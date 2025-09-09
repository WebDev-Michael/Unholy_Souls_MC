import React, { useState, useEffect, useCallback } from "react";
import { galleryAPI } from "../services/api";

function Gallery() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to sort images: featured first, then by date
  const sortImages = (imagesArray) => {
    return [...imagesArray].sort((a, b) => {
      // Check featured status - handle both 'featured' and 'isFeatured' fields
      const aFeatured = Boolean(a.featured || a.isFeatured);
      const bFeatured = Boolean(b.featured || b.isFeatured);
      
      // First, sort by featured status (featured images first)
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      
      // If both have same featured status, sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    });
  };

  // Load images and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [imagesData, categoriesData] = await Promise.all([
          galleryAPI.getAll(),
          galleryAPI.getCategories()
        ]);
        
        // Sort images: featured images first, then by date (newest first)
        const sortedImages = sortImages(imagesData);
        
        setImages(sortedImages);
        setCategories(categoriesData);
        setFilteredImages(sortedImages);
        setError(null);
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search images
  const handleFilter = useCallback(() => {
    let filtered = images;

    // Apply category filter first
    if (selectedCategory !== "all") {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    // Apply search filter to the already filtered results
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchLower) ||
        img.description.toLowerCase().includes(searchLower) ||
        (img.tags && Array.isArray(img.tags) && img.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        (img.location && img.location.toLowerCase().includes(searchLower)) ||
        (img.members && Array.isArray(img.members) && img.members.some(member => member.toLowerCase().includes(searchLower)))
      );
    }

    // Sort images: featured images first, then by date (newest first)
    const sortedFiltered = sortImages(filtered);

    setFilteredImages(sortedFiltered);
  }, [images, selectedCategory, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setFilteredImages(images);
  };

  // Open modal with selected image
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Apply filters whenever images, selectedCategory, or searchTerm changes
  useEffect(() => {
    handleFilter();
  }, [images, selectedCategory, searchTerm]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Navigate to next image
  const nextImage = () => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  // Navigate to previous image
  const previousImage = () => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };

  // Handle arrow key navigation
  useEffect(() => {
    const handleArrowKeys = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        previousImage();
      }
    };

    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, [isModalOpen, selectedImage, filteredImages]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-black/50 rounded-2xl border border-amber-500/30 p-6 sm:p-8 lg:p-12 shadow-2xl mb-6 sm:mb-8">
          <div className="mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight text-center">
            Gallery
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-amber-300 mb-6 sm:mb-8 font-medium text-center">
            Unholy Souls MC Memories
          </p>

          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto text-center px-4">
            Explore our collection of photos and memories from the Unholy Souls MC. 
            From epic rides to unforgettable brotherhood moments, every image tells a story.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
                          <div className="text-xl sm:text-2xl font-bold text-amber-400">{images.length}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Total Images</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{categories.length - 1}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Categories</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-400">{images.filter(img => img.featured || img.isFeatured).length}</div>
              <div className="text-gray-400 text-xs sm:text-sm">Featured</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-500/20">
                          <div className="text-xl sm:text-2xl font-bold text-amber-400">{new Set(images.flatMap(img => img.tags)).size}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Unique Tags</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-gray-700/60 rounded-lg p-4 sm:p-6 border border-amber-500/20 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-amber-300 text-xs sm:text-sm font-medium mb-2">Search Images</label>
              <input
                type="text"
                placeholder="Search by title, description, tags..."
                className="w-full px-3 sm:px-4 py-2 bg-gray-500/60 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500/50 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-amber-300 text-xs sm:text-sm font-medium mb-2">Category</label>
              <select
                className="w-full px-3 sm:px-4 py-2 bg-gray-700/60 border border-amber-500/30 rounded-lg text-white focus:border-amber-500/50 focus:outline-none transition-colors duration-200 text-sm sm:text-base"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{ color: 'white' }}
              >
                <option value="all">All Categories</option>
                {categories.map((categoryObj, index) => (
                  <option key={index} value={categoryObj.category}>
                    {categoryObj.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 sm:px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-colors duration-200 border border-gray-500/30 text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-400 text-sm sm:text-base">
            Showing {filteredImages.length} of {images.length} images
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Image Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="bg-gray-700/60 rounded-lg overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(image)}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  
                  {/* Featured Badge */}
                  {(image.featured || image.isFeatured) && (
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
                <div className="p-3 sm:p-4">
                  <h3 className="text-white font-semibold mb-2 text-base sm:text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                    {image.title}
                  </h3>
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
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
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No images found</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800/95 rounded-2xl border border-amber-500/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-700/50">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedImage.title}</h2>
              
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image with Navigation Arrows */}
              <div className="relative mb-6">
                {/* Previous Arrow */}
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-amber-600 p-3 rounded-full transition-all duration-200 z-10 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-amber-600 p-3 rounded-full transition-all duration-200 z-10 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image */}
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-600/50"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-amber-600 mb-3">Description</h3>
                <p className="text-amber-600 text-base leading-relaxed">{selectedImage.description}</p>
              </div>

              {/* Navigation Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-sm text-gray-400">
                  {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} of {filteredImages.length}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-700/50">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
