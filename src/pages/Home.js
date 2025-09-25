import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products?featured=true&limit=8');
      setFeaturedProducts(Array.isArray(response.data.products) ? response.data.products : []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(Array.isArray(response.data) ? response.data.slice(0, 12) : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center py-2 text-sm font-medium">
        🔥 Flash Sale - Up to 75% OFF on Selected Items! Limited Time Only
      </div>

      {/* Main Hero Carousel - Made Bigger */}
      <section className="relative h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-indigo-900 to-purple-900">
          <div className="container h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                  Tech With<br />
                  <span className="text-purple-400">Innovative Design</span><br />
                  <span className="text-2xl md:text-3xl lg:text-4xl text-gray-300">And On-Trend Style</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-300 font-medium">World's Biggest Tech Brands</p>
                <div className="mb-8">
                  <span className="text-yellow-400 text-lg font-bold">Flat 30% Off</span>
                </div>
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-2">Hurry up! Deals end up :</p>
                  <div className="flex space-x-4 text-center">
                    <div className="bg-gray-900 rounded-lg p-3 border border-purple-600">
                      <div className="text-2xl font-bold text-white">00</div>
                      <div className="text-xs text-gray-400">Days</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 border border-purple-600">
                      <div className="text-2xl font-bold text-white">00</div>
                      <div className="text-xs text-gray-400">Hrs</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 border border-purple-600">
                      <div className="text-2xl font-bold text-white">00</div>
                      <div className="text-xs text-gray-400">Mins</div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 border border-purple-600">
                      <div className="text-2xl font-bold text-white">00</div>
                      <div className="text-xs text-gray-400">Secs</div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full font-bold text-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                  style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
                >
                  Buy Now
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="w-full h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl flex flex-col items-center justify-center text-white border border-purple-800 relative overflow-hidden" style={{ boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)' }}>
                  <div className="text-8xl mb-4">📱💻🎧</div>
                  <div className="text-2xl font-bold mb-2">25000+ Tech Products</div>
                  <div className="text-gray-400">CCTV • Laptops • Headphones • Speakers</div>
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    HOT DEALS
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Deal Hot Section */}
      <section className="py-4 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="container">
          <div className="flex items-center justify-center">
            <span className="text-white font-bold text-lg mr-4">🔥 Today's Deal</span>
            <span className="bg-purple-400 text-black px-4 py-1 rounded-full font-bold text-sm animate-pulse">
              HOT
            </span>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Warranty Protection</h3>
              <p className="text-gray-400 text-sm">Complete protection for all products</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🎧
              </div>
              <h3 className="text-lg font-bold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm">Expert technical assistance anytime</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🚀
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Processing</h3>
              <p className="text-gray-400 text-sm">Quick order processing & delivery</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">
                💎
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-sm">Only authentic branded products</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Categories Grid - Made Bigger */}
      <section className="py-20 bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-purple-400 text-sm font-medium mb-2">Our Categories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tech Products Collection</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our extensive range of premium technology products from trusted brands</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'CCTV Camera', icon: '📹', color: 'from-blue-500 to-blue-600' },
              { name: 'Speaker', icon: '🔊', color: 'from-green-500 to-green-600' },
              { name: 'Laptop', icon: '💻', color: 'from-purple-500 to-purple-600' },
              { name: 'Headphone', icon: '🎧', color: 'from-red-500 to-red-600' },
              { name: 'Mouse', icon: '🖱️', color: 'from-yellow-500 to-yellow-600' },
              { name: 'Keyboard', icon: '⌨️', color: 'from-indigo-500 to-indigo-600' },
              { name: 'Calculator', icon: '🧮', color: 'from-pink-500 to-pink-600' },
              { name: 'USB', icon: '🔌', color: 'from-teal-500 to-teal-600' },
              { name: 'SSD', icon: '💾', color: 'from-orange-500 to-orange-600' },
              { name: 'Telephone', icon: '📞', color: 'from-cyan-500 to-cyan-600' },
              { name: 'CHARGER', icon: '🔋', color: 'from-lime-500 to-lime-600' },
              { name: 'Tech Gift', icon: '🎁', color: 'from-rose-500 to-rose-600' }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <Link to={`/products?category=${category.name}`}>
                  <div className="bg-gray-800 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-purple-600 group-hover:scale-105">
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg`}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-xs">Premium Quality</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heavy On Features Light On Price */}
      <section className="py-16 bg-gradient-to-r from-black to-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Heavy On Features<br />
                <span className="text-purple-400">Light On Price</span>
              </h2>
              <p className="text-xl mb-8 text-gray-300">AMAZING DISCOUNTS AND DEALS</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
              >
                shop now
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="w-full h-80 bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border border-purple-800" style={{ boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)' }}>
                💻📱⌚🎧
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotional Cards Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Get Best Computer Accessories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="text-sm font-medium mb-2">NEW PRODUCT</p>
                <h3 className="text-2xl font-bold mb-4">Get Best Computer Accessories</h3>
                <p className="text-green-100 mb-6">RELEASE DATE & PRICE</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-purple-300 transition-all duration-300">
                  Shop Now
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-20 rounded-full -mr-16 -mt-16"></div>
            </motion.div>

            {/* Exclusive Headphone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="text-sm font-medium mb-2">EXCLUSIVE HEADPHONE</p>
                <h3 className="text-2xl font-bold mb-4">Discounts 50% On All Headphone</h3>
                <button className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-purple-300 transition-all duration-300">
                  shop now
                </button>
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-20 rounded-full -ml-12 -mb-12"></div>
            </motion.div>

            {/* Get Latest Product */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="text-sm font-medium mb-2">NEW PRODUCT</p>
                <h3 className="text-2xl font-bold mb-4">Get latest Product</h3>
                <p className="text-blue-100 mb-6">TODAY'S SUPER OFFER</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-purple-300 transition-all duration-300">
                  Shop Now
                </button>
              </div>
              <div className="absolute top-0 left-0 w-20 h-20 bg-white bg-opacity-20 rounded-full -ml-10 -mt-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Big Sale Section */}
      <section className="py-20 bg-gradient-to-r from-black via-indigo-900 to-purple-900">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-white"
          >
            <p className="text-lg font-medium mb-2">BIG SALE</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Biggest Discount</h2>
            <p className="text-3xl font-bold mb-8">UP TO 75% OFF</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full font-bold text-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
              style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
            >
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Weekend Deal & Summer Sale */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weekend Deal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
            >
              <p className="text-sm font-medium mb-2">WEEKEND DEAL</p>
              <h3 className="text-3xl font-bold mb-4">The Great Sale</h3>
              <p className="text-purple-100 mb-6">Get Free Coupon code</p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-300 transition-all duration-300">
                Get Coupon
              </button>
            </motion.div>

            {/* Summer Sale */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-8 text-white"
            >
              <p className="text-sm font-medium mb-2">MONTH DEAL</p>
              <h3 className="text-3xl font-bold mb-4">Summer Clean Sale</h3>
              <p className="text-2xl font-bold mb-6">UP TO 45% OFF</p>
              <button className="bg-white text-teal-600 px-6 py-2 rounded-full font-bold hover:bg-purple-300 transition-all duration-300">
                Shop Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-black to-gray-900">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-4">Sign Up For Newsletter & Get 20% Off</h3>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300" style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🚚",
                title: "Free Delivery",
                description: "Free shipping on all order"
              },
              {
                icon: "↩️",
                title: "Returns",
                description: "Back guarantee under 7 days"
              },
              {
                icon: "🎧",
                title: "Support 24/7",
                description: "Support online 24 hours a day"
              },
              {
                icon: "💳",
                title: "payments",
                description: "100% payment security"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;