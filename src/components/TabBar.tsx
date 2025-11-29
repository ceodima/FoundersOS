import {
  LightBulbIcon,
  RocketLaunchIcon,   // ← было RocketIcon → теперь правильное
  WalletIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  { name: 'Create', icon: LightBulbIcon },
  { name: 'Projects', icon: RocketLaunchIcon },
  { name: 'Finance', icon: WalletIcon },
  { name: 'Habits', icon: HeartIcon },
];

interface Props {
  active: number;
  setActive: (i: number) => void;
}

export default function TabBar({ active, setActive }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800">
      <div className="flex justify-around py-3">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 transition-colors ${
                active === i ? 'text-cyan-400' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}