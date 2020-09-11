const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const { populate } = require("../models/user");
const Post = mongoose.model("Post")

router.get('/allposts', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "country pic _id name")  // what info we want to get from the user data -- in this case only NAME
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')

        .then(posts => {
            res.json({ posts })
            // console.log(posts);
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/getsubpost', requireLogin, (req, res) => {
    //if is posted by? we will check
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "country _id name")  // what info we want to get from the user data -- in this case only NAME
        .populate("comments.postedBy", " country _id name")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, photo,country } = req.body
    if (!title || !body || !photo||!country) {
        return res.status(422).json({ error: " please add all fields" })
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user,
        country
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err);
        })
});


router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("PostedBy", "country pic _id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true

        
    }).populate("postedBy", " country _id name")
    .populate("comments.postedBy", " pic _id name")
    .exec((err, result) => {
        console.log(result);
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })

})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true

    })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    


    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })

})
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true

    })
        .populate("comments.postedBy", "pic _id name")
        .populate("postedBy", "pic _id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })

})
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json( result )
                    }).catch(err => {
                        console.log(err);
                    })
            }
        })
})







module.exports = router