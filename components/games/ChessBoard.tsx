'use client';

import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface ChessBoardProps {
  position?: string;
  onMove?: (uci: string, fen: string) => void;
  allowMove?: boolean;
  squareStyles?: Record<string, React.CSSProperties>;
  animateFromSquare?: string | null;
  onIllegalMove?: (from: string, to: string) => void;
  lightSquareStyle?: React.CSSProperties;
  darkSquareStyle?: React.CSSProperties;
}

export function ChessBoard({
  onMove,
  position,
  allowMove = true,
  squareStyles,
  animateFromSquare,
  onIllegalMove,
  lightSquareStyle,
  darkSquareStyle,
}: ChessBoardProps) {
  const game = useMemo(() => new Chess(position), [position]);
  const [fen, setFen] = useState(position || game.fen());

  useEffect(() => {
    if (position) {
      setFen(position);
    }
  }, [position]);

  const onDrop = (source: string, target: string) => {
    if (!allowMove) return false;
    const piece = game.get(source);
    if (!piece) return false;
    const turn = game.turn();
    if ((piece.color === 'w' && turn !== 'w') || (piece.color === 'b' && turn !== 'b')) {
      return false;
    }
    try {
      const move = game.move({ from: source, to: target, promotion: 'q' });
      if (move === null) {
        onIllegalMove?.(source, target);
        return false;
      }
      setFen(game.fen());
      onMove?.(`${move.from}${move.to}`, game.fen());
      return true;
    } catch {
      onIllegalMove?.(source, target);
      return false;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-border bg-card p-2 shadow-sm">
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        customSquareStyles={squareStyles}
        customLightSquareStyle={lightSquareStyle}
        customDarkSquareStyle={darkSquareStyle}
        customSquare={({ square, style, children }) => (
          <div style={style} className="relative">
            <div className={square === animateFromSquare ? 'chess-piece-hint' : undefined}>
              {children}
            </div>
          </div>
        )}
      />
    </div>
  );
}
