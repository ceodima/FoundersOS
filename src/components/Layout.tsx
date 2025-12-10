import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Rocket, Timer } from "lucide-react";
import { useTelegramTheme } from "@/hooks/useTelegramTheme";

const tabs = [
  { id: "create", path: "/", label: "Create", icon: Sparkles },
  { id: "projects", path: "/projects", label: "Projects", icon: Rocket },
  { id: "timer", path: "/timer", label: "Timer", icon: Timer },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTelegramTheme();

  const activeTab = location.pathname === "/" ? "create" : location.pathname.slice(1);

  return (
    <div 
      className="min-h-screen font-sans selection:bg-blue-500/30 transition-colors"
      style={{ backgroundColor: theme.bg_color }}
    >
      <div 
        className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden transition-colors"
        style={{ backgroundColor: theme.bg_color }}
      >
        <main className="h-screen overflow-y-auto">
          <Outlet context={{ theme }} />
        </main>

        {/* Bottom Navigation */}
        <nav
          className="fixed bottom-0 left-0 right-0 border-t border-white/10 px-6 py-3 pb-6 flex justify-around items-center z-50 transition-colors"
          style={{ backgroundColor: theme.secondary_bg_color }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-1 transition-colors duration-200"
                style={{ color: isActive ? theme.link_color : theme.hint_color }}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
