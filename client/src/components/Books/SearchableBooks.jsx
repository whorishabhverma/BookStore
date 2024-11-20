import React, { useState, useEffect } from 'react';
import BooksList from './BooksList';

const SearchableBooks = () => {
  const [query, setQuery] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/user/booksa');

  const handleSearch = () => {
    if (query.trim()) {
      setApiUrl(`http://localhost:5000/user/booksa?query=${encodeURIComponent(query.trim())}`);
    } else {
      setApiUrl('http://localhost:5000/user/booksa'); // Reset to show all books
    }
  };

  useEffect(() => {
    handleSearch();
  }, [query]);
  return (
    <div className="max-w-7xl mx-auto my-8">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a book..."
          className="border bg-white border-gray-300 rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <BooksList 
        apiUrl={apiUrl} 
        title="Searchable Books" 
        requiresAuth={false} 
      />
    </div>
  );
};

export default SearchableBooks;
