'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Send, Users, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
    photos: string[];
  };
}

export default function RoomChatPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRoom();
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRoom = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setRoom(data);
    } catch (error) {
      console.error('Error loading room:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/messages`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{room?.name}</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{room?.memberCount || 0} members</span>
              </div>
            </div>
          </div>
          <button className="p-2">
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 overflow-hidden">
              {message.user?.photos?.[0] ? (
                <img src={message.user.photos[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {message.user?.name?.[0] || '?'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">{message.user?.name || 'User'}</span>
                <span className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                <p className="text-sm text-gray-800">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full outline-none text-sm"
          />
          <button
            onClick={sendMessage}
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
