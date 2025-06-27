
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Phases from "./pages/Phases";
import WBS from "./pages/WBS";
import WBSDetail from "./pages/WBSDetail";
import Tasks from "./pages/Tasks";
import CostManagement from "./pages/CostManagement";
import LessonsLearned from "./pages/LessonsLearned";
import ClosureChecklist from "./pages/ClosureChecklist";
import Team from "./pages/Team";
import WBSDictionaryPage from "./pages/WBSDictionary";
import Requirements from "./pages/Requirements";
import ScopeStatement from "./pages/ScopeStatement";
import ScopeValidation from "./pages/ScopeValidation";
import ProjectCharter from "./pages/ProjectCharter";
import ProjectLifecycle from "./pages/ProjectLifecycle";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProjectProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tap" element={<ProjectCharter />} />
              <Route path="/ciclo-vida" element={<ProjectLifecycle />} />
              <Route path="/cronograma" element={<Schedule />} />
              <Route path="/fases" element={<Phases />} />
              <Route path="/eap" element={<WBS />} />
              <Route path="/eap/:id" element={<WBSDetail />} />
              <Route path="/tarefas" element={<Tasks />} />
              <Route path="/custos" element={<CostManagement />} />
              <Route path="/licoes" element={<LessonsLearned />} />
              <Route path="/fechamento" element={<ClosureChecklist />} />
              <Route path="/equipe" element={<Team />} />
              <Route path="/dicionario" element={<WBSDictionaryPage />} />
              <Route path="/requisitos" element={<Requirements />} />
              <Route path="/escopo" element={<ScopeStatement />} />
              <Route path="/validacao" element={<ScopeValidation />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
