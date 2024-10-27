import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, className = '', isHeartShow, userId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleHeartClick = async (e) => {
    e.stopPropagation(); // Prevent triggering the book card click event
    setIsFavorite((prev) => !prev); // Toggle favorite state

    try {
        const response = await fetch('http://localhost:5000/user/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId, // Pass the current user's ID
                bookId: book._id, // Pass the current book's ID
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update favorites,Book is already your favourite');
        }

        const data = await response.json();
        console.log('Favorite updated:', data);
        alert(`Book ID ${book._id} is now your favorite!`);
    } catch (error) {
        console.error('Error updating favorites:', error);
        alert('Failed to update favorites');
    }
};


  return (
    <div
      onClick={() => navigate(`/books/${book._id}`)}
      className={`flex flex-col items-center p-4 border rounded-md shadow 
        hover:shadow-lg transition-shadow cursor-pointer ${className}`}
    >
      <div className="w-full h-48 mb-2">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-contain rounded"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center">{book.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
      <div className="flex items-center justify-between w-full mt-1">
        <p className="text-sm font-medium text-gray-800">${book.price}</p>

        {/* Conditionally render heart button */}
        {isHeartShow && (
          <button
            onClick={handleHeartClick}
            className={`ml-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500'} hover:text-red-600`}
          >
            ❤️ {/* Heart icon */}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
