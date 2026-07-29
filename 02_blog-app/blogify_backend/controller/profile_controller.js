const User = require("../model/User.model")
const cloudinary = require("../config/Cloudinary_config")

const profilecontroller = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "no user found"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Profile retrieved successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

const updateprofile = async (req, res) => {
    const id = req.params.id
    try {
        // Verify user is updating their own profile
        if (req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Not authorized to update this profile" })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: "no user found" })
        }

        const { username, email } = req.body
        if (username) user.username = username
        if (email) user.email = email

        if (req.file) {
            // Delete old profile image from Cloudinary if it exists
            if (user.profileImagePublicId) {
                await cloudinary.uploader.destroy(user.profileImagePublicId)
            }
            
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
            user.profileImage = result.secure_url;
            user.profileImagePublicId = result.public_id;
        }

        await user.save();

        res.status(200).json({
            message: "profile updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                following: user.following || []
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

module.exports = { profilecontroller, updateprofile }
