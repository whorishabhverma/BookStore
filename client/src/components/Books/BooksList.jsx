import React, { useEffect, useState } from 'react';
import BookGrid from './BookGrid';

const BooksList = ({ 
  apiUrl, 
  title = "Books List",
  requiresAuth = false,
}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const headers = {};
        if (requiresAuth) {
          const token = localStorage.getItem('token');
          headers.Authorization = `${token}`;
        }

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.Books || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [apiUrl, requiresAuth]);

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <BookGrid books={books} error={error} />
      )}
    </div>
  );
};


export default BooksList;