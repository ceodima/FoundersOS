import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/context/ProjectsContext";
import { useLifeDesks } from "@/context/LifeDesksContext";
import DeskSwitcher from "@/components/DeskSwitcher";
import { useLongPress } from "@/hooks/useLongPress";
import type { TelegramTheme } from "@/hooks/useTelegramTheme";
export default function Projects() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const {
    theme
  } = useOutletContext<{
    theme: TelegramTheme;
  }>();
  const {
    toggleSubtask,
    startWork,
    completeProject,
    deleteProject,
    updateSubtask,
    addSubtask,
    deleteSubtask,
    getProjectsForDesk
  } = useProjects();
  const {
    activeDesk
  } = useLifeDesks();
  const projects = getProjectsForDesk(activeDesk.id);
  const longPressHandlers = useLongPress({
    onLongPress: () => setIsSwitcherOpen(true),
    delay: 600
  });
  return <>
      <div className="flex flex-col h-full px-4 pt-8 pb-24" style={{
      color: theme.text_color
    }} {...longPressHandlers}>

        <div className="mb-6 mt-8">
          <h1 className="text-2xl font-bold mb-1">Projects </h1>
          <p className="text-xs" style={{
          color: theme.hint_color
        }}>
            Manage goals and break down steps
          </p>
        </div>

        <div className="overflow-y-auto no-scrollbar pb-10">
          {projects.length === 0 ? <div className="text-center py-12" style={{
          color: theme.hint_color
        }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{
            backgroundColor: `${activeDesk.color}20`
          }}>
                {activeDesk.icon}
              </div>
              <p className="text-sm">No projects in {activeDesk.name}</p>
              <p className="text-xs mt-1">Create your first project in the "Create" tab</p>
            </div> : projects.map(project => <ProjectCard key={project.id} project={project} expanded={expandedId === project.id} onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)} onToggleSubtask={toggleSubtask} onStartWork={startWork} onCompleteProject={completeProject} onDeleteProject={deleteProject} onUpdateSubtask={updateSubtask} onAddSubtask={addSubtask} onDeleteSubtask={deleteSubtask} theme={theme} />)}
        </div>
      </div>

      <DeskSwitcher isOpen={isSwitcherOpen} onClose={() => setIsSwitcherOpen(false)} theme={theme} />
    </>;
}