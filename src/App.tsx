
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Layout from "@/components/Layout";

// Páginas Globais
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Páginas do Projeto (contextuais)
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectTAP from "./pages/ProjectTAP";
import ProjectPhases from "./pages/ProjectPhases";
import ProjectWBS from "./pages/ProjectWBS";
import ProjectTasks from "./pages/ProjectTasks";
import ProjectCosts from "./pages/ProjectCosts";
import ProjectRisks from "./pages/ProjectRisks";
import ProjectDocuments from "./pages/ProjectDocuments";
import ProjectCommunications from "./pages/ProjectCommunications";

// Páginas do Projeto (originais - mantidas para compatibilidade)
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
              {/* Navegação Global */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/projetos/novo" element={<NewProject />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/config" element={<Settings />} />
              
              {/* Navegação Contextual do Projeto */}
              <Route path="/projetos/:projectId/dashboard" element={<ProjectDashboard />} />
              <Route path="/projetos/:projectId/tap" element={<ProjectTAP />} />
              <Route path="/projetos/:projectId/fases" element={<ProjectPhases />} />
              <Route path="/projetos/:projectId/eap" element={<ProjectWBS />} />
              <Route path="/projetos/:projectId/tarefas" element={<ProjectTasks />} />
              <Route path="/projetos/:projectId/custos" element={<ProjectCosts />} />
              <Route path="/projetos/:projectId/riscos" element={<ProjectRisks />} />
              <Route path="/projetos/:projectId/documentos" element={<ProjectDocuments />} />
              <Route path="/projetos/:projectId/comunicacoes" element={<ProjectCommunications />} />
              
              {/* Projeto Específico (rotas originais mantidas) */}
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
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
