import React, { useState, useCallback } from 'react';

function ImageUpload({ onImageUpload, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Club',
    tags: '',
    location: '',
    members: '',
    date: new Date().toISOString().split('T')[0],
    featured: false,
    imageUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, imageUrl: '' })); // Clear URL input when file is selected
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.description || !formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    // Check if we have either a file or URL
    if (!selectedFile && !formData.imageUrl) {
      alert('Please select an image file or enter an image URL');
      return;
    }

    let imageUrl = formData.imageUrl;

    // Validate URL format only if no file is selected and URL is provided
    if (!selectedFile && formData.imageUrl) {
      try {
        const url = new URL(formData.imageUrl);
        
        // Check if it's likely a search result URL (Google, Bing, etc.)
        if (url.hostname.includes('google.com') || 
            url.hostname.includes('bing.com') || 
            url.hostname.includes('yahoo.com') ||
            url.pathname.includes('search') ||
            url.pathname.includes('imgres')) {
          alert('Please use a direct image URL, not a search result page.\n\nExamples of valid image URLs:\n• https://i.imgur.com/example.jpg\n• https://example.com/image.png\n• https://picsum.photos/800/600');
          return;
        }
        
        // Check if it looks like an image URL
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        const hasImageExtension = imageExtensions.some(ext => 
          url.pathname.toLowerCase().includes(ext) || 
          url.searchParams.toString().toLowerCase().includes(ext)
        );
        
        if (!hasImageExtension && !url.pathname.includes('image') && !url.pathname.includes('photo')) {
          alert('This URL doesn\'t appear to be a direct image link. Please use a URL that points directly to an image file.\n\nExamples:\n• https://i.imgur.com/example.jpg\n• https://example.com/image.png');
          return;
        }
        
      } catch {
        alert('Please enter a valid URL starting with http:// or https://');
        return;
      }
    }

    setIsUploading(true);
    try {
      // Upload file to Cloudinary if we have a selected file
      if (selectedFile) {
        const uploadResult = await uploadToCloudinary(selectedFile);
        imageUrl = uploadResult.imageUrl;
      }

      const newImage = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        location: formData.location || null,
        members: formData.members.split(',').map(member => member.trim()).filter(member => member),
        date: formData.date,
        featured: formData.featured,
        imageUrl: imageUrl
      };

      onImageUpload(newImage);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Club',
        tags: '',
        location: '',
        members: '',
        date: new Date().toISOString().split('T')[0],
        featured: false,
        imageUrl: ''
      });
      
      // Reset file selection
      setSelectedFile(null);
      setPreviewUrl('');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['Club', 'National', 'Dockside', 'Bay City', 'Event', 'Other'];

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 border border-amber-500/30">
      <h3 className="text-xl font-semibold text-white mb-4">Add New Image</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Section */}
        <div>
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Image Upload *
          </label>
          
          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
              isDragOver
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-amber-500/30 hover:border-amber-500/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg border border-amber-500/30"
                />
                <div className="text-amber-300 text-sm">
                  <p className="font-medium">{selectedFile?.name}</p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-amber-300 font-medium">Drop your image here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
          
          {/* OR Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
          
          {/* Image URL Input */}
          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the direct URL of an image (JPG, PNG, GIF, etc.)
              <br />
              <span className="text-amber-400">Examples:</span> https://i.imgur.com/example.jpg, https://picsum.photos/800/600
              <br />
              <span className="text-red-400">Don't use:</span> Google search results, Bing image search, or other search pages
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="Image title"
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="Image description"
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="brotherhood, ride, adventure"
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="Club House, Mountain Road, etc."
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Members (comma-separated)
            </label>
            <input
              type="text"
              name="members"
              value={formData.members}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="All Members, Don Tito, etc."
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-amber-600 bg-gray-700 border-amber-500/30 rounded focus:ring-amber-500 focus:ring-2"
            />
            <label className="text-amber-300 text-sm font-medium">
              Featured Image
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.title || !formData.description || (!selectedFile && !formData.imageUrl) || isUploading}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Add Image'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ImageUpload;
