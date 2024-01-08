
const User = require('../models/user.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.newUser = async (req,res) => {
    try {
        let {name,enrollment,password} = req.body;
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password.trim(),salt);

        const newUser = new User({
            name,
            enrollment,
            password : hashedPassword
        })
        await newUser.save();
        res.redirect("/login");
    } catch(err) {
        res.status(500).json({message : err.message});
    }
}

module.exports.isEnrollmentExist = async (req, res) => {
    const {enrollment} = req.body;
    // cheacking username existance
    let existUser = await User.find({enrollment});
    if(existUser.length){
        res.status(400).send('Enrollment already exists!');
    }else {
        res.status(200).send('Enrollment is available');
    }
}

module.exports.login = async (req,res,next) => {
    try {
        let {enrollment , password} = req.body;
        password = password.trim();

        const exist = await User.findOne({enrollment});
        // checking password 
        bcrypt.compare(password, exist.password, (err, result) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              return;
            }
            if (result) {
                // Generating token
                const token = jwt.sign({id : exist._id},process.env.JWT_SECRET_KEY, {expiresIn : '12h'})
                // send token in form of cookies
                res.cookie('user_id', token , { httpOnly: true });
                res.redirect("/");
            } else {
                res.send("Password is Incorrect");
            }
        });

        } catch(err) {
            next(err);
        }
}

module.exports.isRightDetails = async (req,res) => {
    let {enrollment , password} = req.body;
    password = password.trim();

    const exist = await User.findOne({enrollment});
    if(!exist){
        return res.status(400).send('User not exist , Register first.');
    }
    bcrypt.compare(password, exist.password, (err, result) => {
        if (err) {
            return res.status(400).send('Something Went wrong! Try again later.');
        }
        if (result) {
            res.status(200).send('');
        } else {
            res.status(400).send('Password is incorrect !!');
        }
    });
}

module.exports.logout = (req,res) => {
    res.clearCookie('user_id');
    res.render("home.ejs");
}

module.exports.register = (req,res) => {
    res.render("register.ejs");
}



