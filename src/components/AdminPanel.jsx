import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ImageUpload from './ImageUpload';
import { adminAPI } from '../services/api';

function AdminPanel() {
  const { logout } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Load images
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const imagesData = await adminAPI.getGallery();
        
        setImages(imagesData);
        setError(null);
      } catch (err) {
        console.error('Error loading admin data:', err);
        setError('Failed to load admin data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleImageUpload = async (newImage) => {
    try {
      const uploadedImage = await adminAPI.createGalleryImage(newImage);
      setImages(prev => [uploadedImage, ...prev]);
      setShowUpload(false);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await adminAPI.deleteGalleryImage(imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
      } catch (err) {
        console.error('Error deleting image:', err);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const handleEditImage = (image) => {
    setSelectedImage(image);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedImage) => {
    try {
      const savedImage = await adminAPI.updateGalleryImage(updatedImage.id, updatedImage);
      setImages(prev => prev.map(img => 
        img.id === updatedImage.id ? savedImage : img
      ));
      setShowEditModal(false);
      setSelectedImage(null);
    } catch (err) {
      console.error('Error updating image:', err);
      alert('Failed to update image. Please try again.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-black/50 rounded-2xl border border-amber-500/30 p-6 sm:p-8 lg:p-12 shadow-2xl mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Gallery Management
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-amber-300 mt-2 font-medium">
                Manage Club Photos
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </div>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl">
            Welcome to the Unholy Souls MC Gallery Admin Panel. Here you can upload new images, 
            manage existing content, and maintain the gallery.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center mt-8">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{images.length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Total Images</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{images.filter(img => img.featured).length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Featured</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{new Set(images.flatMap(img => img.category)).size}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Categories</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{new Set(images.flatMap(img => img.tags)).size}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Unique Tags</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20 mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-600 hover:from-amber-400 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                {showUpload ? 'Cancel Upload' : 'Upload New Image'}
              </button>
              <Link
                to="/members"
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-400 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                Manage Members
              </Link>
            </div>
            <div className="text-gray-400 text-sm">
              {images.length} images in gallery
            </div>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="mb-6 sm:mb-8">
            <ImageUpload 
              onImageUpload={handleImageUpload}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        )}

        {/* Image Management */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Manage Images</h3>
          
          {images.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No images uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="bg-gray-800/60 rounded-lg overflow-hidden border border-amber-500/20">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    
                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 text-amber-300 text-xs px-2 py-1 rounded font-medium">
                        {image.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h4 className="text-white font-semibold mb-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {image.title}
                    </h4>
                    
                    <p className="text-gray-400 text-xs mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                      {image.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditImage(image)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/95 rounded-2xl border border-amber-500/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white">Edit Image</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedImage = {
                  ...selectedImage,
                  title: formData.get('title'),
                  description: formData.get('description'),
                  category: formData.get('category'),
                  imageUrl: formData.get('imageUrl'),
                  tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                  location: formData.get('location'),
                  members: formData.get('members').split(',').map(member => member.trim()).filter(member => member),
                  date: formData.get('date'),
                  featured: formData.get('featured') === 'on'
                };
                handleSaveEdit(updatedImage);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-amber-300 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedImage.title}
                      required
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-300 text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      defaultValue={selectedImage.category}
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    >
                      {['Club', 'National', 'Dockside', 'Bay City', 'Event', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-amber-300 text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      defaultValue={selectedImage.imageUrl}
                      required
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-amber-300 text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedImage.description}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-300 text-sm font-medium mb-2">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={selectedImage.tags.join(', ')}
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-300 text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={selectedImage.location}
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-300 text-sm font-medium mb-2">Members</label>
                    <input
                      type="text"
                      name="members"
                      defaultValue={selectedImage.members.join(', ')}
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-300 text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedImage.date}
                      className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={selectedImage.featured}
                      className="w-4 h-4 text-amber-600 bg-gray-700 border-amber-500/30 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <label className="text-amber-300 text-sm font-medium">Featured</label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
