import React, { useState } from 'react';
import axios from 'axios';

const BookSearch = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a search term');
            setSearchResults([]);
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/user/search?query=${query}`);
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setSearchResults(response.data);
            } else {
                setSearchResults([]);
                setError('No results found');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Failed to fetch results. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Book Search</h2>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a book..."
                    style={{
                        flex: '1',
                        padding: '10px',
                        fontSize: '16px',
                        marginRight: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading && <p>Loading...</p>}

            <div>
                {searchResults.map((book) => (
                    <div
                        key={book._id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        <h3 style={{ margin: '0 0 5px' }}>{book.title}</h3>
                        <p style={{ margin: '0', fontStyle: 'italic' }}>by {book.author}</p>
                        <p style={{ margin: '5px 0 0' }}>{book.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookSearch;
