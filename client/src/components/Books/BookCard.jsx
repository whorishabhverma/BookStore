import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, className = '' }) => {
  const navigate = useNavigate();

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
      <p className="text-sm font-medium text-gray-800 mt-1">${book.price}</p>
    </div>
  );
};


export default BookCard;