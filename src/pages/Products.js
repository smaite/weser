import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: [0, 1000],
    sortBy: 'name',
    sortOrder: 'asc',
    inStock: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          search: filters.search,
          category: filters.category,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          minPrice: filters.priceRange[0].toString(),
          maxPrice: filters.priceRange[1].toString(),
          inStock: filters.inStock.toString()
        });

        const response = await api.get(`/api/products?${queryParams}`);
        
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setTotalPages(Math.ceil(response.data.total / 12));
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentPage, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation(); // Prevent card click navigation
    
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const success = await addToCart(product.id, 1);
      if (success) {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: [0, 1000],
      sortBy: 'name',
      sortOrder: 'asc',
      inStock: false
    });
    setCurrentPage(1);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
            <div className="aspect-square bg-gray-300/20 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-300/20 rounded mb-2"></div>
            <div className="h-3 bg-gray-300/20 rounded mb-4 w-2/3"></div>
            <div className="h-8 bg-gray-300/20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            Products
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Discover our cutting-edge collection of premium products designed for the future.
          </motion.p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Controls */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <motion.div className="flex-1 max-w-md" variants={itemVariants}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              </div>
            </motion.div>

            {/* Filter Toggle & View Mode */}
            <motion.div className="flex items-center space-x-4" variants={itemVariants}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <i className="fas fa-filter"></i>
                <span>Filters</span>
                <i className={`fas fa-chevron-down transition-transform ${showFilters ? 'rotate-180' : ''}`}></i>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 rounded-2xl bg-gray-900 shadow-lg border border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-white font-medium mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    >
                      <option value="">All Categories</option>
                      {Array.isArray(categories) && categories.map(category => (
                        <option key={category.id} value={category.id} className="bg-gray-800">
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                        className="w-full accent-blue-500"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-white font-medium mb-2">Sort By</label>
                    <div className="space-y-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:outline-none transition-all duration-300"
                      >
                        <option value="name" className="bg-gray-800">Name</option>
                        <option value="price" className="bg-gray-800">Price</option>
                        <option value="created_at" className="bg-gray-800">Date Added</option>
                      </select>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:outline-none transition-all duration-300"
                      >
                        <option value="asc" className="bg-gray-800">Ascending</option>
                        <option value="desc" className="bg-gray-800">Descending</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div>
                    <label className="block text-white font-medium mb-2">Options</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                          className="w-5 h-5 rounded bg-gray-50 border-gray-300 text-blue-500 focus:ring-blue-500/20"
                        />
                        <span className="text-gray-700">In Stock Only</span>
                      </label>
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {Array.isArray(products) && products.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                  : "space-y-6"
                }>
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{ y: -10 }}
                      className={`group cursor-pointer ${viewMode === 'list' ? 'flex items-center space-x-6' : ''}`}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <div className={`relative rounded-2xl bg-gray-900 shadow-lg hover:shadow-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm ${
                        viewMode === 'list' ? 'p-6 flex-1' : 'p-6'
                      }`}>
        {/* Product Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'} mb-4 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
          {(() => {
            // Parse product images
            let images = [];
            try {
              images = product.images ? JSON.parse(product.images) : [];
            } catch (error) {
              console.error('Error parsing product images:', error);
              images = [];
            }

            const hasImages = Array.isArray(images) && images.length > 0;

            if (hasImages) {
              return (
                <>
                  <img
                    src={images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback gradient (hidden by default) */}
                  <div 
                    className="absolute inset-0 items-center justify-center text-white text-4xl font-bold shadow-inner hidden"
                    style={{
                      background: `linear-gradient(135deg, 
                        ${['#667eea', '#764ba2'][product.id % 2]}, 
                        ${['#f093fb', '#f5576c'][product.id % 2]})`
                    }}
                  >
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                </>
              );
            } else {
              // Default gradient placeholder
              return (
                <div 
                  className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, 
                      ${['#667eea', '#764ba2'][product.id % 2]}, 
                      ${['#f093fb', '#f5576c'][product.id % 2]})`
                  }}
                >
                  {product.name.charAt(0).toUpperCase()}
                </div>
              );
            }
          })()}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/${product.id}`);
                              }}
                              className="px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg font-medium hover:bg-white transition-all duration-200 shadow-lg transform translate-y-2 group-hover:translate-y-0"
                            >
                              <i className="fas fa-eye mr-2"></i>
                              View Details
                            </button>
                          </div>

                          {/* Featured badge */}
                          {product.featured && (
                            <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-indigo-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 flex-1">
                              {product.name}
                            </h3>
                            {product.category_name && (
                              <span className="ml-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full whitespace-nowrap">
                                {product.category_name}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                            {product.description}
                          </p>

                          {/* Price and Stock Row */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text">
                                ${product.price}
                              </span>
                              {/* Stock indicator */}
                              <div className="flex items-center space-x-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  product.stock_quantity > 10 ? 'bg-green-400' :
                                  product.stock_quantity > 0 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}></div>
                                <span className={`text-xs font-medium ${
                                  product.stock_quantity > 10 ? 'text-green-400' :
                                  product.stock_quantity > 0 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {product.stock_quantity > 10 ? 'In Stock' :
                                   product.stock_quantity > 0 ? `${product.stock_quantity} left` : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock_quantity === 0}
                            className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                              product.stock_quantity > 0
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <i className={`fas ${product.stock_quantity > 0 ? 'fa-cart-plus' : 'fa-ban'}`}></i>
                            <span>{product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-20"
                  variants={itemVariants}
                >
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
                  <p className="text-gray-400 mb-8">Try adjusting your search criteria or filters.</p>
                  <button
                    onClick={clearFilters}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && Array.isArray(products) && products.length > 0 && totalPages > 1 && (
          <motion.div 
            className="mt-12 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all duration-300"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all duration-300"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;