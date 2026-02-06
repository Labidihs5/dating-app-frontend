'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LudoGame } from '@/components/games/LudoGame';
import { ChessGame } from '@/components/games/ChessGame';

export default function GamesPage() {
  const [tab, setTab] = useState<'chess' | 'ludo'>('chess');

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-5xl mx-auto px-4 space-y-6">
            <div className="flex gap-2">
              <Button variant={tab === 'chess' ? 'default' : 'outline'} onClick={() => setTab('chess')}>
                Chess
              </Button>
              <Button variant={tab === 'ludo' ? 'default' : 'outline'} onClick={() => setTab('ludo')}>
                Ludo
              </Button>
            </div>

            <Card className="p-6">
              {tab === 'chess' ? <ChessGame /> : <LudoGame />}
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
