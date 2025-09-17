import React from 'react';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-color rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-box"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                <p className="text-gray-600">Manage your products</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary-color rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-list"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <p className="text-gray-600">Manage categories</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                <p className="text-gray-600">Manage orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
