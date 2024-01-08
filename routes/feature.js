const express = require('express');
const router = express.Router({mergeParams : true});

const featureController = require('../controllers/feature');
const {isAuthenticated} = require('../middleware.js');

router.route('/skills')
.get(featureController.skill)

router.route('/resources')
.get(featureController.resources)

router.route('/java')
.get(isAuthenticated,featureController.java)

router.route('/college')
.get(isAuthenticated,featureController.college)

router.route('/debugging')
.get(isAuthenticated,featureController.debugg)

module.exports = router;