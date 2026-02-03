export interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function getTelegramUser(): TelegramUser | null {
  if (typeof window === 'undefined') return null;
  
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.initDataUnsafe?.user) {
    tg.ready();
    return {
      ...tg.initDataUnsafe.user,
      id: tg.initDataUnsafe.user.id.toString()
    };
  }
  
  // Check localStorage for saved name
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    return {
      id: savedName,
      first_name: savedName,
      username: savedName
    };
  }
  
  // DEV: Return test user if no Telegram
  return {
    id: '1',
    first_name: 'Test User',
    username: 'testuser'
  };
}

export function saveUserName(name: string) {
  localStorage.setItem('userName', name);
}
