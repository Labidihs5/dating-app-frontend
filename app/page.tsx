'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, X, Star, ChevronLeft } from 'lucide-react';
import { discoveryAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';

interface Profile {
  id: string;
  name: string;
  age: number;
  distance?: number;
  photos: string[];
  bio?: string;
  gender: string;
  preferences?: any;
  profilePhotoIndex?: number;
}

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id.toString());
      loadProfiles(user.id.toString());
    }
  }, []);

  const loadProfiles = async (currentUserId: string) => {
    try {
      setLoading(true);
      const data = await discoveryAPI.getProfiles({ userId: currentUserId });
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleSwipeLeft = async () => {
    try {
      await discoveryAPI.pass(currentProfile.id);
    } catch (error) {
      console.error('Error passing profile:', error);
    }
    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
    setCurrentPhotoIndex(0);
  };

  const handleSwipeRight = async () => {
    try {
      if (userId) {
        const result = await discoveryAPI.like(currentProfile.id, userId);
        if (result.isMatch) {
          alert(`It's a match with ${currentProfile.name}!`);
        }
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }
    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
    setCurrentPhotoIndex(0);
  };

  const handleSuperLike = async () => {
    try {
      await discoveryAPI.superLike(currentProfile.id);
    } catch (error) {
      console.error('Error super liking profile:', error);
    }
    setProfiles(profiles.filter((_, idx) => idx !== currentIndex));
    setCurrentPhotoIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No more profiles</h2>
          <button onClick={() => userId && loadProfiles(userId)} className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {currentProfile.photos.map((_, idx) => (
              <div key={idx} className={`flex-1 h-1 rounded-full ${idx === currentPhotoIndex ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>

          <img 
            src={`/api/photos?path=${encodeURIComponent(currentProfile.photos[currentPhotoIndex])}`}
            alt={currentProfile.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">{currentProfile.name}, {currentProfile.age}</h2>
            {currentProfile.distance && (
              <p className="text-sm text-white/90 mb-2">{currentProfile.distance} kilometers away</p>
            )}
          </div>

          <button onClick={() => router.back()} className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={handleSwipeLeft} className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <X className="w-7 h-7 text-red-500" />
          </button>
          
          <button onClick={handleSuperLike} className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <Star className="w-8 h-8 text-white fill-white" />
          </button>
          
          <button onClick={handleSwipeRight} className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.push('/')} className="p-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <button onClick={() => router.push('/likes')} className="p-3">
            <Heart className="w-6 h-6 text-gray-400" />
          </button>
          <button onClick={() => router.push('/explore')} className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button onClick={() => router.push('/chat')} className="p-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button onClick={() => router.push('/user-profile')} className="p-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white overflow-hidden">
              <img src="/placeholder-user.jpg" alt="" className="w-full h-full object-cover" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
