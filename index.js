// Set up express
const express = require("express");
const app = express();

// for upload notes
const multer = require('multer');

// Setting up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// setting up dot env
require('dotenv').config();
require('./db');
// Setting Up storing data
const Video = require('./models/schema.js');
require('./init/data');

// For password encryption
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParse = require('cookie-parser');
app.use(cookieParse());

// Importing User Scehma
const User = require('./models/user.js');
const College = require('./models/collegeSchema.js');
const Feedback = require('./models/feedback.js');
const Rate = require('./models/ratings.js');

// set path for view ejs files
const path = require("path");
const { findOne } = require("./models/schema");
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
// Serve static files (e.g., uploaded PDFs)
app.use(express.static(path.join(__dirname, "/public")));
app.use('/uploads', express.static('uploads'));

// Encoding body data
app.use(express.urlencoded({extended : true}));


// App is listening
app.listen(3000 , () => {
    console.log("Server is Listening");
})

function isAuthenticated(req, res, next) {
    const token = req.cookies.user_id;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        return next();
      } catch (error) {
        // return res.render("register.ejs");
        return res.render("register.ejs");
      }
}


// Middleware to track visitors and their session duration
app.use(async (req, res, next) => {
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
});

// Making Roots

// Home route
app.get("/", (req,res) => {
    const token = req.cookies.user_id;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id; // This will give you the 'exist._id' value from the token's payload
        User.findById(userId).exec()
        .then((user) => {
            res.render("logHome.ejs",{user});
        })
        .catch((err) => {
            console.error('Error finding user:', err);
        });
        } catch (error) {
            res.render("home.ejs");
        }
})

// Registering new user route
app.post('/new', async (req,res) => {
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
        res.redirect("/register");
    } catch(err) {
        res.status(500).json({message : err.message});
    }
})

// Enrollment cheack
app.post('/check-enrollment', async (req, res) => {
    const {enrollment} = req.body;
    // cheacking username existance
    let existUser = await User.find({enrollment});
    if(existUser.length){
        res.status(400).send('Enrollment already exists!');
    }else {
        res.status(200).send('Enrollment is available');
    }
}); 


// login Route
app.post("/login", async (req,res,next) => {
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
                const token = jwt.sign({id : exist._id}, process.env.JWT_SECRET_KEY, {expiresIn : '12h'});
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
})

// log-in details cheacking
app.post('/check-log', async (req,res) => {
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
})

// Creating Register And Log in Route
app.get("/register", (req,res) => {
    res.render("register.ejs");
})

// Creating Resources Route
app.get("/resources", (req,res) => {
    res.render("resources.ejs");
})

// Creating Skills Route
app.get("/skills", (req,res) => {
    res.render("skills.ejs");
})

// Java Page route
app.get("/java",isAuthenticated, async (req,res) => {
    let data = await Video.find();
    res.render("player.ejs", {data});
})

// Creating Skills Route
app.get("/college",isAuthenticated, async (req,res) => {
    let data = await College.find();
    res.render("pdf.ejs",{data});
})

// Uploads file route
app.get("/uploads",isAuthenticated, (req,res) => {
    res.render("upload.ejs");
})

// Custom middleware to handle file upload with any field name
const uploadAnyField = (req, res, next) => {
    upload.any()(req, res, function (err) {
        if (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer errors
                return res.status(400).send('Multer Error: ' + err.message);
            } else {
                // Handle other errors
                return res.status(500).send('Internal Server Error');
            }
        }
        next();
    });
};

app.post("/new/data", uploadAnyField, (req, res) => {
    const allowedExtensions = ['.pdf', '.jpeg', '.jpg', '.png'];
    const fileExtension = path.extname(req.files[0].originalname);

    // Check if the uploaded file has an allowed extension
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        return res.status(400).send('Invalid file type. Allowed types: PDF, JPEG, PNG');
    }

    res.redirect('/college');
});

// Creating Skills Route
app.get("/debugging",isAuthenticated, (req,res) => {
    res.render("resources.ejs");
})

// feedback
app.post("/feedback",isAuthenticated, async (req,res,next) => {
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
})

app.get('/logout', (req,res) => {
    res.clearCookie('user_id');
    res.render("home.ejs");
})

app.post('/ratings', async (req,res) => {
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
})

app.use((err,req,res,next) => {
    res.render('error.ejs');
})

app.use((req,res) => {
    res.render('error.ejs');
})
