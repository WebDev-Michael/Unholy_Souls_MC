import React, { useState, useEffect, useCallback } from 'react';

function MemberForm({ member, onSave, onCancel, chapters, ranks, isEditing = false }) {
  // Debug logging for ranks and chapters data
  console.log('🔍 MemberForm received ranks:', ranks);
  console.log('🔍 MemberForm received chapters:', chapters);
  
  // Fallback ranks array to ensure all required ranks are always available
  const fallbackRanks = [
    { rank: 'Prospect' },
    { rank: 'Full Patch Member' },
    { rank: 'Tail Gunner' },
    { rank: 'Enforcer' },
    { rank: 'Warlord' },
    { rank: 'Treasurer' },
    { rank: 'Secretary' },
    { rank: 'Road Captain' },
    { rank: 'Sergeant at Arms' },
    { rank: 'Vice President' },
    { rank: 'President' }
  ];

  // Use provided ranks or fallback to ensure all ranks are available
  const availableRanks = ranks && ranks.length > 0 ? ranks : fallbackRanks;

  // Fallback chapters array to ensure all required chapters are always available
  const fallbackChapters = [
    { chapter: 'Dockside' },
    { chapter: 'Bay City' },
    { chapter: 'National' }
  ];

  // Use provided chapters or fallback to ensure all chapters are available
  const availableChapters = chapters && chapters.length > 0 ? chapters : fallbackChapters;
  
  // Debug logging for final arrays being used
  console.log('🔍 Final availableRanks:', availableRanks);
  console.log('🔍 Final availableChapters:', availableChapters);

  const [formData, setFormData] = useState({
    name: '',
    roadname: '',
    rank: 'Prospect',
    chapter: 'Dockside',
    bio: '',
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Monitor form data changes for debugging
  useEffect(() => {
    if (isEditing) {
      console.log('🔍 Form data changed:', formData);
      console.log('🔍 Form data ID:', formData.id);
    }
  }, [formData, isEditing]);

  // Initialize form with member data if editing
  useEffect(() => {
    console.log('🔍 MemberForm useEffect triggered');
    console.log('🔍 isEditing:', isEditing);
    console.log('🔍 member prop:', member);
    console.log('🔍 member.id:', member?.id);
    
    if (member && isEditing) {
      console.log('✅ Setting form data for editing member:', member);
      const initialFormData = {
        name: member.name || '',
        roadname: member.roadname || '',
        rank: member.rank || 'Prospect',
        chapter: member.chapter || 'Dockside',
        bio: member.bio || '',
        image: member.image || '',
        id: member.id // Explicitly include the ID
      };
      
      console.log('✅ Initial form data set:', initialFormData);
      setFormData(initialFormData);
    }
  }, [member, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData(prev => ({ ...prev, image: '' })); // Clear URL input when file is selected
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
    
    console.log('🔍 Form submission started');
    console.log('🔍 Current formData:', formData);
    console.log('🔍 isEditing:', isEditing);
    console.log('🔍 member object:', member);
    console.log('🔍 member.id:', member?.id);
    
    // Validate required fields
    if (!formData.name.trim() || !formData.rank || !formData.chapter) {
      alert('Please fill in all required fields (Name, Rank, and Chapter)');
      return;
    }

    // Check if we have either a file or URL for image
    if (!selectedFile && !formData.image) {
      // No image provided, that's okay - it's optional
    }

    let imageUrl = formData.image;

    // Validate URL format only if no file is selected and URL is provided
    if (!selectedFile && formData.image) {
      try {
        const url = new URL(formData.image);
        
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

      // Clean up the data
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        roadname: formData.roadname.trim() || null, // Convert empty string to null
        bio: formData.bio.trim(),
        image: imageUrl || null // Use uploaded URL or provided URL
      };

      // If editing, ALWAYS preserve the ID from multiple sources
      if (isEditing && member && member.id) {
        cleanedData.id = member.id;
        console.log('✅ Preserving member ID for edit from member object:', member.id);
      } else if (isEditing && formData.id) {
        cleanedData.id = formData.id;
        console.log('✅ Preserving member ID for edit from form data:', formData.id);
      } else if (isEditing) {
        console.log('⚠️ No member ID found - isEditing:', isEditing, 'member:', member, 'formData.id:', formData.id);
        alert('Cannot update member: No ID found. Please refresh and try again.');
        return;
      }

      console.log('🔍 Final cleanedData being submitted:', cleanedData);
      onSave(cleanedData);
      
      // Reset file selection after successful save
      setSelectedFile(null);
      setPreviewUrl('');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 border border-amber-500/30">
      <h3 className="text-xl font-semibold text-white mb-4">
        {isEditing ? 'Edit Member' : 'Add New Member'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden ID field to preserve member ID when editing */}
        {isEditing && member && member.id && (
          <input type="hidden" name="id" value={member.id} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="Enter full name"
            />
          </div>

          {/* Road Name */}
          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Road Name
            </label>
            <input
              type="text"
              name="roadname"
              value={formData.roadname || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="Enter road name (optional)"
            />
          </div>

          {/* Rank */}
          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Rank *
            </label>
            <select
              name="rank"
              required
              value={formData.rank}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            >
              {availableRanks.map(rankObj => (
                <option key={rankObj.rank} value={rankObj.rank}>{rankObj.rank}</option>
              ))}
            </select>
          </div>

          {/* Chapter */}
          <div>
            <label className="block text-amber-300 text-sm font-medium mb-2">
              Chapter *
            </label>
            <select
              name="chapter"
              required
              value={formData.chapter}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            >
              {availableChapters.map(chapterObj => (
                <option key={chapterObj.chapter} value={chapterObj.chapter}>{chapterObj.chapter}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Biography
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
            placeholder="Tell us about this member..."
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Profile Image
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
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
              placeholder="https://example.com/image.jpg (optional)"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a direct image URL or upload a file above
            </p>
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
            disabled={isUploading}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : (isEditing ? 'Save Changes' : 'Add Member')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
