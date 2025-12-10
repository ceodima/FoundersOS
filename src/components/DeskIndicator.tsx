import { useState } from "react";
import { useLifeDesks } from "@/context/LifeDesksContext";
import type { TelegramTheme } from "@/hooks/useTelegramTheme";

interface DeskIndicatorProps {
  theme: TelegramTheme;
}

export default function DeskIndicator({ theme }: DeskIndicatorProps) {
  const { activeDesk } = useLifeDesks();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onBlur={() => setTimeout(() => setShowTooltip(false), 150)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: activeDesk.color }}
      >
        {activeDesk.letter}
      </button>

      {showTooltip && (
        <div
          className="absolute left-0 top-full mt-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg animate-fade-in z-50"
          style={{ 
            backgroundColor: theme.secondary_bg_color,
            color: theme.text_color,
            border: `1px solid ${activeDesk.color}40`
          }}
        >
          <span className="mr-1.5">{activeDesk.icon}</span>
          {activeDesk.name}
        </div>
      )}
    </div>
  );
}
