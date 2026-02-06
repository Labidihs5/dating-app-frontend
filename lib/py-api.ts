const PY_API_URL = process.env.NEXT_PUBLIC_PY_API_URL || 'http://localhost:8001';
const NODE_API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const isLoopbackUrl = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);

async function jsonFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const shouldProxy =
    typeof window !== 'undefined' &&
    isLoopbackUrl(PY_API_URL) &&
    !isLoopbackUrl(window.location.origin);
  const primaryBase = shouldProxy ? '/api' : PY_API_URL;

  try {
    const res = await fetch(`${primaryBase}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Request failed');
    }
    return res.json();
  } catch (err) {
    // If a Python API URL is configured, don't silently fall back to Node.
    // This prevents hitting non-existent Node routes like /api/ai/*.
    if (!NODE_API_URL || PY_API_URL || shouldProxy) {
      throw err;
    }
    const base = NODE_API_URL.replace(/\/$/, '');
    const apiBase = base.endsWith('/api') ? base : `${base}/api`;
    const res = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Request failed');
    }
    return res.json();
  }
}

export const aiAPI = {
  generateMessage: (payload: any) => jsonFetch('/ai/generate_message', { method: 'POST', body: JSON.stringify(payload) }),
  suggestReply: (payload: any) => jsonFetch('/ai/suggest_reply', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeTone: (payload: any) => jsonFetch('/ai/analyze_tone', { method: 'POST', body: JSON.stringify(payload) }),
  translateMessage: (payload: any) => jsonFetch('/ai/translate_message', { method: 'POST', body: JSON.stringify(payload) }),
  createProfile: (payload: any) => jsonFetch('/ai/create_profile', { method: 'POST', body: JSON.stringify(payload) }),
  getProfiles: () => jsonFetch('/ai/profiles'),
  eligibilityCheck: (payload: any) => jsonFetch('/ai/eligibility_check', { method: 'POST', body: JSON.stringify(payload) }),
  proposeMatch: (payload: any) => jsonFetch('/ai/propose_match', { method: 'POST', body: JSON.stringify(payload) }),
};

export const gamesAPI = {
  create: (payload: any) => jsonFetch('/games/create', { method: 'POST', body: JSON.stringify(payload) }),
  move: (payload: any) => jsonFetch('/games/move', { method: 'POST', body: JSON.stringify(payload) }),
  state: (gameId: string) => jsonFetch(`/games/state?game_id=${encodeURIComponent(gameId)}`),
  challengeGenerate: (payload: any) => jsonFetch('/games/challenge_generate', { method: 'POST', body: JSON.stringify(payload) }),
  chessMatchmake: (payload: any) => jsonFetch('/games/chess/matchmake', { method: 'POST', body: JSON.stringify(payload) }),
  chessMove: (payload: any) => jsonFetch('/games/chess/move', { method: 'POST', body: JSON.stringify(payload) }),
  chessAIMove: (payload: any) => jsonFetch('/games/chess/ai_move', { method: 'POST', body: JSON.stringify(payload) }),
};

export const chessAPI = {
  analyze: (payload: any) => jsonFetch('/chess/analyze', { method: 'POST', body: JSON.stringify(payload) }),
  aiMove: (payload: any) => jsonFetch('/chess/ai_move', { method: 'POST', body: JSON.stringify(payload) }),
};

export const challengesAPI = {
  generate: (payload: any) => jsonFetch('/challenges/generate', { method: 'POST', body: JSON.stringify(payload) }),
};

export const roomsAPI = {
  list: () => jsonFetch('/rooms'),
  create: (payload: any) => jsonFetch('/rooms/create', { method: 'POST', body: JSON.stringify(payload) }),
  join: (payload: any) => jsonFetch('/rooms/join', { method: 'POST', body: JSON.stringify(payload) }),
  message: (payload: any) => jsonFetch('/rooms/message', { method: 'POST', body: JSON.stringify(payload) }),
  messages: (roomId: string) => jsonFetch(`/rooms/messages?room_id=${encodeURIComponent(roomId)}`),
};

export const presenceAPI = {
  online: (userId: string) => jsonFetch(`/presence/online?user_id=${encodeURIComponent(userId)}`, { method: 'POST' }),
  offline: (userId: string) => jsonFetch(`/presence/offline?user_id=${encodeURIComponent(userId)}`, { method: 'POST' }),
};
