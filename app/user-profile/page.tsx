'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Settings, MoreVertical, Heart, MessageCircle, Star } from 'lucide-react';

export default function UserProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'top' | 'recent' | 'short'>('top');
  const [showMenu, setShowMenu] = useState(false);

  const profile = {
    name: 'Sarah Payne',
    username: '@sarah_payne',
    followers: '103k',
    avatar: '/placeholder-user.jpg',
    photos: Array(9).fill('/placeholder.jpg'),
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', onClick: () => router.push('/settings') },
    { icon: Heart, label: 'Your Activity', badge: '1' },
    { icon: Star, label: 'Archives', badge: '1' },
    { icon: MessageCircle, label: 'Saved', badge: '1' },
    { icon: Heart, label: 'Close Friends', badge: '1' },
    { icon: Star, label: 'Favorites', badge: '1' },
    { icon: Settings, label: 'Group profiles', badge: '1' },
    { icon: Heart, label: 'Discover people', badge: '1' },
  ];

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md min-h-screen">
          <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <button onClick={() => setShowMenu(false)} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">{profile.name}</h1>
            <button className="p-2">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors mb-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-sm text-gray-500">{item.badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button onClick={() => router.push('/')} className="p-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button className="p-3">
                <Heart className="w-6 h-6 text-gray-400" />
              </button>
              <button onClick={() => router.push('/explore')} className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button className="p-3">
                <MessageCircle className="w-6 h-6 text-gray-400" />
              </button>
              <button className="p-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white overflow-hidden">
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md min-h-screen">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => setShowMenu(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <button className="p-2">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.username}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{profile.followers} Followers</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors">
              Edit Profile
            </button>
            <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors">
              Share Profile
            </button>
          </div>

          <div className="flex gap-1 border-b border-gray-200 mb-4">
            {(['top', 'recent', 'short'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold capitalize ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1">
            {profile.photos.map((photo, idx) => (
              <div key={idx} className="aspect-square bg-gray-200 rounded-sm overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button onClick={() => router.push('/')} className="p-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            <button className="p-3">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
            <button onClick={() => router.push('/explore')} className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="p-3">
              <MessageCircle className="w-6 h-6 text-gray-400" />
            </button>
            <button className="p-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-600 overflow-hidden">
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
