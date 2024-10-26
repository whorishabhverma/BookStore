// BookDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReadBook from '../ReadBook'; // Import ReadBook component

const BookDetail = ({ requiresAuth = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const headers = {};
        if (requiresAuth) {
          const token = localStorage.getItem('token');
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/user/books/${id}`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        setBook(data.Books ? data.Books[0] : null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, requiresAuth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!book) {
    return <div className="text-gray-500 p-4">Book not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-start">
          <img 
            src={book.thumbnail} 
            alt={book.title} 
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
          <div className="space-y-4">
            <p className="text-lg text-gray-800"><strong>Author:</strong> {book.author}</p>
            <p className="text-lg text-gray-800"><strong>Publication:</strong> {book.publication}</p>
            <p className="text-lg text-gray-800"><strong>Published Date:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
            <p className="text-lg text-gray-800"><strong>Category:</strong> {book.category}</p>
            <p className="text-lg text-gray-800"><strong>Price:</strong> ${book.price}</p>
          </div>
          <p className="mt-6 text-gray-700">{book.description}</p>
        </div>
      </div>

      <div className="mt-8">
        {book.pdf && (
          <ReadBook 
            pdfUrl={book.pdf} 
            authorizationToken={requiresAuth ? localStorage.getItem('token') : null} 
          />
        )}
      </div>
    </div>
  );
};

export default BookDetail;
