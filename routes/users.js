const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");

router.get("/", (req, res) => {
    res.send("hey the user route")
})

//update users
router.put("/:id", async(req, res) => {
        if (req.body.userID === req.params.id || req.body.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt)
                } catch (err) {
                    console.error("An error occured while updating password", err);
                    return res.status(500).json(err)
                }
            }
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });
                res.status(200).json("User updated Successfully")
            } catch (err) {
                console.error("Error updating the User", err);
                return res.status(500).json(err)
            }

        } else {
            return res.status(403).json("Permision Denied: You do not have permisiion to update this user")
        }
    })
    //delete user

router.delete("/:id", async(req, res) => {
        if (req.body.userID === req.params.id || req.body.isAdmin) {

            try {
                const user = await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User Deleted Successfully")
            } catch (err) {
                console.error("Error Deleting User", err);
                return res.status(500).json(err)
            }

        } else {
            res.status(403).json("Forbidden: You cannot delete yourself")
        }
    })
    //get user
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)

    } catch (err) {
        res.status(500).json(err)
    }
})


//follow a user
router.put("/:id/follow", async(req, res) => {
        if (req.body.userID !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userID);

                if (!user.followers.includes(req.body.userID)) {
                    await user.updateOne({ $push: { followers: req.body.userID } });
                    await currentUser.updateOne({ $push: { following: req.params.id } });
                    res.status(200).json("User followed successfully");
                } else {
                    res.status(403).json("Forbidden: You already follow this user");
                }

            } catch (err) {
                res.status(500).json(err)
            }

        } else {
            res.status(403).json("Forbidden: You cannot follow yourself")
        }
    })
    //unfollow a user
router.put("/:id/unfollow", async(req, res) => {
    if (req.body.userID !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userID);

            if (user.followers.includes(req.body.userID)) {
                await user.updateOne({ $pull: { followers: req.body.userID } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User unfollowed successfully");
            } else {
                res.status(403).json("Forbidden: You are not following this user");
            }

        } catch (err) {
            res.status(500).json(err)
        }

    } else {
        res.status(403).json("Forbidden: You cannot unfollow yourself")
    }
})


module.exports = router