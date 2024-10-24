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
   favouriteBooks: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Book'
   }]
});

const ReviewSchema = new mongoose.Schema({
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
   },
   book: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Book'
   },
   rating: Number,
   comment: String
});

/*
const BookSchema = new mongoose.Schema({
   title: String,
   description: String,
   author: String,
   publication:String,
   publishedDate: Date,
   price: Number,
   category: String,
   reviews: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Review'
   }]
});
*/

const BookSchema = new mongoose.Schema({
   title: String,
   description: String,
   author: String,
   publication: String,
   publishedDate: Date,
   price: Number,
   category: String,
   thumbnail: String,  // URL for the thumbnail image
   pdf: String,        // URL for the PDF
   reviews: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Review'
   }]
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Book = mongoose.model('Book', BookSchema);
const Review = mongoose.model('Review', ReviewSchema);

module.exports = {
   Admin,
   User,
   Book,
   Review
};