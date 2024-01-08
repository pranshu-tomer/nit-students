const jwt = require('jsonwebtoken');
const User = require('./models/user.js');

module.exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.user_id;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        return next();
      } catch (error) {
        return res.render("register.ejs");
      }
}

module.exports.userDetails = async (req, res, next) => {
  const visitorId = req.cookies.user_id;
  const currentTime = new Date().getTime();

  // If the visitor doesn't have a unique ID, generate one and set a cookie
  if (!visitorId) {
    const newVisitorId = 'tempraryPeople'
    res.cookie('visitorId', newVisitorId);
    req.visitorId = newVisitorId;
  } else {
    const decoded = jwt.verify(visitorId, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const exist = await User.findOne({_id : userId});
    req.visitorId = exist.enrollment;
  }

  // Store or update the visitor's last visit timestamp
  const lastVisitTimestamp = req.cookies.lastVisitTimestamp;
  if (lastVisitTimestamp) {
    const sessionDuration = currentTime - parseInt(lastVisitTimestamp);
    console.log(`Visitor ${req.visitorId} spent ${sessionDuration} ms on the site.`);
  }

  res.cookie('lastVisitTimestamp', currentTime.toString());

  next();
}