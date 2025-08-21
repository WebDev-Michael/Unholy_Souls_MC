import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import MemberForm from './MemberForm';
import { adminAPI, membersAPI } from '../services/api';

function MemberManagement() {
  const { logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChapter, setFilterChapter] = useState('all');
  const [chapters, setChapters] = useState([]);
  const [ranks, setRanks] = useState([]);

  const allRanks = [
    { rank: 'Prospect', count: 0 },
    { rank: 'Full Patch Member', count: 0 },
    { rank: 'Tail Gunner', count: 0 },
    { rank: 'Enforcer', count: 0 },
    { rank: 'Warlord', count: 0 },
    { rank: 'Treasurer', count: 0 },
    { rank: 'Secretary', count: 0 },
    { rank: 'Road Captain', count: 0 },
    { rank: 'Sergeant at Arms', count: 0 },
    { rank: 'Vice President', count: 0 },
    { rank: 'President', count: 0 }
  ];

  const allChapters = [
    { chapter: 'Dockside', count: 0 },
    { chapter: 'Bay City', count: 0 },
    { chapter: 'National', count: 0 }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [membersData, ranksData, chaptersData] = await Promise.all([
          adminAPI.getMembers(),
          membersAPI.getRanks().catch(() => []),
          membersAPI.getChapters().catch(() => [])
        ]);
        
        setMembers(membersData);
        
        if (ranksData && ranksData.length > 0) {
          const existingRanksMap = new Map(ranksData.map(r => [r.rank, r.count]));
          
          const mergedRanks = allRanks.map(fallbackRank => ({
            rank: fallbackRank.rank,
            count: existingRanksMap.get(fallbackRank.rank) || 0
          }));
          
          console.log('🔍 API ranks data:', ranksData);
          console.log('🔍 Merged ranks:', mergedRanks);
          setRanks(mergedRanks);
        } else {
          console.log('🔍 No API ranks data, using fallback:', allRanks);
          setRanks(allRanks);
        }
        
        if (chaptersData && chaptersData.length > 0) {
          const existingChaptersMap = new Map(chaptersData.map(c => [c.chapter, c.count]));
          
          const mergedChapters = allChapters.map(fallbackChapter => ({
            chapter: fallbackChapter.chapter,
            count: existingChaptersMap.get(fallbackChapter.chapter) || 0
          }));
          
          console.log('🔍 API chapters data:', chaptersData);
          console.log('🔍 Merged chapters:', mergedChapters);
          setChapters(mergedChapters);
        } else {
          console.log('🔍 No API chapters data, using fallback:', allChapters);
          setChapters(allChapters);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading members:', err);
        setError('Failed to load members. Please try again later.');
        
        setRanks(allRanks);
        setChapters(allChapters);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddMember = async (newMember) => {
    try {
      const createdMember = await adminAPI.createMember(newMember);
      setMembers(prev => [createdMember, ...prev]);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating member:', err);
      alert('Failed to create member. Please try again.');
    }
  };

  const handleEditMember = (member) => {
    console.log('🔍 handleEditMember called with member:', member);
    console.log('🔍 Member ID:', member.id);
    console.log('🔍 Full member object:', member);
    
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedMember) => {
    try {
      console.log('🔍 handleSaveEdit called with:', updatedMember);
      console.log('🔍 Member ID:', updatedMember.id);
      console.log('🔍 Member data:', updatedMember);
      
      if (!updatedMember.id) {
        console.error('❌ No member ID provided for update');
        alert('Cannot update member: No ID provided. Please refresh and try again.');
        return;
      }
      
      const existingMember = members.find(m => m.id === updatedMember.id);
      if (!existingMember) {
        console.error('❌ Member no longer exists in current state');
        alert('Member no longer exists. Please refresh the page.');
        return;
      }
      
      console.log('✅ Member exists, proceeding with update...');
      
      const savedMember = await adminAPI.updateMember(updatedMember.id, updatedMember);
      console.log('✅ Member updated successfully:', savedMember);
      
      setMembers(prev => prev.map(member => 
        member.id === updatedMember.id ? savedMember : member
      ));
      setShowEditModal(false);
      setSelectedMember(null);
    } catch (err) {
      console.error('❌ Error updating member:', err);
      alert('Failed to update member. Please try again.');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      try {
        await adminAPI.deleteMember(memberId);
        setMembers(prev => prev.filter(member => member.id !== memberId));
      } catch (err) {
        console.error('Error deleting member:', err);
        alert('Failed to delete member. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.roadname && member.roadname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.chapter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChapter = filterChapter === 'all' || member.chapter === filterChapter;
    
    return matchesSearch && matchesChapter;
  });

  if (loading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading members...</p>
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
                Member Management
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-amber-300 mt-2 font-medium">
                Manage Club Members
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
            Welcome to the Unholy Souls MC Member Management Panel. Here you can add new members, 
            edit existing member information, and maintain the club roster.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center mt-8">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{members.length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Total Members</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{chapters.length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Chapters</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{ranks.length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Ranks</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{filteredMembers.length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Filtered</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20 mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                {showAddForm ? 'Cancel Add' : 'Add New Member'}
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              {members.length} members in club
            </div>
          </div>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <div className="mb-6 sm:mb-8">
            <MemberForm 
              onSave={handleAddMember}
              onCancel={() => setShowAddForm(false)}
              ranks={ranks}
              chapters={chapters}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Members
              </label>
              <input
                type="text"
                placeholder="Search by name, roadname, rank, or chapter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Chapter Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Chapter
              </label>
              <select
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Chapters</option>
                {chapters.map((chapterObj, index) => (
                  <option key={index} value={chapterObj.chapter}>{chapterObj.chapter}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterChapter('all');
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Club Members</h3>
          
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchTerm || filterChapter !== 'all' 
                  ? 'No members found matching your criteria.' 
                  : 'No members found.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-gray-800/60 rounded-lg overflow-hidden border border-amber-500/20">
                  {/* Member Image */}
                  <div className="relative overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-48 bg-gray-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Rank Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                        {member.rank}
                      </span>
                    </div>
                    
                    {/* Chapter Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                        {member.chapter}
                      </span>
                    </div>
                  </div>
                  
                  {/* Member Info */}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {member.name}
                      {member.roadname && (
                        <span className="text-amber-400 text-sm ml-2">({member.roadname})</span>
                      )}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                      {member.bio}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
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

        {/* Edit Member Modal */}
        {showEditModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-4">Edit Member</h3>
              <MemberForm 
                member={selectedMember}
                onSave={handleSaveEdit}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedMember(null);
                }}
                ranks={ranks}
                chapters={chapters}
                isEditing={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberManagement;
