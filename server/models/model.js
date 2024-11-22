const mongoose = require("mongoose");
const {mongoURI} = require("../config/config")
mongoose.connect(mongoURI);

const AdminSchema = new mongoose.Schema({
   username: String,
   password: String 
});

const UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   name: String,
   mobile: Number,
   premium: { type: Boolean, default: false },
   favouriteBooks: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Book'
   }]
});

const ReviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure every review is associated with a user
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true, // Ensure every review is associated with a book
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    comment: {
      type: String,
      trim: true, // Remove extra spaces
      required: true, // Ensure every review includes a comment
      maxlength: 500, // Optional: Limit the comment length
    },
  }, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  });
  


  const BookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing spaces
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publication: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now, // Default to the current date if not provided
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure no negative prices
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    thumbnail: {
      type: String,
      trim: true,
      required: true, // Ensure every book has a thumbnail
    },
    pdf: {
      type: String,
      trim: true,
      required: true, // Ensure every book has a PDF file
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    premium: {
      type: Boolean,
      default: false,
    },
  }, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  });
  

const SubscribeSchema = new mongoose.Schema(
    {
        email:String,
        subscribedAt:  Date,
        status: {
        type: String,
            enum: ['active', 'unsubscribed'],
            default: 'active'
        }
    }
)

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Book = mongoose.model('Book', BookSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Subscribe = mongoose.model('Subscribe',SubscribeSchema);

module.exports = {
   Admin,
   User,
   Book,
   Review,
   Subscribe
};