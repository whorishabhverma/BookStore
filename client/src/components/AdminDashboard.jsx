// src/components/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBook from './UploadBook';
import BooksList from './BookList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
    <div className="bg-white shadow-lg">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            >
                Logout
            </button>
        </div>
    </div>
</div>

  <UploadBook/>
</div>
      
  );
};

export default AdminDashboard;