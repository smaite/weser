import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/admin', 
      label: 'Dashboard', 
      icon: 'fas fa-chart-line' 
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: 'fas fa-users' 
    },
    { 
      path: '/admin/products', 
      label: 'Products', 
      icon: 'fas fa-box' 
    },
    { 
      path: '/admin/orders', 
      label: 'Orders', 
      icon: 'fas fa-shopping-cart' 
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 min-h-[60px] transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`${item.icon} text-lg mb-1`}></i>
              <span className="text-xs font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBottomNav;
