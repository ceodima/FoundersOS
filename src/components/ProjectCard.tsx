import { useState, useRef } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Play,
  Loader2,
  CheckCheck,
  Plus,
  Trash2
} from "lucide-react";
import { triggerHaptic, type TelegramTheme } from "@/hooks/useTelegramTheme";

export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Project {
  id: number;
  title: string;
  date: string;
  progress: number;
  isStarted: boolean;
  isCompleted: boolean;
  deskId: string;
  subtasks: Subtask[];
}

interface ProjectCardProps {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
  onToggleSubtask: (projectId: number, subtaskIndex: number) => void;
  onStartWork: (projectId: number) => void;
  onCompleteProject: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
  onUpdateSubtask: (projectId: number, subtaskIndex: number, title: string) => void;
  onAddSubtask: (projectId: number) => void;
  onDeleteSubtask: (projectId: number, subtaskIndex: number) => void;
  theme: TelegramTheme;
}

const GREEN_COLOR = '#10B981';

export default function ProjectCard({
  project,
  expanded,
  onToggle,
  onToggleSubtask,
  onStartWork,
  onCompleteProject,
  onDeleteProject,
  onUpdateSubtask,
  onAddSubtask,
  onDeleteSubtask,
  theme,
}: ProjectCardProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    if (!project.isStarted || project.isCompleted) return;
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      onCompleteProject(project.id);
      setIsPressing(false);
      triggerHaptic('success');
    }, 3000);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
  };

  const startDeletePress = () => {
    if (!project.isCompleted) return;
    setIsDeleting(true);
    deleteTimerRef.current = setTimeout(() => {
      onDeleteProject(project.id);
      setIsDeleting(false);
      triggerHaptic('success');
    }, 3000);
  };

  const cancelDeletePress = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    setIsDeleting(false);
  };

  const handleSubtaskClick = (idx: number) => {
    if (!project.isCompleted) {
      onToggleSubtask(project.id, idx);
      triggerHaptic('light');
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 mb-4 border border-white/5 transition-all duration-300 ${
        expanded ? 'ring-1 ring-blue-500/30' : ''
      }`}
      style={{ 
        backgroundColor: theme.secondary_bg_color, 
        borderColor: expanded ? theme.link_color : 'rgba(255,255,255,0.05)' 
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start cursor-pointer" onClick={onToggle}>
        <div className="flex-1">
          <h3
            className="font-bold mb-2 text-[15px] transition-colors"
            style={{ color: project.isCompleted ? GREEN_COLOR : theme.text_color }}
          >
            {project.title}
          </h3>

          <div className="flex items-center gap-3 text-xs mb-3">
            <span className="flex items-center gap-1" style={{ color: theme.hint_color }}>
              🗓 {project.date}
            </span>
            <span
              className="font-medium"
              style={{ 
                color: project.isCompleted 
                  ? GREEN_COLOR 
                  : (project.progress > 40 ? theme.link_color : theme.hint_color) 
              }}
            >
              {project.progress}% complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-[#2C2C2E] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${project.progress}%`,
                backgroundColor: project.isCompleted ? GREEN_COLOR : theme.link_color,
              }}
            />
          </div>
        </div>

        <div className="ml-4 mt-1" style={{ color: theme.hint_color }}>
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-6 pt-4 border-t border-white/5 animate-fade-in">
          <div className="space-y-3 mb-6">
            {project.subtasks.map((task, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 group p-2 rounded-lg transition-colors -mx-2 ${
                  !project.isCompleted ? 'hover:bg-white/5' : 'opacity-60'
                }`}
              >
                <button
                  onClick={() => handleSubtaskClick(idx)}
                  className="shrink-0"
                  disabled={project.isCompleted}
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} style={{ color: GREEN_COLOR }} />
                  ) : (
                    <Circle size={20} style={{ color: theme.hint_color }} />
                  )}
                </button>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => onUpdateSubtask(project.id, idx, e.target.value)}
                  placeholder="Enter subtask..."
                  disabled={project.isCompleted}
                  className={`flex-1 bg-transparent text-sm outline-none transition-all ${
                    task.completed ? 'line-through' : ''
                  }`}
                  style={{ 
                    color: task.completed ? theme.hint_color : theme.text_color,
                  }}
                />
                {!project.isCompleted && (
                  <button
                    onClick={() => {
                      onDeleteSubtask(project.id, idx);
                      triggerHaptic('light');
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
                    style={{ color: theme.hint_color }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            {!project.isCompleted && (
              <button
                onClick={() => {
                  onAddSubtask(project.id);
                  triggerHaptic('light');
                }}
                className="flex items-center gap-2 text-sm p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors w-full"
                style={{ color: theme.link_color }}
              >
                <Plus size={18} />
                Add subtask
              </button>
            )}
          </div>

          {/* Action Button with Long Press Animation */}
          <div className="relative w-full h-12 rounded-xl overflow-hidden touch-none select-none">
            <div
              className="absolute top-0 left-0 h-full transition-all ease-linear z-0"
              style={{
                width: isPressing || isDeleting ? '100%' : '0%',
                transitionDuration: isPressing || isDeleting ? '3000ms' : '200ms',
                backgroundColor: isDeleting ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
              }}
            />

            <button
              onClick={() => !project.isStarted && !project.isCompleted && onStartWork(project.id)}
              onMouseDown={project.isCompleted ? startDeletePress : (project.isStarted ? startPress : undefined)}
              onMouseUp={project.isCompleted ? cancelDeletePress : (project.isStarted ? cancelPress : undefined)}
              onMouseLeave={project.isCompleted ? cancelDeletePress : (project.isStarted ? cancelPress : undefined)}
              onTouchStart={project.isCompleted ? startDeletePress : (project.isStarted ? startPress : undefined)}
              onTouchEnd={project.isCompleted ? cancelDeletePress : (project.isStarted ? cancelPress : undefined)}
              className="absolute inset-0 w-full font-medium flex items-center justify-center gap-2 transition-all duration-300 z-10"
              style={{
                backgroundColor: project.isCompleted
                  ? (isDeleting ? 'rgba(239, 68, 68, 0.1)' : GREEN_COLOR)
                  : project.isStarted
                    ? 'rgba(16, 185, 129, 0.1)'
                    : theme.link_color,
                color: project.isCompleted
                  ? (isDeleting ? '#EF4444' : theme.text_color)
                  : project.isStarted
                    ? GREEN_COLOR
                    : theme.text_color,
                cursor: project.isCompleted ? 'grab' : (project.isStarted ? 'grab' : 'pointer'),
              }}
            >
              {project.isCompleted ? (
                <>
                  <CheckCheck size={18} />
                  {isDeleting ? 'Deleting...' : 'Completed'}
                </>
              ) : project.isStarted ? (
                <>
                  <Loader2 size={16} className={isPressing ? 'animate-spin' : ''} />
                  {isPressing ? 'Hold...' : 'In Progress'}
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  Start Work
                </>
              )}
            </button>
          </div>
          
          {project.isStarted && !project.isCompleted && (
            <div className="text-center mt-2 text-[10px]" style={{ color: theme.hint_color }}>
              Hold for 3 sec to complete
            </div>
          )}
          
          {project.isCompleted && (
            <div className="text-center mt-2 text-[10px]" style={{ color: theme.hint_color }}>
              Hold for 3 sec to delete
            </div>
          )}
        </div>
      )}
    </div>
  );
}
