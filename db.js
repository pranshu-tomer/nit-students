const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect("mongodb://127.0.0.1:27017/nit-students").then(() => {
    console.log("Connected to Server");
})
.catch((err) => {
    console.log('Error occured ' + err);
})

// process.env.Mongo_Url