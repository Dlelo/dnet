const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const helmet = require('helmet');
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");





dotenv.config();
//console.log(process.env.DN_MONGO_URL)



mongoose.connect(
    process.env.DN_MONGO_URL, {},
    () => {
        console.log('connected to db')
    });

mongoose.connection
    .once('open', () => console.log("MongoDB connected"))
    .on('error', (error) => {
        console.log("MongoDB error", error);
    });




// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/users", userRoute);

app.use("/api/auth", authRoute);




app.listen(9999, () => {
    console.log('Backend server is running')
})