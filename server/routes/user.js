const express = require('express')
const router = express.Router();
const {Book, User,Review,Subscribe} = require('../models/model')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/config")
const userMiddleware  = require('../middlewares/user');
const adminMiddleware  = require('../middlewares/admin');
const bcrypt = require('bcrypt');

//admin signup route
// router.post('/signup',async (req,res)=>{
//     const {username,password} = req.body;
//     await User.create({
//         username,
//         password
//     })   
//     res.json({
//         message :"user created successfully!"
//     }) 
// });


router.post('/signup', async (req, res) => {
    const { username, password, name, mobile } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with hashed password
        await User.create({
            username,
            password:hashedPassword,
            name,
            mobile
        });

        res.status(201).json({
            message: "User created successfully!"
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: 'Server error, please try again later.'
        });
    }
});



// Signin route
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ msg: "Incorrect username or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ msg: "Incorrect username or password" });
        }

        // If password matches, generate a JWT token
        const token = jwt.sign({
            _id: user._id,
            username: user.username
        }, JWT_SECRET,
    );

        // Send the token to the client
        res.json({
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error, please try again later." });
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

// router.get("/books",async(req,res)=>{
//     const response = await Book.find({});
//     res.json({
//         Books : response
//     })
// })

// router.get("/books/:bookId",async(req,res)=>{
//     const bookId = req.params.bookId;
//     const response = await Book.find({
//         _id : bookId
//     });
//     res.json({
//         Books : response
//     })
// })


router.get("/books/:bookId?", async (req, res) => {
    const { bookId } = req.params;
    const response = await Book.find(bookId ? { _id: bookId } : {});
    res.json({
        Books: response
    });
});


//will use this route for favourite books
/*
router.get("/favBooks", userMiddleware,async (req, res) => {
    const { bookId } = req.params;
    const response = await Book.find(bookId ? { _id: bookId } : {});
    res.json({
        Books: response
    });
});
*/

router.post('/subscribe', async (req, res) => {
    try {
        const {email} = req.body;

        // Check if already subscribed
        const emailId = await Subscribe.findOne({ email });
        if (emailId) {
            return res.status(409).json({
                success: false,
                message: 'Already subscribed'
            });
        }

        // Create new subscription
        const subscribe = new Subscribe({
            email,
            subscribedAt: new Date(),
            status: 'active'
        });

        await subscribe.save();

        return res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error subscribing',
            error: error.message
        });
    }
});







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

