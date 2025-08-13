import React from 'react'
import MemberCard from './MemberCard'
import { members } from '../data/members'

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