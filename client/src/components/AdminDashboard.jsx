import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UploadBook from './UploadBook';
import BooksList from './Books/BooksList';
import BookDetail from './Books/BookDetail';
import AdminNewsLetterForm from './AdminNewsLetterForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId')
    navigate('/signin');
  };

  const userId = localStorage.getItem('userId');
  // console.log("User ID:", userId);

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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-semibold mb-4">Upload New Book</h2>
                  <UploadBook />
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>
                  <BooksList 
                    apiUrl={`http://localhost:5000/admin/books/${userId}`}
                    title="Books Uploaded by you"
                    requiresAuth={true}
                    isHeartShow={false}
                    userId={userId}
                  />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <AdminNewsLetterForm />
                </div>


              </div>

              
            } 
          />
          <Route 
            path="/books/:id" 
            element={
              <div className="bg-white rounded-lg shadow p-6">
                <BookDetail requiresAuth={true}  />
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;