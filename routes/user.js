const express = require('express');
const router = express.Router({mergeParams : true});

const userController = require('../controllers/user');

router.route('/new')
.post(userController.newUser)

router.route('/check-enrollment')
.post(userController.isEnrollmentExist)

router.route('/login')
.get(userController.register)
.post(userController.login)

router.route('/check-log')
.post(userController.isRightDetails)

router.route('/logout')
.get(userController.logout)

module.exports = router;