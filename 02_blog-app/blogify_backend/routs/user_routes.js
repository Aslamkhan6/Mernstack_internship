const express = require("express")
const router = express.Router()
const authmiddleware = require("../middleware/auth_middleware")
const upload = require("../middleware/upload")

const { register, login, searchuser, follow, getuserbyid, forgotPassword, resetPassword, getFollowers, logout } = require("../controller/User_auth.controller")
const { profilecontroller, updateprofile } = require("../controller/profile_controller")
const { postcontroller, deletepost, updatepost, comment, deletecomment, like, savePost, getSavedPosts, singlepost, getmypost, trandingpost, latestpost, getuserpost } = require("../controller/post_controller")

// 1. Static Routes
router.route("/register").post(upload.single("profileImage"), register)
router.route("/login").post(login)
router.route("/profile").get(authmiddleware, profilecontroller)
router.route("/search").get(searchuser)
router.route("/gettrending").get(trandingpost)
router.route("/latestpost").get(latestpost)
router.route("/getmypost").get(authmiddleware, getmypost)
router.route("/getsavedpost").get(authmiddleware, getSavedPosts)
router.route("/forgotpassword").post(forgotPassword)
router.route("/resetpassword").post(resetPassword)
router.route("/logout").post(logout)

// 2. Parameterized Routes
router.route("/updateprofile/:id").post(authmiddleware, upload.single("profileImage"), updateprofile)
router.route("/postcontroller").post(authmiddleware, upload.single("coverImage"), postcontroller)
router.route("/updatepost/:id").put(authmiddleware, upload.single("coverImage"), updatepost)
router.route("/deletepost/:id").delete(authmiddleware, deletepost)
router.route("/singlepost/:id").get(authmiddleware, singlepost)
router.route("/getuserpost/:id").get(authmiddleware, getuserpost)
router.route("/user/:id").get(getuserbyid)
router.route("/user/:id/followers").get(getFollowers)

// 3. Nested / Action Routes
router.route("/:id/comment").post(authmiddleware, comment)
router.route("/:id/like").post(authmiddleware, like)
router.route("/:id/save").post(authmiddleware, savePost)
router.route("/:postId/comment/:commentId").delete(authmiddleware, deletecomment)
router.route("/:id/follow").post(authmiddleware, follow)

module.exports = router