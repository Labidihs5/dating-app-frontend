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

  const matchId = params.matchId as string;
  const matchName = searchParams.get('name') || 'User';
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        const match = await matchRes.json();
        
        if (match?.user1?.id && match?.user2?.id) {
          const otherId = match.user1.id === userId ? match.user2.id : match.user1.id;
          const status = await fetch(`/api/status/${otherId}`).then(r => r.json());
          
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
                <OnlineIndicator isOnline={userStatus.isOnline} lastSeen={userStatus.lastSeen} size="sm" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-background">
            <div className="max-w-4xl mx-auto space-y-4 pb-4">
              {messages.length === 0 ? (
                <Card className="p-4 text-center">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
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
                            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
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
                placeholder="Type a message..."
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
      </PageContainer>
    </>
  );
}
