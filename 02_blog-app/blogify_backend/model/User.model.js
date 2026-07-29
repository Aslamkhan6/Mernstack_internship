const  mongoose = require("mongoose")
const Userschema  = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
     following: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
    followers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
    profileImage: String,
    profileImagePublicId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date   
},{
    timestamps:true
})

const model = mongoose.model("User",Userschema)
module.exports = model