import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/signin');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-xl font-bold" onClick={closeMenu}>
            BookishBazaar
          </Link>

          

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-gray-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-8">
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
        </div>

        {/* Mobile Menu with Search */}
        <div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-2 pb-4 space-y-2`}
        >
          
          
          <Link to="/" className="block text-white hover:text-gray-300 py-2" onClick={closeMenu}>Home</Link>
          <Link to="/about" className="block text-white hover:text-gray-300 py-2" onClick={closeMenu}>About</Link>
          <Link to="/contact" className="block text-white hover:text-gray-300 py-2" onClick={closeMenu}>Contact Us</Link>

          {!token ? (
            <div className="space-y-2 pt-2">
              <Link 
                to="/signup" 
                className="block bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out text-center"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
              <Link 
                to="/signin" 
                className="block bg-transparent border-2 border-white text-white font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-blue-500 transition duration-300 ease-in-out text-center"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <Link 
                to={`/${userType}-dashboard`} 
                className="block text-white hover:text-gray-300 py-2"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-center"
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
