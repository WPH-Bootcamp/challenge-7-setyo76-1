import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import redLogo from '@/assets/images/red-logo.png';
import facebookIcon from '@/assets/images/facebook-icon.svg';
import instagramIcon from '@/assets/images/instagram-icon.svg';
import linkedinIcon from '@/assets/images/linkedin-icon.svg';
import tiktokIcon from '@/assets/images/tiktok-icon.svg';

interface FooterProps {
  // Props kept for backward compatibility but not used
  onCategoryClick?: (category: string) => void;
  onScrollToCategories?: () => void;
}

const Footer: React.FC<FooterProps> = () => {
  const router = useRouter();

  const handleCategoryClick = (filter: string | null) => {
    if (filter === null || filter === 'all') {
      // "All Food" goes to /category/all
      router.push('/category/all');
    } else {
      // Other categories go to /category/all with filter parameter
      router.push(`/category/all?filter=${filter}`);
    }
  };

  const handleHelpClick = (helpItem: string) => {
    switch (helpItem) {
      case 'How to Order':
        router.push('/category/all');
        break;
      case 'Payment Methods':
        router.push('/checkout');
        break;
      case 'Track My Order':
        router.push('/profile?tab=orders');
        break;
      case 'FAQ':
        // You can add FAQ page route here when available
        router.push('/category/all');
        break;
      case 'Contact Us':
        // You can add Contact page route here when available
        router.push('/category/all');
        break;
      default:
        break;
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: facebookIcon, url: 'https://facebook.com' },
    { name: 'Instagram', icon: instagramIcon, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: linkedinIcon, url: 'https://linkedin.com' },
    { name: 'TikTok', icon: tiktokIcon, url: 'https://tiktok.com' },
  ];

  const exploreItems = [
    { name: 'All Food', filter: null },
    { name: 'Nearby', filter: 'nearby' },
    { name: 'Discount', filter: 'discount' },
    { name: 'Best Seller', filter: 'bestseller' },
    { name: 'Delivery', filter: 'delivery' },
    { name: 'Lunch', filter: 'lunch' },
  ];

  const helpItems = [
    'How to Order',
    'Payment Methods',
    'Track My Order',
    'FAQ',
    'Contact Us',
  ];

  return (
    <footer className='bg-[#0A0D12] text-white py-10 md:py-20 px-4 md:px-30'>
      <div className='max-w-[393px] md:max-w-6xl mx-auto'>
        <div className='flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-16'>
          {/* Company Info */}
          <div className='space-y-6 md:space-y-10'>
            {/* Logo */}
            <button
              onClick={() => router.push('/')}
              className='flex items-center gap-4 group cursor-pointer bg-transparent border-none p-0 transition-transform duration-200 hover:scale-105'
            >
              <div className='relative w-10 h-10 md:w-10 md:h-10'>
                <Image
                  src={redLogo}
                  alt='Foody Logo'
                  fill
                  className='object-contain'
                  sizes='40px'
                />
              </div>
              <span className='text-2xl md:text-display-md text-white font-nunito font-extrabold leading-[42px] group-hover:text-red-500 transition-colors duration-200'>
                Foody
              </span>
            </button>

            {/* Description */}
            <p className='text-sm md:text-md-regular text-[#FDFDFD] leading-7 md:leading-relaxed font-nunito font-normal tracking-[-0.02em] max-w-[361px]'>
              Enjoy homemade flavors & {`chef's`} signature dishes, freshly
              prepared every day. Order online or visit our nearest branch.
            </p>

            {/* Social Media */}
            <div className='space-y-4'>
              <h4 className='text-sm md:text-md-extrabold text-[#FDFDFD] font-nunito font-bold leading-7'>
                Follow on Social Media
              </h4>
              <div className='flex gap-3'>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 border border-[#252B37] rounded-full flex items-center justify-center hover:bg-red-500 hover:border-red-500 cursor-pointer transition-all duration-300 hover:scale-110 group'
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className='w-5 h-5 transition-transform duration-300 group-hover:scale-110'
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Sections Container */}
          <div className='flex flex-row gap-6 md:contents'>
            {/* Explore Menu */}
            <div className='space-y-4 md:space-y-5 flex-1'>
              <h4 className='text-sm md:text-md-extrabold text-[#FDFDFD] font-nunito font-extrabold leading-7'>
                Explore
              </h4>
              <div className='space-y-3'>
                {exploreItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleCategoryClick(item.filter)}
                    className='block text-sm md:text-md-regular text-[#FDFDFD] hover:text-red-500 text-left transition-all duration-200 font-nunito font-normal leading-7 tracking-[-0.02em] cursor-pointer bg-transparent border-none p-0 hover:translate-x-1 w-full group'
                  >
                    <span className='inline-block group-hover:scale-105 transition-transform duration-200'>
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Help Menu */}
            <div className='space-y-4 md:space-y-5 flex-1'>
              <h4 className='text-sm md:text-md-extrabold text-[#FDFDFD] font-nunito font-extrabold leading-7'>
                Help
              </h4>
              <div className='space-y-3'>
                {helpItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleHelpClick(item)}
                    className='block text-sm md:text-md-regular text-[#FDFDFD] hover:text-red-500 text-left transition-all duration-200 font-nunito font-normal leading-7 tracking-[-0.02em] cursor-pointer bg-transparent border-none p-0 hover:translate-x-1 w-full group'
                  >
                    <span className='inline-block group-hover:scale-105 transition-transform duration-200'>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
