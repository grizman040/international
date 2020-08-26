const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/dev')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  }
}))

router.get('/protected', requireLogin, (req, res) => {
  res.send("hello USER")
})


router.get("/", (req, res) => {
  res.redirect("/signin");
});
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exists with that email" });
    }
    bcrypt
      .hash(password, 12) // creating Hashed password
      .then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          pic
        });
        user
          .save()

          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "devco@gmx.de",
              subject: "signup success",
              html: "<h1>Welcome to International Cooker</h1>"
            })


            res.json({ message: "saved successful" });
          })
          .catch((err) => {
            console.log(err);
          });
      })

      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({ message: "successful signed in" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
          const { _id, name, email, followers, following, pic } = savedUser
          res.json({ token, user: { _id, name, email, followers, following, pic } })
        } else {
          return res.status(422).json({ error: "Invalid password or email" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
    }
    const token = buffer.toString("hex")
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(422).json({ error: "User dont exists with that email" })
        }
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        user.save().then((result) => {
          transporter.sendMail({
            to: user.email,
            from: "devco@gmx.de",
            subject: "Reset your password",
            html: `
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                  `

          })
          res.json({ message: "check your email" })
        })

      })
  })
})
router.post('/new-password', (req, res) => {
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "try again" })
      }
      bcrypt.hash(newPassword,12).then(hashedPassword=>{
        user.password = hashedPassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then((savedUser)=>{
          res.json({message:"password updated success"})
      })
   })
}).catch(err=>{
   console.log(err)
})
})

module.exports = router;
