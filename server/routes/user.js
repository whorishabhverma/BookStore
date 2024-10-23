const express = require('express')
const router = express.Router();
const {Book, User,Review} = require('../models/model')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/db")
const userMiddleware  = require('../middlewares/user');

//admin signup route
router.post('/signup',async (req,res)=>{
    const {username,password} = req.body;
    await User.create({
        username,
        password
    })   
    res.json({
        message :"user created successfully!"
    }) 
});

router.post('/signin',async (req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username,password});
    
    if(user){
        const token = jwt.sign({
            _id: user._id,
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

router.get("/book/:category",async (req,res)=>{
    const category = req.params.category;
    const response = await Book.find({
        category
    })
    res.json({
        books:response
    })
})

router.get("/books",async(req,res)=>{
    const response = await Book.find({});
    res.json({
        Books : response
    })
})

router.post('/review/:bookName',userMiddleware, async (req, res) => {
    try {
        const bookName = req.params.bookName;
        const userId = req.user._id;
        console.log(userId)
        const { rating, comment} = req.body;
 
        // Find the book by name
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
 
        // Create new review
        const review = new Review({
            user: userId,
            book: book._id,
            rating: rating,
            comment: comment
        });
 
        // Save the review
        await review.save();
 
        // Add review to book's reviews array
        book.reviews.push(review._id);
        await book.save();
 
        res.status(201).json({
            message: "Review added successfully",
            review: review
        });
 
    } catch (error) {
        res.status(500).json({
            message: "Error adding review",
            error: error.message
        });
    }
 });



module.exports = router;

