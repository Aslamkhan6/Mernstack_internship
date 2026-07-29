const User = require("../model/User.model")
const Post = require("../model/Post.model")
const cloudinary = require("../config/Cloudinary_config.js")

const postcontroller = async (req, res) => {
    try {
        const { title, category, content } = req.body
        if (!title || !category || !content) {
            return res.status(400).json({
                status: "false",
                message: "all fields are required"
            })
        }

        let coverImage = "";
        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "posts" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            coverImage = result.secure_url;
        }

        const newpost = await Post.create({
            title,
            content,
            category,
            user: req.user._id,
            coverImage,
            likes: [],
            comments: [],
            views: 0
        })

        const populatedPost = await Post.findById(newpost._id)
            .populate("user", "username email profileImage")

        res.status(201).json(populatedPost)
    } catch (error) {
        res.status(500).json({
            message: "Error creating post",
            error: error.message
        })
    }
}

// get my all post 
const getmypost = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const skip = (page - 1) * limit
        const filter = { user: req.user._id }

        if (req.query.category && req.query.category !== "All") {
            filter.category = req.query.category
        }
        // keyword search (title or content)
        if (req.query.keyword) {
            filter.$or = [
                { title: { $regex: req.query.keyword, $options: "i" } },
                { content: { $regex: req.query.keyword, $options: "i" } }
            ]
        }

        const total = await Post.countDocuments(filter)
        const mypost = await Post.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('user', 'username email profileImage')
            .populate('likes', 'username email profileImage')
            .populate('comments.user', 'username email profileImage')

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            mypost
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

// updatepost 
const updatepost = async (req, res) => {
    try {
        const postToUpdate = await Post.findById(req.params.id)

        if (!postToUpdate) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        if (postToUpdate.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" })
        }

        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "posts" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            postToUpdate.coverImage = result.secure_url;
        }

        postToUpdate.title = req.body.title || postToUpdate.title
        postToUpdate.category = req.body.category || postToUpdate.category
        postToUpdate.content = req.body.content || postToUpdate.content

        const updated = await postToUpdate.save()
        await updated.populate('user', 'username email profileImage')
        await updated.populate('likes', 'username email profileImage')
        await updated.populate('comments.user', 'username email profileImage')

        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({
            message: "Error updating post",
            error: error.message
        })
    }
}

// delete post 
const deletepost = async (req, res) => {
    try {
        const postToDelete = await Post.findById(req.params.id)
        if (!postToDelete) {
            return res.status(404).json({
                message: "no post found"
            })
        }

        if (postToDelete.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "not authorized"
            })
        }

        await postToDelete.deleteOne()
        res.status(200).json({ message: "post deleted successfully" })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting post",
            error: error.message
        })
    }
}

// comment 
const comment = async (req, res) => {
    try {
        const { content } = req.body
        const postId = req.params.id

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: "Comment cannot be empty" })
        }

        const postById = await Post.findById(postId)
        if (!postById) {
            return res.status(404).json({ message: "Post not found" })
        }

        const newComment = {
            content: content.trim(),
            user: req.user._id,
            createdAt: new Date()
        }

        postById.comments.push(newComment)
        await postById.save()

        const updatedPost = await Post.findById(postId)
            .populate('comments.user', 'username email profileImage')

        res.status(201).json({
            message: "Comment added successfully",
            comments: updatedPost.comments
        })
    } catch (error) {
        res.status(500).json({
            message: "Error commenting on post",
            error: error.message
        })
    }
}

// deletecomment
const deletecomment = async (req, res) => {
    try {
        const { postId, commentId } = req.params
        const postById = await Post.findById(postId)
        if (!postById) {
            return res.status(404).json({
                message: "post not found"
            })
        }

        const commentToDel = postById.comments.id(commentId)
        if (!commentToDel) {
            return res.status(404).json({
                message: "no comment found"
            })
        }

        // Author of post OR author of comment can delete comment
        if (postById.user.toString() !== req.user._id.toString() && commentToDel.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "unauthorized access"
            })
        }

        postById.comments.pull(commentId)
        await postById.save()

        res.status(200).json({
            message: "comment deleted successfully",
            comments: postById.comments
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting comment",
            error: error.message
        })
    }
}

// like post 
const like = async (req, res) => {
    try {
        const likepost = await Post.findById(req.params.id)
        if (!likepost) {
            return res.status(404).json({
                message: "no post found"
            })
        }

        const alreadyliked = likepost.likes.includes(req.user._id)
        if (alreadyliked) {
            likepost.likes = likepost.likes.filter(id => id.toString() !== req.user._id.toString())
        } else {
            likepost.likes.push(req.user._id)
        }

        await likepost.save()
        await likepost.populate('likes', 'username email profileImage')

        res.status(200).json({
            liked: !alreadyliked,
            likes: likepost.likes,
            likesCount: likepost.likes.length
        })
    } catch (error) {
        res.status(500).json({
            message: "Error liking/unliking post",
            error: error.message
        })
    }
}

// save / unsave post 
const savePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({
                message: "no post found"
            })
        }

        const alreadySaved = post.saved.includes(req.user._id)
        if (alreadySaved) {
            post.saved = post.saved.filter(id => id.toString() !== req.user._id.toString())
        } else {
            post.saved.push(req.user._id)
        }

        await post.save()
        await post.populate('saved', 'username email profileImage')

        res.status(200).json({
            saved: !alreadySaved,
            savedCount: post.saved.length,
            saved: post.saved
        })
    } catch (error) {
        res.status(500).json({
            message: "Error saving/unsaving post",
            error: error.message
        })
    }
}

// get saved posts for current user
const getSavedPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const filter = { saved: req.user._id }
        if (req.query.category && req.query.category !== "All") {
            filter.category = req.query.category
        }
        if (req.query.keyword) {
            filter.$or = [
                { title: { $regex: req.query.keyword, $options: "i" } },
                { content: { $regex: req.query.keyword, $options: "i" } }
            ]
        }

        const total = await Post.countDocuments(filter)
        const posts = await Post.find(filter)
            .populate('user', 'username email profileImage')
            .populate('likes', 'username email profileImage')
            .populate('saved', 'username email profileImage')
            .populate('comments.user', 'username email profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            posts
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching saved posts",
            error: error.message
        })
    }
}

// get single post by id 
const singlepost = async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.id)
            .populate('user', 'username email profileImage')
            .populate('likes', 'username email profileImage')
            .populate('comments.user', 'username email profileImage')

        if (!foundPost) {
            return res.status(404).json({
                message: "no post found"
            })
        }
        foundPost.views = (foundPost.views || 0) + 1
        await foundPost.save()

        res.json(foundPost)
    } catch (error) {
        res.status(500).json({
            message: "Error fetching post",
            error: error.message
        })
    }
}

// get trending post 
const trandingpost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username email profileImage')
            .populate('likes', 'username email profileImage')
            .populate('comments.user', 'username email profileImage')
            .sort({ views: -1 })
            .limit(10)

        res.json(posts)
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trending posts",
            error: error.message
        })
    }
}

// show posts at the main page, sorted from newest to oldest
const latestpost = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const filter = {}
        if (req.query.category && req.query.category !== "All") {
            filter.category = req.query.category
        }
        if (req.query.keyword) {
            filter.$or = [
                { title: { $regex: req.query.keyword, $options: "i" } },
                { content: { $regex: req.query.keyword, $options: "i" } }
            ]
        }

        const total = await Post.countDocuments(filter)
        const posts = await Post.find(filter)
            .populate('user', 'username email profileImage')
            .populate('likes', 'username email profileImage')
            .populate('comments.user', 'username email profileImage')
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            posts
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching latest posts",
            error: error.message
        })
    }
}

// get user post 
const getuserpost = async (req, res) => {
    try {
        const userid = req.params.id
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const skip = (page - 1) * limit

        const total = await Post.countDocuments({ user: userid })
        const posts = await Post.find({ user: userid })
            .populate('user', 'username email profileImage')
            .populate('likes', 'username email profileImage')
            .populate('comments.user', 'username email profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.json({
            total,
            page,
            skip,
            posts
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user posts",
            error: error.message
        })
    }
}

module.exports = {
    postcontroller,
    getmypost,
    updatepost,
    deletepost,
    singlepost,
    comment,
    deletecomment,
    like,
    savePost,
    getSavedPosts,
    trandingpost,
    latestpost,
    getuserpost
}
