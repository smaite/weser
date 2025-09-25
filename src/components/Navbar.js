import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BottomNav from './BottomNav';

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
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-black border-b border-gray-800 sticky top-0 z-50 ${scrolled ? 'shadow-2xl shadow-purple-500/20' : ''}`}
      style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      {/* Top banner - Hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center py-2 text-sm px-2">
        📞 Need Help? Contact Us | 📧 Glorious Trade Hub | 🎯 Premium Electronics & Tech Solutions
      </div>
      
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform" style={{ boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' }}>
              G
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-all duration-300">
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
            <Link
              to="/about"
              className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActiveLink('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
            
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-purple-400 transition-all duration-300 border border-gray-800"
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
                  className="flex items-center space-x-3 p-2 rounded-xl bg-gray-900 hover:bg-gray-800 transition-all duration-300 border border-gray-800"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:block font-medium text-gray-300">
                    {user?.name}
                  </span>
                  <i className={`fas fa-chevron-down text-gray-400 text-sm transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 py-2 z-50"
                      style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)' }}
                    >
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                      >
                        <i className="fas fa-user w-4"></i>
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                      >
                        <i className="fas fa-box w-4"></i>
                        <span>Orders</span>
                      </Link>
                      
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                        >
                          <i className="fas fa-cog w-4"></i>
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-800 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
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
                  className="text-gray-300 hover:text-purple-400 font-medium transition-colors"
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

          {/* Mobile menu button - Only show on tablet, hidden on mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden sm:block lg:hidden p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 transition-all duration-300 border border-gray-800"
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
              className="lg:hidden border-t border-gray-800 bg-gray-900 rounded-b-2xl mt-2 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 mx-2 rounded-lg transition-colors ${
                    isActiveLink('/') 
                      ? 'text-purple-400 bg-gray-800 font-medium' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-purple-400'
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 mx-2 rounded-lg transition-colors ${
                    isActiveLink('/products') 
                      ? 'text-purple-400 bg-gray-800 font-medium' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-purple-400'
                  }`}
                >
                  Products
                </Link>
                
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 mx-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-purple-400"
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
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user?.name}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mx-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                    >
                      Profile
                    </Link>
                    
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mx-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                    >
                      Orders
                    </Link>
                    
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 mx-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 mx-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 mx-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors"
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

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </>
  );
};

export default Navbar;