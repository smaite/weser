import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    cartItems: 0,
    wishlistItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Nepal'
  });

  useEffect(() => {
    fetchUserStats();
    fetchRecentOrders();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Simulate API calls - replace with actual endpoints
      setStats({
        totalOrders: Math.floor(Math.random() * 50) + 1,
        totalSpent: (Math.random() * 5000 + 500).toFixed(2),
        cartItems: Math.floor(Math.random() * 10),
        wishlistItems: Math.floor(Math.random() * 20)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      // Simulate recent orders - replace with actual API
      const mockOrders = [
        {
          id: '#ORD001',
          date: '2024-01-15',
          total: 299.99,
          status: 'Delivered',
          items: 3
        },
        {
          id: '#ORD002', 
          date: '2024-01-10',
          total: 149.99,
          status: 'Shipped',
          items: 1
        },
        {
          id: '#ORD003',
          date: '2024-01-05',
          total: 89.99,
          status: 'Processing',
          items: 2
        }
      ];
      setRecentOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Simulate profile update
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-400 bg-green-900/20';
      case 'Shipped': return 'text-blue-400 bg-blue-900/20';
      case 'Processing': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  {editMode && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                      <i className="fas fa-camera text-xs"></i>
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                  <p className="text-gray-400">{user?.email}</p>
                  <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full mt-2 border border-purple-500/30">
                    {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)} Account
                  </span>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white py-2">{user?.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white py-2">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-400 py-2">{profileData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      placeholder="Kathmandu"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-400 py-2">{profileData.city || 'Not provided'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                  {editMode ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Enter your full address"
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-400 py-2">{profileData.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-white">{order.id}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {order.items} items • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">${order.total}</p>
                        <button className="text-purple-400 hover:text-purple-300 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Account Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shopping-bag text-purple-400"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="font-semibold text-white">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-dollar-sign text-green-400"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="font-semibold text-white">${stats.totalSpent}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-blue-400"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Cart Items</p>
                      <p className="font-semibold text-white">{stats.cartItems}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-heart text-red-400"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Wishlist</p>
                      <p className="font-semibold text-white">{stats.wishlistItems}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <i className="fas fa-list-alt text-purple-400"></i>
                  <span className="text-white">View All Orders</span>
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <i className="fas fa-shopping-cart text-blue-400"></i>
                  <span className="text-white">View Cart</span>
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <i className="fas fa-shopping-bag text-green-400"></i>
                  <span className="text-white">Continue Shopping</span>
                </button>

                <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3">
                  <i className="fas fa-cog text-gray-400"></i>
                  <span className="text-white">Account Settings</span>
                </button>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Security</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3">
                  <i className="fas fa-key text-yellow-400"></i>
                  <span className="text-white">Change Password</span>
                </button>

                <button className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3">
                  <i className="fas fa-shield-alt text-green-400"></i>
                  <span className="text-white">Two-Factor Auth</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <i className="fas fa-sign-out-alt text-red-400"></i>
                  <span className="text-red-400">Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
