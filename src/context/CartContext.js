import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      await axios.post('/api/cart', { product_id: productId, quantity });
      await fetchCartItems();
      toast.success('Item added to cart!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return false;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    if (!isAuthenticated()) return false;

    try {
      await axios.put(`/api/cart/${cartItemId}`, { quantity });
      await fetchCartItems();
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart item';
      toast.error(message);
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated()) return false;

    try {
      await axios.delete(`/api/cart/${cartItemId}`);
      await fetchCartItems();
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
      return false;
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCartItems,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
