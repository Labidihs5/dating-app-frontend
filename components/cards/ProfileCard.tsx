'use client';

import { Badge } from '@/components/ui/badge';
import { DistanceBadge } from '@/components/location/DistanceBadge';

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  distance?: number;
  photos: string[];
  bio?: string;
  gender: string;
  preferences?: any;
  profilePhotoIndex?: number;
}

export function ProfileCard({
  name,
  age,
  distance,
  photos,
  bio,
  gender,
  preferences,
  profilePhotoIndex = 0,
}: ProfileCardProps) {
  const mainPhoto = photos?.[profilePhotoIndex] || photos?.[0];
  const imageUrl = mainPhoto ? `/api/photos?path=${encodeURIComponent(mainPhoto)}` : "/placeholder.svg";
  
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-slate-900/10 to-slate-900/70">
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
      <div className="absolute -left-10 bottom-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-accent/20 blur-3xl" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-3xl font-semibold leading-tight drop-shadow-lg">{name}, {age}</h3>
            {distance && (
              <div className="mt-2 inline-flex">
                <DistanceBadge distance={distance} />
              </div>
            )}
          </div>
          <div className="glass-panel rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            {gender}
          </div>
        </div>

        {bio && (
          <p className="mt-3 line-clamp-2 text-sm text-white/80 drop-shadow">
            {bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="gradient-chip border-white/60 text-xs font-semibold text-foreground">
            Vibe check
          </Badge>
          <Badge variant="outline" className="border-white/50 bg-white/20 text-xs font-semibold text-white">
            {preferences?.relationshipType || 'Adventurer'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
