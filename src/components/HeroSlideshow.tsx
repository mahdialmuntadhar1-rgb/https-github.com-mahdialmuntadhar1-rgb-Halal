import React, { useState, useEffect } from 'react';
import { HeroImage } from '../types';

interface HeroSlideshowProps {
  images: HeroImage[];
  intervalMs?: number;
}

export default function HeroSlideshow({ images, intervalMs = 4500 }: HeroSlideshowProps) {
  const activeImages = images.filter(img => img.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (activeImages.length <= 1) return;

    const timer = setInterval(() => {
      // Fade out
      setFadeState('out');
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
        setFadeState('in');
      }, 800); // match fade transition duration
      
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeImages.length, intervalMs]);

  // Handle empty state gracefully
  if (activeImages.length === 0) {
    return (
      <div className="w-full h-48 sm:h-80 md:h-[400px] bg-stone-100 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center border border-dashed border-stone-300">
        <p className="text-stone-400 text-xs font-mono">No active slide images provided. Upload in Admin tab.</p>
      </div>
    );
  }

  const currentImage = activeImages[currentIndex];

  return (
    <div 
      className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-stone-100 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm border border-white/40 transition-shadow duration-300 hover:shadow-md"
      id="hero-slideshow-container"
    >
      <img
        src={currentImage?.url}
        alt={currentImage?.title || 'Halal Matchmaking Slideshow'}
        className={`w-full h-full object-cover select-none transition-opacity duration-700 ease-in-out ${
          fadeState === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
        referrerPolicy="no-referrer"
        loading="eager"
      />
      
      {/* Safe bottom dots to let users see paging in an elegant, minimal way */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 p-1.5 bg-black/10 backdrop-blur-md rounded-full pointer-events-none">
          {activeImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4.5 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
