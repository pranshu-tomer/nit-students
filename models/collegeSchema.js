const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const javaSchema = new Schema({
    id : {
        type : Number,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    link : {
        type : String,
        required : true
    },
    source : {
        type : String
    }
});

const College = mongoose.model("College",javaSchema);
module.exports = College;