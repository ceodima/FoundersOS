import { useLifeDesks } from "@/context/LifeDesksContext";
import type { TelegramTheme } from "@/hooks/useTelegramTheme";

interface LifeDesksOnboardingProps {
  theme: TelegramTheme;
}

export default function LifeDesksOnboarding({ theme }: LifeDesksOnboardingProps) {
  const { hasSeenOnboarding, setHasSeenOnboarding, desks } = useLifeDesks();

  if (hasSeenOnboarding) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
    >
      <div 
        className="w-full max-w-sm rounded-3xl p-6 text-center"
        style={{ backgroundColor: theme.secondary_bg_color }}
      >
        {/* Desk icons preview */}
        <div className="flex justify-center gap-3 mb-6">
          {desks.map(desk => (
            <div
              key={desk.id}
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg"
              style={{ backgroundColor: desk.color }}
            >
              {desk.icon}
            </div>
          ))}
        </div>

        <h2 
          className="text-xl font-bold mb-3"
          style={{ color: theme.text_color }}
        >
          Life Desks
        </h2>
        
        <p 
          className="text-sm mb-6 leading-relaxed"
          style={{ color: theme.hint_color }}
        >
          Your goals are now separated into 4 life desks. Long-press anywhere to switch between{' '}
          <span style={{ color: desks[0].color }}>Work</span>,{' '}
          <span style={{ color: desks[1].color }}>Personal</span>,{' '}
          <span style={{ color: desks[2].color }}>Family</span> and{' '}
          <span style={{ color: desks[3].color }}>Health</span>.
        </p>

        <button
          onClick={() => setHasSeenOnboarding(true)}
          className="w-full py-4 rounded-xl font-semibold transition-all active:scale-[0.98]"
          style={{ backgroundColor: theme.button_color, color: theme.button_text_color }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
