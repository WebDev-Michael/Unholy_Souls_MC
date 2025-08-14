export const members = [
  {
    name: 'Don Tito',
    roadname: 'Prez',
    rank: 'National President',
    chapter: 'Dockside',
    bio: 'Don Tito is the president of the Unholy Souls MC. He is a great leader and a great friend.',
    image: 'https://i.imgur.com/kzkgmmI.jpeg',
  },
  {
    name: 'Ricky Lafluer',
    roadname: 'Crash',
    rank: 'National Vice President',
    chapter: 'Dockside',
    bio: 'Ricky Lafluer is the backbone of the club, handling operations and member relations with precision.',
    image: 'https://i.imgur.com/RfAdXPS.png',
  },
  {
    name: 'Ginge Thompson',
    roadname: null,
    rank: 'National Sergeant at Arms',
    chapter: 'Dockside',
    bio: 'Ginge is the Sergeant at Arms of the Unholy Souls MC. He is a great leader and a great friend.',
    image: null,
  },
  {
    name: 'Winston Oak',
    roadname: 'Ace',
    rank: 'President',
    chapter: 'Dockside',
    bio: 'Ace manages the club finances and ensures we stay on track with all our business ventures.',
    image: 'https://i.imgur.com/sjQcAhU.png',
  },
  {
    name: 'Astra Teach',
    roadname: 'Tornado',
    rank: 'Vice President',
    chapter: 'Dockside',
    bio: 'Astra ensures club security and maintains order during meetings and events.',
    image: 'https://i.imgur.com/j1xNAWE.png',
  },
  {
    name: 'Wyatt Teach',
    roadname: 'Cowboy',
    rank: 'Road Captain',
    chapter: 'Dockside',
    bio: 'Wyatt plans our rides and ensures everyone gets home safe after our adventures.',
    image: 'https://i.imgur.com/0C1nZ3Z.jpeg',
  },
  {
    name: 'Kait Williams',
    roadname: 'Kitty',
    rank: 'Secretary',
    chapter: 'Dockside',
    bio: 'The Secretary is responsible for making and keeping all club chapter records.',
    image: 'https://i.imgur.com/Fp3uZGX.png',
  },
  {
    name: 'Jackson Hayes',
    roadname: 'Maverick',
    rank: 'Enforcer',
    chapter: 'Dockside',
    bio: 'The Enforcer makes certain that the club laws and rules are followed by all members.',
    image: 'https://i.imgur.com/p1v4My0.png',
  },
  {
    name: 'Blaze Newman',
    roadname: 'Ghost',
    rank: 'Full Patch Member',
    chapter: 'Dockside',
    bio: 'A Member is also called a Patch Member or a Rider.',
    image: 'https://i.imgur.com/GyARgKJ.png',
  },
  {
    name: 'Merle Fell',
    roadname: 'Reaper',
    rank: 'President',
    chapter: 'Bay City',
    bio: 'Merle is the president of the Bay City Chapter.',
    image: 'https://i.imgur.com/OLB0Ctk.jpeg',
  },
  {
    name: 'Vikki Wesley',
    roadname: 'Psycho',
    rank: 'Treasurer',
    chapter: 'Bay City',
    bio: 'Vikki is the treasurer of the Bay City Chapter.',
    image: 'https://i.imgur.com/hwiMwSE.png',
  },
  {
    name: 'Bunny Frost',
    roadname: 'Houdini',
    rank: 'Enforcer',
    chapter: 'Bay City',
    bio: 'Bunny is the enforcer of the Bay City Chapter.',
    image: 'https://imgur.com/MEkgy1v.png',
  },
  {
    name: 'Michael Smith',
    roadname: 'Lazy Eye',
    rank: 'Full Patch Member',
    chapter: 'Bay City',
    bio: 'Michael is the full patch member of the Bay City Chapter.',
    image: 'https://i.imgur.com/bcmg59b.jpeg',
  },
  {
    name: 'Trent Carter',
    roadname: 'Teabag',
    rank: 'Full Patch Member',
    chapter: 'Bay City',
    bio: 'Trent is the full patch member of the Bay City Chapter.',
    image: null,
  },
  // {
  //   name: '',
  //   roadname: '',
  //   rank: '',
  //   chapter: '',
  //   bio: '',
  //   image: null,
  // },
];

// Utility functions for member data
export const getMembersByRank = (rank) => {
  return members.filter(member => member.rank === rank);
};

export const getMembersByChapter = (chapter) => {
  return members.filter(member => member.chapter === chapter);
};

export const getMembersWithRoadnames = () => {
  return members.filter(member => member.roadname !== null);
};

export const getMembersWithImages = () => {
  return members.filter(member => member.image !== null);
};

export const searchMembers = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return members.filter(member => 
    member.name.toLowerCase().includes(term) ||
    (member.roadname && member.roadname.toLowerCase().includes(term)) ||
    member.rank.toLowerCase().includes(term) ||
    member.chapter.toLowerCase().includes(term) ||
    member.bio.toLowerCase().includes(term)
  );
};
