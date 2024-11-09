import React, { useState } from 'react';
import axios from 'axios';

const BookSearch = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (query.trim()) {
            setError(''); // Reset any previous errors
            try {
                const response = await axios.get(`http://localhost:5000/user/search?query=${query}`);
                // Ensure response.data is an array
                if (Array.isArray(response.data)) {
                    setSearchResults(response.data);
                } else {
                    setSearchResults([]); // Reset results if not an array
                    setError('No results found'); // Handle unexpected response
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('Failed to fetch results'); // Set error message
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a book..."
            />
            <button onClick={handleSearch}>Search</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                {searchResults.length > 0 ? (
                    searchResults.map((book) => (
                        <div key={book._id}>
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <p>{book.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No results to display</p>
                )}
            </div>
        </div>
    );
};

export default BookSearch;
