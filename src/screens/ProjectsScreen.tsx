// src/screens/ProjectsScreen.tsx

// 👇 РАСКОММЕНТИРУЙТЕ ЭТОТ ИМПОРТ В ВАШЕМ ПРОЕКТЕ:
// import { useGoalsStore } from '../store/goals';

import { 
  ChevronRight, 
  Calendar, 
  Play, 
  CheckCircle2, 
  Circle, 
  Sparkles 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { create } from 'zustand'; // Только для мок-стора, можно удалить

// --- УТИЛИТЫ ---
const cn = (...classes: ClassValue[]) => clsx(classes);

// --- MOCK STORE (ОБНОВЛЕН: добавлен toggleSubGoal) ---
interface SubGoal { id: string; text: string; completed: boolean; }
interface Goal { id: string; title: string; inProgress: boolean; subGoals: SubGoal[]; }
interface GoalsStore { 
  goals: Goal[]; 
  toggleInProgress: (id: string) => void;
  toggleSubGoal: (goalId: string, subGoalId: string) => void; 
}

const useGoalsStore = create<GoalsStore>((set) => ({
  goals: [
    {
      id: Date.now().toString(),
      title: "Удвоить вовлечённость в блоге",
      inProgress: false,
      subGoals: [
        { id: '1', text: "Анализ текущей аудитории", completed: true },
        { id: '2', text: "Создание контент-плана", completed: false },
        { id: '3', text: "Настройка аналитики", completed: false },
        { id: '4', text: "Запуск А/Б тестов", completed: false },
      ]
    },
    {
      id: (Date.now() - 100000).toString(),
      title: "Запустить новый продукт",
      inProgress: true,
      subGoals: [
        { id: '1', text: "Исследование рынка", completed: true },
        { id: '2', text: "Разработка MVP", completed: false },
        { id: '3', text: "Тестирование с пользователями", completed: false }, 
      ]
    },
    {
      id: (Date.now() - 200000).toString(),
      title: "Сэкономить 50 000 ₽",
      inProgress: false,
      subGoals: [
        { id: '1', text: "Аудит расходов", completed: true },
        { id: '2', text: "Оптимизация подписок", completed: true },
        { id: '3', text: "Создание бюджета", completed: false },
      ]
    }
  ],
  toggleInProgress: (id) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, inProgress: !g.inProgress } : g)
  })),
  toggleSubGoal: (goalId, subGoalId) => set((state) => ({
    goals: state.goals.map(g => 
      g.id === goalId 
        ? { 
            ...g, 
            subGoals: g.subGoals.map(s => 
              s.id === subGoalId ? { ...s, completed: !s.completed } : s
            ) 
          } 
        : g
    )
  }))
}));
// -----------------------------------------------------------------------


export default function ProjectsScreen() {
  const { goals, toggleInProgress, toggleSubGoal } = useGoalsStore();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // Логика авто-выбора последней цели
  useEffect(() => {
    if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[goals.length - 1].id);
    }
  }, [goals, selectedGoalId]);

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pb-24 text-zinc-500">
        <p className="text-lg">Нет целей. Создайте первую!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 pt-6 pb-32 font-sans selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Проекты & Роадмапы</h1>
          <p className="text-zinc-400 text-sm">
            Управляйте целями и декомпозируйте шаги
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            // Расчет прогресса на основе реальных данных (completed: true)
            const totalSteps = goal.subGoals.length;
            const completedSteps = goal.subGoals.filter(s => s.completed).length;
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
            
            const isOpen = selectedGoalId === goal.id;

            const createdDate = new Date(parseInt(goal.id)).toLocaleDateString('ru', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={goal.id}
                onClick={() => setSelectedGoalId(isOpen ? null : goal.id)}
                className={cn(
                  "relative w-full overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer group",
                  "bg-[#121212] border-white/5 hover:border-blue-500/30",
                  isOpen ? "border-blue-500/50 bg-[#18181b]" : "hover:bg-[#18181b]"
                )}
              >
                <div className="p-5">
                  {/* Card Header Flex Container */}
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Left side: Title & Meta */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <h3 className="font-semibold text-[17px] leading-snug text-zinc-100 truncate pr-2">
                        {goal.title}
                      </h3>
                      
                      {/* Meta Info Row */}
                      <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 opacity-70" />
                          <span>{createdDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {/* ИЗМЕНЕНИЕ ЦВЕТА: Всегда синий (blue-400) */}
                          <span className="text-blue-400 transition-colors">
                            {progress}%
                          </span>
                          <span className="opacity-70">выполнено</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Chevron */}
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 text-zinc-500 transition-transform duration-300 flex-shrink-0 mt-1",
                        isOpen && "rotate-90 text-blue-400"
                      )}
                    />
                  </div>

                  {/* Progress Bar Container */}
                  <div className="mt-4 h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                    {/* ИЗМЕНЕНИЕ ЦВЕТА: Всегда синий (bg-blue-500) */}
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out bg-blue-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Expanded Content Area */}
                  {isOpen && (
                    <div className="mt-5 space-y-1 animate-in slide-in-from-top-2 fade-in duration-300">
                      {goal.subGoals.map((sub, idx) => {
                          const isInProgress = idx === 0 && goal.inProgress; // Примерная логика "в работе"

                          return (
                            <div
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubGoal(goal.id, sub.id);
                              }}
                              className="flex items-center gap-3 group p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer select-none"
                            >
                              {/* Status Icon */}
                              <div className="flex-shrink-0 flex items-center justify-center">
                                {sub.completed ? (
                                  // ИЗМЕНЕНИЕ ЦВЕТА: CheckCircle2 теперь синий
                                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                ) : isInProgress ? (
                                  <div className="w-5 h-5 rounded-full border-[2px] border-blue-500 bg-blue-500/10 animate-pulse" />
                                ) : (
                                  <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                                )}
                              </div>
                              
                              {/* Step Title */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-[14px] font-medium leading-tight truncate transition-colors",
                                    sub.completed ? "text-zinc-500 line-through decoration-zinc-600" : "text-zinc-200"
                                  )}
                                >
                                  {sub.text}
                                </p>
                              </div>

                              {/* AI Button (Visible on Hover/Active if not completed) */}
                              {isInProgress && !sub.completed && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert('AI decomposition coming soon ✨');
                                  }}
                                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 text-xs py-1 px-2.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center border border-blue-500/20"
                                >
                                  <Sparkles className="w-3 h-3 mr-1.5" />
                                  Разложить
                                </button>
                              )}
                            </div>
                          );
                        })}

                      {/* Main Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInProgress(goal.id);
                        }}
                        className={cn(
                          "w-full mt-5 h-11 rounded-xl font-semibold text-[15px] transition-all flex items-center justify-center relative overflow-hidden",
                          goal.inProgress 
                            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-white/5" 
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500/50",
                          "active:scale-[0.98]"
                        )}
                      >
                        {goal.inProgress ? (
                          <>
                             <div className="w-2 h-2 bg-zinc-400 rounded-full mr-2 animate-pulse" />
                             В работе
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Начать работу
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}