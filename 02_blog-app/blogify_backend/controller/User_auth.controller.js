const User = require("../model/User.model.js")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generatetoken")
const cloudinary = require("../config/Cloudinary_config.js")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const register = async (req,res)=>{
    try{
        const{username,email,password} = req.body;
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                message:"email already exists, try another email"
            })
        }

        const bcryptpassword = await bcrypt.hash(password,10);
        let imageurl = "";
        let publicId = "";
        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "users" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            imageurl = result.secure_url;
            publicId = result.public_id;
        }

        const newuser = await User.create({
            username,
            email,
            password:bcryptpassword,
            profileImage: imageurl,
            profileImagePublicId: publicId
        })
        res.status(201).json({
            message:"user created successfully",
            user: {
                _id: newuser._id,
                username: newuser.username,
                email: newuser.email,
                profileImage: newuser.profileImage,
                following: newuser.following || []
            },
            token:generateToken(newuser._id)
        })
    }
    catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
            
        })
        console.log(err)
    }
}

// login 
const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message:"invalid password"
            })
        }

        res.status(200).json({
           user: {
               _id: user._id,
               username: user.username,
               email: user.email,
               profileImage: user.profileImage,
               following: user.following || []
           },
           token: generateToken(user._id),
           message:"login successfully"
        })
    } catch (err) {
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }}

//logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Logout failed",
      error: err.message,
    });
  }
};

//forgot password
const forgotPassword = async (req,res)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(200).json({
              message: "If an account with that email exists, a password reset link has been sent."
            })
        }

        const passwordResetToken = crypto.randomBytes(32).toString("hex");
        const passwordResetExpires = Date.now() + 15 * 60 * 1000

        user.resetPasswordToken = passwordResetToken;
        user.resetPasswordExpires = passwordResetExpires;
        await user.save()

        // Send reset email using nodemailer
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "akkhan7862345@gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${passwordResetToken}`;

          await transporter.sendMail({
            from: process.env.SMTP_USER || "noreply@blogify.dev",
            to: email,
            subject: "Blogify Password Reset Request",
            html: `
              <h3>Password Reset Request</h3>
              <p>Hello ${user.username},</p>
              <p>You requested a password reset. Click the link below to reset your password:</p>
              <p><a href="${resetLink}">Reset Password</a></p>
              <p>This link will expire in 15 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>
            `,
          });
        } catch (emailErr) {
          console.error("Failed to send password reset email:", emailErr.message);
        }

        res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent."
        })
    } catch (err) {
        res.status(500).json({
            message: "Error processing request",
            error: err.message
        })
    }
}

// reset link controller
const resetPassword = async (req,res)=>{
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        // Hash new password and save
        const bcryptpassword = await bcrypt.hash(password, 10);
        user.password = bcryptpassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Error resetting password", error: err.message });
    }
}

const follow = async (req,res)=>{
    try {
        const userToFollow = req.params.id
        const currentUser = req.user._id.toString()

        if(userToFollow === currentUser){
            return res.status(400).json({message:"Cannot follow yourself"})
        }

        const userExists = await User.findById(userToFollow)
        if(!userExists){
            return res.status(404).json({message:"User not found"})
        }

        const currentUserData = await User.findById(currentUser)
        const alreadyFollowing = currentUserData.following.includes(userToFollow)

        if(alreadyFollowing){
            currentUserData.following = currentUserData.following.filter(id => id.toString() !== userToFollow)
            userExists.followers = userExists.followers.filter(id => id.toString() !== currentUser)
            await currentUserData.save()
            await userExists.save()
            return res.status(200).json({
                message: "Unfollowed successfully",
                following: false
            })
        } else {
            currentUserData.following.push(userToFollow)
            userExists.followers.push(currentUser)
            await currentUserData.save()
            await userExists.save()
            return res.status(200).json({
                message: "Followed successfully",
                following: true
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Error in follow action", error: err.message })
    }
}

// get followers of a user
const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'username email profileImage')
            .select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({
            followers: user.followers,
            count: user.followers.length
        })
    } catch (err) {
        res.status(500).json({ message: "Error fetching followers", error: err.message })
    }
}

//search user 
const searchuser = async (req,res)=>{
    try {
        const {query} = req.query

        if(!query || query.trim() === ''){
            return res.status(400).json({message:"Search query is required"})
        }

        const users = await User.find({
            $or: [
                {username: {$regex: query, $options: 'i'}},
                {email: {$regex: query, $options: 'i'}}
            ]
        })
        .select('-password')
        .limit(10)

        res.status(200).json({
            count: users.length,
            users
        })
    } catch (err) {
        res.status(500).json({ message: "Search error", error: err.message })
    }
}

const getuserbyid = async(req,res)=>{
    try {
        const foundUser = await User.findById(req.params.id)
            .select('-password')
            .populate('following', 'username email profileImage')
        if(!foundUser){
            return res.status(404).json({
                message:"no user found"
            })
        }
        res.status(200).json({
            status:true,
            user: foundUser
        })
    } catch (err) {
        res.status(500).json({
            message:"Error getting user profile",
            error: err.message
        })
    }
}

module.exports = {
    register,
    login,
    follow,
    searchuser,
    forgotPassword,
    resetPassword,
    logout,
    getuserbyid,
    getFollowers
}
