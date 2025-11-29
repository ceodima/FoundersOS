import { useGoalsStore } from '../store/goals';
import { TrashIcon, ChevronDownIcon, SparklesIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function ProjectsScreen() {
  const { goals, updateSubGoal, toggleInProgress, deleteGoal } = useGoalsStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (goals.length > 0 && !expandedId) {
      setExpandedId(goals[goals.length - 1].id);
    }
  }, [goals]);

  if (goals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 text-gray-500 text-lg">
        No goals yet. Create one first!
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-6 pb-32">
      <h1 className="text-4xl font-bold mb-2">Projects & Roadmaps</h1>
      <p className="text-gray-500 text-sm mb-8">Manage goals and break down steps</p>

      {goals.map((goal) => {
        const filled = goal.subGoals.filter(s => s.text.trim()).length;
        const progress = Math.round((filled / 3) * 100);
        const isExpanded = expandedId === goal.id;
        const isEditing = editingGoalId === goal.id;

        const createdDate = new Date(parseInt(goal.id)).toLocaleDateString('en', {
          month: 'short',
          day: 'numeric',
        });

        return (
          <div
            key={goal.id}
            className="mb-5 bg-[#131313]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-300"
            onClick={() => !isEditing && setExpandedId(isExpanded ? null : goal.id)}
          >
            {/* Header */}
            <div className="p-6 cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{goal.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{createdDate}</span>
                    <span className="text-cyan-400 font-medium">{progress}% done</span>
                  </div>
                  <div className="mt-3 bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <ChevronDownIcon
                  className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-6 pb-6 border-t border-white/10 pt-5 space-y-5">
                {/* Edit / View Toggle */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGoalId(isEditing ? null : goal.id);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition"
                  >
                    {isEditing ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Done
                      </>
                    ) : (
                      <>
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </button>
                </div>

                {/* Subgoals */}
                {isEditing ? (
                  // Режим редактирования — как у нас было
                  <div className="space-y-4">
                    {goal.subGoals.map((sub, i) => (
                      <input
                        key={sub.id}
                        type="text"
                        value={sub.text}
                        onChange={(e) => updateSubGoal(goal.id, sub.id, e.target.value)}
                        placeholder={`Sub-goal ${i + 1}...`}
                        className="w-full bg-white/5 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-cyan-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ))}
                  </div>
                ) : (
                  // Режим просмотра — как в «лавабл»
                  <div className="space-y-4">
                    {goal.subGoals
                      .filter(s => s.text.trim())
                      .map((sub, i) => (
                        <div key={sub.id} className="flex items-center gap-4 group">
                          <div className="w-5 h-5 rounded-full border-2 border-cyan-500 bg-cyan-500/20" />
                          <p className="text-lg text-gray-300">{sub.text}</p>
                          <button className="ml-auto opacity-0 group-hover:opacity-100 transition">
                            <SparklesIcon className="w-5 h-5 text-cyan-400" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                {/* Start Working Button — как в лавбл */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInProgress(goal.id);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/30 transition-all"
                >
                  {goal.inProgress ? 'In Progress' : 'Start Working'}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}