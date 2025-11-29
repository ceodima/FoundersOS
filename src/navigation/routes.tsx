import type { ComponentType } from 'react';

import CreateScreen from '../screens/CreateScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import FinanceScreen from '../screens/FinanceScreen';
import HabitsScreen from '../screens/HabitsScreen';

interface Route {
  path: string;
  Component: ComponentType<any>;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: CreateScreen, title: 'Create' },
  { path: '/projects', Component: ProjectsScreen, title: 'Projects' },
  { path: '/finance', Component: FinanceScreen, title: 'Finance' },
  { path: '/habits', Component: HabitsScreen, title: 'Habits' },
];
