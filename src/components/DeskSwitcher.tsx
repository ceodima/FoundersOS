import { useState, useRef, useEffect, useCallback } from "react";
import { X, GripVertical, Check } from "lucide-react";
import { useLifeDesks, Desk } from "@/context/LifeDesksContext";
import { useProjects } from "@/context/ProjectsContext";
import type { TelegramTheme } from "@/hooks/useTelegramTheme";
import { disableWebViewSwipes, enableWebViewSwipes } from "@/hooks/useTelegramTheme";
interface DeskSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  theme: TelegramTheme;
}
const DESK_HEIGHT = 180;
const DESK_GAP = 16;
const BLUE_COLOR = '#3B82F6';
const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'];
export default function DeskSwitcher({
  isOpen,
  onClose,
  theme
}: DeskSwitcherProps) {
  const {
    desks,
    activeDesk,
    setActiveDesk,
    updateDesk,
    reorderDesks
  } = useLifeDesks();
  const {
    getProjectsForDesk
  } = useProjects();
  const [selectedIndex, setSelectedIndex] = useState(() => desks.findIndex(d => d.id === activeDesk.id));
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDesk, setEditingDesk] = useState<Desk | null>(null);
  const [editName, setEditName] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(desks.findIndex(d => d.id === activeDesk.id));
      disableWebViewSwipes();
    } else {
      enableWebViewSwipes();
    }
    return () => enableWebViewSwipes();
  }, [isOpen, activeDesk.id, desks]);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isEditMode) return;
    e.preventDefault(); // Prevent text selection
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    isDragging.current = true;
  }, [isEditMode]);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || isEditMode) return;
    e.preventDefault(); // Prevent text selection and scrolling
    const deltaY = e.touches[0].clientY - startY.current;
    currentY.current = deltaY;

    // Calculate which desk should be selected based on drag distance
    const threshold = DESK_HEIGHT / 2;
    const indexChange = Math.round(-deltaY / (DESK_HEIGHT + DESK_GAP));
    const newIndex = Math.max(0, Math.min(desks.length - 1, selectedIndex + indexChange));
    if (Math.abs(deltaY) > threshold) {
      setSelectedIndex(newIndex);
      startY.current = e.touches[0].clientY;
    }
  }, [selectedIndex, desks.length, isEditMode]);
  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);
  const handleSelect = (index: number) => {
    if (isEditMode) {
      const desk = desks[index];
      setEditingDesk(desk);
      setEditName(desk.name);
    } else {
      setActiveDesk(desks[index]);
      onClose();
    }
  };
  const handleSaveEdit = () => {
    if (editingDesk && editName.trim()) {
      updateDesk(editingDesk.id, {
        name: editName.trim(),
        letter: editName.trim()[0].toUpperCase()
      });
    }
    setEditingDesk(null);
  };
  const handleColorChange = (color: string) => {
    if (editingDesk) {
      updateDesk(editingDesk.id, {
        color
      });
    }
  };
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newDesks = [...desks];
    const [dragged] = newDesks.splice(draggedIndex, 1);
    newDesks.splice(index, 0, dragged);
    reorderDesks(newDesks);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
    backgroundColor: 'rgba(0,0,0,0.85)'
  }}>
      {/* Close button */}
      <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{
      backgroundColor: theme.secondary_bg_color,
      color: theme.text_color
    }}>
        <X size={20} />
      </button>

      {/* Edit button */}
      <button onClick={() => {
      if (isEditMode) {
        setEditingDesk(null);
      }
      setIsEditMode(!isEditMode);
    }} className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium transition-colors" style={{
      backgroundColor: isEditMode ? theme.button_color : theme.secondary_bg_color,
      color: isEditMode ? theme.button_text_color : theme.text_color
    }}>
        {isEditMode ? 'Done' : 'Edit'}
      </button>

      {/* Vertical desk carousel */}
      <div ref={containerRef} className="w-full max-w-sm px-6 overflow-hidden select-none" style={{
      height: '70vh',
      touchAction: 'none'
    }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="flex flex-col gap-4 transition-transform duration-300 ease-out select-none" style={{
        transform: `translateY(calc(50% - ${selectedIndex * (DESK_HEIGHT + DESK_GAP)}px - ${DESK_HEIGHT / 2}px))`,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}>
          {desks.map((desk, index) => {
          const isSelected = index === selectedIndex;
          const projects = getProjectsForDesk(desk.id);
          const activeProjects = projects.filter(p => !p.isCompleted).slice(0, 2);
          const totalProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0;
          return <div key={desk.id} onClick={() => handleSelect(index)} draggable={isEditMode} onDragStart={() => handleDragStart(index)} onDragOver={e => {
            e.preventDefault();
            handleDragOver(index);
          }} onDragEnd={handleDragEnd} className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer ${isSelected ? 'scale-100 opacity-100' : 'scale-90 opacity-60'} ${draggedIndex === index ? 'opacity-50' : ''}`} style={{
            height: DESK_HEIGHT,
            backgroundColor: `${BLUE_COLOR}20`,
            border: `2px solid ${isSelected ? BLUE_COLOR : 'transparent'}`
          }}>
                {isEditMode && <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} style={{
                color: BLUE_COLOR
              }} />
                  </div>}

                <div className="flex items-center gap-3 mb-3 pl-6">
                  <div style={{
                backgroundColor: BLUE_COLOR
              }} className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-primary text-primary">
                    {desk.letter}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{
                  color: theme.text_color
                }}>
                      {desk.name}
                    </h3>
                    <p className="text-xs" style={{
                  color: theme.hint_color
                }}>
                      {projects.length} projects
                    </p>
                  </div>
                  
                  {/* Progress ring */}
                  <div className="ml-auto relative w-12 h-12">
                    <svg className="w-12 h-12 -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke={`${BLUE_COLOR}30`} strokeWidth="4" />
                      <circle cx="24" cy="24" r="20" fill="none" stroke={BLUE_COLOR} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${totalProgress / 100 * 125.6} 125.6`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{
                  color: BLUE_COLOR
                }}>
                      {totalProgress}%
                    </span>
                  </div>
                </div>

                {/* Active goals */}
                <div className="pl-6 space-y-1.5">
                  {activeProjects.length > 0 ? activeProjects.map((project, i) => <p key={i} className="text-sm font-medium truncate" style={{
                color: theme.text_color
              }}>
                        • {project.title}
                      </p>) : <p className="text-sm italic" style={{
                color: theme.hint_color
              }}>
                      No active goals
                    </p>}
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Desk edit modal */}
      {editingDesk && <div className="absolute inset-0 flex items-center justify-center z-60" style={{
      backgroundColor: 'rgba(0,0,0,0.7)'
    }} onClick={() => setEditingDesk(null)}>
          <div className="w-80 rounded-2xl p-5" style={{
        backgroundColor: theme.secondary_bg_color
      }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{
          color: theme.text_color
        }}>
              Edit Desk
            </h3>
            
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm mb-4 focus:outline-none" style={{
          backgroundColor: theme.bg_color,
          color: theme.text_color,
          border: `1px solid ${editingDesk.color}40`
        }} placeholder="Desk name" />

            <p className="text-xs mb-2" style={{
          color: theme.hint_color
        }}>Color</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {COLORS.map(color => <button key={color} onClick={() => handleColorChange(color)} className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95" style={{
            backgroundColor: color
          }}>
                  {editingDesk.color === color && <Check size={16} className="text-white" />}
                </button>)}
            </div>

            <button onClick={handleSaveEdit} className="w-full py-3 rounded-xl font-medium transition-colors" style={{
          backgroundColor: theme.button_color,
          color: theme.button_text_color
        }}>
              Save
            </button>
          </div>
        </div>}

      {/* Instruction text */}
      <p className="absolute bottom-8 left-0 right-0 text-center text-xs" style={{
      color: theme.hint_color
    }}>
        {isEditMode ? 'Tap a desk to edit • Drag to reorder' : 'Swipe up/down to browse • Tap to select'}
      </p>
    </div>;
}