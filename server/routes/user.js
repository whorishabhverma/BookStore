const express = require('express');
const router = express.Router();
const { Book, User, Review, Subscribe } = require('../models/model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config");  // Import STRIPE_SECRET_KEY from config
const userMiddleware = require('../middlewares/user');
const bcrypt = require('bcrypt');
require('dotenv').config();


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

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id, username: user.username, premium: user.premium || false },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Send response
        return res.status(200).json({
            token: `Bearer ${token}`,
            user: { _id: user._id, username: user.username, premium: user.premium || false },
        });
    } catch (error) {
        console.error("Server error during sign-in:", error); // Log detailed error
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

router.get("/books/:bookId?", async (req, res) => {
    const { bookId } = req.params;
    const response = await Book.find(bookId ? { _id: bookId } : {premium:false});
    res.json({
        Books: response
    });
});

router.get('/books/fav/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID and populate the favouriteBooks field
        const user = await User.findById(userId).populate('favouriteBooks');

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's favorite books
        res.json({ 
            Books: user.favouriteBooks 
        });
    } catch (error) {
        console.error('Error fetching favorite books:', error);
        res.status(500).json({ message: 'Error fetching favorite books' });
    }
});


router.get('/books/exclude/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user and get their favorite books
        const user = await User.findById(userId).populate('favouriteBooks', '_id');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract IDs of the user's favorite books
        const favoriteBookIds = user.favouriteBooks.map(book => book._id);

        // Fetch books that are not premium and not in the user's favorite books
        const books = await Book.find({
            premium: false,
            _id: { $nin: favoriteBookIds }
        });

        // Respond with the filtered books
        res.json({ Books: books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
});

router.get('/booksa', async (req, res) => {
    const { query, category } = req.query;
  
    // Build the filter object dynamically
    const filter = {};
  
    // If a query is provided, add it to the filter (case-insensitive title search)
    if (query) {
      filter.title = { $regex: query, $options: 'i' }; // Case-insensitive regex search for title
    }
  
    // If a category is provided, add it to the filter (case-insensitive category search)
    if (category) {
      filter.category = { $regex: category, $options: 'i' }; // Case-insensitive regex search for category
    }
  
    try {
      // Find books based on the filter (if empty, this will return all books)
      const books = await Book.find(filter);
  
      // Return the filtered books (or all books if no filter is applied)
      return res.json({ Books: books });
    } catch (err) {
      // Handle any errors that occur during the database query
      return res.status(500).json({ error: err.message });
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
// router.post('/review/:bookName',userMiddleware, async (req, res) => {
//     try {
//         const bookName = req.params.bookName;
//         const userId = req.user._id;
//         console.log(userId)
//         const { rating, comment} = req.body;
 
//         // Find the book by name
//         const book = await Book.findOne({ title: bookName });
//         if (!book) {
//             return res.status(404).json({
//                 message: "Book not found"
//             });
//         }
 
//         // Create new review
//         const review = new Review({
//             user: userId,
//             book: book._id,
//             rating: rating,
//             comment: comment
//         });
 
//         // Save the review
//         await review.save();
 
//         // Add review to book's reviews array
//         book.reviews.push(review._id);
//         await book.save();
 
//         res.status(201).json({
//             message: "Review added successfully",
//             review: review
//         });
 
//     } catch (error) {
//         res.status(500).json({
//             message: "Error adding review",
//             error: error.message
//         });
//     }
//  });


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

const checkPremiumUser = async (req, res, next) => {
    const user = req.user; // `req.user` is set by your authentication middleware
  
    if (!user || !user.premium) {
      return res.status(403).json({ message: "Access denied. Premium users only." });
    }
    next();
  };
  router.get("/premium-books",userMiddleware,checkPremiumUser, async (req, res) => {
    try {
      const books = await Book.find({ premium: true });
      res.json({
        Books: books,
      });
    } catch (error) {
      console.error("Error fetching premium books:", error);
      res.status(500).json({ message: "Error fetching premium books" });
    }
  });
  // POST /user/books/:id/review
  router.post('/books/:id/review', userMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { review, rating } = req.body;
      const userId = req.user._id;  // Assuming middleware passes user ID
  
      if (!review || !rating) {
        return res.status(400).json({ error: 'Review and rating are required.' });
      }
  
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
      }
  
      const newReview = new Review({
        user: userId,
        book: id,
        rating,
        comment: review
      });
  
      await newReview.save();
      
      // Add review reference to book's reviews array
      book.reviews.push(newReview._id);
      await book.save();
  
      res.status(201).json({ message: 'Review added successfully.', newReview });
    } catch (error) {
      console.error(error);  // Log the actual error for debugging
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });

  // GET /user/books/:id
router.get('/Books/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id).populate('reviews');
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
      }
  
      res.status(200).json({ Books: [book], Reviews: book.reviews });
    } catch (error) {
      res.status(500).json({ error: 'Server error.' });
    }
  });
  

  // Route to fetch reviews for a specific book
router.get('/books/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the book and populate its reviews with user details
        const book = await Book.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'user',
                select: 'username' // Only select username for privacy
            }
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Extract reviews with user information
        const reviews = book.reviews.map(review => ({
            _id: review._id,
            comment: review.comment,
            rating: review.rating,
            user: review.user.username,
            createdAt: review.createdAt
        }));

        res.json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});
  



module.exports = router;

