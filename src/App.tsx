import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ProjectsProvider } from "./context/ProjectsContext";
import { LifeDesksProvider } from "./context/LifeDesksContext";
import Layout from "./components/Layout";
import Create from "./pages/Create";
import Projects from "./pages/Projects";
import Timer from "./pages/Timer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LifeDesksProvider>
        <ProjectsProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Create />} />
                <Route path="projects" element={<Projects />} />
                <Route path="timer" element={<Timer />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </ProjectsProvider>
      </LifeDesksProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
