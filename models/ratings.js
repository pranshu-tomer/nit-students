const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    rating : {
        type : Number
    },
    user : {
        type : String
    }
});

const Rate = mongoose.model("Rate",userSchema);
module.exports = Rate;