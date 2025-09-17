import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products?featured=true&limit=8'),
        axios.get('/api/categories')
      ]);
      
      setFeaturedProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-64 h-64 bg-white opacity-5 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Now Live • Premium Shopping Experience</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="block">Glorious</span>
              <span className="block text-gradient">Trade Hub</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto">
              Experience the future of shopping with our curated collection of premium products. 
              Discover, explore, and elevate your lifestyle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn btn-primary text-lg px-8 py-4">
                <i className="fas fa-shopping-bag"></i>
                Explore Collection
              </Link>
              <Link to="/products?featured=true" className="btn btn-outline text-lg px-8 py-4">
                <i className="fas fa-star"></i>
                Featured Items
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Shop by Category
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="block text-gradient">Perfect Match</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our carefully curated categories to find exactly what you're looking for
            </p>
          </div>

          {loading ? (
            <div className="category-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 skeleton rounded-2xl mx-auto mb-4"></div>
                  <div className="h-4 skeleton rounded mb-2"></div>
                  <div className="h-3 skeleton rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="category-grid">
              {categories.slice(0, 6).map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center group cursor-pointer"
                >
                  <Link to={`/products?category=${category.id}`}>
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto flex items-center justify-center text-blue-600 text-2xl group-hover:shadow-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white">
                        <i className="fas fa-cube"></i>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-semibold mb-4">
              ⭐ Featured Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Handpicked
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Just for You
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our premium selection of the finest products, curated by our experts
            </p>
          </div>

          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="h-48 bg-gray-700 skeleton"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-700 skeleton rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 skeleton rounded mb-4"></div>
                    <div className="h-6 bg-gray-700 skeleton rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-500" style={{backgroundColor: 'rgba(31, 41, 55, 0.5)'}}>
                      <div className="relative overflow-hidden">
                        {product.images && JSON.parse(product.images).length > 0 ? (
                          <img
                            src={`/uploads/${JSON.parse(product.images)[0]}`}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                            {product.name}
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gradient">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <span className={`badge ${
                            product.stock_quantity > 0 ? 'badge-success' : 'badge-error'
                          }`}>
                            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products" className="btn btn-primary text-lg px-8 py-4">
              View All Products
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="block text-gradient">Glorious Trade Hub?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with an exceptional shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fas fa-shipping-fast',
                title: 'Lightning Fast Delivery',
                description: 'Get your orders delivered in record time with our premium shipping network',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Bank-Level Security',
                description: 'Your data and payments are protected with military-grade encryption',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: 'fas fa-headset',
                title: '24/7 Premium Support',
                description: 'Our expert team is always ready to help you with anything you need',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="feature-card"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <i className={feature.icon}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;