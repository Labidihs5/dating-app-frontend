/**
 * API Services - Frontend integration layer for backend
 * Replace these with actual API calls to your Node.js/Prisma backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// User Profile Services
export const userAPI = {
  getProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (userId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  uploadPhoto: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/users/${userId}/photos`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },
};

// Location Services
export const locationAPI = {
  updateLocation: async (userId: string, locationData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    });
    return response.json();
  },

  getLocation: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/location`);
    return response.json();
  },

  toggleHideExactLocation: async (userId: string, hide: boolean) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/location/privacy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hideExactLocation: hide }),
    });
    return response.json();
  },

  searchByDistance: async (latitude: number, longitude: number, maxDistance: number, filters?: any) => {
    const query = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      maxDistance: maxDistance.toString(),
      ...filters,
    });
    const response = await fetch(`${API_BASE_URL}/profiles/nearby?${query}`);
    return response.json();
  },

  geocodeCity: async (city: string, country?: string) => {
    const query = new URLSearchParams({
      city,
      ...(country && { country }),
    });
    const response = await fetch(`${API_BASE_URL}/location/geocode?${query}`);
    return response.json();
  },
};

// Discovery/Swipe Services
export const discoveryAPI = {
  getProfiles: async (filters?: any) => {
    const query = new URLSearchParams(filters || {});
    const response = await fetch(`${API_BASE_URL}/profiles?${query}`);
    return response.json();
  },

  like: async (profileId: string, senderId: string) => {
    const response = await fetch(`${API_BASE_URL}/interactions/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, targetProfileId: profileId }),
    });
    return response.json();
  },

  pass: async (profileId: string) => {
    const response = await fetch(`${API_BASE_URL}/interactions/pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetProfileId: profileId }),
    });
    return response.json();
  },

  superLike: async (profileId: string) => {
    const response = await fetch(`${API_BASE_URL}/interactions/super-like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetProfileId: profileId }),
    });
    return response.json();
  },
};

// Matches Services
export const matchesAPI = {
  getMatches: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/matches?userId=${userId}`);
    return response.json();
  },

  getMatch: async (matchId: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`);
    return response.json();
  },

  unmatch: async (matchId: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Likes Services
export const likesAPI = {
  getLikes: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/likes?userId=${userId}`);
    return response.json();
  },

  respondToLike: async (likeId: string, accept: boolean, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/likes/${likeId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accept, userId }),
    });
    return response.json();
  },
};

// Messages Services
export const messagesAPI = {
  getConversation: async (matchId: string, userId?: string) => {
    const url = userId 
      ? `${API_BASE_URL}/messages/${matchId}?userId=${userId}`
      : `${API_BASE_URL}/messages/${matchId}`;
    const response = await fetch(url);
    return response.json();
  },

  sendMessage: async (matchId: string, content: string, senderId: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${matchId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, senderId }),
    });
    return response.json();
  },

  markAsRead: async (messageIds: string[]) => {
    const response = await fetch(`${API_BASE_URL}/messages/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageIds }),
    });
    return response.json();
  },
};

// Subscription/Gold Services
export const subscriptionAPI = {
  getStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/subscription/status`);
    return response.json();
  },

  createCheckoutSession: async (planId: string) => {
    const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    return response.json();
  },

  cancelSubscription: async () => {
    const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
      method: 'POST',
    });
    return response.json();
  },
};

// Auth Services
export const authAPI = {
  login: async (phone: string, code: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    return response.json();
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Telegram Bot Services
export const telegramAPI = {
  initializeMiniApp: async (initData: string) => {
    const response = await fetch(`${API_BASE_URL}/telegram/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });
    return response.json();
  },

  notifyMatch: async (matchId: string) => {
    const response = await fetch(`${API_BASE_URL}/telegram/notify/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId }),
    });
    return response.json();
  },

  notifyMessage: async (matchId: string) => {
    const response = await fetch(`${API_BASE_URL}/telegram/notify/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId }),
    });
    return response.json();
  },
};
