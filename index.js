const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000
const { MONGOURI } = require("./config/dev");

// mongoose.connect(MONGOURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connection works"))
  .catch((err) => console.log("DB Connection failed", err))


require('./models/user')
require('./models/posts')
app.use(express.json())
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require('./routes/user'));



// .then(() => console.log("connection to database Establish"));
// mongoose.connection.on("connected", () => {
//   console.log("Connected to mongo DATA BASE");
// });
// mongoose.connection.on("error", (err) => {
//   console.log("Error connecting", err);
// });


if(process.env.NODE_ENV=="production"){
  const path = require('path')
  app.use(express.static( path.join(__dirname, 'client', 'build')))
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

//comment


app.listen(PORT, () => {
  console.log("The server is running successful on port", PORT);
});
