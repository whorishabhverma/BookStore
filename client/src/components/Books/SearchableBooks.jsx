import React, { useState, useEffect } from 'react';
import BooksList from './BooksList';

const SearchableBooks = ({ initialUrl, title, requiresAuth }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(''); // State for category filter
  const [apiUrl, setApiUrl] = useState(initialUrl);

  const handleSearch = () => {
    let url = `${initialUrl}`;
    
    // Add query filter if available
    if (query.trim()) {
      url += `?query=${encodeURIComponent(query.trim())}`;
    }

    // Add category filter if selected
    if (category) {
      url += (url.includes('?') ? '&' : '?') + `category=${encodeURIComponent(category)}`;
    }

    setApiUrl(url);
  };

  useEffect(() => {
    handleSearch();
  }, [query, category]); // Update search whenever query or category changes

  return (
    <div className="max-w-7xl mx-auto my-8">
      <div className="mb-4 flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a book..."
          className="border bg-white border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        />
        
        {/* Category filter dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border bg-white border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        >
          <option value="">All Categories</option>
          <option value="rishabh verma">rishabh</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="interview">Interview</option>
          <option value="history">History</option>
          <option value="technology">Technology</option>
          {/* Add more categories as needed */}
        </select>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      <BooksList 
        apiUrl={apiUrl} 
        title={title} 
        requiresAuth={requiresAuth} 
      />
    </div>
  );
};

export default SearchableBooks;
