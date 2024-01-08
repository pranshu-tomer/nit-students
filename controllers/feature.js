const Video = require('../models/schema.js');
const College = require('../models/collegeSchema.js');

module.exports.skill = (req,res) => {
    res.render("skills.ejs");
}

module.exports.resources = (req,res) => {
    res.render("resources.ejs");
}

module.exports.java = async (req,res) => {
    let data = await Video.find();
    res.render("player.ejs", {data});
}

module.exports.college = async (req,res) => {
    let data = await College.find();
    res.render("pdf.ejs",{data});
}

module.exports.debugg = (req,res) => {
    res.render("resources.ejs");
}