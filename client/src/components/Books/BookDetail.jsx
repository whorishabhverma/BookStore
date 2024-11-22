import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Star, BookOpen, Calendar, Tag, User, DollarSign } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import ReadBook from '../ReadBook';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchBookDetails = async () => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);

    try {
      const headers = token ? { 'Authorization': token } : {};

      const bookResponse = await fetch(`http://localhost:5000/user/Books/${id}`, { headers });
      if (!bookResponse.ok) throw new Error('Failed to fetch book details');

      const bookData = await bookResponse.json();
      setBook(bookData.Books[0]);

      const reviewResponse = await fetch(`http://localhost:5000/user/books/${id}/reviews`, { headers });
      if (!reviewResponse.ok) throw new Error('Failed to fetch reviews');

      const reviewData = await reviewResponse.json();
      setReviews(reviewData.reviews || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim() || newRating === 0) {
      toast.error('Please provide both review and rating');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/books/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          review: newReview,
          rating: newRating,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to submit review');

      fetchBookDetails();
      setNewReview('');
      setNewRating(0);
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-6 text-center">{error}</div>
  );

  if (!book) return (
    <div className="text-gray-500 p-6 text-center">Book not found</div>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ToastContainer />

      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to List
      </button>

      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="max-w-full h-auto rounded-lg shadow-2xl transform transition hover:scale-105"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
            {book.title}
          </h1>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <User className="text-blue-500" />
              <p><strong>Author:</strong> {book.author}</p>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="text-green-500" />
              <p><strong>Publication:</strong> {book.publication}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="text-red-500" />
              <p><strong>Published Date:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Tag className="text-purple-500" />
              <p><strong>Category:</strong> {book.category}</p>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="text-green-600" />
              <p><strong>Price:</strong> ${book.price}</p>
            </div>
          </div>

          <p className="text-gray-700 italic"><strong>Description :</strong> {book.description}</p>
        </div>
      </div>

      {/* Show login prompt if not logged in */}
      {!loggedIn && (
        <div className="mt-8 bg-white p-4 rounded-lg text-center text-blue-600">
          <p>Please <button onClick={() => navigate('/login')} className="underline">log in</button> to read the book and submit reviews.</p>
        </div>
      )}

      {/* Read Book Section - Only for logged in users */}
      {loggedIn && book.pdf && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <ReadBook
            pdfUrl={book.pdf}
            authorizationToken={localStorage.getItem('token')}
          />
        </div>
      )}

      {/* Review Section - Only for logged in users */}
      {loggedIn && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts about this book..."
            className="w-full bg-white p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-200 transition-all"
            rows="4"
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setNewRating(index + 1)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${index < newRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={handleReviewSubmit}
              disabled={!newReview.trim() || newRating === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                         disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Book Reviews
        </h2>

        <div className="space-y-4 mb-6">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-500 italic py-4">
              No reviews yet. Be the first to write a review!
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">{review.user}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-800">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
