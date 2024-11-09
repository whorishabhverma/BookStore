import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import BooksList from './Books/BooksList';
import BookDetail from './Books/BookDetail';

const UserDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/signin');
  };
  const userId = localStorage.getItem('userId');
  // console.log("User ID:", userId);

 
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
                      <BooksList 
                        apiUrl="http://localhost:5000/user/books"
                        title="Books available on Website"
                        requiresAuth={true}
                        userId={userId}
                        isHeartShow={true}
                      />

                      <BooksList 
                        apiUrl={`http://localhost:5000/user/books/fav/${userId}`}
                        title="Your Favourite Books"
                        requiresAuth={false}
                        userId={userId}
                      />



                      
                      
                    </div>
                    
                  </div>
                </>
              } 
            />
            <Route 
              path="/books/:id" 
              element={<BookDetail requiresAuth={true} />} 
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};


export default UserDashboard;