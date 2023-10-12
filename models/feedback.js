const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    feedback : {
        type : String,
        required : true
    },
    username : {
        type : String
    }
});

const Feedback = mongoose.model("Feedback",userSchema);
module.exports = Feedback;