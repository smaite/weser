import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  
  // Safe cart items count with error handling
  let cartItemsCount = 0;
  try {
    cartItemsCount = getCartItemsCount ? getCartItemsCount() : 0;
  } catch (error) {
    console.error('Error getting cart items count:', error);
    cartItemsCount = 0;
  }

  const navItems = [
    {
      path: '/',
      icon: 'fas fa-home',
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      path: '/products',
      icon: 'fas fa-search',
      label: 'Search',
      active: location.pathname === '/products'
    },
    {
      path: '/cart',
      icon: 'fas fa-shopping-cart',
      label: 'Cart',
      active: location.pathname === '/cart',
      badge: cartItemsCount > 0 ? cartItemsCount : null
    },
    {
      path: isAuthenticated() ? '/orders' : '/login',
      icon: isAuthenticated() ? 'fas fa-clock' : 'fas fa-user',
      label: isAuthenticated() ? 'Orders' : 'Login',
      active: location.pathname === '/orders' || location.pathname === '/login'
    }
  ];

  // Add admin item if user is admin
  if (isAdmin()) {
    navItems.push({
      path: '/admin',
      icon: 'fas fa-cog',
      label: 'Admin',
      active: location.pathname.startsWith('/admin')
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
      <div className="flex justify-around items-center py-1 px-2">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center justify-center py-1 px-1 min-w-0 flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center min-h-[50px] justify-center"
            >
              {/* Icon Container */}
              <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${
                item.active 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}>
                <i className={`${item.icon} text-base`}></i>
                
                {/* Badge for cart */}
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </div>
              
              {/* Label - Always visible with better sizing */}
              <span className={`text-xs font-medium mt-0.5 transition-colors duration-300 text-center leading-tight ${
                item.active ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.div>

            {/* Active Indicator */}
            {item.active && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="pb-safe bg-white"></div>
    </div>
  );
};

export default BottomNav;
