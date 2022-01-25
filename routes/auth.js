const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


router.get("/", (req, res) => {
    res.send("hey the auth route")
})

// REGISTER
router.post("/register", async(req, res) => {
    try {
        // generate new hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(req.body.password, salt);
        // create a new user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedpass

        });

        //save new user and return a response
        const user = await newUser.save();
        res.status(200).json(user);
        //res.send("user added successfully");

    } catch (err) {
        res.status(500).json(err);
        console.error("An error occured while registering a user", err);
    }

});

// LOGIN

router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");


        const validPass = await bcrypt.compare(req.body.password, user.password);
        !validPass && res.status(400).json("Wrong Password");

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);
        console.error("An error occured when login in user", err);
    }


});


module.exports = router