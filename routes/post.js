const router = require("express").Router();
const { promise } = require("bcrypt/promises");
const Post = require("../models/Post");
const User = require("../models/User");

//create post

router.post("/", async(req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)

    } catch (err) {
        res.status(500).json(err)
    }
})


//update post
router.put("/:id", async(req, res) => {
        try {
            const updatePost = await Post.findById(req.params.id)
            if (updatePost.userID === req.body.userID) {
                await updatePost.updateOne({ $set: req.body });
                res.status(200).json("Post updated Successfully");

            } else {
                res.status(403).json("Permission Denied: You can only update your post")
            }

        } catch (err) {
            res.status(500).json(err)
        }


    })
    //delete a post
router.delete("/:id", async(req, res) => {
        try {
            const deletePost = await Post.findById(req.params.id)
            if (deletePost.userID === req.body.userID) {
                await deletePost.deleteOne();
                res.status(200).json("Post deleted Successfully");

            } else {
                res.status(403).json("Permission Denied: You can only delete your post")
            }

        } catch (err) {
            res.status(500).json(err)
        }


    })
    //like a post
router.put("/:id/like", async(req, res) => {
    try {
        const likePost = await Post.findById(req.params.id)
        if (!likePost.likes.includes(req.body.userID)) {
            await likePost.updateOne({ $push: { likes: req.body.userID } });
            res.status(200).json("Post liked Successfully");

        } else {
            await likePost.updateOne({ $pull: { likes: req.body.userID } });
            res.status(200).json("Post unliked Successfully");
        }

    } catch (err) {
        res.status(500).json(err)
    }


})

//get a post
router.get("/:id", async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
        } catch (err) {
            res.status(500).json(err)
        }
    })
    //get timeline posts (following and current user)

router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userID)
        const userposts = await Post.find({ userID: currentUser._id });
        const friendPost = await Promise.all(
            currentUser.following.map((friendID) => {
                return Post.find({ userID: friendID });
            })
        );
        res.status(200).json(userposts.concat(...friendPost));

    } catch (err) {
        res.status(500).json(err)
    }
})



module.exports = router