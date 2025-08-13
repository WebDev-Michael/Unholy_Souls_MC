import React from "react";

function Gallery() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-black/50 rounded-2xl border border-amber-500/30 p-12 shadow-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Gallery
          </h1>

          <p className="text-xl md:text-2xl text-amber-300 mb-8 font-medium">
            Coming Soon
          </p>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            We're working hard to bring you an amazing collection of photos and
            memories from the Unholy Souls MC. Get ready to see our brotherhood
            in action, from epic rides to unforgettable moments.
          </p>

          <div className="mb-8">
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">Development Progress: 75%</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">
                Photo Collections
              </h3>
              <p className="text-gray-400 text-sm">
                Browse through our organized photo galleries
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Video Memories</h3>
              <p className="text-gray-400 text-sm">
                Relive our adventures with video content
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Event Archives</h3>
              <p className="text-gray-400 text-sm">
                Explore our past events and gatherings
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-6 border border-amber-400/30">
            <h3 className="text-white text-xl font-bold mb-3">Stay Tuned!</h3>
            <p className="text-amber-100 mb-4">
              Follow us on social media for updates and sneak peeks of what's
              coming.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-black/30 hover:bg-black/50 text-white px-6 py-2 rounded-lg transition-colors duration-200 border border-amber-400/30">
                Discord
              </button>
              <button className="bg-black/30 hover:bg-black/50 text-white px-6 py-2 rounded-lg transition-colors duration-200 border border-amber-400/30">
                Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
