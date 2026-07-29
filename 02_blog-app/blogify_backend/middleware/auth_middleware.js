const jwt = require("jsonwebtoken")
const User = require("../model/User.model")
require("dotenv").config()

const authmiddleware = async (req,res,next)=>{
    const  header = req.headers.authorization
    
    if(!header || !header.startsWith("Bearer")){
        return res.status(401).json({
            message:"No token found or invalid format"
        })
    }
    const token = header.split(" ")[1]
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decode.id).select("-password")
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            message:"invalid token"
        })
    }
}

module.exports = authmiddleware