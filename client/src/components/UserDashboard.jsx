// src/components/UserDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BooksList from './BookList';

const UserDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/signin');
  };

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
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <div className="p-4">
                <h2 className="text-xl font-semibold">Welcome to Your Dashboard</h2>
                <p className="mt-2">Browse and purchase your favorite books here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BooksList/>
    </div>
  );
};

export default UserDashboard;