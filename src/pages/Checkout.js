import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const orderData = {
        shipping_address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
        payment_method: data.paymentMethod
      };

      await api.post('/api/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && (
                    <p className="form-error">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && (
                    <p className="form-error">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="form-error">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && (
                    <p className="form-error">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className={`form-input ${errors.state ? 'error' : ''}`}
                    {...register('state', { required: 'State is required' })}
                  />
                  {errors.state && (
                    <p className="form-error">{errors.state.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    className={`form-input ${errors.zipCode ? 'error' : ''}`}
                    {...register('zipCode', { required: 'ZIP code is required' })}
                  />
                  {errors.zipCode && (
                    <p className="form-error">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Payment Method</label>
                <select
                  className={`form-input ${errors.paymentMethod ? 'error' : ''}`}
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                >
                  <option value="">Select payment method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
                {errors.paymentMethod && (
                  <p className="form-error">{errors.paymentMethod.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg py-3 mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <i className="fas fa-credit-card mr-2"></i>
                    Place Order
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 sm:space-x-3">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`${JSON.parse(item.images)[0]}`}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {item.name.substring(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm sm:text-base">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary-color pt-2 border-t">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
