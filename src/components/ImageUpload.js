import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    
    if (fileArray.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image(s)`);
      return;
    }

    setUploading(true);
    const uploadPromises = fileArray.map(uploadSingleFile);

    try {
      const uploadResults = await Promise.all(uploadPromises);
      const successfulUploads = uploadResults.filter(result => result.success);
      
      if (successfulUploads.length > 0) {
        const newImages = [...images, ...successfulUploads.map(result => result.imageUrl)];
        onImagesChange(newImages);
        toast.success(`${successfulUploads.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload some images');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onImagesChange]);

  const uploadSingleFile = async (file) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not a valid image file`);
      return { success: false };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error(`${file.name} is too large (max 5MB)`);
      return { success: false };
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/admin/upload-product-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return {
          success: true,
          imageUrl: response.data.imageUrl,
          filename: response.data.filename
        };
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Single file upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      return { success: false };
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = async (index, imageUrl) => {
    try {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop();
      
      // Delete from server
      await api.delete(`/api/admin/delete-product-image/${filename}`);
      
      // Remove from local state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Delete image error:', error);
      toast.error('Failed to delete image');
    }
  };

  const reorderImages = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-gray-700 font-medium">
          Product Images ({images.length}/{maxImages})
        </label>
        {images.length > 0 && (
          <span className="text-sm text-gray-500">
            Drag to reorder • First image is the main image
          </span>
        )}
      </div>

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Upload Product Images'}
              </p>
              <p className="text-gray-500 mt-1">
                Drag & drop or click to select • Max {maxImages - images.length} more images
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supports: JPG, PNG, WebP • Max 5MB per image
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {images.map((imageUrl, index) => (
              <motion.div
                key={`${imageUrl}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  if (fromIndex !== index) {
                    reorderImages(fromIndex, index);
                  }
                }}
              >
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    Main
                  </div>
                )}

                {/* Image */}
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    {/* Move Left */}
                    {index > 0 && (
                      <button
                        onClick={() => reorderImages(index, index - 1)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        title="Move left"
                      >
                        <i className="fas fa-arrow-left text-gray-700 text-sm"></i>
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => removeImage(index, imageUrl)}
                      className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                      title="Delete image"
                    >
                      <i className="fas fa-trash text-white text-sm"></i>
                    </button>

                    {/* Move Right */}
                    {index < images.length - 1 && (
                      <button
                        onClick={() => reorderImages(index, index + 1)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        title="Move right"
                      >
                        <i className="fas fa-arrow-right text-gray-700 text-sm"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Drag Handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-1 bg-white bg-opacity-90 rounded cursor-move" title="Drag to reorder">
                    <i className="fas fa-grip-vertical text-gray-600 text-xs"></i>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {images.length === 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
            <i className="fas fa-lightbulb mr-2"></i>
            Image Upload Tips
          </h5>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Upload up to {maxImages} high-quality product images</li>
            <li>• First image will be used as the main product image</li>
            <li>• Drag images to reorder them</li>
            <li>• Use clear, well-lit photos for best results</li>
            <li>• Recommended size: 800x800px or higher</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
