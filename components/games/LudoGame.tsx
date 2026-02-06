'use client';

import { useMemo, useState } from 'react';

const tokens = [
  { id: 1, color: 'bg-red-500' },
  { id: 2, color: 'bg-green-500' },
  { id: 3, color: 'bg-yellow-500' },
  { id: 4, color: 'bg-blue-500' },
];

export function LudoGame() {
  const [dice, setDice] = useState(1);
  const [turn, setTurn] = useState(0);
  const [rollFx, setRollFx] = useState(false);

  const roll = () => {
    const value = Math.floor(Math.random() * 6) + 1;
    setRollFx(true);
    setDice(value);
    setTurn((t) => (t + 1) % tokens.length);
    setTimeout(() => setRollFx(false), 300);
  };

  const grid = useMemo(() => Array.from({ length: 15 * 15 }, (_, i) => i), []);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full max-w-[420px] rounded-3xl border border-border bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Ludo Arena</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${tokens[turn].color}`} />
            Turn
          </div>
        </div>

        <div className="relative w-full aspect-square rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))]">
            {grid.map((i) => (
              <div key={i} className="border border-slate-100" />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-50/60" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50/60" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yellow-50/60" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-50/60" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-slate-900/5 border border-slate-200 flex items-center justify-center text-xs font-semibold tracking-wide">
              HOME
            </div>
          </div>

          <div className="absolute top-4 left-4 grid grid-cols-2 gap-1">
            {tokens.slice(0, 2).map((t) => (
              <span key={t.id} className={`w-4 h-4 rounded-full ${t.color}`} />
            ))}
          </div>
          <div className="absolute top-4 right-4 grid grid-cols-2 gap-1">
            {tokens.slice(2, 4).map((t) => (
              <span key={t.id} className={`w-4 h-4 rounded-full ${t.color}`} />
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${tokens[turn].color}`} />
            <div className="text-sm text-muted-foreground">Player turn</div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center font-bold text-lg ${
              rollFx ? 'scale-110' : ''
            } transition-transform`}
          >
            {dice}
          </div>
          <button
            onClick={roll}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            Roll
          </button>
        </div>
      </div>
    </div>
  );
}
