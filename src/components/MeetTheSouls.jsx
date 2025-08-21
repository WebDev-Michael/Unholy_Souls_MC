import React, { useState, useEffect } from 'react'
import MemberCard from './MemberCard'
import { membersAPI } from '../services/api'

function MeetTheSouls() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rank: '',
    chapter: '',
    search: ''
  });
  const [ranks, setRanks] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Define all available ranks and chapters as fallbacks
  const allRanks = [
    "Prospect",
    "Full Patch Member",
    "Tail Gunner",
    "Enforcer",
    "Warlord",
    "Treasurer",
    "Secretary",
    "Road Captain",
    "Sergeant at Arms",
    "Vice President",
    "President"
  ];

  const allChapters = [
    "Dockside",
    "Bay City",
    "National"
  ];

  // Load members and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [membersData, ranksData, chaptersData] = await Promise.all([
          membersAPI.getAll(),
          membersAPI.getRanks().catch(() => []), // Fallback to empty array if API fails
          membersAPI.getChapters().catch(() => []) // Fallback to empty array if API fails
        ]);
        
        setMembers(membersData);
        
        // Use API data if available, otherwise use fallback arrays
        if (ranksData && ranksData.length > 0) {
          setRanks(ranksData);
        } else {
          // Convert to the format expected by the component
          setRanks(allRanks.map(rank => ({ rank, count: 0 })));
        }
        
        if (chaptersData && chaptersData.length > 0) {
          setChapters(chaptersData);
        } else {
          // Convert to the format expected by the component
          setChapters(allChapters.map(chapter => ({ chapter, count: 0 })));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading members:', err);
        setError('Failed to load members. Please try again later.');
        
        // Set fallback data even if there's an error
        setRanks(allRanks.map(rank => ({ rank, count: 0 })));
        setChapters(allChapters.map(chapter => ({ chapter, count: 0 })));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Only run on mount

  // Filter members based on current filters
  const filteredMembers = members.filter(member => {
    // Apply rank filter
    if (filters.rank && member.rank !== filters.rank) return false;
    
    // Apply chapter filter
    if (filters.chapter && member.chapter !== filters.chapter) return false;
    
    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      return (
        member.name.toLowerCase().includes(searchLower) ||
        (member.roadname && member.roadname.toLowerCase().includes(searchLower)) ||
        member.rank.toLowerCase().includes(searchLower) ||
        member.chapter.toLowerCase().includes(searchLower) ||
        (member.bio && member.bio.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      rank: '',
      chapter: '',
      search: ''
    });
  };

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
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Meet The Souls
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-white max-w-3xl mx-auto px-4">
            Get to know the dedicated members who make the Unholy Souls MC what it is today. 
            Each soul brings their own unique spirit and commitment to our brotherhood.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-700/50 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search members..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Rank Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rank
              </label>
              <select
                value={filters.rank}
                onChange={(e) => handleFilterChange('rank', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
              >
                <option value="">All Ranks</option>
                {ranks.map((rankObj, index) => (
                  <option key={index} value={rankObj.rank}>{rankObj.rank}</option>
                ))}
              </select>
            </div>

            {/* Chapter Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chapter
              </label>
              <select
                value={filters.chapter}
                onChange={(e) => handleFilterChange('chapter', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
              >
                <option value="">All Chapters</option>
                {chapters.map((chapterObj, index) => (
                  <option key={index} value={chapterObj.chapter}>{chapterObj.chapter}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredMembers.length} of {members.length} members
          </p>
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredMembers.map((member, index) => (
              <MemberCard key={member.id || index} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No members found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-white dark:bg-gray-700/50 rounded-lg shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Want to Join the Brotherhood?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              The Unholy Souls MC is always looking for dedicated individuals who share our values 
              and commitment to the motorcycle lifestyle.
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              If you think you have what it takes to be a part of a 1% MC in a
              fast-paced city, approach a member of the club and let them know you
              would like a meeting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetTheSouls