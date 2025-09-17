import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`nav-modern ${scrolled ? 'shadow-lg' : ''}`}
    >
      <div className="container">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                Glorious Trade Hub
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`nav-link ${isActiveLink('/products') ? 'active' : ''}`}
            >
              Products
            </Link>
            
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-blue-600 transition-all duration-300"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
              {cartItemsCount > 0 && (
                <span className="cart-badge animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:block font-medium text-gray-700">
                    {user?.name}
                  </span>
                  <i className={`fas fa-chevron-down text-gray-500 text-sm transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <i className="fas fa-user w-4"></i>
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <i className="fas fa-box w-4"></i>
                        <span>Orders</span>
                      </Link>
                      
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <i className="fas fa-cog w-4"></i>
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt w-4"></i>
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white rounded-b-2xl mt-2 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 mx-2 rounded-lg transition-colors ${
                    isActiveLink('/') 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 mx-2 rounded-lg transition-colors ${
                    isActiveLink('/products') 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Products
                </Link>
                
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 mx-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span>Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                </Link>

                {isAuthenticated() ? (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Orders
                    </Link>
                    
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 mx-2 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Login
                    </Link>
                    <div className="px-4">
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-primary w-full text-center"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;