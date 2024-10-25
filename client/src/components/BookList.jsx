import React, { useEffect, useState } from 'react';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/user/books', {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                setBooks(data.Books);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Books List</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.map((book) => (
                    <div key={book._id} className="flex flex-col items-center p-4 border rounded-md shadow hover:shadow-lg transition-shadow">
                        <div className="w-full h-48 mb-2">
                            <img src={book.thumbnail} alt={book.title} className="w-full h-full object-contain rounded" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center">{book.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BooksList;
