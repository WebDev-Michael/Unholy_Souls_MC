// Image Database Structure for Unholy Souls MC
let imageDatabase = [
  {
    id: 1,
    title: "Club Ride 2025",
    category: "Club",
    description: "Epic ride through the mountains with the brotherhood",
    imageUrl: "https://i.imgur.com/2cZtQxl.png",
    tags: ["ride", "support local business", "brotherhood", "adventure"],
    featured: true,
    location: "car wash",
    members: ["All Members"],
    date: '8/13/2025'
  },
  {
    id: 2,
    title: "Top 9",
    category: "Club",
    description: "The core members that make it all happen",
    imageUrl: "https://i.imgur.com/ZRQ9NtS.png",
    tags: ["leadership", "core", "members", "brotherhood"],
    featured: true,
    location: "Club House",
    members: ["Top 9"],
    date: '8/13/2025'
  },
  {
    id: 3,
    title: "Don Tito - Prez",
    category: "National",
    description: "National President of the Unholy Souls MC.",
    imageUrl: "https://i.imgur.com/kzkgmmI.jpeg",
    tags: ["president", "national", "brotherhood"],
    featured: true,
    location: "National",
    members: ["Don Tito"],
    date: '8/13/2025'
  },
  {
    id: 4,
    title: "Ricky Lafluer - Crash",
    category: "National",
    description: "National Vice President of the Unholy Souls MC.",
    imageUrl: "https://i.imgur.com/RfAdXPS.png",
    tags: ["vice president", "national", "brotherhood"],
    featured: true,
    location: "National",
    members: ["Ricky Lafluer"],
    date: '8/13/2025'
  },
  {
    id: 5,
    title: "Winston Oak - Ace",
    category: "Dockside",
    description: "President of the Dockside Chapter.",
    imageUrl: "https://i.imgur.com/sjQcAhU.png",
    tags: ["president", "brotherhood"],
    featured: false,
    location: "Dockside Chapter",
    members: ["Winston Oak"],
    date: '8/13/2025'
  },
  {
    id: 6,
    title: "Astra Teach - Tornado",
    category: "Dockside",
    description: "Vice President of the Dockside Chapter.",
    imageUrl: "https://imgur.com/j1xNAWE.png",
    tags: ["vice president", "brotherhood"],
    featured: false,
    location: "Dockside Chapter",
    members: ["Astra Teach"],
    date: '8/13/2025'
  },
  {
    id: 7,
    title: "Wyatt Teach - Cowboy",
    category: "Dockside",
    description: "Road Captain of the Dockside Chapter.",
    imageUrl: "https://i.imgur.com/0C1nZ3Z.jpeg",
    tags: ["road captain", "brotherhood"],
    featured: false,
    location: "Dockside Chapter",
    members: ["Wyatt Teach"],
    date: '8/13/2025'
  },
  {
    id: 8,
    title: "Kait Williams - Kitty",
    category: "Dockside",
    description: "Secretary of the Dockside Chapter.",
    imageUrl: "https://i.imgur.com/Fp3uZGX.png",
    tags: ["secretary", "brotherhood"],
    featured: false,
    location: "Dockside Chapter",
    members: ["Kait Williams"],
    date: '8/13/2025'
  },
  {
    id: 9,
    title: "Jackson Hayes - Maverick",
    category: "Dockside",
    description: "Enforcer of the Dockside Chapter.",
    imageUrl: "https://i.imgur.com/p1v4My0.png",
    tags: ["enforcer", "brotherhood"],
    featured: false,
    location: "Dockside Chapter",
    members: ["Jackson Hayes"],
    date: '8/13/2025'
  },
  {
    id: 10,
    title: "Blaze Newman - Ghost",
    category: "Dockside",
    description: "Full Patch Member of the Dockside Chapter.",
    imageUrl: "https://i.imgur.com/GyARgKJ.png",
    tags: [ "full patch member", "brotherhood"],
    featured: false,
    location: "Dockside Chapter",
    members: ["Blaze Newman"],
    date: '8/13/2025'
  },
  {
    id: 11,
    title: "Merle Fell - Reaper",
    category: "Bay City",
    description: "President of the Bay City Chapter.",
    imageUrl: "https://i.imgur.com/OLB0Ctk.jpeg",
    tags: [ "president", "brotherhood", "bay city"],
    featured: false,
    location: "Bay City Chapter",
    members: ["Merle Fell"],
    date: '8/13/2025'
  },
  {
    id: 12,
    title: "Vikki Wesley - Psycho",
    category: "Bay City",
    description: "Treasurer of the Bay City Chapter.",
    imageUrl: "https://i.imgur.com/hwiMwSE.png",
    tags: [ "treasurer", "brotherhood", "bay city"],
    featured: false,
    location: "Bay City Chapter",
    members: ["Vikki Wesley"],
    date: '8/13/2025'
  },
  {
    id: 13,
    title: "Bunny Frost - Houdini",
    category: "Bay City",
    description: "Enforcer of the Bay City Chapter.",
    imageUrl: "https://imgur.com/MEkgy1v.png",
    tags: [ "enforcer", "brotherhood", "bay city"],
    featured: false,
    location: "Bay City Chapter",
    members: ["Bunny Frost"],
    date: '8/13/2025'
  },
  {
    id: 14,
    title: "Michael Smith - Lazy Eye",
    category: "Bay City",
    description: "Full patch member of the Bay City Chapter.",
    imageUrl: "https://i.imgur.com/bcmg59b.jpeg",
    tags: [ "full patch member", "brotherhood", "bay city"],
    featured: false,
    location: "Bay City Chapter",
    members: ["Michael Smith"],
    date: '8/13/2025'
  },
  {
    id: 15,
    title: "Trent Carter - Teabag",
    category: "Bay City",
    description: "Full patch member of the Bay City Chapter.",
    imageUrl: null,
    tags: [ "full patch member", "brotherhood", "bay city"],
    featured: false,
    location: "Bay City Chapter",
    members: ["Trent Carter"],
    date: '8/13/2025'
  },
  // {
  //   id: 16,
  //   title: "",
  //   category: "",
  //   description: "",
  //   imageUrl: null,
  //   tags: [],
  //   featured: false,
  //   location: "",
  //   members: [],
  //   date: ''
  // }
];

// Load uploaded images from localStorage
const loadUploadedImages = () => {
  try {
    const uploaded = localStorage.getItem('uploadedImages');
    if (uploaded) {
      const parsedImages = JSON.parse(uploaded);
      imageDatabase = [...imageDatabase, ...parsedImages];
    }
  } catch (error) {
    console.warn('Could not load uploaded images:', error);
  }
};

// Initialize uploaded images
loadUploadedImages();

// Export the database
export { imageDatabase };

// Function to add new images to the database
export const addImageToDatabase = (newImage) => {
  imageDatabase.unshift(newImage);
  // Update localStorage
  try {
    const existing = localStorage.getItem('uploadedImages') || '[]';
    const existingImages = JSON.parse(existing);
    const updatedImages = [newImage, ...existingImages];
    localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
  } catch (error) {
    console.warn('Could not save image to localStorage:', error);
  }
};

// Categories for filtering
export const categories = [
  { id: "all", name: "All Categories", count: imageDatabase.length },
  { id: "Club", name: "Club", count: imageDatabase.filter(img => img.category === "Club").length },
  { id: "Dockside", name: "Dockside Chapter", count: imageDatabase.filter(img => img.category === "Dockside").length },
  { id: "Bay City", name: "Bay City Chapter", count: imageDatabase.filter(img => img.category === "Bay City").length },
  { id: "National", name: "National", count: imageDatabase.filter(img => img.category === "National").length }
];

// Utility functions
export const getImagesByCategory = (category) => {
  if (category === "all") return imageDatabase;
  return imageDatabase.filter(img => img.category === category);
};

export const searchImages = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return imageDatabase.filter(img => 
    img.title.toLowerCase().includes(term) ||
    img.description.toLowerCase().includes(term) ||
    img.tags.some(tag => tag.toLowerCase().includes(term)) ||
    img.location.toLowerCase().includes(term) ||
    img.members.some(member => member.toLowerCase().includes(term))
  );
};

export const getFeaturedImages = () => {
  return imageDatabase.filter(img => img.featured);
};

export const getImagesByDate = (startDate, endDate) => {
  return imageDatabase.filter(img => {
    const imgDate = new Date(img.date);
    return imgDate >= startDate && imgDate <= endDate;
  });
};

// Get member profile images specifically
export const getMemberProfileImages = () => {
  return imageDatabase.filter(img => 
    img.tags.includes("brotherhood") && 
    img.members.length === 1 && 
    img.members[0] !== "All Members"
  );
};

// Get images by specific member
export const getImagesByMember = (memberName) => {
  return imageDatabase.filter(img => 
    img.members.some(member => 
      member.toLowerCase().includes(memberName.toLowerCase())
    )
  );
};

// Local storage functions for user preferences
export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem('galleryPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.warn('Could not save preferences to localStorage:', error);
  }
};

export const loadUserPreferences = () => {
  try {
    const saved = localStorage.getItem('galleryPreferences');
    return saved ? JSON.parse(saved) : {
      defaultCategory: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      itemsPerPage: 12
    };
  } catch (error) {
    console.warn('Could not load preferences from localStorage:', error);
    return {
      defaultCategory: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      itemsPerPage: 12
    };
  }
};
