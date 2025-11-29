import { useState } from 'react';
import { useGoalsStore } from '../store/goals';

export default function CreateScreen({ setTab }: { setTab: (i: number) => void }) {
  const [text, setText] = useState('');
  const addGoal = useGoalsStore((s) => s.addGoal);

  const handleSubmit = () => {
    if (text.trim()) {
      addGoal(text);
      setText('');
      setTab(1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center">
      {/* iPhone 13 Pro рамка */}
      <div
        className="relative bg-black rounded-[60px] shadow-2xl"
        style={{
          width: '390px',
          height: '844px',
          border: '13px solid #111',
          boxShadow: '0 20px 80px rgba(0,0,0,0.9)',
        }}
      >
        {/* Чёлка */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-8 bg-black rounded-b-3xl z-50" />

        {/* Экран приложения */}
        <div className="h-full bg-[#0a0a0a] rounded-[48px] overflow-hidden flex flex-col">
          {/* Контент */}
          <div className="flex-1 pt-16 pb-10 px-6 overflow-y-auto">
            <h1 className="text-4xl font-bold text-white mb-3">Create New Goal</h1>
            <p className="text-gray-500 mb-10">
              Describe your big idea and we’ll help break it down
            </p>

            {/* Поле ввода — фиксированный размер ≈7см × 3см */}
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your big goal..."
              className="w-full max-w-sm mx-auto block h-3 px-6 bg-[#131313] border border-white/40 rounded-2xl text-lg outline-none focus:border-cyan-500/50 transition-all text-white placeholder-gray-600"
            />

            {/* Прямоугольная кнопка с мягким скруглением */}
            <div className="mt-12">
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="w-full max-w-sm mx-auto block h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-2xl shadow-lg shadow-cyan-500/30 transition-all duration-200 active:scale-98 flex items-center justify-center gap-3"
              >
                <span>Generate Roadmap</span>
                <svg className="w-6 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}