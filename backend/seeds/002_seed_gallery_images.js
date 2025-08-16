/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('gallery_images').del()
    .then(function () {
      // Inserts seed entries
      return knex('gallery_images').insert([
        {
          title: "Club Ride 2025",
          category: "Club",
          description: "Epic ride through the mountains with the brotherhood",
          imageUrl: "https://i.imgur.com/2cZtQxl.png",
          tags: JSON.stringify(["ride", "support local business", "brotherhood", "adventure"]),
          featured: true,
          location: "car wash",
          members: JSON.stringify(["All Members"]),
          date: '2025-08-13'
        },
        {
          title: "Top 9",
          category: "Club",
          description: "The core members that make it all happen",
          imageUrl: "https://i.imgur.com/ZRQ9NtS.png",
          tags: JSON.stringify(["leadership", "core", "members", "brotherhood"]),
          featured: true,
          location: "Club House",
          members: JSON.stringify(["Top 9"]),
          date: '2025-08-13'
        },
        {
          title: "Don Tito - Prez",
          category: "National",
          description: "National President of the Unholy Souls MC.",
          imageUrl: "https://i.imgur.com/kzkgmmI.jpeg",
          tags: JSON.stringify(["president", "national", "brotherhood"]),
          featured: true,
          location: "National",
          members: JSON.stringify(["Don Tito"]),
          date: '2025-08-13'
        },
        {
          title: "Ricky Lafluer - Crash",
          category: "National",
          description: "National Vice President of the Unholy Souls MC.",
          imageUrl: "https://i.imgur.com/RfAdXPS.png",
          tags: JSON.stringify(["vice president", "national", "brotherhood"]),
          featured: true,
          location: "National",
          members: JSON.stringify(["Ricky Lafluer"]),
          date: '2025-08-13'
        },
        {
          title: "Winston Oak - Ace",
          category: "Dockside",
          description: "President of the Dockside Chapter.",
          imageUrl: "https://i.imgur.com/sjQcAhU.png",
          tags: JSON.stringify(["president", "brotherhood"]),
          featured: false,
          location: "Dockside Chapter",
          members: JSON.stringify(["Winston Oak"]),
          date: '2025-08-13'
        },
        {
          title: "Astra Teach - Tornado",
          category: "Dockside",
          description: "Vice President of the Dockside Chapter.",
          imageUrl: "https://imgur.com/j1xNAWE.png",
          tags: JSON.stringify(["vice president", "brotherhood"]),
          featured: false,
          location: "Dockside Chapter",
          members: JSON.stringify(["Astra Teach"]),
          date: '2025-08-13'
        },
        {
          title: "Wyatt Teach - Cowboy",
          category: "Dockside",
          description: "Road Captain of the Dockside Chapter.",
          imageUrl: "https://i.imgur.com/0C1nZ3Z.jpeg",
          tags: JSON.stringify(["road captain", "brotherhood"]),
          featured: false,
          location: "Dockside Chapter",
          members: JSON.stringify(["Wyatt Teach"]),
          date: '2025-08-13'
        },
        {
          title: "Kait Williams - Kitty",
          category: "Dockside",
          description: "Secretary of the Dockside Chapter.",
          imageUrl: "https://i.imgur.com/Fp3uZGX.png",
          tags: JSON.stringify(["secretary", "brotherhood"]),
          featured: false,
          location: "Dockside Chapter",
          members: JSON.stringify(["Kait Williams"]),
          date: '2025-08-13'
        },
        {
          title: "Jackson Hayes - Maverick",
          category: "Dockside",
          description: "Enforcer of the Dockside Chapter.",
          imageUrl: "https://i.imgur.com/p1v4My0.png",
          tags: JSON.stringify(["enforcer", "brotherhood"]),
          featured: false,
          location: "Dockside Chapter",
          members: JSON.stringify(["Jackson Hayes"]),
          date: '2025-08-13'
        },
        {
          title: "Blaze Newman - Ghost",
          category: "Dockside",
          description: "Full Patch Member of the Dockside Chapter.",
          imageUrl: "https://i.imgur.com/GyARgKJ.png",
          tags: JSON.stringify(["full patch member", "brotherhood"]),
          featured: false,
          location: "Dockside Chapter",
          members: JSON.stringify(["Blaze Newman"]),
          date: '2025-08-13'
        },
        {
          title: "Merle Fell - Reaper",
          category: "Bay City",
          description: "President of the Bay City Chapter.",
          imageUrl: "https://i.imgur.com/OLB0Ctk.jpeg",
          tags: JSON.stringify(["president", "brotherhood", "bay city"]),
          featured: false,
          location: "Bay City Chapter",
          members: JSON.stringify(["Merle Fell"]),
          date: '2025-08-13'
        },
        {
          title: "Vikki Wesley - Psycho",
          category: "Bay City",
          description: "Treasurer of the Bay City Chapter.",
          imageUrl: "https://i.imgur.com/hwiMwSE.png",
          tags: JSON.stringify(["treasurer", "brotherhood", "bay city"]),
          featured: false,
          location: "Bay City Chapter",
          members: JSON.stringify(["Vikki Wesley"]),
          date: '2025-08-13'
        },
        {
          title: "Bunny Frost - Houdini",
          category: "Bay City",
          description: "Enforcer of the Bay City Chapter.",
          imageUrl: "https://imgur.com/MEkgy1v.png",
          tags: JSON.stringify(["enforcer", "brotherhood", "bay city"]),
          featured: false,
          location: "Bay City Chapter",
          members: JSON.stringify(["Bunny Frost"]),
          date: '2025-08-13'
        },
        {
          title: "Michael Smith - Lazy Eye",
          category: "Bay City",
          description: "Full patch member of the Bay City Chapter.",
          imageUrl: "https://i.imgur.com/bcmg59b.jpeg",
          tags: JSON.stringify(["full patch member", "brotherhood", "bay city"]),
          featured: false,
          location: "Bay City Chapter",
          members: JSON.stringify(["Michael Smith"]),
          date: '2025-08-13'
        },
        {
          title: "Trent Carter - Teabag",
          category: "Bay City",
          description: "Full patch member of the Bay City Chapter.",
          imageUrl: null,
          tags: JSON.stringify(["full patch member", "brotherhood", "bay city"]),
          featured: false,
          location: "Bay City Chapter",
          members: JSON.stringify(["Trent Carter"]),
          date: '2025-08-13'
        }
      ]);
    });
}
