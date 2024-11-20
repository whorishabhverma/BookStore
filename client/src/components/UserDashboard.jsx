import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import BooksList from './Books/BooksList';
import BookDetail from './Books/BookDetail';
import SearchableBooks from './Books/SearchableBooks';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true); // Loading state for favorites
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  // Fetch favorites when the component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/user/books/fav/${userId}`, {
          headers: { 'Authorization': `${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.Books || []); // Ensure Books is correctly populated
          setLoadingFavorites(false);  // Mark favorites as loaded
        } else {
          throw new Error('Failed to fetch favorite books');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoadingFavorites(false);  // Stop loading even on error
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">


                      

                      <SearchableBooks 
                  initialUrl="http://localhost:5000/user/booksa" 
                  title="All Books" 
                  requiresAuth={false} 
                />


                      {/* Displaying books excluding favorites */}
                      <BooksList
                        apiUrl={`http://localhost:5000/user/books/exclude/${userId}`}
                        title="Books available on Website"
                        requiresAuth={true}
                        excludeFavorites={favorites} // Exclude favorite books here
                        isHeartShow={true} // Show the heart icon for favorites
                        userId={userId}
                      />
                      
                      {/* Displaying only favorite books */}
                      <BooksList
                        apiUrl={`http://localhost:5000/user/books/fav/${userId}`}
                        title="Your Favourite Books"
                        requiresAuth={true}
                        isHeartShow={false} // No heart icon here, since it's showing favorites
                        userId={userId}
                      />

                      {/* Displaying only premium books */}
                      <BooksList
                        apiUrl={`http://localhost:5000/user/premium-books`}
                        title="premium Books"
                        requiresAuth={true}
                      />

                    </div>
                  </div>
                </>
              }
            />
            <Route path="/books/:id" element={<BookDetail requiresAuth={true} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
