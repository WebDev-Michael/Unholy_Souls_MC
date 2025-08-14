import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MemberForm from './MemberForm';

function MemberManagement() {
  const { logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('unholySoulsMembers');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Don Tito',
        roadname: 'Prez',
        rank: 'National President',
        chapter: 'Dockside',
        bio: 'Don Tito is the president of the Unholy Souls MC. He is a great leader and a great friend.',
        image: 'https://i.imgur.com/kzkgmmI.jpeg',
      },
      {
        id: 2,
        name: 'Ricky Lafluer',
        roadname: 'Crash',
        rank: 'National Vice President',
        chapter: 'Dockside',
        bio: 'Ricky Lafluer is the backbone of the club, handling operations and member relations with precision.',
        image: 'https://i.imgur.com/RfAdXPS.png',
      },
      {
        id: 3,
        name: 'Ginge Thompson',
        roadname: null,
        rank: 'National Sergeant at Arms',
        chapter: 'Dockside',
        bio: 'Ginge is the Sergeant at Arms of the Unholy Souls MC. He is a great leader and a great friend.',
        image: null,
      },
      {
        id: 4,
        name: 'Winston Oak',
        roadname: 'Ace',
        rank: 'President',
        chapter: 'Dockside',
        bio: 'Ace manages the club finances and ensures we stay on track with all our business ventures.',
        image: 'https://i.imgur.com/sjQcAhU.png',
      },
      {
        id: 5,
        name: 'Astra Teach',
        roadname: 'Tornado',
        rank: 'Vice President',
        chapter: 'Dockside',
        bio: 'Astra ensures club security and maintains order during meetings and events.',
        image: 'https://i.imgur.com/j1xNAWE.png',
      },
      {
        id: 6,
        name: 'Wyatt Teach',
        roadname: 'Cowboy',
        rank: 'Road Captain',
        chapter: 'Dockside',
        bio: 'Wyatt plans our rides and ensures everyone gets home safe after our adventures.',
        image: 'https://i.imgur.com/0C1nZ3Z.jpeg',
      },
      {
        id: 7,
        name: 'Kait Williams',
        roadname: 'Kitty',
        rank: 'Secretary',
        chapter: 'Dockside',
        bio: 'The Secretary is responsible for making and keeping all club chapter records.',
        image: 'https://i.imgur.com/Fp3uZGX.png',
      },
      {
        id: 8,
        name: 'Jackson Hayes',
        roadname: 'Maverick',
        rank: 'Enforcer',
        chapter: 'Dockside',
        bio: 'The Enforcer makes certain that the club laws and rules are followed by all members.',
        image: 'https://i.imgur.com/p1v4My0.png',
      },
      {
        id: 9,
        name: 'Blaze Newman',
        roadname: 'Ghost',
        rank: 'Full Patch Member',
        chapter: 'Dockside',
        bio: 'A Member is also called a Patch Member or a Rider.',
        image: 'https://i.imgur.com/GyARgKJ.png',
      },
      {
        id: 10,
        name: 'Merle Fell',
        roadname: 'Reaper',
        rank: 'President',
        chapter: 'Bay City',
        bio: 'Merle is the president of the Bay City Chapter.',
        image: 'https://i.imgur.com/OLB0Ctk.jpeg',
      },
      {
        id: 11,
        name: 'Vikki Wesley',
        roadname: 'Psycho',
        rank: 'Treasurer',
        chapter: 'Bay City',
        bio: 'Vikki is the treasurer of the Bay City Chapter.',
        image: 'https://i.imgur.com/hwiMwSE.png',
      },
      {
        id: 12,
        name: 'Bunny Frost',
        roadname: 'Houdini',
        rank: 'Enforcer',
        chapter: 'Bay City',
        bio: 'Bunny is the enforcer of the Bay City Chapter.',
        image: 'https://imgur.com/MEkgy1v.png',
      },
      {
        id: 13,
        name: 'Michael Smith',
        roadname: 'Lazy Eye',
        rank: 'Full Patch Member',
        chapter: 'Bay City',
        bio: 'Michael is the full patch member of the Bay City Chapter.',
        image: 'https://i.imgur.com/bcmg59b.jpeg',
      },
      {
        id: 14,
        name: 'Trent Carter',
        roadname: 'Teabag',
        rank: 'Full Patch Member',
        chapter: 'Bay City',
        bio: 'Trent is the full patch member of the Bay City Chapter.',
        image: null,
      }
    ];
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChapter, setFilterChapter] = useState('all');

  // Save members to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('unholySoulsMembers', JSON.stringify(members));
  }, [members]);

  const handleAddMember = (newMember) => {
    const memberWithId = {
      ...newMember,
      id: Date.now()
    };
    setMembers(prev => [memberWithId, ...prev]);
    setShowAddForm(false);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedMember) => {
    setMembers(prev => prev.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    ));
    setShowEditModal(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // Filter members based on search and chapter
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.roadname && member.roadname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.chapter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChapter = filterChapter === 'all' || member.chapter === filterChapter;
    
    return matchesSearch && matchesChapter;
  });

  const chapters = ['Dockside', 'Bay City', 'National'];
  const ranks = [
    'National President',
    'National Vice President', 
    'National Sergeant at Arms',
    'President',
    'Vice President',
    'Road Captain',
    'Secretary',
    'Treasurer',
    'Enforcer',
    'Full Patch Member'
  ];

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
                Unholy Souls MC Brotherhood
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
            Manage the Unholy Souls MC membership. Add new brothers, update information, 
            and maintain the brotherhood roster.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center mt-8">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{members.length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Total Members</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{new Set(members.map(m => m.chapter)).size}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Chapters</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{new Set(members.map(m => m.rank)).size}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Ranks</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{members.filter(m => m.roadname).length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">With Road Names</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">Search Members</label>
              <input
                type="text"
                placeholder="Search by name, road name, rank..."
                className="w-full px-3 py-2 bg-gray-500/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Chapter Filter */}
            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">Filter by Chapter</label>
              <select
                className="w-full px-3 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value)}
              >
                <option value="all">All Chapters</option>
                {chapters.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>

            {/* Add Member Button */}
            <div className="flex items-end">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                {showAddForm ? 'Cancel' : 'Add New Member'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <div className="mb-6 sm:mb-8">
            <MemberForm 
              onSubmit={handleAddMember}
              onCancel={() => setShowAddForm(false)}
              chapters={chapters}
              ranks={ranks}
            />
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-400 text-sm sm:text-base">
            Showing {filteredMembers.length} of {members.length} members
            {searchTerm && ` matching "${searchTerm}"`}
            {filterChapter !== 'all' && ` in ${filterChapter} Chapter`}
          </p>
        </div>

        {/* Members List */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Brotherhood Members</h3>
          
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No members found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-gray-800/60 rounded-lg overflow-hidden border border-amber-500/20">
                  {/* Member Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image || 'https://i.imgur.com/placeholder.png'}
                      alt={member.name}
                      className="w-full h-40 sm:h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://i.imgur.com/placeholder.png';
                      }}
                    />
                    
                    {/* Chapter Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/70 text-amber-300 text-xs px-2 py-1 rounded font-medium">
                        {member.chapter}
                      </span>
                    </div>

                    {/* Rank Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-amber-500/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {member.rank}
                      </span>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-3 sm:p-4">
                    <h4 className="text-white font-semibold mb-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {member.name}
                    </h4>
                    
                    {member.roadname && (
                      <p className="text-amber-400 text-xs mb-2 font-medium">
                        "{member.roadname}"
                      </p>
                    )}
                    
                    <p className="text-gray-400 text-xs mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                      {member.bio}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
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
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/95 rounded-2xl border border-amber-500/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white">Edit Member</h2>
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
              <MemberForm 
                member={selectedMember}
                onSubmit={handleSaveEdit}
                onCancel={() => setShowEditModal(false)}
                chapters={chapters}
                ranks={ranks}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberManagement;
