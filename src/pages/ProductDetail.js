import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        navigate('/products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg skeleton"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-6 bg-gray-200 rounded skeleton w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded skeleton"></div>
            </div>
          </div>
        </div>
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
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-primary-color">Home</a></li>
            <li><i className="fas fa-chevron-right"></i></li>
            <li><a href="/products" className="hover:text-primary-color">Products</a></li>
            <li><i className="fas fa-chevron-right"></i></li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={`/uploads/${images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {product.name}
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary-color' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={`/uploads/${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              {product.featured && (
                <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  <i className="fas fa-star mr-1"></i>
                  Featured Product
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.category_name}</p>
            </div>

            <div className="text-4xl font-bold text-primary-color">
              ${parseFloat(product.price).toFixed(2)}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Stock:</span>
              <span className={`text-sm font-semibold ${
                product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock_quantity > 0 
                  ? `${product.stock_quantity} available` 
                  : 'Out of stock'
                }
              </span>
            </div>

            {product.stock_quantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <i className="fas fa-minus text-sm"></i>
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <i className="fas fa-plus text-sm"></i>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="btn btn-primary flex-1 text-lg py-3"
                  >
                    <i className="fas fa-cart-plus mr-2"></i>
                    Add to Cart
                  </motion.button>
                  <button className="btn btn-outline px-6">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            )}

            {product.stock_quantity === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                  <span className="text-red-700 font-medium">This product is currently out of stock</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
