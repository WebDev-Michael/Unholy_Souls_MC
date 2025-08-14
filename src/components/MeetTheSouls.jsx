import React, { useState, useEffect } from 'react'
import MemberCard from './MemberCard'

function MeetTheSouls() {
  const [members, setMembers] = useState(() => {
    // Try to load from localStorage first, fallback to default data
    const saved = localStorage.getItem('unholySoulsMembers');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default members data
    return [
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

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('unholySoulsMembers');
      if (saved) {
        setMembers(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {members.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>

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