import { Plus } from 'lucide-react';
import { gradients, shadow, colors } from '@/src/ui/tokens';

export function FloatingPlus() {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-[48px]">
      <button
        type="button"
        className="h-[56px] w-[56px] rounded-full flex items-center justify-center"
        style={{ background: gradients.primaryButton, boxShadow: shadow.softButton }}
      >
        <Plus size={22} color={colors.ivory} />
      </button>
    </div>
  );
}
