const Video = require("../models/schema.js");
const initData = require("./Java.js");

const initDB = async () => {
    // first we cleane our database
    await Video.deleteMany({});
    await Video.insertMany(initData.data);
}

const College = require("../models/collegeSchema.js");
const initCollegeData = require("./college.js");

const initCollegeDB = async () => {
    // first we cleane our database
    await College.deleteMany({});
    await College.insertMany(initCollegeData.data);
}

initDB();
initCollegeDB();