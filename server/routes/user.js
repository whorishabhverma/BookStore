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
            token,
            userId: user._id
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

router.get('/books/fav/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID and populate the favouriteBooks field
        const response = await User.findById(userId).populate('favouriteBooks');

        // Check if response is null to handle not found
        if (!response) { // Change this to check response instead of user
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the favorite books of the user
        res.json({ 
            Books: response.favouriteBooks // Return the populated favouriteBooks field
        });
    } catch (error) {
        console.error('Error fetching favorite books:', error);
        res.status(500).json({ message: 'Error fetching favorite books' });
    }
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


// Backend route to add book to user's favorites
router.post('/favorites', async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.favouriteBooks.includes(bookId)) {
            return res.status(400).json({ msg: "Book is already in favorites" });
        }

        user.favouriteBooks.push(bookId);
        await user.save();
        res.json({ msg: "Book added to favorites", favoriteBooks: user.favouriteBooks });
    } catch (error) {
        console.error('Error updating favorites:', error);
        res.status(500).json({ msg: 'Failed to update favorites', error });
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

