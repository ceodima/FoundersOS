import { useState } from 'react';
import TabBar from './components/TabBar';
import CreateScreen from './screens/CreateScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import FinanceScreen from './screens/FinanceScreen';
import HabitsScreen from './screens/HabitsScreen';

const screens = [
  CreateScreen,
  ProjectsScreen,
  FinanceScreen,
  HabitsScreen,
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const Screen = screens[activeTab];

  return (
    <>
      <Screen setTab={setActiveTab} />
      <TabBar active={activeTab} setActive={setActiveTab} />
    </>
  );
}