import { Heart, Bell, Sliders } from 'lucide-react';
import { colors } from '@/src/ui/tokens';

type Props = {
  onFilterClick?: () => void;
};

export function TopHeader({ onFilterClick }: Props) {
  return (
    <div className="px-20 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div
          className="h-48 w-48 rounded-full flex items-center justify-center"
          style={{ background: colors.ivory, boxShadow: '0 6px 16px rgba(59,20,92,0.12)' }}
        >
          <Heart size={20} color={colors.violet} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[18px] font-semibold" style={{ color: colors.violet }}>
            LoveMatch
          </span>
          <span className="text-[12px]" style={{ color: '#8A6AA6' }}>
            Explore people near you
          </span>
        </div>
      </div>
      <div className="flex items-center gap-12">
        <button
          type="button"
          onClick={onFilterClick}
          className="h-36 w-36 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center"
          aria-label="Filter"
        >
          <Sliders size={18} color={colors.violet} />
        </button>
        <div className="h-36 w-36 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center">
          <Bell size={18} color={colors.violet} />
        </div>
      </div>
    </div>
  );
}
