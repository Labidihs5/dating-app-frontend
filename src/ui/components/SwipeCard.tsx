import { BadgePill } from '@/src/ui/components/BadgePill';
import { colors, shadow } from '@/src/ui/tokens';

type Profile = {
  name: string;
  age: number;
  distance?: number;
  photos: string[];
  bio?: string;
};

export function SwipeCard({ profile }: { profile: Profile }) {
  const mainPhoto = profile.photos?.[0];
  return (
    <div
      className="w-full h-full rounded-[28px] overflow-hidden relative"
      style={{ boxShadow: shadow.softCard, backgroundColor: 'rgba(255,255,255,0.92)' }}
    >
      <div className="absolute inset-0">
        {mainPhoto ? (
          <img
            src={`/api/photos?path=${encodeURIComponent(mainPhoto)}`}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-white/70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <div className="absolute top-16 left-16 flex gap-8">
        <BadgePill label="Vérifié" />
        <BadgePill label="IA" />
      </div>

      <div
        className="absolute left-16 right-16 bottom-16 rounded-[24px] px-16 py-14 backdrop-blur-md"
        style={{
          background: 'rgba(255,255,255,0.92)',
          boxShadow: shadow.softCard,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <span
              className="text-[22px] font-bold tracking-tight"
              style={{ color: colors.ink, fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {profile.name}, {profile.age}
            </span>
            {profile.distance !== undefined && (
              <span className="text-[12px] font-medium" style={{ color: '#7C5A99' }}>
                {profile.distance} km
              </span>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  );
}
