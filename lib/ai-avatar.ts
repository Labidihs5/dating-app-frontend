type CoachAvatarOptions = {
  gender?: 'male' | 'female';
  accent?: string;
};

export function coachAvatarSvg(options: CoachAvatarOptions = {}) {
  const gender = options.gender || 'female';
  const accent = options.accent || '#7ACB5E';
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
}
