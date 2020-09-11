

const mongoose = require('mongoose'); // Erase if already required
const {ObjectId} = mongoose.Schema.Types


// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        // index:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    
    country:{
        type:String,
        ref:"User",
        required:true
    },
    pic:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png'
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    // active:{
    //     type:Boolean,
    //     default:false
    // },
    resetToken:String,
    expireToken:Date,
});

//Export the model
module.exports = mongoose.model('User', userSchema);