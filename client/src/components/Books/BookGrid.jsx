import React from 'react';
import BookCard from './BookCard';

const BookGrid = ({ books, error }) => {
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!books?.length) {
    return <div className="text-gray-500 p-4">No books found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;