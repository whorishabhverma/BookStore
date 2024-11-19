const express = require('express');
const router = express.Router();
const { Book, User, Review, Subscribe } = require('../models/model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET } = require("../config/config");  // Import STRIPE_SECRET_KEY from config
const userMiddleware = require('../middlewares/user');
const bcrypt = require('bcrypt');
require('dotenv').config();
/*
const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,  // Razorpay Key ID from your environment variables
    key_secret: process.env.RAZORPAY_KEY_SECRET,  // Razorpay Key Secret from your environment variables
});

*/


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
//for search 
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the query from the request
    try {
        const books = await Book.find({ title: { $regex: query, $options: 'i' } }); // Search for books by title
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
 router.post('/api/verify-username', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    res.json({ exists: !!user });
});

router.get("/check/:username", async (req, res) => {
    const { username } = req.params;
  
    try {
      // Query database for user with the given username
      const user = await User.findOne({ username }); 
  
      res.json({
        exists: !!user, // true if user exists, false otherwise
        user,           // Return user data if found
      });
    } catch (error) {
      res.status(500).json({
        message: "Error checking user",
      });
    }
  });
  


  router.post("/subscribe", async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Username is required",
        });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.premium) {
            return res.status(200).json({
                message: "User is already a premium member",
            });
        }

        // Update the user to premium
        user.premium = true;
        await user.save();

        res.status(200).json({
            message: "Successfully subscribed to premium",
            user: {
                id: user._id,
                username: user.username,
                premium: user.premium,
            },
        });
    } catch (error) {
        console.error("Error in subscribing user:", error);
        res.status(500).json({
            message: "Error subscribing to premium",
        });
    }
});



router.post('/api/create-checkout-session', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.premium) return res.status(400).json({ error: 'User already premium' });

        // Create Razorpay order
        const orderOptions = {
            amount: 1000 * 100, // Amount in paisa (1000 paisa = 10 INR)
            currency: 'INR', // Currency in which the payment is made
            receipt: `receipt_${new Date().getTime()}`,
            payment_capture: 1, // Auto capture payment
            notes: {
                username, // Store username in notes for reference
            },
        };

        const order = await razorpay.orders.create(orderOptions);

        // Send the order details to the frontend for the payment
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during order creation' });
    }
});

// Razorpay Webhook for payment verification
router.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const payload = req.body;
    const sig = req.headers['x-razorpay-signature'];

    try {
        // Webhook secret key (from Razorpay Dashboard)
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(payload)
            .digest('hex');

        if (expectedSignature !== sig) {
            return res.status(400).send('Invalid signature');
        }

        // Process the payment after verification
        const paymentData = JSON.parse(payload);
        if (paymentData.event === 'payment.captured') {
            const orderId = paymentData.payload.payment.entity.order_id;
            const paymentId = paymentData.payload.payment.entity.id;

            // Fetch the order using Razorpay API and confirm the payment
            const order = await razorpay.orders.fetch(orderId);

            if (order.status === 'captured') {
                const username = order.notes.username;

                // Find the user and update their premium status
                const user = await User.findOne({ username });
                if (user) {
                    user.premium = true; // Mark user as premium
                    await user.save();
                }
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

module.exports = router;

