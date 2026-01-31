/**
 * SearchBar Component with Autocomplete Suggestions
 * Displays search input with dropdown suggestions
 * Enhanced with modern, attractive card design
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star, Loader2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Restaurant } from '@/shared/types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  suggestions?: Restaurant[];
  isLoading?: boolean;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search restaurants, food and drink',
  suggestions = [],
  isLoading = false,
  showSuggestions = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when typing
  useEffect(() => {
    if (showSuggestions && searchQuery.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchQuery, showSuggestions]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    onSearchChange(restaurant.name);
    setIsOpen(false);
    // Navigate to restaurant detail page or category page with search
    router.push(`/category?search=${encodeURIComponent(restaurant.name)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectRestaurant(suggestions[highlightedIndex]);
        } else if (searchQuery.trim()) {
          // Navigate to category page with search query
          setIsOpen(false);
          router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div ref={wrapperRef} className='relative w-full'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center bg-white rounded-full px-4 py-2 md:px-6 md:py-3 w-full md:max-w-2xl mx-auto h-12 md:h-auto shadow-sm hover:shadow-md transition-shadow duration-200'>
          <Search className='w-5 h-5 md:w-5 md:h-5 text-gray-500 mr-1.5 md:mr-3 flex-shrink-0' />
          <input
            type='text'
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
            className='flex-1 text-gray-600 placeholder-gray-500 outline-none text-sm md:text-md-regular font-nunito font-normal leading-7 tracking-[-0.02em]'
            autoComplete='off'
          />
          {isLoading && (
            <Loader2 className='w-5 h-5 text-red-500 animate-spin ml-2' />
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && (
        <div 
          className='absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 max-h-[480px] overflow-y-auto backdrop-blur-xl'
          style={{
            animation: 'slideDown 0.2s ease-out',
          }}
        >
          <style jsx>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {isLoading ? (
            <div className='px-6 py-12 text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-4'>
                <Loader2 className='w-8 h-8 text-red-500 animate-spin' />
              </div>
              <p className='text-base font-semibold text-gray-900 mb-1'>Searching for restaurants...</p>
              <p className='text-sm text-gray-500'>Finding the best matches for you</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {/* Header */}
              <div className='px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100'>
                <div className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                  <TrendingUp className='w-4 h-4 text-red-500' />
                  <span>Top Results</span>
                  <span className='ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full'>
                    {suggestions.length} found
                  </span>
                </div>
              </div>

              {/* Results */}
              <ul className='py-2'>
                {suggestions.map((restaurant, index) => (
                  <li key={restaurant.id}>
                    <button
                      type='button'
                      onClick={() => handleSelectRestaurant(restaurant)}
                      className={`w-full px-6 py-4 text-left transition-all duration-200 group ${
                        highlightedIndex === index 
                          ? 'bg-gradient-to-r from-red-50 to-orange-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center gap-4'>
                        {/* Restaurant Image */}
                        <div className='relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200'>
                          {restaurant.imageUrl ? (
                            <img
                              src={restaurant.imageUrl}
                              alt={restaurant.name}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-400'>
                              <Search className='w-7 h-7' />
                            </div>
                          )}
                          
                          {/* Overlay gradient on hover */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                        </div>

                        {/* Restaurant Info */}
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-bold text-gray-900 text-base mb-1.5 truncate group-hover:text-red-600 transition-colors duration-200'>
                            {restaurant.name}
                          </h4>
                          
                          {/* Rating and Distance */}
                          <div className='flex items-center gap-3 mb-1.5'>
                            {restaurant.rating && (
                              <div className='flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-lg'>
                                <Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
                                <span className='text-sm font-semibold text-yellow-700'>
                                  {restaurant.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                            {restaurant.distance && (
                              <div className='flex items-center gap-1.5 text-gray-600'>
                                <MapPin className='w-3.5 h-3.5' />
                                <span className='text-sm font-medium'>
                                  {restaurant.distance.toFixed(1)} km
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Address */}
                          {restaurant.address && (
                            <p className='text-xs text-gray-500 truncate font-medium'>
                              {restaurant.address}
                            </p>
                          )}
                        </div>

                        {/* Hover indicator */}
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                          <div className='w-8 h-8 rounded-full bg-red-500 flex items-center justify-center'>
                            <Search className='w-4 h-4 text-white' />
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : searchQuery.length >= 2 ? (
            <div className='px-6 py-12 text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4'>
                <Search className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-base font-semibold text-gray-900 mb-1'>No restaurants found</p>
              <p className='text-sm text-gray-500'>Try searching with different keywords</p>
            </div>
          ) : null}

          {/* View All Results Footer */}
          {suggestions.length > 0 && (
            <div className='border-t border-gray-100 px-6 py-4 bg-gradient-to-r from-white to-gray-50'>
              <button
                type='button'
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
                }}
                className='w-full text-center py-3 px-4 rounded-xl font-semibold text-red-600 hover:text-white bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 border-2 border-red-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md'
              >
                View all results for "{searchQuery}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
