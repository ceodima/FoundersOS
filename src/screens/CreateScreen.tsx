import { useState } from 'react';
import { useGoalsStore } from '../store/goals';

export default function CreateScreen({ setTab }: { setTab: (i: number) => void }) {
  const [text, setText] = useState('');
  const addGoal = useGoalsStore((s) => s.addGoal);

  const handleSubmit = () => {
    if (text.trim()) {
      addGoal(text);
      setText('');
      setTab(1); // переключаем на Projects
    }
  };

  return (
    <div className="min-h-screen px-5 pt-10 pb-32 bg-[#0a0a0a]">
      <h1 className="text-4xl font-bold mb-3">Create New Goal</h1>
      <p className="text-gray-500 mb-10">Describe your big idea and we’ll help break it down</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your big goal..."
        className="w-full h-56 bg-[#131313] border border-white/10 rounded-3xl p-6 text-lg resize-none outline-none focus:border-cyan-500/50 transition-all"
      />

      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="mt-10 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-6 rounded-3xl text-lg shadow-2xl shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-3"
      >
        <span>Generate Roadmap</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}