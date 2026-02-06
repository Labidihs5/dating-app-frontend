'use client';

import { useCallback, useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roomsAPI } from '@/lib/py-api';
import { useRoomSocket } from '@/hooks/useRoomSocket';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { getTelegramUser } from '@/lib/telegram-utils';

export default function RoomsPage() {
  const { t } = useI18n();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState('');
  const [activeRoom, setActiveRoom] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const loadRooms = useCallback(async () => {
    const data = await roomsAPI.list();
    setRooms(data);
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const { send } = useRoomSocket(activeRoom?.room_id || null, (evt) => {
    if (evt?.type === 'new_message' && evt?.payload) {
      setMessages((prev) => [...prev, evt.payload]);
    }
  });

  const createRoom = async () => {
    const data = await roomsAPI.create({
      name: roomName,
      type: 'public',
      owner_id: null,
      is_verified_only: false,
    });
    setRoomName('');
    setRooms((prev) => [data, ...prev]);
  };

  const joinRoom = async (room: any) => {
    const user = getTelegramUser();
    if (user?.id) {
      await roomsAPI.join({ room_id: room.room_id, user_id: user.id });
    }
    setActiveRoom(room);
    const msgs = await roomsAPI.messages(room.room_id);
    setMessages(msgs);
  };

  const sendMessage = async () => {
    if (!activeRoom || !content.trim()) return;
    const user = getTelegramUser();
    const payload = {
      room_id: activeRoom.room_id,
      user_id: user?.id || crypto.randomUUID(),
      content,
    };
    await roomsAPI.message(payload);
    send(payload);
    setContent('');
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            <Card className="p-4 space-y-3">
              <h2 className="text-lg font-bold">{t('rooms.title')}</h2>
              <div className="flex gap-2">
                <Input placeholder={t('rooms.newRoom')} value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <Button onClick={createRoom}>{t('rooms.create')}</Button>
              </div>
              <div className="space-y-2">
                {rooms.map((room) => (
                  <Button
                    key={room.room_id}
                    variant={activeRoom?.room_id === room.room_id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => joinRoom(room)}
                  >
                    {room.name}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-4 flex flex-col min-h-[480px]">
              <h2 className="text-lg font-bold mb-2">{activeRoom?.name || t('rooms.selectRoom')}</h2>
              <div className="flex-1 space-y-2 overflow-y-auto border border-border rounded-md p-3">
                {messages.map((m, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-semibold">{m.user_id?.slice(0, 6)}:</span> {m.content}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder={t('rooms.typeMessage')} />
                <Button onClick={sendMessage}>{t('rooms.send')}</Button>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
