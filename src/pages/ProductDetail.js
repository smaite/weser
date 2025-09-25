import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products from the same category
      if (response.data.category_id) {
        fetchRelatedProducts(response.data.category_id, id);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const response = await api.get(`/api/products?category=${categoryId}&limit=4`);
      const filtered = response.data.products?.filter(p => p.id !== parseInt(currentProductId)) || [];
      setRelatedProducts(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (quantity > product.stock_quantity) {
      toast.error('Insufficient stock');
      return;
    }

    setAddingToCart(true);
    try {
      const success = await addToCart(product.id, quantity);
      if (success) {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (isAuthenticated()) {
      navigate('/cart');
    }
  };

  // Generate gradient placeholder for product image
  const getGradientPlaceholder = (id) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[id % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <div
                className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
                style={{ background: getGradientPlaceholder(product.id) }}
              >
                {product.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            {product.category_name && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {product.category_name}
              </span>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-blue-600">
                ${product.price}
              </span>
              {product.featured && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock_quantity > 10 ? 'bg-green-500' :
                product.stock_quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                product.stock_quantity > 10 ? 'text-green-600' :
                product.stock_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {product.stock_quantity > 10 ? 'In Stock' :
                 product.stock_quantity > 0 ? `Only ${product.stock_quantity} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {product.stock_quantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 btn-primary flex items-center justify-center"
                  >
                    {addingToCart ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 btn-secondary flex items-center justify-center"
                  >
                    <i className="fas fa-bolt mr-2"></i>
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Out of Stock Message */}
            {product.stock_quantity === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  This product is currently out of stock.
                </p>
              </div>
            )}

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-shipping-fast text-blue-600"></i>
                  <span className="text-gray-700">Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-undo text-blue-600"></i>
                  <span className="text-gray-700">30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-shield-alt text-blue-600"></i>
                  <span className="text-gray-700">1 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-headset text-blue-600"></i>
                  <span className="text-gray-700">24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div
                    className="h-48 flex items-center justify-center text-white text-2xl font-bold"
                    style={{ background: getGradientPlaceholder(relatedProduct.id) }}
                  >
                    {relatedProduct.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ${relatedProduct.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;