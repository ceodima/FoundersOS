import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cloudWrapper from '../helpers/cloudStorageWrapper';
import { createJSONStorage } from 'zustand/middleware';

interface SubGoal {
  id: string;
  text: string;
}

interface Goal {
  id: string;
  title: string;
  subGoals: SubGoal[];
  inProgress: boolean;
}

interface GoalsStore {
  goals: Goal[];
  addGoal: (title: string) => void;
  updateSubGoal: (goalId: string, subId: string, text: string) => void;
  toggleInProgress: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (title) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              id: Date.now().toString(),
              title: title.trim(),
              inProgress: false,
              subGoals: [
                { id: '1', text: '' },
                { id: '2', text: '' },
                { id: '3', text: '' },
              ],
            },
          ],
        })),
      updateSubGoal: (goalId, subId, text) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  subGoals: g.subGoals.map((s) =>
                    s.id === subId ? { ...s, text } : s
                  ),
                }
              : g
          ),
        })),
      toggleInProgress: (goalId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, inProgress: !g.inProgress } : g
          ),
        })),
      deleteGoal: (goalId) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
        })),
    }),
    {
      name: 'founders-goals',
      storage: createJSONStorage(() => cloudWrapper),
      onRehydrateStorage: (state) => {
        try {
          // If we are running inside Telegram and cloud storage is supported, attempt to sync
          // the rehydrated state to cloud as a best-effort sync. This ensures local changes
          // are propagated to the user's cloud storage once their environment supports it.
          // We do not await this call here to keep hydration fast.
          import('@tma.js/sdk').then(({ cloudStorage }) => {
            if (typeof cloudStorage?.isSupported === 'function' ? cloudStorage.isSupported() : cloudStorage?.isSupported) {
              cloudStorage.setItem('founders-goals', JSON.stringify(state)).catch(() => {});
            }
          });
        } catch (e) {
          // ignore
        }
      },
    }
  )
);