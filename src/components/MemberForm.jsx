import React, { useState, useEffect } from 'react';

function MemberForm({ member, onSave, onCancel, chapters, ranks, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: '',
    roadname: '',
    rank: 'Prospect',
    chapter: 'Dockside',
    bio: '',
    image: ''
  });

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

  const handleSubmit = (e) => {
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

    // Clean up the data
    const cleanedData = {
      ...formData,
      name: formData.name.trim(),
      roadname: formData.roadname.trim() || null, // Convert empty string to null
      bio: formData.bio.trim(),
      image: formData.image.trim() || null // Convert empty string to null
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
              {ranks.map(rankObj => (
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
              {chapters.map(chapterObj => (
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
            {isEditing ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
