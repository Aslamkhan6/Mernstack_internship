const mongoose = require("mongoose")
const commentSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
      type:Date,
      default:Date.now
    }
})

const Postschema =   mongoose.Schema({
    title:{
        type:String,
        required:true
    }  ,
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
       ref:"User",
        required:true
    
    },

    views:{
        type:Number,
        required:true,
        default:0
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    saved:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    coverImage:{
        type:String,
        default:""
    },
    comments:[commentSchema]
},
{
    timestamps: true
}

)


Postschema.index({title:1});
Postschema.index({user:1});
Postschema.index({createdAt:-1})
Postschema.index({user:1,createdAt:-1})

const  postmodel =  mongoose.model("Post",Postschema)
module.exports = postmodel
