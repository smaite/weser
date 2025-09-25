import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const AIProductEntry = ({ onProductCreated, categories, onCategoryCreated }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      setExtractedData(null);
    }
  };

  // Analyze image with AI
  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await api.post('/api/admin/ai/analyze-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setExtractedData(response.data.data);
        toast.success('Image analyzed successfully!');
      } else {
        toast.error(response.data.error || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Create product from extracted data
  const createProduct = async () => {
    if (!extractedData) return;

    setIsCreating(true);
    try {
      // First, upload the image if available
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
          toast.error('Failed to upload image, but will create product without it');
        }
      }

      // Create category if it doesn't exist
      let categoryId = null;
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === extractedData.category.toLowerCase()
      );

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        // Create new category
        const categoryResponse = await api.post('/api/admin/categories', {
          name: extractedData.category,
          description: `Auto-created category for ${extractedData.category} products`
        });
        categoryId = categoryResponse.data.categoryId;
        onCategoryCreated && onCategoryCreated();
        toast.success(`Created new category: ${extractedData.category}`);
      }

      // Create product with image
      const productData = {
        name: extractedData.name,
        description: extractedData.description,
        price: parseFloat(extractedData.estimatedPrice) || 0,
        category_id: categoryId,
        stock_quantity: 10, // Default stock
        status: 'active',
        images: uploadedImageUrl ? [uploadedImageUrl] : []
      };

      const response = await api.post('/api/admin/products', productData);
      
      if (response.data.message) {
        toast.success('Product created successfully with AI-analyzed data!');
        onProductCreated && onProductCreated();
        
        // Reset form
        setSelectedImage(null);
        setImagePreview(null);
        setExtractedData(null);
        document.getElementById('ai-image-input').value = '';
      }
    } catch (error) {
      console.error('Product creation error:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Update extracted data
  const updateExtractedData = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-magic mr-3 text-purple-600"></i>
            AI Product Entry
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Upload a product image and let AI extract all the details automatically
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">AI Powered</span>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-3">Product Image</label>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Upload Area */}
          <div className="flex-1">
            <div className="relative">
              <input
                id="ai-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label
                htmlFor="ai-image-input"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1"
            >
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setExtractedData(null);
                    document.getElementById('ai-image-input').value = '';
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Analyze Button */}
        {selectedImage && !extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Image...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-eye"></i>
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* Extracted Data Display */}
      <AnimatePresence>
        {extractedData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-robot mr-2 text-purple-600"></i>
                AI Extracted Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={extractedData.name}
                    onChange={(e) => updateExtractedData('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={extractedData.category}
                    onChange={(e) => updateExtractedData('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Estimated Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={extractedData.estimatedPrice}
                    onChange={(e) => updateExtractedData('estimatedPrice', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Brand */}
                {extractedData.brand && extractedData.brand !== 'Unknown' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Brand</label>
                    <input
                      type="text"
                      value={extractedData.brand}
                      onChange={(e) => updateExtractedData('brand', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={extractedData.description}
                  onChange={(e) => updateExtractedData('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Advanced Information */}
              <div className="mt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <i className={`fas fa-chevron-${showAdvanced ? 'up' : 'down'}`}></i>
                  <span>Advanced Information</span>
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Color */}
                      {extractedData.color && (
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Color</label>
                          <input
                            type="text"
                            value={extractedData.color}
                            onChange={(e) => updateExtractedData('color', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Extracted Text */}
                      {extractedData.extractedText && (
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Extracted Text</label>
                          <input
                            type="text"
                            value={extractedData.extractedText}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-600"
                          />
                        </div>
                      )}

                      {/* Features */}
                      {extractedData.features && extractedData.features.length > 0 && (
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-medium mb-2">Features</label>
                          <div className="flex flex-wrap gap-2">
                            {extractedData.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {extractedData.tags && extractedData.tags.length > 0 && (
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 font-medium mb-2">Tags</label>
                          <div className="flex flex-wrap gap-2">
                            {extractedData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Create Product Button */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={createProduct}
                  disabled={isCreating}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Product...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      <span>Create Product</span>
                    </>
                  )}
                </button>

                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Re-analyze</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
          <i className="fas fa-lightbulb mr-2"></i>
          How it works
        </h5>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Upload a clear image of your product</li>
          <li>• AI will extract product name, description, category, and price</li>
          <li>• Review and edit the extracted information</li>
          <li>• Categories will be created automatically if they don't exist</li>
          <li>• Click "Create Product" to add it to your inventory</li>
        </ul>
      </div>
    </div>
  );
};

export default AIProductEntry;
