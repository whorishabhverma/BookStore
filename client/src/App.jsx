// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Navbar from './components/NavBar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BookList from './components/BookList'; // Import BooksList
import ReadBook from './components/ReadBook';
import myPdf from './components/Summary.pdf';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to BookishBazaar
                      </h1>
                      <p className="text-xl text-gray-600">
                        Your one-stop destination for all your favorite books
                      </p>
                    </div>
                    <BookList /> {/* Add BooksList component here */}
                    <ReadBook pdfUrl={myPdf} buttonText="View Document" />
                  </div>
                </div>
              </>
            } 
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          

          {/* Protected routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 404 route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Page not found</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
