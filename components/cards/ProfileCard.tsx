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
  profilePhotoIndex = 0,
}: ProfileCardProps) {
  const mainPhoto = photos?.[profilePhotoIndex] || photos?.[0];
  const imageUrl = mainPhoto ? `/api/photos?path=${encodeURIComponent(mainPhoto)}` : "/placeholder.svg";
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-black/0 to-black/60 shadow-2xl">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="mb-3">
          <h3 className="text-2xl font-bold">{name}, {age}</h3>
          {distance && (
            <div className="mt-2">
              <DistanceBadge distance={distance} />
            </div>
          )}
        </div>

        {bio && (
          <div className="mb-3">
            <p className="text-sm text-gray-100 line-clamp-2">{bio}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-black/50 text-white border-white/30">
            {gender}
          </Badge>
        </div>
      </div>
    </div>
  );
}
