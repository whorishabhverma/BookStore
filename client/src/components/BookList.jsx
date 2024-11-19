import React, { useEffect, useState } from 'react';

const BooksList = ({ apiUrl, title, requiresAuth, excludeFavorites, isHeartShow, userId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(apiUrl, {
          headers: requiresAuth ? { 'Authorization': `${token}` } : {}
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
  
        const data = await response.json();
        let bookList = data.Books || [];
  
        if (excludeFavorites && Array.isArray(excludeFavorites)) {
          // Create a Set of favorite IDs for efficient lookup
          const favoriteIds = new Set(excludeFavorites.map(fav => fav._id));
  
          // Filter out books that are in the favorite list
          bookList = bookList.filter(book => !favoriteIds.has(book._id));
        }
  
        setBooks(bookList);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, [apiUrl, requiresAuth, excludeFavorites]);
  

  const handleAddToFavorites = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/user/books/fav/${userId}/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      // Remove the book from the list if it's successfully added to favorites
      setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Failed to add to favorites');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">Loading books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {books.length === 0 ? (
        <p className="text-gray-500 text-center">No books available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <div key={book._id} className="flex flex-col items-center p-4 border rounded-md shadow hover:shadow-lg transition-shadow">
              <div className="w-full h-48 mb-2">
                <img 
                  src={book.thumbnail} 
                  alt={book.title} 
                  className="w-full h-full object-contain rounded" 
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">{book.title}</h3>
              {isHeartShow && (
                <div className="mt-2">
                  <button 
                    onClick={() => handleAddToFavorites(book._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    ❤️ Add to favorites
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;