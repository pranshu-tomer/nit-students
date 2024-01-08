const jwt = require('jsonwebtoken');

const User = require('../models/user.js');
const Feedback = require('../models/feedback.js');
const Rate = require('../models/ratings.js');

module.exports.feedbacks = async (req,res,next) => {
    let {feedback} = req.body;
    const token = req.cookies.user_id;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    User.findById(userId)
        .exec()
        .then((exist) => {
        if (exist) {
            const feed = new Feedback({feedback, username : exist.name});
            feed.save();
            res.redirect("/");
        } else {
            console.log('User not found');
        }
        })
        .catch((err) => {
            next(err);
        });
}

module.exports.rating = async (req,res) => {
    let {rating,name} = req.body;
    const token = req.cookies.user_id;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    User.findById(userId)
        .exec()
        .then((exist) => {
        if (exist) {
            let rate = new Rate({
                name,
                rating,
                user : exist.enrollment
            });
            rate.save();
            res.redirect('/java');
        } else {
            console.log('User not found');
        }
        })
        .catch((err) => {
            next(err);
        });
}