
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProject } from "@/contexts/ProjectContext";

// Importar componentes existentes
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Clients from "@/pages/Clients";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import InternalProjectDashboard from "@/pages/InternalProjectDashboard";
import Index from "@/pages/Index";
import ProjectCharter from "@/pages/ProjectCharter";
import ProjectLifecycle from "@/pages/ProjectLifecycle";
import Schedule from "@/pages/Schedule";
import Phases from "@/pages/Phases";
import WBS from "@/pages/WBS";
import Tasks from "@/pages/Tasks";
import CostManagement from "@/pages/CostManagement";
import Team from "@/pages/Team";
import WBSDictionaryPage from "@/pages/WBSDictionary";
import Requirements from "@/pages/Requirements";
import ScopeStatement from "@/pages/ScopeStatement";
import ScopeValidation from "@/pages/ScopeValidation";
import LessonsLearned from "@/pages/LessonsLearned";
import ClosureChecklist from "@/pages/ClosureChecklist";

// Componente placeholder para páginas ainda não implementadas
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">Esta página será implementada em breve.</p>
    </div>
  </div>
);

export default function Layout() {
  const { currentView, activeProject } = useProject();

  const renderContent = () => {
    // Se há um projeto ativo, renderizar baseado na view atual
    if (activeProject) {
      switch (currentView) {
        case 'project-dashboard':
          return <InternalProjectDashboard />;
        case 'tap':
          return <ProjectCharter />;
        case 'cronograma':
          return <Schedule />;
        case 'eap':
          return <WBS />;
        case 'dicionario':
          return <WBSDictionaryPage />;
        case 'escopo':
          return <ScopeStatement />;
        case 'requisitos':
          return <Requirements />;
        case 'tarefas':
          return <Tasks />;
        case 'equipe':
          return <Team />;
        case 'custos':
          return <CostManagement />;
        case 'fechamento':
          return <ClosureChecklist />;
        case 'licoes':
          return <LessonsLearned />;
        case 'validacao':
          return <ScopeValidation />;
        // Páginas do PMBOK ainda não implementadas
        case 'plano-custos':
          return <PlaceholderPage title="Plano de Custos" />;
        case 'plano-riscos':
          return <PlaceholderPage title="Plano de Riscos" />;
        case 'plano-qualidade':
          return <PlaceholderPage title="Plano de Qualidade" />;
        case 'plano-recursos':
          return <PlaceholderPage title="Plano de Recursos" />;
        case 'plano-comunicacoes':
          return <PlaceholderPage title="Plano de Comunicações" />;
        case 'plano-aquisicoes':
          return <PlaceholderPage title="Plano de Aquisições" />;
        case 'fornecedores':
          return <PlaceholderPage title="Gestão de Fornecedores" />;
        case 'entregas':
          return <PlaceholderPage title="Registro de Entregas" />;
        case 'desempenho':
          return <PlaceholderPage title="Desempenho (KPIs)" />;
        case 'riscos-controle':
          return <PlaceholderPage title="Riscos (Controle)" />;
        case 'mudancas':
          return <PlaceholderPage title="Gestão de Mudanças" />;
        case 'problemas':
          return <PlaceholderPage title="Registro de Problemas" />;
        case 'qualidade':
          return <PlaceholderPage title="Controle de Qualidade" />;
        case 'relatorios-projeto':
          return <PlaceholderPage title="Relatórios do Projeto" />;
        case 'comunicacoes':
          return <PlaceholderPage title="Comunicações" />;
        case 'relatorio-final':
          return <PlaceholderPage title="Relatório Final do Projeto" />;
        case 'aceitacao':
          return <PlaceholderPage title="Aceitação Formal do Cliente" />;
        case 'documentos':
          return <PlaceholderPage title="Documentos" />;
        default:
          return <InternalProjectDashboard />;
      }
    }

    // Se não há projeto ativo, renderizar baseado na view global
    switch (currentView) {
      case 'projetos':
        return <Projects />;
      case 'clientes':
        return <Clients />;
      case 'relatorios':
        return <Reports />;
      case 'config':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white shadow-sm flex items-center px-6">
            <SidebarTrigger className="text-gray-600 hover:text-green-600 transition-colors" />
            <div className="ml-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Gerenciamento de Projetos</h1>
            </div>
          </header>
          <main className="flex-1 p-6 bg-gray-50">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
