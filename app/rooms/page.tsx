'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Lock, Globe, Heart, MessageCircle, Plus } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  memberCount: number;
  ageRestriction: number;
  isSystemRoom: boolean;
}

export default function RoomsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All', icon: Globe },
    { id: 'RESPECT', label: 'Respect', icon: Heart },
    { id: 'SERIOUS', label: 'Serious', icon: Users },
    { id: 'ADULT', label: 'Adult 18+', icon: Lock },
    { id: 'FUN', label: 'Fun', icon: MessageCircle },
    { id: 'CITY', label: 'City', icon: Globe },
  ];

  useEffect(() => {
    loadRooms();
  }, [selectedCategory]);

  const loadRooms = async () => {
    try {
      const response = await fetch('/api/rooms', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesCategory = selectedCategory === 'ALL' || room.category === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-24">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <button className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search rooms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl outline-none text-sm"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => router.push(`/rooms/${room.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{room.name}</h3>
                    {room.type === 'PRIVATE' && <Lock className="w-4 h-4 text-gray-400" />}
                    {room.ageRestriction >= 18 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                        18+
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.memberCount || 0} members</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">
                    {room.category}
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No rooms found</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3">
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
