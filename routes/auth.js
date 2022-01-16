const router = require("express").Router();
const User = require("../models/User");


router.get("/", (req, res) => {
    res.send("hey the auth route")
})

// REGISTER
router.get("/register", async(req, res) => {
    // res.send("before adding user")

    try {

        const user = await new User({
            username: "donattah",
            email: "akinyidonattah@gmail.com",
            password: "don123456"

        });

        await user.save();
        res.send("user added successfully");

    } catch (err) {
        console.error("An error occured");
        console.error(err);
    }

})


module.exports = router