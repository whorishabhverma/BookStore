import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Navbar from './components/NavBar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BooksList from "./components/Books/BooksList";
import BookDetail from "./components/Books/BookDetail";
import { Footer } from './components/Footer';

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
                    <BooksList 
                      apiUrl="http://localhost:5000/user/books"
                      title="Available Books"
                      requiresAuth={false}
                    />
                  </div>
                </div>
              </>
            } 
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Book detail routes */}
          <Route path="/books/:id" element={
            <>
              <Navbar />
              <BookDetail requiresAuth={true} />
            </>
          } />

          {/* Protected routes */}
          <Route 
            path="/admin-dashboard/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-dashboard/*" 
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
      <Footer/>
    </Router>
  );
};

export default App;