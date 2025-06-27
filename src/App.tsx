
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
              <Route path="/fases" element={<Phases />} />
              <Route path="/eap" element={<WBS />} />
              <Route path="/eap/:id" element={<WBSDetail />} />
              <Route path="/tarefas" element={<Tasks />} />
              <Route path="/custos" element={<CostManagement />} />
              <Route path="/licoes" element={<LessonsLearned />} />
              <Route path="/fechamento" element={<ClosureChecklist />} />
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
