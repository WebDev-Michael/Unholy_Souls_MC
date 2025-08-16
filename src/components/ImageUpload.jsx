import React, { useState } from 'react';

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    
    if (!formData.imageUrl) {
      alert('Please enter an image URL');
      return;
    }

    // Validate URL format
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

    setIsUploading(true);
    try {
      const newImage = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        location: formData.location || null,
        members: formData.members.split(',').map(member => member.trim()).filter(member => member),
        date: formData.date,
        featured: formData.featured,
        imageUrl: formData.imageUrl
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
        {/* Image URL Input */}
        <div>
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="imageUrl"
            required
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
            disabled={!formData.title || !formData.description || !formData.imageUrl || isUploading}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Adding...' : 'Add Image'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ImageUpload;
