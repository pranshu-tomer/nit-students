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

const {userDetails} = require('./middleware.js');

// setting up dot env
require('dotenv').config();
require('./db');
// Setting Up storing data
const Video = require('./models/schema.js');
require('./init/data');

// For password encryption
const jwt = require('jsonwebtoken');
const cookieParse = require('cookie-parser');
app.use(cookieParse());

const {isAuthenticated} = require('./middleware.js');

// Importing User Scehma
const User = require('./models/user.js');

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

const userRouter = require('./routes/user.js');
const featureRouter = require('./routes/feature.js');
const feedbackRouter = require('./routes/feedback.js');


// App is listening
app.listen(3000 , () => {
    console.log("Server is Listening");
})

app.use(userDetails);

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

app.use('/', userRouter)
app.use('/', featureRouter)
app.use('/',feedbackRouter)

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

app.use((err,req,res,next) => {
    res.render('error.ejs');
})

app.use((req,res) => {
    res.render('error.ejs');
})
