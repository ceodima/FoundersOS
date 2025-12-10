import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Wallet,
  CreditCard,
  PiggyBank,
} from "lucide-react";

const financialGoals = [
  {
    title: "Накопить на оборудование",
    target: 150000,
    current: 98000,
    deadline: "Март 2025",
  },
  {
    title: "Выйти на доход 200К",
    target: 200000,
    current: 165000,
    deadline: "Февраль 2025",
  },
];

const monthlyData = {
  income: { fact: 165000, plan: 180000 },
  expenses: { total: 92000, byCategory: [
    { name: "Софт/подписки", amount: 12000, color: "text-accent" },
    { name: "Реклама", amount: 35000, color: "text-primary" },
    { name: "Аренда студии", amount: 25000, color: "text-warning" },
    { name: "Прочее", amount: 20000, color: "text-muted-foreground" },
  ]},
  savings: 73000,
};

export default function Finance() {
  return (
    <div className="min-h-screen p-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Финансовый Трекер</h1>
          <p className="text-muted-foreground">
            Следите за доходами, расходами и целями
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Доход</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {(monthlyData.income.fact / 1000).toFixed(0)}К
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              План: {(monthlyData.income.plan / 1000).toFixed(0)}К
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Траты</span>
            </div>
            <p className="text-2xl font-bold text-destructive">
              {(monthlyData.expenses.total / 1000).toFixed(0)}К
            </p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Остаток</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {(monthlyData.savings / 1000).toFixed(0)}К
            </p>
          </Card>
        </div>

        {/* Expenses Breakdown */}
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Wallet className="w-4 h-4 text-accent" />
              <span>Расходы по категориям</span>
            </div>

            <div className="space-y-3">
              {monthlyData.expenses.byCategory.map((cat, idx) => {
                const percentage = (
                  (cat.amount / monthlyData.expenses.total) *
                  100
                ).toFixed(0);
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={cat.color}>{cat.name}</span>
                      <span className="font-semibold">
                        {(cat.amount / 1000).toFixed(0)}К ({percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={Number(percentage)}
                      className="h-1.5"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Financial Goals */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="w-4 h-4 text-accent" />
            <span>Финансовые Цели</span>
          </div>

          {financialGoals.map((goal, idx) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <Card
                key={idx}
                className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{goal.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {goal.deadline}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {(goal.current / 1000).toFixed(0)}К
                      </p>
                      <p className="text-xs text-muted-foreground">
                        из {(goal.target / 1000).toFixed(0)}К
                      </p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    Осталось: {((goal.target - goal.current) / 1000).toFixed(0)}
                    К
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
