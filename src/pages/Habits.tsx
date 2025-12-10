import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Bell, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const habits = [
  { id: 1, title: "Ежедневный постинг", streak: 12, completed: true },
  { id: 2, title: "Утреннее чтение", streak: 8, completed: true },
  { id: 3, title: "Спорт/тренировка", streak: 5, completed: false },
  { id: 4, title: "Планирование дня", streak: 15, completed: true },
  { id: 5, title: "Медитация", streak: 3, completed: false },
];

const weekProgress = [
  { day: "Пн", completed: [1, 2, 4] },
  { day: "Вт", completed: [1, 2, 3, 4] },
  { day: "Ср", completed: [1, 2, 4, 5] },
  { day: "Чт", completed: [1, 3, 4] },
  { day: "Пт", completed: [1, 2, 4, 5] },
  { day: "Сб", completed: [2, 3] },
  { day: "Вс", completed: [] },
];

const motivationalQuote = {
  text: "Маленькие ежедневные улучшения — ключ к удивительным результатам.",
  author: "Робин Шарма",
};

export default function Habits() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [habitStates, setHabitStates] = useState(habits);

  const toggleHabit = (id: number) => {
    setHabitStates((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const totalCompleted = habitStates.filter((h) => h.completed).length;
  const completionPercentage = (totalCompleted / habitStates.length) * 100;

  return (
    <div className="min-h-screen p-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Трекер Привычек</h1>
          <p className="text-muted-foreground">
            Формируйте ежедневные ритуалы успеха
          </p>
        </div>

        {/* Quote of the Day */}
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <div className="flex gap-4">
            <Quote className="w-8 h-8 text-primary/50 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium italic leading-relaxed">
                "{motivationalQuote.text}"
              </p>
              <p className="text-xs text-muted-foreground">
                — {motivationalQuote.author}
              </p>
            </div>
          </div>
        </Card>

        {/* Daily Progress */}
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Прогресс сегодня</span>
              <span className="text-sm font-bold text-primary">
                {totalCompleted} / {habitStates.length}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </Card>

        {/* Today's Habits */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Привычки на сегодня</h2>
          {habitStates.map((habit) => (
            <Card
              key={habit.id}
              className={cn(
                "p-4 bg-card/50 backdrop-blur border-border/50 transition-all duration-300 cursor-pointer hover:border-primary/30",
                habit.completed && "bg-success/5 border-success/20"
              )}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium",
                      habit.completed && "text-muted-foreground line-through"
                    )}
                  >
                    {habit.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    🔥 Серия: {habit.streak} дней
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly Grid */}
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Неделя</h2>
            <div className="grid grid-cols-7 gap-2">
              {weekProgress.map((day, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs text-center text-muted-foreground font-medium">
                    {day.day}
                  </p>
                  <div className="space-y-1">
                    {habits.map((habit) => {
                      const isCompleted = day.completed.includes(habit.id);
                      return (
                        <div
                          key={habit.id}
                          className={cn(
                            "h-1.5 rounded-full transition-colors",
                            isCompleted
                              ? "bg-success"
                              : "bg-muted"
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Anti-Procrastination Assistant */}
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold">
                  Ассистент "Анти-Прокрастинация"
                </span>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ИИ присылает напоминания при простое в работе над проектом или
              пропуске привычки
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
