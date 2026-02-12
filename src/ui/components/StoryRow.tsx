import { gradients, colors } from '@/src/ui/tokens';

type Story = {
  id: string;
  name: string;
  photo?: string;
};

export function StoryRow({ stories }: { stories: Story[] }) {
  return (
    <div className="px-20 mt-12">
      <div className="flex items-center gap-12 overflow-x-auto pb-8">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-6">
            <div
              className="h-48 w-48 rounded-full p-[3px]"
              style={{ background: gradients.ring }}
            >
              <div className="h-full w-full rounded-full bg-white/90 flex items-center justify-center overflow-hidden">
                {story.photo ? (
                  <img
                    src={story.photo}
                    alt={story.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[12px] font-semibold" style={{ color: colors.violet }}>
                    {story.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[12px] font-medium" style={{ color: colors.violet }}>
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
