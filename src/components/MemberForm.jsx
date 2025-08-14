import React, { useState, useEffect } from 'react';

function MemberForm({ member, onSubmit, onCancel, chapters, ranks, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    roadname: '',
    rank: 'Full Patch Member',
    chapter: 'Dockside',
    bio: '',
    image: ''
  });

  // Initialize form with member data if editing
  useEffect(() => {
    if (member && isEdit) {
      setFormData({
        name: member.name || '',
        roadname: member.roadname || '',
        rank: member.rank || 'Full Patch Member',
        chapter: member.chapter || 'Dockside',
        bio: member.bio || '',
        image: member.image || ''
      });
    }
  }, [member, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.rank || !formData.chapter) {
      alert('Please fill in all required fields (Name, Rank, and Chapter)');
      return;
    }

    // Clean up the data
    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      roadname: formData.roadname.trim() || null, // Convert empty string to null
      bio: formData.bio.trim(),
      image: formData.image.trim() || null // Convert empty string to null
    };

    // If editing, preserve the ID
    if (isEdit && member) {
      cleanedData.id = member.id;
    }

    onSubmit(cleanedData);
  };

  return (
    <div className="bg-gray-800/80 rounded-lg p-6 border border-amber-500/30">
      <h3 className="text-xl font-semibold text-white mb-4">
        {isEdit ? 'Edit Member' : 'Add New Member'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
              {ranks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
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
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
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

        {/* Image URL */}
        <div>
          <label className="block text-amber-300 text-sm font-medium mb-2">
            Profile Image URL
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
            Leave empty if no image is available
          </p>
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
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            {isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
