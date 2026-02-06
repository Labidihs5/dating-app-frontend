'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { messagesAPI, userAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';
import { OnlineIndicator } from '@/components/status/OnlineIndicator';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { aiAPI } from '@/lib/py-api';
import { languageMeta } from '@/lib/i18n';
import { coachAvatarSvg } from '@/lib/ai-avatar';

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export default function ChatConversationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userId] = useState<string | null>(() => {
    const user = getTelegramUser();
    return user?.id || null;
  });
  const [userStatus, setUserStatus] = useState<{ isOnline: boolean; lastSeen?: string }>({ isOnline: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
  const lastMessageIdsRef = useRef<Set<string>>(new Set());
  const lastMessagesDataRef = useRef<string>('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(() => languageMeta[language]?.label || 'English');
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [bubblePos, setBubblePos] = useState({ x: 24, y: 180 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const movedRef = useRef(false);

  const bubbleSize = 64;
  const panelWidth = 280;
  const edgePadding = 12;

  const matchId = params.matchId as string;
  const matchName = searchParams.get('name') || t('common.user');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageContent = messages.length > 0 ? messages[messages.length - 1]?.content || '' : '';
  const coachAvatar = coachAvatarSvg({ gender: 'female', accent: '#7ACB5E' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    const maxX = Math.max(edgePadding, window.innerWidth - bubbleSize - edgePadding);
    const maxY = Math.max(120, window.innerHeight - bubbleSize - edgePadding);
    setBubblePos({ x: maxX, y: maxY });
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (!userId || !matchId) return;
    
    const fetchMessages = async () => {
      try {
        const data = await messagesAPI.getConversation(matchId, userId);
        const dataStr = JSON.stringify(data);
        
        // Only update if messages changed
        if (lastMessagesDataRef.current !== dataStr) {
          lastMessagesDataRef.current = dataStr;
          setMessages(data);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    fetchMessages();
    pollingIntervalRef.current = setInterval(fetchMessages, 2000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [matchId, userId]);
  
  useEffect(() => {
    if (!userId || !matchId) return;
    
    const fetchStatus = async () => {
      try {
        const matchRes = await fetch(`/api/matches/${matchId}`);
        if (!matchRes.ok) {
          return;
        }
        const matchText = await matchRes.text();
        if (!matchText) {
          return;
        }
        const match = JSON.parse(matchText);
        
        if (match?.user1?.id && match?.user2?.id) {
          const otherId = match.user1.id === userId ? match.user2.id : match.user1.id;
          const statusRes = await fetch(`/api/status/${otherId}`);
          if (!statusRes.ok) {
            return;
          }
          const statusText = await statusRes.text();
          if (!statusText) {
            return;
          }
          const status = JSON.parse(statusText);
          
          // Only update if status changed
          setUserStatus(prev => {
            if (prev.isOnline === status.isOnline && prev.lastSeen === status.lastSeen) return prev;
            return status;
          });
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [matchId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 && userId) {
      // Mark messages as read
      const unreadIds = messages
        .filter(msg => msg.senderId !== userId && !msg.isRead)
        .map(msg => msg.id);
      
      if (unreadIds.length > 0) {
        messagesAPI.markAsRead(unreadIds).catch(console.error);
      }
    }
    
    // Only scroll if new messages arrived
    if (messages.length > lastMessageCountRef.current) {
      scrollToBottom();
      lastMessageCountRef.current = messages.length;
    }
  }, [messages, userId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !matchId || !userId) return;

    try {
      const newMessage = await messagesAPI.sendMessage(matchId, inputValue, userId);
      setMessages([...messages, newMessage]);
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAnalyzeLastMessage = async () => {
    if (!lastMessageContent.trim() || !userId) return;
    setAnalyzing(true);
    try {
      const data = await aiAPI.analyzeTone({ user_id: userId, message: lastMessageContent });
      setAnalysisResult(data.tone || '');
    } catch (error: any) {
      setAnalysisResult(error?.message || 'Error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTranslateLastMessage = async () => {
    if (!lastMessageContent.trim() || !userId) return;
    setTranslating(true);
    try {
      const data = await aiAPI.translateMessage({
        user_id: userId,
        message: lastMessageContent,
        target_language: targetLanguage || languageMeta[language]?.label || 'English',
      });
      setTranslationResult(data.translation || '');
    } catch (error: any) {
      setTranslationResult(error?.message || 'Error');
    } finally {
      setTranslating(false);
    }
  };

  const handleBubblePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    movedRef.current = false;
    dragOffsetRef.current = {
      x: e.clientX - bubblePos.x,
      y: e.clientY - bubblePos.y,
    };
    const target = e.currentTarget as HTMLButtonElement;
    target.setPointerCapture(e.pointerId);
    attachDragListeners(target, e.pointerId);
  };

  const endDrag = (pointerId?: number, target?: HTMLButtonElement) => {
    draggingRef.current = false;
    if (pointerId !== undefined && target) {
      try {
        target.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
    }
    if (!movedRef.current) {
      setBubbleOpen((prev) => !prev);
    }
  };

  const attachDragListeners = (target: HTMLButtonElement, pointerId: number) => {
    const handleMove = (e: PointerEvent) => {
      const rawX = e.clientX - dragOffsetRef.current.x;
      const rawY = e.clientY - dragOffsetRef.current.y;
      const minX = edgePadding;
      const minY = edgePadding;
      const maxX = viewport.width
        ? viewport.width - bubbleSize - edgePadding
        : rawX;
      const maxY = viewport.height
        ? viewport.height - bubbleSize - edgePadding
        : rawY;
      const nextX = Math.min(Math.max(rawX, minX), Math.max(minX, maxX));
      const nextY = Math.min(Math.max(rawY, minY), Math.max(minY, maxY));
      if (Math.abs(nextX - bubblePos.x) > 2 || Math.abs(nextY - bubblePos.y) > 2) {
        movedRef.current = true;
      }
      setBubblePos({ x: Math.max(8, nextX), y: Math.max(8, nextY) });
    };
    const handleUp = () => {
      draggingRef.current = false;
      try {
        target.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      if (!movedRef.current) {
        setBubbleOpen((prev) => !prev);
      }
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp, { once: true });
  };

  const panelWidthClamped = viewport.width ? Math.min(panelWidth, viewport.width - edgePadding * 2) : panelWidth;
  const panelLeft = viewport.width
    ? Math.min(
        Math.max(edgePadding, bubblePos.x - panelWidthClamped + bubbleSize),
        Math.max(edgePadding, viewport.width - panelWidthClamped - edgePadding),
      )
    : bubblePos.x;
  const panelMaxHeight = viewport.height ? Math.floor(viewport.height * 0.6) : 360;
  const rawPanelTop = viewport.height
    ? bubblePos.y < 220
      ? bubblePos.y + bubbleSize + 8
      : bubblePos.y - 8 - panelMaxHeight
    : bubblePos.y + bubbleSize + 8;
  const panelTop = viewport.height
    ? Math.min(
        Math.max(edgePadding, rawPanelTop),
        Math.max(edgePadding, viewport.height - panelMaxHeight - edgePadding),
      )
    : rawPanelTop;

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col h-screen pb-20 md:pl-20">
          <div className="bg-card border-b border-border sticky top-0 z-10 px-4 py-4">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/chat')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">{matchName}</h1>
                <OnlineIndicator isOnline={userStatus.isOnline} lastSeen={userStatus.lastSeen} size="md" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-background">
            <div className="max-w-4xl mx-auto space-y-4 pb-4">
              {messages.length === 0 ? (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground">{t('chatConversation.empty')}</p>
                </Card>
              ) : (
                <>
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                          message.senderId === userId
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-card text-foreground border border-border rounded-bl-none'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <p className="text-xs opacity-70">
                            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' }) : t('common.now')}
                          </p>
                          {message.senderId === userId && (
                            <span className="text-xs opacity-70">
                              {message.isRead ? '✓✓' : message.isDelivered ? '✓' : '⏱'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="bg-card border-t border-border sticky bottom-0 p-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatConversation.placeholder')}
                className="flex-1 rounded-full"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className="fixed z-[60]"
          style={{ left: bubblePos.x, top: bubblePos.y }}
        >
          <div
            className={`relative flex gap-2 ${
              viewport.height && bubblePos.y < 220 ? 'flex-col' : 'flex-col-reverse'
            } ${
              viewport.width && bubblePos.x < Math.max(edgePadding, panelWidth - bubbleSize + edgePadding)
                ? 'items-start'
                : 'items-end'
            }`}
          >
            <button
              type="button"
              className="h-16 w-16 rounded-full border border-border bg-card shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
              onPointerDown={handleBubblePointerDown}
              aria-label={t('chatConversation.aiHelperTitle')}
              style={{ touchAction: 'none', cursor: draggingRef.current ? 'grabbing' : 'grab' }}
            >
              <img
                src={coachAvatar}
                alt={t('chatConversation.aiHelperTitle')}
                className="h-14 w-14 rounded-full object-cover"
              />
            </button>

            {bubbleOpen && (
              <Card
                className="p-3 shadow-lg max-h-[60vh] overflow-auto"
                style={{ position: 'fixed', left: panelLeft, top: panelTop, width: panelWidthClamped }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{t('chatConversation.aiHelperTitle')}</p>
                    <p className="text-xs text-muted-foreground">{t('chatConversation.aiHelperSubtitle')}</p>
                  </div>
                  <Input
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    placeholder={t('chatConversation.aiHelperTargetLang')}
                    className="max-w-[120px] h-8 text-xs"
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground line-clamp-3">
                  {lastMessageContent ? (
                    <>
                      <span className="font-semibold text-foreground">{t('chatConversation.aiHelperLastMessage')}:</span>{' '}
                      {lastMessageContent}
                    </>
                  ) : (
                    t('chatConversation.aiHelperNoMessages')
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={handleAnalyzeLastMessage}
                    disabled={!lastMessageContent.trim() || analyzing}
                  >
                    {analyzing ? t('chatConversation.aiHelperAnalyzing') : t('chatConversation.aiHelperAnalyze')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTranslateLastMessage}
                    disabled={!lastMessageContent.trim() || translating}
                  >
                    {translating ? t('chatConversation.aiHelperTranslating') : t('chatConversation.aiHelperTranslate')}
                  </Button>
                </div>
                {analysisResult && (
                  <Card className="mt-2 p-2 bg-muted/40">
                    <p className="text-xs">{analysisResult}</p>
                  </Card>
                )}
                {translationResult && (
                  <Card className="mt-2 p-2 bg-muted/40">
                    <p className="text-xs">{translationResult}</p>
                  </Card>
                )}
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
