const express = require('express')
const router = express.Router();
const {Admin, Book,Review} = require('../models/model')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/db")
const adminMiddleware  = require('../middlewares/admin');

//admin signup route
router.post('/signup',async (req,res)=>{
    const {username,password} = req.body;
    await Admin.create({
        username,
        password
    })   
    res.json({
        message :"Admin created successfully!"
    }) 
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

