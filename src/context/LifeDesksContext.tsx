import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Desk {
  id: string;
  name: string;
  letter: string;
  color: string;
  icon: string;
}

interface LifeDesksContextType {
  desks: Desk[];
  activeDesk: Desk;
  setActiveDesk: (desk: Desk) => void;
  updateDesk: (id: string, updates: Partial<Omit<Desk, 'id'>>) => void;
  reorderDesks: (newOrder: Desk[]) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
}

const defaultDesks: Desk[] = [
  { id: 'work', name: 'Work', letter: 'W', color: '#3B82F6', icon: 'W' },
  { id: 'personal', name: 'Personal', letter: 'P', color: '#3B82F6', icon: 'P' },
  { id: 'family', name: 'Family', letter: 'F', color: '#3B82F6', icon: 'F' },
  { id: 'health', name: 'Health', letter: 'H', color: '#3B82F6', icon: 'H' },
];

const STORAGE_KEY = 'life-desks';
const ACTIVE_DESK_KEY = 'active-desk';
const ONBOARDING_KEY = 'life-desks-onboarding';

const LifeDesksContext = createContext<LifeDesksContextType | null>(null);

export function LifeDesksProvider({ children }: { children: ReactNode }) {
  const [desks, setDesks] = useState<Desk[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultDesks;
  });

  const [activeDesk, setActiveDeskState] = useState<Desk>(() => {
    const storedId = localStorage.getItem(ACTIVE_DESK_KEY);
    const storedDesks = localStorage.getItem(STORAGE_KEY);
    const deskList = storedDesks ? JSON.parse(storedDesks) : defaultDesks;
    return deskList.find((d: Desk) => d.id === storedId) || deskList[0];
  });

  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(desks));
  }, [desks]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_DESK_KEY, activeDesk.id);
  }, [activeDesk]);

  const setActiveDesk = (desk: Desk) => {
    setActiveDeskState(desk);
  };

  const updateDesk = (id: string, updates: Partial<Omit<Desk, 'id'>>) => {
    setDesks(prev => prev.map(desk => 
      desk.id === id ? { ...desk, ...updates } : desk
    ));
    // Update active desk if it was modified
    if (activeDesk.id === id) {
      setActiveDeskState(prev => ({ ...prev, ...updates }));
    }
  };

  const reorderDesks = (newOrder: Desk[]) => {
    setDesks(newOrder);
  };

  const setHasSeenOnboarding = (seen: boolean) => {
    setHasSeenOnboardingState(seen);
    localStorage.setItem(ONBOARDING_KEY, seen.toString());
  };

  return (
    <LifeDesksContext.Provider value={{
      desks,
      activeDesk,
      setActiveDesk,
      updateDesk,
      reorderDesks,
      hasSeenOnboarding,
      setHasSeenOnboarding,
    }}>
      {children}
    </LifeDesksContext.Provider>
  );
}

export function useLifeDesks() {
  const context = useContext(LifeDesksContext);
  if (!context) {
    throw new Error("useLifeDesks must be used within LifeDesksProvider");
  }
  return context;
}
