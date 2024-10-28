import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/signin');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">BookishBazaar</Link>

        <div className="flex space-x-8">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          <Link to="/contact" className="text-white hover:text-gray-300">Contact Us</Link>
        </div>

        <div className="space-x-4">
          {!token ? (
            <>
              <Link 
                to="/signup" 
                className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
              >
                Sign Up
              </Link>
              <Link 
                to="/signin" 
                className="bg-transparent border-2 border-white text-white font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-blue-500 transition duration-300 ease-in-out"
              >
                Sign In
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to={`/${userType}-dashboard`} 
                className="text-white hover:text-gray-300"
              >
                Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
