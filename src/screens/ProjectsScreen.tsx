import { useGoalsStore } from '../store/goals';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, Fragment } from 'react';

export default function ProjectsScreen() {
  const { goals, updateSubGoal, toggleInProgress, deleteGoal } = useGoalsStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (goals.length > 0 && !expandedId) {
      setExpandedId(goals[goals.length - 1].id);
    }
  }, [goals, expandedId]);

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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#0b0b0b] rounded-2xl border border-gray-600 overflow-hidden">
          <thead>
            <tr className="text-left text-sm text-gray-400 bg-[#0f0f0f]">
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Progress</th>
              <th className="px-6 py-3">Subgoals</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => {
              const filled = goal.subGoals.filter(s => s.text.trim()).length;
              const progress = goal.subGoals.length ? Math.round((filled / goal.subGoals.length) * 100) : 0;
              const isExpanded = expandedId === goal.id;
              const isEditing = editingGoalId === goal.id;

              return (
                <Fragment key={goal.id}>
                  <tr className={`border-t border-gray-600 hover:bg-gray-700 transition cursor-default ${isExpanded ? 'bg-gray-700' : 'bg-gray-800'}`}>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-lg font-semibold text-white">{goal.title}</div>
                    </td>
                    <td className="px-6 py-4 align-middle w-1/3">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">{filled}/{goal.subGoals.length}</td>
                    <td className="px-6 py-4 align-middle">{goal.inProgress ? 'In Progress' : 'Idle'}</td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : goal.id)}
                          className="px-3 py-1 bg-white/5 text-sm rounded hover:bg-white/10 transition"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? 'Collapse' : 'Details'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGoalId(isEditing ? null : goal.id);
                          }}
                          className="px-3 py-1 bg-white/5 text-sm rounded hover:bg-white/10 transition"
                          aria-label={isEditing ? 'Done' : 'Edit'}
                        >
                          {isEditing ? 'Done' : 'Edit'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGoal(goal.id);
                          }}
                          className="px-3 py-1 bg-red-700/10 text-sm rounded hover:bg-red-700/20 transition text-red-400"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInProgress(goal.id);
                          }}
                          className="px-3 py-1 bg-cyan-500 text-sm rounded text-white hover:opacity-90 transition"
                        >
                          {goal.inProgress ? 'Stop' : 'Start'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-gray-800">
                      <td colSpan={5} className="p-6 border-t border-gray-600">
                        {isEditing ? (
                          <div className="space-y-4">
                            {goal.subGoals.map((sub, idx) => (
                              <input
                                key={sub.id}
                                type="text"
                                value={sub.text}
                                onChange={(e) => updateSubGoal(goal.id, sub.id, e.target.value)}
                                placeholder={`Sub-goal ${idx + 1}...`}
                                className="w-full bg-white/5 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-cyan-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {goal.subGoals
                              .filter(s => s.text.trim())
                              .map((sub) => (
                                <div key={sub.id} className="flex items-center gap-4 group">
                                  <div className="w-4 h-4 rounded-full border-2 border-cyan-500 bg-cyan-500/20" />
                                  <p className="text-lg text-gray-300">{sub.text}</p>
                                  <button className="ml-auto opacity-0 group-hover:opacity-100 transition">
                                    <SparklesIcon className="w-4 h-4 text-cyan-400" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}