'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLanguage, languageMeta, translate, type LanguageCode } from '@/lib/i18n';
import { getTelegramUser } from '@/lib/telegram-utils';

const STORAGE_KEY = 'hm_language';

type I18nContextValue = {
  language: LanguageCode;
  dir: 'ltr' | 'rtl';
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isReady: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const getInitialLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return defaultLanguage;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') return stored;
  return defaultLanguage;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);
  const [isReady, setIsReady] = useState(false);

  const applyLanguage = useCallback((lang: LanguageCode) => {
    if (typeof document === 'undefined') return;
    const dir = languageMeta[lang]?.dir || 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  useEffect(() => {
    applyLanguage(language);
  }, [applyLanguage, language]);

  useEffect(() => {
    const user = getTelegramUser();
    if (!user?.id) {
      setIsReady(true);
      return;
    }

    const loadSettings = async () => {
      try {
        const res = await fetch(`/api/settings/${user.id}`);
        const data = await res.json();
        const lang = data?.language as LanguageCode | undefined;
        if (lang === 'en' || lang === 'ar') {
          setLanguageState(lang);
        }
      } catch (error) {
        console.error('Error loading language settings:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadSettings();
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      dir: languageMeta[language]?.dir || 'ltr',
      setLanguage,
      t: (key, params) => translate(language, key, params),
      isReady,
    };
  }, [language, isReady, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within LanguageProvider');
  }
  return ctx;
}
