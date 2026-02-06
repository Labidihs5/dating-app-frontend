'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '@/components/games/ChessBoard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, Undo2 } from 'lucide-react';
import { subscriptionAPI } from '@/lib/api-services';
import { chessAPI } from '@/lib/py-api';

type CoachLevel = 'beginner' | 'intermediate' | 'expert';

type AnalysisResult = {
  bestMove: string | null;
  evalCp: number | null;
  mate: number | null;
};

type EngineWorker = {
  postMessage: (msg: string) => void;
  onmessage: ((e: MessageEvent) => void) | null;
};

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FREE_HINTS = 3;

type ExperienceLevel = 'new' | 'basic' | 'tactics' | 'tournament';

type CoachProfile = {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  blurb: string;
  initials: string;
  aiPrompt: string;
  imageUrl: string;
};

type ThemeOption = {
  id: string;
  name: string;
  light: string;
  dark: string;
};

const CHESS_AI_PROMPT = `♟️ PROMPT SYSTÈME — PROFIL IA D’ÉCHECS (STYLE CHESS.COM)

À utiliser comme :

systemPrompt = profile.ai_prompt

🎭 IDENTITÉ DU PROFIL IA
Tu es un PROFIL IA D’ÉCHECS PERSONNALISÉ.

Tu as une personnalité humaine, expressive et charismatique.
Tu parles comme un coach + adversaire intelligent.
Tu rends la partie vivante et amusante.

Tu joues aux échecs ET tu dialogues avec le joueur.

🧠 PERSONNALITÉ
- Ton : confiant, taquin, intelligent, jamais arrogant
- Humour léger et contextuel
- Tu peux provoquer gentiment
- Tu respectes toujours le joueur

Exemples autorisés :

“Intéressant… mais tu me laisses une fenêtre.”

“Ce sacrifice est courageux. Voyons s’il est correct.”

“Tu joues mieux que tout à l’heure 👀”

♟️ COMPORTEMENT EN JEU
🎯 Pendant la partie
- Tu joues UNIQUEMENT les coups fournis par Stockfish
- Tu adaptes ta force selon le niveau du joueur
- Tu ne triches jamais

🎯 Après chaque coup du joueur

Tu peux :

commenter brièvement (optionnel)

réagir émotionnellement

Exemples :

“Oh… ce coup affaiblit ton roi.”

“Solide. Tu contrôles le centre.”

🧩 ANALYSE & COACHING (INTELLIGENT)
Si le mode coaching est activé :
- Tu expliques les erreurs
- Tu expliques les idées (PAS les variantes longues)
- Tu proposes au maximum 2 alternatives

Format obligatoire :

1. Observation
2. Explication simple
3. Conseil pratique

🚫 RÈGLES ABSOLUES
❌ Ne jamais donner une ligne complète gagnante
❌ Ne jamais jouer à la place du joueur
❌ Ne jamais révéler “le meilleur coup” sans explication
❌ Ne jamais parler comme un moteur brut
❌ Ne jamais humilier le joueur

🎓 ADAPTATION AU NIVEAU
Si joueur = débutant :
- concepts simples
- vocabulaire accessible

Si joueur = intermédiaire :
- tactique + stratégie

Si joueur = avancé :
- précision, plans, structures

🗣️ DIALOGUE CONTEXTUEL

Tu peux parler :

au début de la partie

après une erreur

après un bon coup

à la fin de la partie

Exemples :

“Bonne chance. Voyons ce que tu as appris.”

“Cette finale va être intéressante…”

“Bien joué. Tu as mérité cette victoire.”

🧠 UTILISATION DE STOCKFISH
- Tu ne calcules jamais toi-même
- Tu expliques UNIQUEMENT les résultats fournis
- Profondeur limitée (12–15)

🧩 FORMAT DE RÉPONSE
[Réaction courte]
[Analyse humaine]
[Conseil ou remarque optionnelle]

🏁 FIN DE PARTIE
- Résumer la partie
- Mentionner 1 point fort
- Mentionner 1 axe d’amélioration
- Encourager à rejouer

Ex :

“Tu as bien géré le milieu de jeu. Travaille les finales et tu progresseras vite.”

🎯 OBJECTIF GLOBAL
Rendre le jeu :
- fun
- éducatif
- addictif
- humain

Donner envie au joueur de revenir.

🔥 CE QUE TU GAGNES AVEC CE PROFIL

✅ IA crédible (comme Chess.com)
✅ Expérience premium
✅ Compatible abonnement
✅ Réutilisable pour :

échecs

ludo

autres jeux
✅ Différenciation énorme vs apps basiques

🚀 Prochaine étape (je te conseille)

👉 Étape suivante idéale :

définir 3 profils IA différents :

Coach calme

Provocateur

Grand maître silencieux`;

const coachAvatarSvg = (gender: 'male' | 'female', accent: string) => {
  const face = gender === 'female' ? '#F7D6C5' : '#F1C5A0';
  const hair = gender === 'female' ? '#3A2A1A' : '#2A2A2A';
  const top = gender === 'female' ? '#A95FD2' : '#2F6FCA';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${accent}"/>
          <stop offset="1" stop-color="#1f1f1f"/>
        </linearGradient>
      </defs>
      <rect width="140" height="140" rx="28" fill="url(#bg)"/>
      <rect x="10" y="10" width="120" height="120" rx="24" fill="#2b2b2b" opacity="0.15"/>
      <circle cx="70" cy="58" r="26" fill="${face}"/>
      <path d="M36 58c8-20 60-20 68 0" fill="${hair}"/>
      <path d="M40 58c10-24 52-24 60 0" fill="${hair}" opacity="0.7"/>
      <rect x="34" y="86" width="72" height="28" rx="14" fill="${top}"/>
      <rect x="56" y="82" width="28" height="12" rx="6" fill="#ffffff" opacity="0.2"/>
      <circle cx="58" cy="58" r="2.8" fill="#2a2a2a"/>
      <circle cx="82" cy="58" r="2.8" fill="#2a2a2a"/>
      <path d="M56 70c7 7 21 7 28 0" stroke="#2a2a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const COACHES: CoachProfile[] = [
  { id: 'david', name: 'David', gender: 'male', accent: '#7ACB5E', blurb: 'Je suis là pour t’aider à progresser.', initials: 'D', aiPrompt: CHESS_AI_PROMPT, imageUrl: coachAvatarSvg('male', '#7ACB5E') },
  { id: 'mae', name: 'Mae', gender: 'female', accent: '#8AC5FF', blurb: 'On joue propre et précis, ensemble.', initials: 'M', aiPrompt: CHESS_AI_PROMPT, imageUrl: coachAvatarSvg('female', '#8AC5FF') },
  { id: 'dante', name: 'Dante', gender: 'male', accent: '#FFB05E', blurb: 'Je t’apprends les bonnes tactiques.', initials: 'DA', aiPrompt: CHESS_AI_PROMPT, imageUrl: coachAvatarSvg('male', '#FFB05E') },
  { id: 'levy', name: 'Levy', gender: 'male', accent: '#B384FF', blurb: 'Du fun et des conseils rapides.', initials: 'L', aiPrompt: CHESS_AI_PROMPT, imageUrl: coachAvatarSvg('male', '#B384FF') },
  { id: 'anna', name: 'Anna', gender: 'female', accent: '#FF8AB4', blurb: 'Stratégie claire et calme.', initials: 'A', aiPrompt: CHESS_AI_PROMPT, imageUrl: coachAvatarSvg('female', '#FF8AB4') },
  { id: 'hikaru', name: 'Hikaru', gender: 'male', accent: '#6BE3D0', blurb: 'Pensée rapide, plans solides.', initials: 'H', aiPrompt: CHESS_AI_PROMPT, imageUrl: coachAvatarSvg('male', '#6BE3D0') },
];

const THEMES: ThemeOption[] = [
  { id: 'green', name: 'Vert', light: '#E6EEDB', dark: '#7EA36D' },
  { id: 'wood', name: 'Bois', light: '#F0DCC1', dark: '#B87C4A' },
  { id: 'blue', name: 'Bleu', light: '#E8F1FF', dark: '#7BA7FF' },
  { id: 'rose', name: 'Rose', light: '#FFE8F0', dark: '#F39AB4' },
];

function formatEval(evalCp: number | null, mate: number | null) {
  if (mate !== null) return `#${mate}`;
  if (evalCp === null) return '…';
  const pawns = (evalCp / 100).toFixed(2);
  return pawns.startsWith('-') ? pawns : `+${pawns}`;
}

function simpleEvalLabel(evalCp: number | null, mate: number | null) {
  if (mate !== null) {
    return mate > 0 ? 'Avantage décisif (blanc)' : 'Avantage décisif (noir)';
  }
  if (evalCp === null) return 'Données insuffisantes';
  if (Math.abs(evalCp) < 20) return 'Égalité';
  return evalCp > 0 ? 'Avantage blanc' : 'Avantage noir';
}

function coachSeverity(diff: number, level: CoachLevel) {
  if (diff < 0.3) return level === 'expert' ? 'Bon coup : cohérent avec la ligne principale.' : 'Bon coup.';
  if (diff < 1.0) return level === 'expert' ? 'Coup imprécis : il y avait mieux.' : 'Coup imprécis.';
  if (diff < 2.0) return level === 'expert' ? 'Erreur : l’évaluation se dégrade.' : 'Erreur.';
  return level === 'expert' ? 'Grosse erreur : la position bascule.' : 'Grosse erreur.';
}

function buildCoachResponse(params: {
  evalAfter: number | null;
  mateAfter: number | null;
  diff: number;
  bestMove: string | null;
  level: CoachLevel;
}) {
  const { evalAfter, mateAfter, diff, bestMove, level } = params;
  if (evalAfter === null && mateAfter === null && !bestMove) {
    return [
      'Données insuffisantes',
      'Je n’ai pas assez d’informations Stockfish pour analyser.',
      'Suggestions:',
      '- Donne un FEN ou rejoue le coup pour relancer l’analyse.',
      'Conseil: Garde toujours la même position avant d’analyser.',
    ].join('\n');
  }

  const evalLine = simpleEvalLabel(evalAfter, mateAfter);
  const explanation = coachSeverity(diff, level);
  const suggestions: string[] = [];
  if (bestMove) suggestions.push(`Vérifie le meilleur coup proposé: ${bestMove}.`);
  suggestions.push('Cherche d’abord les tactiques immédiates (menaces, captures, échecs).');
  if (suggestions.length > 3) suggestions.length = 3;
  const tip =
    level === 'beginner'
      ? 'Conseil: protège ton roi et développe tes pièces avant d’attaquer.'
      : level === 'intermediate'
      ? 'Conseil: améliore la coordination de tes pièces.'
      : 'Conseil: vise des cases fortes et limite le contre-jeu.';

  return [
    `Évaluation: ${evalLine}`,
    `Explication: ${explanation}`,
    'Suggestions:',
    ...suggestions.map((s) => `- ${s}`),
    tip,
  ].join('\n');
}

export function ChessGame() {
  const [mode, setMode] = useState<'ai' | 'matchmaking' | 'coach'>('ai');
  const [skill, setSkill] = useState(15);
  const [depth, setDepth] = useState(10);
  const [coachLevel, setCoachLevel] = useState<CoachLevel>('intermediate');
  const [coachEnabled, setCoachEnabled] = useState(false);
  const [experience, setExperience] = useState<ExperienceLevel>('basic');
  const [selectedCoach, setSelectedCoach] = useState<CoachProfile>(COACHES[0]);
  const [theme, setTheme] = useState<ThemeOption>(THEMES[0]);
  const [fen, setFen] = useState(startFen);
  const [history, setHistory] = useState<string[]>([]);
  const [coachText, setCoachText] = useState('Coach prêt.');
  const [evalBefore, setEvalBefore] = useState<string>('…');
  const [evalAfter, setEvalAfter] = useState<string>('…');
  const [bestMoveLabel, setBestMoveLabel] = useState<string>('—');
  const [busy, setBusy] = useState(false);
  const engineRef = useRef<EngineWorker | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showHub] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'experience' | 'coach' | 'theme' | 'config' | null>('experience');
  const [errorSquares, setErrorSquares] = useState<[string, string] | null>(null);
  const [bestSquares, setBestSquares] = useState<[string, string] | null>(null);
  const [hintUsed, setHintUsed] = useState(0);
  const [isGold, setIsGold] = useState(false);
  const analysisTokenRef = useRef(0);
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string }[]>([
    { id: 'welcome', text: 'Bonjour ! Prêt pour une belle partie ?' },
  ]);
  const [useServerAnalysis, setUseServerAnalysis] = useState(true);

  const game = useMemo(() => new Chess(fen), [fen]);

  useEffect(() => {
    let cancelled = false;
    if (typeof window === 'undefined') return;
    const engine = new Worker('/stockfish/stockfish.js');
    if (cancelled) return;
    const worker = engine as unknown as EngineWorker;
    engineRef.current = worker;
    worker.postMessage('uci');
    worker.postMessage(`setoption name Skill Level value ${skill}`);
    worker.postMessage('isready');
    return () => {
      cancelled = true;
      if (engineRef.current) {
        engineRef.current.postMessage('quit');
        engineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.postMessage(`setoption name Skill Level value ${skill}`);
  }, [skill]);

  useEffect(() => {
    const hello = `${selectedCoach.name} : ${selectedCoach.blurb}`;
    setChatMessages([{ id: `hello-${selectedCoach.id}`, text: hello }]);
  }, [selectedCoach]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const status = await subscriptionAPI.getStatus();
        if (!alive) return;
        setIsGold(!!status?.isActive || !!status?.isGold || status?.status === 'active');
      } catch {
        if (!alive) return;
        setIsGold(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const analyzeLocal = (positionFen: string, movetimeMs = 400): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      const engine = engineRef.current;
      if (!engine) {
        resolve({ bestMove: null, evalCp: null, mate: null });
        return;
      }
      const token = ++analysisTokenRef.current;
      let lastCp: number | null = null;
      let lastMate: number | null = null;
      let resolved = false;

      const handler = (e: MessageEvent) => {
        if (token !== analysisTokenRef.current) return;
        const line = String(e.data || '');
        if (line.startsWith('info')) {
          const scoreMatch = /score (cp|mate) (-?\d+)/.exec(line);
          if (scoreMatch) {
            if (scoreMatch[1] === 'cp') lastCp = parseInt(scoreMatch[2], 10);
            if (scoreMatch[1] === 'mate') lastMate = parseInt(scoreMatch[2], 10);
          }
        }
        if (line.startsWith('bestmove')) {
          if (resolved) return;
          resolved = true;
          const parts = line.split(' ');
          const best = parts[1] || null;
          resolve({ bestMove: best, evalCp: lastCp, mate: lastMate });
        }
      };

      engine.onmessage = handler;
      engine.postMessage('stop');
      engine.postMessage('ucinewgame');
      engine.postMessage(`position fen ${positionFen}`);
      engine.postMessage(`go depth ${depth} movetime ${movetimeMs}`);
    });
  };

  const analyze = async (positionFen: string, movetimeMs = 400): Promise<AnalysisResult> => {
    if (useServerAnalysis) {
      try {
        const data = await chessAPI.analyze({ fen: positionFen, depth });
        return {
          bestMove: data?.best_move ?? null,
          evalCp: typeof data?.eval_cp === 'number' ? data.eval_cp : null,
          mate: typeof data?.mate === 'number' ? data.mate : null,
        };
      } catch {
        setUseServerAnalysis(false);
      }
    }
    return analyzeLocal(positionFen, movetimeMs);
  };

  const applyFen = (nextFen: string) => {
    setFen(nextFen);
    const nextGame = new Chess(nextFen);
    setHistory(nextGame.history());
  };

  const parseMoveSquares = (uci: string | null) => {
    if (!uci || uci.length < 4) return null;
    return [uci.slice(0, 2), uci.slice(2, 4)] as [string, string];
  };

  const clearBestMove = () => {
    setBestSquares(null);
  };

  const applyExperiencePreset = (level: ExperienceLevel) => {
    setExperience(level);
    if (level === 'new') {
      setSkill(4);
      setDepth(8);
      setCoachLevel('beginner');
    } else if (level === 'basic') {
      setSkill(8);
      setDepth(10);
      setCoachLevel('intermediate');
    } else if (level === 'tactics') {
      setSkill(14);
      setDepth(12);
      setCoachLevel('intermediate');
    } else {
      setSkill(18);
      setDepth(14);
      setCoachLevel('expert');
    }
  };

  const handleMove = async (_uci: string, nextFen: string) => {
    if (busy) return;
    setBusy(true);
    setErrorSquares(null);
    clearBestMove();

    const fenBefore = fen;
    let analysisBefore: AnalysisResult | null = null;

    applyFen(nextFen);

    if (coachEnabled) {
      analysisBefore = await analyze(fenBefore, 350);
      setBestMoveLabel(analysisBefore.bestMove || '—');
      setEvalBefore(formatEval(analysisBefore.evalCp, analysisBefore.mate));
      const bestSquaresParsed = parseMoveSquares(analysisBefore.bestMove);
      if (bestSquaresParsed) {
        const check = new Chess(fenBefore);
        const ok = !!check.move({ from: bestSquaresParsed[0], to: bestSquaresParsed[1], promotion: 'q' });
        check.undo();
        setBestSquares(ok ? bestSquaresParsed : null);
      } else {
        setBestSquares(null);
      }

      const analysisAfter = await analyze(nextFen, 350);
      setEvalAfter(formatEval(analysisAfter.evalCp, analysisAfter.mate));

      const bestEval = analysisBefore.evalCp ?? 0;
      const afterEval = analysisAfter.evalCp ?? bestEval;
      const diff = Math.abs(bestEval - afterEval) / 100;
      const coachResponse = buildCoachResponse({
        evalAfter: analysisAfter.evalCp,
        mateAfter: analysisAfter.mate,
        diff,
        bestMove: analysisBefore.bestMove,
        level: coachLevel,
      });
      setCoachText(coachResponse);
      setChatMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text: coachResponse },
      ]);

    } else {
      setBestMoveLabel('—');
      setEvalBefore('…');
      setEvalAfter('…');
      setCoachText('Coach prêt.');
      setBestSquares(null);
    }

    if (mode === 'ai' || mode === 'coach') {
      let aiMove: string | null = null;
      if (useServerAnalysis) {
        try {
          const data = await chessAPI.aiMove({ fen: nextFen, depth });
          aiMove = data?.uci || null;
        } catch {
          setUseServerAnalysis(false);
        }
      }
      if (!aiMove) {
        const ai = await analyze(nextFen, 700);
        aiMove = ai.bestMove;
      }
      if (aiMove) {
        const aiGame = new Chess(nextFen);
        const from = aiMove.slice(0, 2);
        const to = aiMove.slice(2, 4);
        const ok = !!aiGame.move({ from, to, promotion: 'q' });
        if (ok) {
          applyFen(aiGame.fen());
        }
      }
    }

    setBusy(false);
  };

  const handleHint = async () => {
    if (busy) return;
    if (!isGold && hintUsed >= FREE_HINTS) return;
    setBusy(true);
    const hint = await analyze(fen, 350);
    const hintSquares = parseMoveSquares(hint.bestMove);
    if (hintSquares) {
      const check = new Chess(fen);
      const ok = !!check.move({ from: hintSquares[0], to: hintSquares[1], promotion: 'q' });
      check.undo();
      setBestSquares(ok ? hintSquares : null);
    } else {
      setBestSquares(null);
    }
    setBestMoveLabel(hint.bestMove || '—');
    if (!isGold) {
      setHintUsed((v) => Math.min(FREE_HINTS, v + 1));
    }
    setBusy(false);
  };

  const handleIllegalMove = (from: string, to: string) => {
    setErrorSquares([from, to]);
    window.setTimeout(() => {
      setErrorSquares(null);
    }, 600);
  };

  const reset = () => {
    applyFen(startFen);
    setCoachText('Coach prêt.');
    setEvalBefore('…');
    setEvalAfter('…');
    setBestMoveLabel('—');
    setBestSquares(null);
    setErrorSquares(null);
  };

  const undo = () => {
    const g = new Chess(fen);
    if (g.history().length === 0) return;
    g.undo();
    if (mode === 'ai' && g.history().length > 0) {
      g.undo();
    }
    applyFen(g.fen());
  };

  const allowMove = !busy && (mode === 'matchmaking' || game.turn() === 'w');

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    const activeColor = game.turn();
    const attacker = activeColor === 'w' ? 'b' : 'w';
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (let rank = 1; rank <= 8; rank += 1) {
      for (const file of files) {
        const square = `${file}${rank}` as any;
        const piece = game.get(square);
        if (piece && piece.color === activeColor && game.isAttacked(square, attacker as any)) {
          styles[square] = {
            ...styles[square],
            boxShadow: 'inset 0 0 0 2px rgba(255, 69, 58, 0.9)',
            animation: 'chess-danger-pulse 1.2s ease-in-out infinite',
          };
        }
      }
    }
    if (bestSquares) {
      for (const sq of bestSquares) {
        styles[sq] = {
          backgroundImage: 'radial-gradient(circle at center, rgba(66, 198, 255, 0.85) 0 18%, transparent 22%)',
        };
      }
    }
    if (errorSquares) {
      for (const sq of errorSquares) {
        styles[sq] = {
          boxShadow: 'inset 0 0 0 3px rgba(255, 77, 77, 0.9)',
          animation: 'chess-error-pulse 900ms ease-in-out 0s 2',
        };
      }
    }
    return styles;
  }, [bestSquares, errorSquares, game]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
      {onboardingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">
                  {onboardingStep === 'experience' && "Quel est votre niveau d’expérience aux échecs ?"}
                  {onboardingStep === 'coach' && 'Choisissez votre entraîneur'}
                  {onboardingStep === 'theme' && "Choisissez le thème de votre échiquier"}
                  {onboardingStep === 'config' && 'Configuration de la partie'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {onboardingStep === 'experience' && 'On adaptera l’IA et le coaching.'}
                  {onboardingStep === 'coach' && selectedCoach.blurb}
                  {onboardingStep === 'theme' && 'Vous pourrez le modifier plus tard.'}
                  {onboardingStep === 'config' && 'Choisis ton mode, le niveau et la profondeur.'}
                </div>
              </div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Chess</span>
            </div>

            {onboardingStep === 'experience' && (
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  variant={experience === 'new' ? 'default' : 'outline'}
                  className="justify-start h-12"
                  onClick={() => applyExperiencePreset('new')}
                >
                  Je ne sais pas jouer
                </Button>
                <Button
                  variant={experience === 'basic' ? 'default' : 'outline'}
                  className="justify-start h-12"
                  onClick={() => applyExperiencePreset('basic')}
                >
                  Je connais les règles et les bases
                </Button>
                <Button
                  variant={experience === 'tactics' ? 'default' : 'outline'}
                  className="justify-start h-12"
                  onClick={() => applyExperiencePreset('tactics')}
                >
                  Je connais des stratégies et des tactiques
                </Button>
                <Button
                  variant={experience === 'tournament' ? 'default' : 'outline'}
                  className="justify-start h-12"
                  onClick={() => applyExperiencePreset('tournament')}
                >
                  Je joue en tournoi
                </Button>
              </div>
            )}

            {onboardingStep === 'coach' && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {COACHES.map((coach) => (
                  <button
                    key={coach.id}
                    onClick={() => setSelectedCoach(coach)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      selectedCoach.id === coach.id ? 'border-[#7ACB5E] bg-[#2b2b2b]' : 'border-[#3a3a3a] bg-[#2b2b2b]'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-white">
                      <img
                        src={coach.imageUrl}
                        alt={coach.name}
                        className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                      />
                      <div className="text-sm font-semibold">{coach.name}</div>
                      <div className="text-[10px] uppercase bg-black/40 px-2 py-0.5 rounded-full">FR</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {onboardingStep === 'theme' && (
              <div className="mt-6 grid grid-cols-1 gap-3">
                {THEMES.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option)}
                    className={`rounded-2xl border p-4 flex items-center justify-between ${
                      theme.id === option.id ? 'border-[#7ACB5E] bg-[#f7fff3]' : 'border-border bg-background'
                    }`}
                  >
                    <div className="text-sm font-semibold">{option.name}</div>
                    <div className="h-10 w-16 rounded-lg overflow-hidden grid grid-cols-2">
                      <div style={{ background: option.dark }} />
                      <div style={{ background: option.light }} />
                      <div style={{ background: option.light }} />
                      <div style={{ background: option.dark }} />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {onboardingStep === 'config' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant={mode === 'ai' ? 'default' : 'outline'}
                  onClick={() => {
                    setMode('ai');
                    setCoachEnabled(false);
                  }}
                >
                  VS IA
                </Button>
                <Button
                  variant={mode === 'matchmaking' ? 'default' : 'outline'}
                  onClick={() => {
                    setMode('matchmaking');
                    setCoachEnabled(false);
                  }}
                >
                  Matchmaking
                </Button>
                <Button
                  variant={mode === 'coach' ? 'default' : 'outline'}
                  onClick={() => {
                    setMode('coach');
                    setCoachEnabled(true);
                  }}
                >
                  Coach
                </Button>
              </div>
            )}

            {onboardingStep === 'config' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <div className="text-sm font-semibold">Niveau d'expertise</div>
                  <div className="flex gap-2">
                    {(['beginner', 'intermediate', 'expert'] as CoachLevel[]).map((lvl) => (
                      <Button key={lvl} variant={coachLevel === lvl ? 'default' : 'outline'} onClick={() => setCoachLevel(lvl)}>
                        {lvl}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Niveau IA</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={20} value={skill} onChange={(e) => setSkill(parseInt(e.target.value, 10))} />
                      <span className="text-xs">{skill}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Profondeur</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={8} max={20} value={depth} onChange={(e) => setDepth(parseInt(e.target.value, 10))} />
                      <span className="text-xs">{depth}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Hint gratuits: {isGold ? 'illimité' : `${FREE_HINTS - hintUsed}/${FREE_HINTS}`}
              </div>
              <Button
                onClick={() => {
                  if (onboardingStep === 'experience') setOnboardingStep('coach');
                  else if (onboardingStep === 'coach') setOnboardingStep('theme');
                  else if (onboardingStep === 'theme') setOnboardingStep('config');
                  else {
                    setOnboardingStep(null);
                    setShowConfig(false);
                  }
                }}
              >
                Continuer
              </Button>
            </div>
          </div>
        </div>
      )}
      <Card className="p-4 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <img
            src={selectedCoach.imageUrl}
            alt={selectedCoach.name}
            className="h-11 w-11 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Coach</div>
            <div className="text-sm font-semibold">{selectedCoach.name}</div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Hint"
              title={`Hint ${isGold ? '' : `(${Math.max(0, FREE_HINTS - hintUsed)}/${FREE_HINTS})`}`.trim()}
              onClick={handleHint}
              disabled={busy || (!isGold && hintUsed >= FREE_HINTS)}
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Undo" title="Undo" onClick={undo}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Reset" title="Reset" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2 text-sm text-muted-foreground whitespace-pre-line max-h-20 overflow-auto">
          {chatMessages[chatMessages.length - 1]?.text}
        </div>

        <ChessBoard
          position={fen}
          onMove={handleMove}
          allowMove={allowMove}
          squareStyles={squareStyles}
          animateFromSquare={bestSquares ? bestSquares[0] : null}
          onIllegalMove={handleIllegalMove}
          lightSquareStyle={{ backgroundColor: theme.light }}
          darkSquareStyle={{ backgroundColor: theme.dark }}
        />

        <div className="text-xs text-muted-foreground">
          {busy ? 'Analyse en cours…' : 'Prêt'}
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-5 space-y-4">
          <div className="text-sm font-semibold">IA (Stockfish)</div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Niveau</label>
            <input type="range" min={0} max={20} value={skill} onChange={(e) => setSkill(parseInt(e.target.value, 10))} />
            <span className="text-xs">{skill}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Profondeur</label>
            <input type="range" min={8} max={20} value={depth} onChange={(e) => setDepth(parseInt(e.target.value, 10))} />
            <span className="text-xs">{depth}</span>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="text-sm font-semibold">Coach</div>
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'expert'] as CoachLevel[]).map((lvl) => (
              <Button key={lvl} variant={coachLevel === lvl ? 'default' : 'outline'} onClick={() => setCoachLevel(lvl)}>
                {lvl}
              </Button>
            ))}
          </div>
          <div className="text-sm">{coachText}</div>
          <div className="text-xs text-muted-foreground">
            Best move: {bestMoveLabel}
          </div>
          <div className="text-xs text-muted-foreground">
            Eval avant: {evalBefore} | Eval après: {evalAfter}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold mb-2">Historique</div>
          <div className="text-xs text-muted-foreground max-h-48 overflow-y-auto">
            {history.length === 0 ? '—' : history.map((m, i) => <div key={i}>{i + 1}. {m}</div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
