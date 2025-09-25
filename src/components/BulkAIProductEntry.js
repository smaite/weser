import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const BulkAIProductEntry = ({ onProductsCreated, categories, onCategoryCreated }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedProducts, setExtractedProducts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [creationProgress, setCreationProgress] = useState({ current: 0, total: 0 });

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Image size should be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Clear previous analysis
      setExtractedProducts([]);
      setSelectedProducts(new Set());
    }
  };

  // Analyze image with AI for multiple products
  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await api.post('/api/admin/ai/analyze-bulk-products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const products = response.data.data.products || [];
        setExtractedProducts(products);
        // Select all products by default
        setSelectedProducts(new Set(products.map((_, index) => index)));
        toast.success(`Found ${products.length} products in the image!`);
      } else {
        toast.error(response.data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Bulk analysis error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle product selection
  const toggleProductSelection = (index) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedProducts(newSelected);
  };

  // Select/deselect all products
  const toggleAllProducts = () => {
    if (selectedProducts.size === extractedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(extractedProducts.map((_, index) => index)));
    }
  };

  // Update product data
  const updateProductData = (index, field, value) => {
    const updatedProducts = [...extractedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setExtractedProducts(updatedProducts);
  };

  // Create selected products
  const createSelectedProducts = async () => {
    const selectedProductsArray = extractedProducts.filter((_, index) => 
      selectedProducts.has(index)
    );

    if (selectedProductsArray.length === 0) {
      toast.error('Please select at least one product to create');
      return;
    }

    setIsCreating(true);
    setCreationProgress({ current: 0, total: selectedProductsArray.length });

    let createdCount = 0;
    const errors = [];

    for (let i = 0; i < selectedProductsArray.length; i++) {
      const product = selectedProductsArray[i];
      setCreationProgress({ current: i + 1, total: selectedProductsArray.length });

      try {
        // Upload the original image for each product (they can share the same image)
        let uploadedImageUrl = null;
        if (selectedImage) {
          try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const uploadResponse = await api.post('/api/admin/upload-product-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (uploadResponse.data.success) {
              uploadedImageUrl = uploadResponse.data.imageUrl;
            }
          } catch (uploadError) {
            console.error('Image upload error:', uploadError);
          }
        }

        // Create category if it doesn't exist
        let categoryId = null;
        const existingCategory = categories.find(
          cat => cat.name.toLowerCase() === product.category.toLowerCase()
        );

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          // Create new category
          const categoryResponse = await api.post('/api/admin/categories', {
            name: product.category,
            description: `Auto-created category for ${product.category} products`
          });
          categoryId = categoryResponse.data.categoryId;
          onCategoryCreated && onCategoryCreated();
        }

        // Create product
        const productData = {
          name: product.name,
          description: product.description,
          price: parseFloat(product.estimatedPrice) || 0,
          category_id: categoryId,
          stock_quantity: 10, // Default stock
          status: 'active',
          images: uploadedImageUrl ? [uploadedImageUrl] : []
        };

        await api.post('/api/admin/products', productData);
        createdCount++;

      } catch (error) {
        console.error(`Error creating product ${product.name}:`, error);
        errors.push(`${product.name}: ${error.response?.data?.message || error.message}`);
      }

      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsCreating(false);
    setCreationProgress({ current: 0, total: 0 });

    if (createdCount > 0) {
      toast.success(`Successfully created ${createdCount} products!`);
      onProductsCreated && onProductsCreated();
      
      // Reset form
      setSelectedImage(null);
      setImagePreview(null);
      setExtractedProducts([]);
      setSelectedProducts(new Set());
      document.getElementById('bulk-ai-image-input').value = '';
    }

    if (errors.length > 0) {
      toast.error(`${errors.length} products failed to create. Check console for details.`);
      console.error('Product creation errors:', errors);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-purple-200"
    >
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
          <i className="fas fa-images text-white text-lg sm:text-xl"></i>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Bulk AI Product Entry</h3>
          <p className="text-sm text-gray-600">Upload one image with multiple products</p>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 sm:p-8 text-center hover:border-purple-400 transition-colors">
          <input
            type="file"
            id="bulk-ai-image-input"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <label
            htmlFor="bulk-ai-image-input"
            className="cursor-pointer block"
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-32 sm:h-48 object-contain mx-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
                    Click to change image
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 sm:py-12">
                <i className="fas fa-cloud-upload-alt text-4xl sm:text-6xl text-purple-400 mb-4"></i>
                <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Upload Image with Multiple Products
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Analyze Button */}
      {selectedImage && !extractedProducts.length && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyzeImage}
          disabled={isAnalyzing}
          className="w-full btn btn-primary mb-6 text-base sm:text-lg py-3 sm:py-4"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing Products...
            </div>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Analyze Products in Image
            </>
          )}
        </motion.button>
      )}

      {/* Extracted Products */}
      <AnimatePresence>
        {extractedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                Found {extractedProducts.length} Products
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={toggleAllProducts}
                  className="btn btn-outline text-sm px-3 py-1"
                >
                  {selectedProducts.size === extractedProducts.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600 self-center">
                  {selectedProducts.size} selected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {extractedProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    selectedProducts.has(index)
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-semibold text-gray-900 flex-1">
                      Product {index + 1}
                    </h5>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(index)}
                        onChange={() => toggleProductSelection(index)}
                        className="form-checkbox h-4 w-4 text-purple-600"
                      />
                      <span className="ml-2 text-sm text-gray-600">Select</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProductData(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={product.category}
                        onChange={(e) => updateProductData(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.estimatedPrice}
                        onChange={(e) => updateProductData(index, 'estimatedPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={product.description}
                        onChange={(e) => updateProductData(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Products Button */}
      {extractedProducts.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createSelectedProducts}
          disabled={isCreating || selectedProducts.size === 0}
          className="w-full btn btn-primary text-base sm:text-lg py-3 sm:py-4"
        >
          {isCreating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Products ({creationProgress.current}/{creationProgress.total})
            </div>
          ) : (
            <>
              <i className="fas fa-plus-circle mr-2"></i>
              Create {selectedProducts.size} Selected Products
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default BulkAIProductEntry;
