import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUpload({ onImageUpload, onCancel }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Club',
    tags: '',
    location: '',
    members: '',
    date: new Date().toISOString().split('T')[0],
    featured: false
  });
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert('Please select an image first');
      return;
    }

    setIsUploading(true);
    try {
      // Convert file to base64 for storage
      const base64 = await fileToBase64(uploadedFile);
      
      const newImage = {
        id: Date.now(), // Simple ID generation
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        location: formData.location,
        members: formData.members.split(',').map(member => member.trim()).filter(member => member),
        date: formData.date,
        featured: formData.featured,
        imageUrl: base64
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
        featured: false
      });
      setUploadedFile(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const categories = ['Club', 'Dockside', 'Bay City', 'National'];

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 border border-amber-500/30">
      <h3 className="text-xl font-semibold text-white mb-4">Upload New Image</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Area */}
        <div>
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Image File
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-gray-600 hover:border-amber-500/50'
            }`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="space-y-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-32 mx-auto rounded"
                />
                <p className="text-green-400 text-sm">Image selected: {uploadedFile.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-gray-400">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
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
            disabled={!uploadedFile || isUploading}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ImageUpload;
