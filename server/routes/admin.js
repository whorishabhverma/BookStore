const express = require('express')
const router = express.Router();
const {Admin, Book,Review,Subscribe} = require('../models/model')
const jwt = require('jsonwebtoken');
const {JWT_SECRET } = require("../config/config")
const adminMiddleware  = require('../middlewares/admin');
const nodemailer = require('nodemailer');
const axios = require('axios');
const bcrypt = require('bcrypt');


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
// router.post('/signup', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // Check if the username already exists
//         const existingAdmin = await Admin.findOne({ username });
//         if (existingAdmin) {
//             return res.status(400).json({ message: 'Username already exists' });
//         }

//         // Create a new admin
//         await Admin.create({
//             username,
//             password
//         });

//         res.status(201).json({
//             message: "Admin created successfully!"
//         });
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         res.status(500).json({
//             message: 'Server error, please try again later.'
//         });
//     }
// });


// router.post('/signin',async (req,res)=>{
//     const {username,password} = req.body;
//     const user = await Admin.findOne({username,password});
    
//     if(user){
//         const token = jwt.sign({
//             username: user.username,
//             _id: user._id
//         },JWT_SECRET)

//         res.json({
//             token,
//             userId: user._id
//         });
//     }else{
//         res.status(401).json({
//             msg : "incorrect username or  password"
//         });
//     }
// });
router.post('/signup', async (req, res) => {
    const { username, password} = req.body;
    try {
        // Check if the username already exists
        const existingUser = await Admin.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with hashed password
        await Admin.create({
            username,
            password:hashedPassword,
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

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await Admin.findOne({ username });

        if (!user) {
            return res.status(401).json({ msg: "Incorrect username or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: "Incorrect username or password" });
        }

        // If password matches, generate a JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                username: user.username,
            },
            JWT_SECRET,
            { expiresIn: '2h' } // Token expires in 2 hours
        );

        // Send the token and user information to the client
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ msg: "Server error, please try again later." });
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
        const { title, description, author, publication, publishedDate, price, category, premium } = req.body;

        // Check if all required fields are provided
        if (!title || !description || !author || !price || !category || !req.files.thumbnail || !req.files.pdf) {
            return res.status(400).json({ error: "All fields are required including thumbnail and pdf." });
        }

        // Get the URLs of the uploaded files from Cloudinary (assuming you're using Cloudinary)
        const thumbnailUrl = req.files.thumbnail ? req.files.thumbnail[0].path : null;
        const pdfUrl = req.files.pdf ? req.files.pdf[0].path : null;

        // Assume uploadedBy is stored in req.user from adminMiddleware
        const uploadedBy = req.user._id; // Ensure that req.user is set by your middleware

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
            pdf: pdfUrl,              // Save PDF URL in the database
            uploadedBy,               // Save the ID of the user who uploaded the book
            premium: premium || false // Ensure `premium` is a boolean (default false)
        });

        res.json({
            message: "Book added successfully",
            BookId: newBook._id
        });
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ error: error.message });
    }
});




router.get("/books/:userId", adminMiddleware, async (req, res) => {
    const {userId} = req.params;
    try {
        const response = await Book.find({ uploadedBy: userId }); // Filter by logged-in user ID
        res.json({ Books: response });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching books" });
    }
});


router.get("/allemails",adminMiddleware, async (req, res) => {
    try {
        const response = await Subscribe.find({ }); // Filter by logged-in user ID
        res.json({ 
            Emails: response.map(user=>user.email)
         });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching books" });
    }
});





// Assuming you have an admin middleware already
router.post('/send-newsletter', async (req, res) => {
    try {
        const { title, message } = req.body;

        // Fetch all subscribed emails
        const { data } = await axios.get('http://localhost:5000/admin/allemails');
        const emails = data.Emails;

        if (!emails || emails.length === 0) {
            return res.status(400).json({ success: false, message: 'No subscribed emails found.' });
        }

        console.log("Emails to send:", emails); // Log for verification

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });

        // Set up email options
        const mailOptions = {
            from: config.EMAIL_USER,
            to: emails.join(','), // Convert array to comma-separated string
            subject: title,
            text: message,
            
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Newsletter sent successfully!' });

    } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).json({ success: false, message: 'Error sending newsletter', error: error.message });
    }
});


router.put('/books/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { ...updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ msg: "Book not found" });
        }

        res.status(200).json({
            msg: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ msg: "Error updating book" });
    }
});
router.delete('/books/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ msg: "Book not found" });
        }

        res.status(200).json({
            msg: "Book deleted successfully",
            book: deletedBook,
        });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ msg: "Error deleting book" });
    }
});





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

