const express = require('express')
const router = express.Router();
const {Admin, Book,Review} = require('../models/model')
const jwt = require('jsonwebtoken');
const {JWT_SECRET } = require("../config/config")
const adminMiddleware  = require('../middlewares/admin');


/*****************************************file uploads********************************************************/ 
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
cloudinary.config({ 
    cloud_name: config.cloudinary.cloudName, // Correctly access cloudName
    api_key: config.cloudinary.apiKey,       // Correctly access apiKey
    api_secret: config.cloudinary.apiSecret   // Correctly access apiSecret
});
    const multer = require('multer');
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    
    // Cloudinary storage configuration
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'bookstore',  // Folder name where images and PDFs will be stored
        allowed_formats: ['jpg', 'png', 'pdf'],  // Allowed file formats
        resource_type: 'auto'  // Auto-detect file type (useful for images and PDFs)
      }
    });
    
    // Initialize multer with Cloudinary storage
    const upload = multer({ storage });    

/********************************************************************************************** */

//admin signup route
// router.post('/signup',async (req,res)=>{
//     const {username,password} = req.body;
//     await Admin.create({
//         username,
//         password
//     })   
//     res.json({
//         message :"Admin created successfully!"
//     }) 
// });
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new admin
        await Admin.create({
            username,
            password
        });

        res.status(201).json({
            message: "Admin created successfully!"
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: 'Server error, please try again later.'
        });
    }
});


router.post('/signin',async (req,res)=>{
    const {username,password} = req.body;
    const user = await Admin.findOne({username,password});
    
    if(user){
        const token = jwt.sign({
            username: user.username
        },JWT_SECRET)

        res.json({
            token
        });
    }else{
        res.status(401).json({
            msg : "incorrect username or  password"
        });
    }
});


/*
router.post("/uploadBooks",adminMiddleware,async (req,res)=>{
    const {title,description,author,publication,publishedDate,price,category}= req.body;
    const newBook = await Book.create({
        title,
        description,
        author,
        publication,
        publishedDate,
        price,
        category
    })
    res.json({
        message:"book added successfully",
        BookId : newBook._id
    })
})
*/

router.post("/uploadBooks", adminMiddleware, upload.fields([
    { name: 'thumbnail', maxCount: 1 },  // Handle a single thumbnail image
    { name: 'pdf', maxCount: 1 }         // Handle a single PDF file
]), async (req, res) => {
    try {
        const { title, description, author, publication, publishedDate, price, category } = req.body;

        // Get the URLs of the uploaded files from Cloudinary
        const thumbnailUrl = req.files.thumbnail ? req.files.thumbnail[0].path : null;
        const pdfUrl = req.files.pdf ? req.files.pdf[0].path : null;
        console.log(req.files)
        // Create a new book with the file URLs
        const newBook = await Book.create({
            title,
            description,
            author,
            publication,
            publishedDate,
            price,
            category,
            thumbnail: thumbnailUrl,  // Save thumbnail URL in the database
            pdf: pdfUrl               // Save PDF URL in the database
        });

        res.json({
            message: "Book added successfully",
            BookId: newBook._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/books",async(req,res)=>{
    const response = await Book.find({});
    res.json({
        Books : response
    })
})

router.get('/review/:bookName',adminMiddleware, async (req, res) => {
    try {
        const bookName = req.params.bookName; // Correctly retrieve bookName from params

        // Find the book by its name
        const book = await Book.findOne({ title: bookName });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Fetch reviews associated with the found book
        const reviews = await Review.find({ book: book._id }).populate('user', 'username'); // Populate user for better readability
        
        // Map the reviews to only include username, rating, and comment
        const responseReviews = reviews.map(review => ({
            username: review.user.username,
            rating: review.rating,
            comment: review.comment
        }));

        // Send the reviews as a response
        res.status(200).json({
            book: book.title,
            reviews: responseReviews
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving reviews",
            error: error.message
        });
    }
});
module.exports = router;

