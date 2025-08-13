import React from 'react'

const MemberCard = ({ member }) => {
  return (
    <div className="bg-white dark:bg-gray-800/70 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        {/* Rank Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black border-2 border-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {member.rank}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Name and Road Name */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {member.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            "{member.roadname}"
          </p>
        </div>

        {/* Chapter */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-amber-900 dark:text-amber-200">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {member.chapter}
          </span>
        </div>

        {/* Bio */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {member.bio}
        </p>

      </div>
    </div>
  )
}

export default MemberCard
