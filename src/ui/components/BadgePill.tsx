import { colors } from '@/src/ui/tokens';

export function BadgePill({ label }: { label: string }) {
  return (
    <span
      className="px-12 py-6 text-[12px] font-semibold rounded-full bg-white/90 backdrop-blur-md"
      style={{ color: colors.violet, boxShadow: '0 6px 16px rgba(59,20,92,0.12)' }}
    >
      {label}
    </span>
  );
}
