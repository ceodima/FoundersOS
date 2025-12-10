import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Project } from "@/components/ProjectCard";

interface ProjectsContextType {
  projects: Project[];
  addProject: (goal: string, deskId: string) => void;
  toggleSubtask: (projectId: number, subtaskIndex: number) => void;
  startWork: (projectId: number) => void;
  completeProject: (projectId: number) => void;
  deleteProject: (projectId: number) => void;
  updateSubtask: (projectId: number, subtaskIndex: number, title: string) => void;
  addSubtask: (projectId: number) => void;
  deleteSubtask: (projectId: number, subtaskIndex: number) => void;
  getProjectsForDesk: (deskId: string) => Project[];
}

const PROJECTS_STORAGE_KEY = 'founders-os-projects';

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Double blog engagement',
    date: 'Jan 15',
    progress: 25,
    isStarted: false,
    isCompleted: false,
    deskId: 'work',
    subtasks: [
      { title: 'Analyze current audience', completed: true },
      { title: 'Create content plan', completed: false },
      { title: 'Set up analytics', completed: false },
      { title: 'Launch A/B tests', completed: false },
    ]
  },
  {
    id: 2,
    title: 'Launch new product',
    date: 'Feb 1',
    progress: 50,
    isStarted: false,
    isCompleted: false,
    deskId: 'work',
    subtasks: [
      { title: 'Market research', completed: true },
      { title: 'MVP prototyping', completed: false },
    ]
  },
  {
    id: 3,
    title: 'Family vacation planning',
    date: 'Mar 1',
    progress: 0,
    isStarted: false,
    isCompleted: false,
    deskId: 'family',
    subtasks: [
      { title: 'Choose destination', completed: false },
      { title: 'Book flights', completed: false },
    ]
  },
  {
    id: 4,
    title: 'Run a marathon',
    date: 'Jun 1',
    progress: 10,
    isStarted: true,
    isCompleted: false,
    deskId: 'health',
    subtasks: [
      { title: 'Create training schedule', completed: true },
      { title: 'Buy running shoes', completed: false },
      { title: 'Join running club', completed: false },
    ]
  },
];

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultProjects;
      }
    }
    return defaultProjects;
  });

  // Сохраняем проекты в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const calculateProgress = (subtasks: { completed: boolean }[]) => {
    if (subtasks.length === 0) return 0;
    const completedCount = subtasks.filter(t => t.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };

  const addProject = (goal: string, deskId: string) => {
    const newProject: Project = {
      id: Date.now(),
      title: goal,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      progress: 0,
      isStarted: false,
      isCompleted: false,
      deskId,
      subtasks: [
        { title: '', completed: false },
        { title: '', completed: false },
        { title: '', completed: false },
      ]
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const toggleSubtask = (projectId: number, subtaskIndex: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      const newSubtasks = [...project.subtasks];
      newSubtasks[subtaskIndex] = {
        ...newSubtasks[subtaskIndex],
        completed: !newSubtasks[subtaskIndex].completed
      };

      return {
        ...project,
        subtasks: newSubtasks,
        progress: calculateProgress(newSubtasks)
      };
    }));
  };

  const startWork = (projectId: number) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, isStarted: true } : project
    ));
  };

  const completeProject = (projectId: number) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId
        ? {
            ...project,
            isCompleted: true,
            progress: 100,
            subtasks: project.subtasks.map(t => ({ ...t, completed: true }))
          }
        : project
    ));
  };

  const updateSubtask = (projectId: number, subtaskIndex: number, title: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;
      const newSubtasks = [...project.subtasks];
      newSubtasks[subtaskIndex] = { ...newSubtasks[subtaskIndex], title };
      return { ...project, subtasks: newSubtasks };
    }));
  };

  const addSubtask = (projectId: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        subtasks: [...project.subtasks, { title: '', completed: false }],
        progress: calculateProgress([...project.subtasks, { completed: false }])
      };
    }));
  };

  const deleteSubtask = (projectId: number, subtaskIndex: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;
      const newSubtasks = project.subtasks.filter((_, idx) => idx !== subtaskIndex);
      return {
        ...project,
        subtasks: newSubtasks,
        progress: calculateProgress(newSubtasks)
      };
    }));
  };

  const deleteProject = (projectId: number) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getProjectsForDesk = (deskId: string) => {
    return projects.filter(project => project.deskId === deskId);
  };

  return (
    <ProjectsContext.Provider value={{ 
      projects, 
      addProject, 
      toggleSubtask, 
      startWork, 
      completeProject,
      deleteProject,
      updateSubtask,
      addSubtask,
      deleteSubtask,
      getProjectsForDesk
    }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
}
