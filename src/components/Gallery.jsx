import React, { useState } from "react";
import { imageDatabase, categories, searchImages, getImagesByCategory } from "../data/imageDatabase";

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState(imageDatabase);

  // Filter and search images
  const handleFilter = () => {
    let filtered = imageDatabase;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = getImagesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchImages(searchTerm);
    }

    setFilteredImages(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      handleFilter();
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    handleFilter();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setFilteredImages(imageDatabase);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-black/50 rounded-2xl border border-amber-500/30 p-12 shadow-2xl mb-8">
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

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight text-center">
            Gallery
          </h1>

          <p className="text-xl md:text-2xl text-amber-300 mb-8 font-medium text-center">
            Unholy Souls MC Memories
          </p>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto text-center">
            Explore our collection of photos and memories from the Unholy Souls MC. 
            From epic rides to unforgettable brotherhood moments, every image tells a story.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">{imageDatabase.length}</div>
              <div className="text-gray-400 text-sm">Total Images</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">{categories.length - 1}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">{imageDatabase.filter(img => img.featured).length}</div>
              <div className="text-gray-400 text-sm">Featured</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-amber-500/20">
              <div className="text-2xl font-bold text-amber-400">{new Set(imageDatabase.flatMap(img => img.tags)).size}</div>
              <div className="text-gray-400 text-sm">Unique Tags</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/5 rounded-lg p-6 border border-amber-500/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">Search Images</label>
              <input
                type="text"
                placeholder="Search by title, description, tags..."
                className="w-full px-4 py-2 bg-gray-500/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none transition-colors duration-200"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyUp={handleFilter}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">Category</label>
              <select
                className="w-full px-4 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none transition-colors duration-200"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ color: 'white' }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-colors duration-200 border border-gray-500/30"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredImages.length} of {imageDatabase.length} images
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Image Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white/5 rounded-lg overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  
                  {/* Featured Badge */}
                  {image.featured && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/70 text-amber-300 text-xs px-2 py-1 rounded font-medium">
                      {image.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                    {image.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                    {image.description}
                  </p>
                  
                  {/* Date and Location */}
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    <span>{new Date(image.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).replace(/\//g, '-')}</span>
                    {image.location && (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" clipRule="evenodd" />
                        </svg>
                        {image.location}
                      </span>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded hover:bg-amber-500/30 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded">
                        +{image.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Members */}
                  {image.members && image.members.length > 0 && (
                    <div className="text-xs text-gray-400">
                      <span className="font-medium text-amber-300">Members:</span> {image.members.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No images found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
