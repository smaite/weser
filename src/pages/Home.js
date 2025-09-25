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

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-indigo-600 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-600 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container relative z-10 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-20">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-white space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                  Premium Electronics Store
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
              >
                <span className="block">Tech With</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Innovation
                </span>
                <span className="block text-3xl md:text-4xl lg:text-5xl text-gray-300 font-normal">
                  & Premium Quality
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
              >
                Discover cutting-edge electronics, CCTV systems, gaming gear, and premium tech accessories from world's biggest brands.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full font-bold text-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl"
                  style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
                >
                  🛒 Shop Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-purple-500 text-purple-400 px-12 py-4 rounded-full font-bold text-xl hover:bg-purple-500 hover:text-white transition-all duration-300"
                >
                  📱 Explore Categories
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">25K+</div>
                  <div className="text-sm text-gray-400">Premium Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">1000+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">100%</div>
                  <div className="text-sm text-gray-400">Authentic Products</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative"
            >
              <div className="relative w-full h-[600px] lg:h-[700px]">
                {/* Main Hero Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-purple-900/80 rounded-3xl backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                    <motion.div
                      animate={{ 
                        rotateY: [0, 5, 0, -5, 0],
                        y: [0, -10, 0, -10, 0],
                        scale: [1, 1.02, 1, 1.02, 1]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mb-8 relative"
                    >
                      {/* Premium Headphone Image */}
                      <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] mx-auto">
                        <img 
                          src="/images/image-removebg-preview.png"
                          alt="Premium Headphones"
                          className="w-full h-full object-contain relative z-10"
                          style={{ 
                            filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.3))',
                            minWidth: '300px',
                            minHeight: '300px'
                          }}
                        />
                        {/* Enhanced background glow for better visibility */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 rounded-full blur-2xl scale-125"></div>
                      </div>
                      {/* Glowing effect behind the headphones */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-20 blur-3xl scale-75"></div>
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Premium Audio Experience
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-md">
                      Professional Headphones • Crystal Clear Sound • Wireless Freedom • Studio Quality
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                      <div className="bg-black/50 rounded-xl p-4 hover:bg-black/70 transition-all duration-300">
                        <div className="text-2xl mb-2">📹</div>
                        <div className="text-sm text-gray-400">CCTV Systems</div>
                      </div>
                      <div className="bg-black/50 rounded-xl p-4 hover:bg-black/70 transition-all duration-300">
                        <div className="text-2xl mb-2">🎮</div>
                        <div className="text-sm text-gray-400">Gaming Gear</div>
                      </div>
                      <div className="bg-black/50 rounded-xl p-4 hover:bg-black/70 transition-all duration-300">
                        <div className="text-2xl mb-2">💻</div>
                        <div className="text-sm text-gray-400">Laptops</div>
                      </div>
                      <div className="bg-black/50 rounded-xl p-4 hover:bg-black/70 transition-all duration-300">
                        <div className="text-2xl mb-2">🔊</div>
                        <div className="text-sm text-gray-400">Audio</div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                    🔥 HOT DEALS
                  </div>
                  <div className="absolute bottom-4 left-4 text-purple-400 text-sm font-medium">
                    ⭐ Premium Quality Guaranteed
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 w-32 h-32 bg-purple-600 rounded-full opacity-20 blur-xl"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-600 rounded-full opacity-20 blur-xl"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-center"
          >
            <div className="text-sm mb-2">Scroll to explore</div>
            <div className="text-2xl">⬇️</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Secondary Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-r from-black via-indigo-900 to-purple-900">
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

      {/* Heavy On Features Light On Price - Made Bigger */}
      <section className="py-24 bg-gradient-to-r from-black to-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-white"
            >
              <p className="text-purple-400 text-sm font-medium mb-4">PREMIUM TECHNOLOGY</p>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Heavy On Features<br />
                <span className="text-purple-400">Light On Price</span>
              </h2>
              <p className="text-xl mb-8 text-gray-300">Experience cutting-edge technology at unbeatable prices. From CCTV systems to gaming gear.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400">25K+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400">1000+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full font-bold text-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
              >
                Explore Collection
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="w-full h-[500px] bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl flex flex-col items-center justify-center text-white border border-purple-800 relative overflow-hidden" style={{ boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)' }}>
                <div className="text-6xl mb-6">💻📱⌚🎧</div>
                <div className="text-3xl font-bold mb-2">Latest Tech</div>
                <div className="text-gray-400 text-center px-6">Premium Electronics • Gaming Gear • Smart Devices • Audio Equipment</div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600 rounded-full opacity-20"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-600 rounded-full opacity-20"></div>
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
                <h3 className="text-2xl font-bold mb-4">Super bass Wireless headphones with Noise Cancelling</h3>
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

      {/* Big Sale Section - Enhanced */}
      <section className="py-32 bg-gradient-to-r from-black via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
        <div className="container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-white"
          >
            <p className="text-purple-400 text-lg font-medium mb-4">LIMITED TIME OFFER</p>
            <h2 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Clearance<br />
              <span className="text-purple-400">Sales</span>
            </h2>
            <p className="text-4xl font-bold mb-8 text-yellow-400">UP TO 40% OFF</p>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Massive discounts on premium electronics, CCTV systems, laptops, and gaming accessories
            only for dashain and tihar</p>
            <div className="mb-12">
              <p className="text-lg text-gray-400 mb-4">Hurry up! Deals end up :</p>
              <div className="flex justify-center space-x-6">
                <div className="bg-gray-900 rounded-2xl p-6 border border-purple-600">
                  <div className="text-4xl font-bold text-white">07</div>
                  <div className="text-sm text-gray-400">Days</div>
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-purple-600">
                  <div className="text-4xl font-bold text-white">08</div>
                  <div className="text-sm text-gray-400">Hrs</div>
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-purple-600">
                  <div className="text-4xl font-bold text-white">08</div>
                  <div className="text-sm text-gray-400">Mins</div>
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-purple-600">
                  <div className="text-4xl font-bold text-white">08</div>
                  <div className="text-sm text-gray-400">Secs</div>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-16 py-6 rounded-full font-bold text-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
              style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' }}
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

      {/* Contact & Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-black to-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-white"
            >
              <h3 className="text-4xl font-bold mb-6">Get In Touch With Us</h3>
              <p className="text-xl text-gray-300 mb-8">
                Connect with Glorious Trade Hub for all your technology needs. We're here to help with expert advice and premium products.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-gray-400">Need help? +977 9807540020</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-gray-400">info@glorioustradehub.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white">🏪</span>
                  </div>
                  <div>
                    <p className="font-semibold">Visit Our Store</p>
                    <p className="text-gray-400">Bhairahawa, Nepal Near Durga Mandir</p>
                  </div>
                </div>
              </div>
            </motion.div>
          <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-3xl p-8 border border-gray-700"
            >
              <h4 className="text-2xl font-bold text-white mb-6 text-center">Stay Updated</h4>
              <p className="text-gray-400 text-center mb-6">Get notified about new products and exclusive deals</p>
              <div className="space-y-4">
              <input
                type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300" style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
                  Subscribe to Updates
              </button>
            </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                * Get the latest product updates and tech news directly in your inbox
              </p>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated */}
      <section className="py-24 bg-gray-900">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Glorious Trade Hub</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Your trusted technology partner with years of experience in providing quality electronics</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🛡️",
                title: "Warranty Protection",
                description: "Complete warranty coverage on all products"
              },
              {
                icon: "🔄",
                title: "Easy Returns", 
                description: "Hassle-free return policy within 7 days"
              },
              {
                icon: "🎧",
                title: "Expert Support",
                description: "Professional technical assistance available"
              },
              {
                icon: "💎",
                title: "Authentic Products",
                description: "100% genuine branded electronics only"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-purple-600 transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Glorious Trade Hub Section */}
      <section className="py-24 bg-black">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-white"
            >
              <p className="text-purple-400 text-sm font-medium mb-4">ABOUT GLORIOUS TRADE HUB</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Your Trusted<br />
                <span className="text-purple-400">Technology Partner</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Glorious Trade Hub has been serving customers with premium electronics, CCTV systems, computer components, and mobile accessories. We specialize in providing authentic branded products at competitive prices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Authentic Products Only</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Expert Technical Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Competitive Pricing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-300">Wide Product Range</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <div className="w-full h-[400px] bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl flex flex-col items-center justify-center text-white border border-purple-800 relative overflow-hidden" style={{ boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)' }}>
                <div className="text-6xl mb-4">🏢</div>
                <div className="text-2xl font-bold mb-2">Glorious Trade Hub</div>
                <div className="text-gray-400 text-center px-6">Your Technology Destination</div>
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-600 rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-600 rounded-full opacity-20"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;