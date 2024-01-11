const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.Mongo_Url).then(() => {
    console.log("Connected to Server");
})
.catch((err) => {
    console.log('Error occured ' + err);
})
