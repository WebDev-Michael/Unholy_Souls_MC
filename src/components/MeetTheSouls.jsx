import React from 'react'
import MemberCard from './MemberCard'

let members = [
  {
    name: 'Don Tito',
    roadname: 'Prez',
    rank: 'National President',
    chapter: 'Dockside',
    bio: 'Don Tito is the president of the Unholy Souls MC. He is a great leader and a great friend.',
    image: 'https://cdn.discordapp.com/attachments/1238700546236350507/1358999773411278858/Screenshot_2025-01-27_224100.png?ex=689ca86a&is=689b56ea&hm=7aa362c0281fd967e2bf5943d4573476bea7755ab5d97368cde1dbeb858f8b00&',
  },
  {
    name: 'Ricky Lafluer',
    roadname: 'Crash',
    rank: 'National Vice President',
    chapter: 'Dockside',
    bio: 'Ricky Lafluer is the backbone of the club, handling operations and member relations with precision.',
    image: 'https://cdn.discordapp.com/attachments/1238700546236350507/1371694231055237151/image.png?ex=689cb28d&is=689b610d&hm=3cb5e592526c2c93255bc43795ae72e983656f112eacf804267f267971b0b3c3&',
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
    image: 'https://cdn.discordapp.com/attachments/1238700546236350507/1403904287515607141/Screenshot_2025-08-09_173803.png?ex=689c8b01&is=689b3981&hm=5ff265775468b4134508090e98d64f8fca98a4ad4f4ed7eafa75556295234b22&',
  },
  {
    name: 'Astra Teach',
    roadname: 'Tornado',
    rank: 'Vice President',
    chapter: 'Dockside',
    bio: 'Astra ensures club security and maintains order during meetings and events.',
    image: 'https://cdn.discordapp.com/attachments/1238700546236350507/1402720496797094108/Untitled.png?ex=689cd9c3&is=689b8843&hm=e2891158d66ff45f18dfba067a58135b7af572fb46714de796c9e63d6cf7f073&',
  },
  {
    name: 'Wyatt Teach',
    roadname: 'Cowboy',
    rank: 'Road Captain',
    chapter: 'Dockside',
    bio: 'Wyatt plans our rides and ensures everyone gets home safe after our adventures.',
    image: 'https://cdn.discordapp.com/attachments/1238700546236350507/1402832914923913216/2025-05-31_21_43_43-FiveM_by_Cfx.re_-_Liberated_Roleplay___MC_GANG_SLOTS_NOW_OPEN___Seriou.jpg?ex=689c99b6&is=689b4836&hm=f82055a72a2a6de29c8d16cd6da682f80c82ed3f44688024604bdf287de1d92d&',
  },
  {
    name: 'Kait Williams',
    roadname: 'Kitty',
    rank: 'Secretary',
    chapter: 'Dockside',
    bio: 'The Secretary is responsible for making and keeping all club chapter records.',
    image: 'https://cdn.discordapp.com/attachments/1238700546236350507/1402786489464782878/image.png?ex=689c6e79&is=689b1cf9&hm=08595efc0c7bde890fd52228cb64869737038d515c490b09f353fd61d43e27f0&',
  },
  {
    name: 'Jackson Hayes',
    roadname: 'Maverick',
    rank: 'Enforcer',
    chapter: 'Dockside',
    bio: 'The Enforcer makes certain that the club laws and rules are followed by all members.',
    image: 'https://media.discordapp.net/attachments/1362971109406015639/1402768282888573120/77.png?ex=689d0644&is=689bb4c4&hm=4556e76f655f5ff35a4494cbb69901ad63c4c092443aea779ae4d81d14c7b8fd&=&format=webp&quality=lossless&width=1048&height=670',
  },
  {
    name: 'Blaze Newman',
    roadname: 'Ghost',
    rank: 'Full Patch Member',
    chapter: 'Dockside',
    bio: 'A Member is also called a Patch Member or a Rider.',
    image: 'https://cdn.discordapp.com/attachments/1374207527457132635/1404972211663540265/Screenshot_2025-08-12_191911.png?ex=689d21d6&is=689bd056&hm=1d452c878ec2d08792a19005f5d8af42f486947bf5bd5360061baf8833626029&',
  },
]

function MeetTheSouls() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet The Souls
          </h1>
          <p className="text-xl text-gray-600 dark:text-white max-w-3xl mx-auto">
            Get to know the dedicated members who make the Unholy Souls MC what it is today. 
            Each soul brings their own unique spirit and commitment to our brotherhood.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-700/50 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to Join the Brotherhood?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The Unholy Souls MC is always looking for dedicated individuals who share our values 
              and commitment to the motorcycle lifestyle.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
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