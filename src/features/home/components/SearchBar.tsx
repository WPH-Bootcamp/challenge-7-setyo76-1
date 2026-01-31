/**
 * SearchBar Component with Autocomplete Suggestions
 * Displays search input with dropdown suggestions
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
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
        <div className='flex items-center bg-white rounded-full px-4 py-2 md:px-6 md:py-3 w-full md:max-w-2xl mx-auto h-12 md:h-auto shadow-sm'>
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
            <Loader2 className='w-5 h-5 text-gray-400 animate-spin ml-2' />
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='px-4 py-8 text-center text-gray-500'>
              <Loader2 className='w-6 h-6 animate-spin mx-auto mb-2' />
              <p className='text-sm'>Searching restaurants...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className='py-2'>
              {suggestions.map((restaurant, index) => (
                <li key={restaurant.id}>
                  <button
                    type='button'
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      highlightedIndex === index ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      {/* Restaurant Image */}
                      <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100'>
                        {restaurant.imageUrl ? (
                          <img
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>
                            <Search className='w-6 h-6' />
                          </div>
                        )}
                      </div>

                      {/* Restaurant Info */}
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-semibold text-gray-900 text-sm truncate'>
                          {restaurant.name}
                        </h4>
                        <div className='flex items-center gap-2 mt-1 text-xs text-gray-500'>
                          {restaurant.rating && (
                            <span className='flex items-center gap-1'>
                              <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                              {restaurant.rating.toFixed(1)}
                            </span>
                          )}
                          {restaurant.distance && (
                            <span className='flex items-center gap-1'>
                              <MapPin className='w-3 h-3' />
                              {restaurant.distance.toFixed(1)} km
                            </span>
                          )}
                        </div>
                        {restaurant.address && (
                          <p className='text-xs text-gray-400 mt-1 truncate'>
                            {restaurant.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchQuery.length >= 2 ? (
            <div className='px-4 py-8 text-center text-gray-500'>
              <Search className='w-8 h-8 mx-auto mb-2 text-gray-300' />
              <p className='text-sm'>No restaurants found</p>
              <p className='text-xs text-gray-400 mt-1'>
                Try a different search term
              </p>
            </div>
          ) : null}

          {/* View All Results Link */}
          {suggestions.length > 0 && (
            <div className='border-t border-gray-100 px-4 py-3 bg-gray-50'>
              <button
                type='button'
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
                }}
                className='w-full text-center text-sm text-red-500 hover:text-red-600 font-medium transition-colors'
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
