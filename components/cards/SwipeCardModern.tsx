'use client';

import { useState } from 'react';
import { X, Star, Heart } from 'lucide-react';

interface SwipeCardModernProps {
  profile: {
    id: string;
    name: string;
    age: number;
    photos: string[];
    bio?: string;
    distance?: number;
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
}

export function SwipeCardModern({ profile, onSwipeLeft, onSwipeRight, onSuperLike }: SwipeCardModernProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  return (
    <div className="relative w-full h-full max-w-sm mx-auto">
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {profile.photos.map((_, idx) => (
          <div key={idx} className={`flex-1 h-1 rounded-full ${idx === currentPhotoIndex ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>

      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src={`/api/photos?path=${encodeURIComponent(profile.photos[currentPhotoIndex])}`}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-1">{profile.name}, {profile.age}</h2>
          {profile.distance && (
            <p className="text-sm text-white/80 mb-3">{profile.distance} kilometers away</p>
          )}
          {profile.bio && (
            <p className="text-sm text-white/90 line-clamp-2">{profile.bio}</p>
          )}
        </div>

        <button 
          onClick={() => {}}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div className="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-4">
        <button 
          onClick={onSwipeLeft}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X className="w-7 h-7 text-red-500" />
        </button>
        
        <button 
          onClick={onSuperLike}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Star className="w-8 h-8 text-white fill-white" />
        </button>
        
        <button 
          onClick={onSwipeRight}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
        </button>
      </div>
    </div>
  );
}
