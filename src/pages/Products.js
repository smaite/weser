import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    featured: searchParams.get('featured') || ''
  });
  const [pagination, setPagination] = useState({});

  const { addToCart } = useCart();

  const toArray = (value, key) => {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value[key])) return value[key];
    return [];
  };

  const parseImagesToArray = (imagesField) => {
    try {
      if (!imagesField) return [];
      if (Array.isArray(imagesField)) return imagesField;
      if (typeof imagesField === 'string') {
        const trimmed = imagesField.trim();
        if (!trimmed) return [];
        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        }
        if (trimmed.includes(',')) {
          return trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [trimmed];
      }
      if (typeof imagesField === 'object') {
        // mysql JSON might come as Buffer in some environments
        if (imagesField.data) {
          const asString = Buffer.from(imagesField.data).toString('utf8');
          return parseImagesToArray(asString);
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const getProductPrimaryImage = (product) => {
    const imgs = parseImagesToArray(product?.images);
    const first = imgs[0];
    if (!first) return '';
    const base = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
    return `${base}/uploads/${first}`;
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      setError('');
      const params = new URLSearchParams(searchParams);
      const response = await api.get(`/api/products?${params.toString()}`);
      const productsData = toArray(response.data, 'products');
      setProducts(productsData);
      setPagination(response.data?.pagination || {});
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error?.response?.data?.message || 'Failed to load products');
      setProducts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      // Ensure categories is always an array
      const categoriesData = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.categories) ? response.data.categories : []);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    // Reset to first page when filters change
    params.delete('page');
    
    setSearchParams(params);
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', category: '', featured: '' });
    const params = new URLSearchParams();
    setSearchParams(params);
  };

  const hasFilters = useMemo(() => {
    return Boolean(filters.search || filters.category || filters.featured);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of quality products at great prices
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search products..."
                className="form-input"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input"
              >
                <option value="">All Categories</option>
                {(Array.isArray(categories) ? categories : []).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter
              </label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="form-input"
              >
                <option value="">All Products</option>
                <option value="true">Featured Only</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {pagination.total ? (
                <span>
                  Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
              ) : null}
            </div>
            <div>
              <button
                onClick={handleClearFilters}
                disabled={!hasFilters}
                className={`btn btn-outline text-sm ${!hasFilters ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-48 bg-gray-200 skeleton"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded skeleton mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded skeleton mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Failed to load products</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card group"
              >
                <div className="relative overflow-hidden">
                  {parseImagesToArray(product.images).length > 0 ? (
                    <img
                      src={getProductPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {product.name}
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                      <i className="fas fa-star mr-1"></i>
                      Featured
                    </div>
                  )}
                  {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-color transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary-color">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-outline flex-1 text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock_quantity === 0}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      <i className="fas fa-cart-plus mr-1"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === pagination.page;
                return (
                  <button
                    key={page}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', page.toString());
                      setSearchParams(params);
                    }}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-color text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
