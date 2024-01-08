const express = require('express');
const router = express.Router({mergeParams : true});

const feedbackController = require('../controllers/feedback');
const {isAuthenticated} = require('../middleware.js');

router.route('/feedback')
.post(isAuthenticated,feedbackController.feedbacks)

router.route('/ratings')
.post(feedbackController.rating);

module.exports = router;