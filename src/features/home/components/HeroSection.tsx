/**
 * Hero Section Component with Search Suggestions
 * Main landing section with functional search bar
 */

'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '@/features/filters/store/filtersSlice';
import { useRestaurantSearch } from '@/shared/hooks/useRestaurantSearch';
import SearchBar from './SearchBar';
import bgMainpage from '@/assets/images/bg-mainpage.png';
import type { RootState } from '@/app/store';

const HeroSection: React.FC = () => {
  const dispatch = useDispatch();
  
  // Get search query from Redux state
  const searchQuery = useSelector(
    (state: RootState) => state.filters.searchQuery
  );

  // Use the search hook to get suggestions
  const { suggestions, isLoading } = useRestaurantSearch(searchQuery);

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return (
    <div className='relative h-[648px] md:hero-height' style={{ zIndex: 1 }}>
      {/* Background Image */}
      <div
        className='absolute -top-16 md:-top-20 left-0 right-0 bottom-0 bg-cover bg-no-repeat'
        style={{
          backgroundImage: `url(${bgMainpage.src})`,
          backgroundPosition: 'center top 64px',
        }}
      />

      {/* Gradient Overlay */}
      <div
        className='absolute -top-16 md:-top-20 left-0 right-0 bottom-0'
        style={{ 
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Hero Content */}
      <div
        className='relative flex flex-col items-center justify-center h-full px-4'
        style={{ zIndex: 3 }}
      >
        <div className='text-center max-w-[349px] md:max-w-4xl'>
          <h1 className='text-[36px] md:text-display-2xl text-white mb-1 md:mb-2 leading-[44px] md:leading-tight font-nunito font-extrabold'>
            Explore Culinary Experiences
          </h1>
          <p className='text-[18px] md:text-display-xs text-white mb-6 md:mb-10 leading-[32px] md:leading-[36px] font-nunito font-bold tracking-[-0.03em]'>
            Search and refine your choice to discover the perfect restaurant.
          </p>

          {/* Search Bar with Suggestions */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            suggestions={suggestions}
            isLoading={isLoading}
            showSuggestions={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
