import { LightBulbIcon, RocketLaunchIcon, WalletIcon, HeartIcon } from '@heroicons/react/24/outline';

const tabs = [
  { name: "Create", icon: LightBulbIcon },
  { name: "Projects", icon: RocketLaunchIcon },
  { name: "Finance", icon: WalletIcon },
  { name: "Habits", icon: HeartIcon },
];

interface Props {
  active: number;
  setActive: (i: number) => void;
}

export default function TabBar({ active, setActive }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-opacity-80 z-50">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-2 relative">

        {tabs.map((tab, i) => {
          const isActive = active === i;

          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                relative flex flex-col items-center justify-center gap-1 
                h-full flex-none min-w-[80px] px-3
                transition-colors duration-300
                ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              {/* ICON WRAPPER (fixed size so they never change height) */}
              <div className="w-6 h-6 flex items-center justify-center">
                <tab.icon
                  className={`
                    w-full h-full transition-transform duration-300
                    ${isActive ? "scale-105" : "scale-100"}
                  `}
                />
              </div>

              {/* LABEL */}
              <span className={`text-[11px] font-medium`}>
                {tab.name}
              </span>

              {/* ACTIVE INDICATOR */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-primary rounded-full" />
              )}
            </button>
          );
        })}
        
      </div>
    </nav>
  );
}
