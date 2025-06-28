import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderOpen,
  Users,
  FileText,
  Settings,
  Plus,
  BarChart3,
  Calendar,
  ListTodo,
  DollarSign,
  AlertTriangle,
  FileStack,
  MessageSquare,
  BookOpen,
  CheckSquare,
  UserCheck,
  Network,
  Target,
  Shield,
  Briefcase,
  ArrowLeft,
  ChevronDown,
  ClipboardList,
  Rocket,
  TrendingUp,
  FolderCheck,
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

// Navegação Global (quando não há projeto ativo)
const globalNavItems = [
  { title: "Dashboard Geral", url: "/dashboard", icon: Home },
  { title: "Meus Projetos", url: "/projetos", icon: FolderOpen },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Configurações", url: "/config", icon: Settings },
];

// Estrutura PMBOK para navegação do projeto - ORDEM REORGANIZADA
const projectNavSections = [
  {
    title: "Dashboard do Projeto",
    icon: BarChart3,
    view: "project-dashboard",
    items: []
  },
  {
    title: "TAP",
    icon: ClipboardList,
    view: "tap",
    items: []
  },
  {
    title: "Planejamento",
    icon: FileText,
    view: null,
    items: [
      // NOVA ORDEM METODOLÓGICA CORRETA
      { title: "Escopo", view: "escopo", icon: Target }, // 1º - Base para tudo
      { title: "EAP", view: "eap", icon: ListTodo }, // 2º - Baseado no escopo
      { title: "Dicionário EAP", view: "dicionario", icon: BookOpen }, // 3º - Detalha a EAP
      { title: "Requisitos", view: "requisitos", icon: FileStack }, // 4º - Especifica critérios
      { title: "Cronograma", view: "cronograma", icon: Calendar }, // 5º - Baseado na EAP
      { title: "Plano de Custos", view: "plano-custos", icon: DollarSign }, // 6º - Baseado no cronograma
      { title: "Plano de Riscos", view: "plano-riscos", icon: AlertTriangle }, // 7º - Análise de riscos
      { title: "Plano de Qualidade", view: "plano-qualidade", icon: Shield }, // 8º - Critérios de qualidade
      { title: "Plano de Recursos", view: "plano-recursos", icon: Users }, // 9º - Recursos necessários
      { title: "Plano de Comunicações", view: "plano-comunicacoes", icon: MessageSquare }, // 10º - Comunicação
      { title: "Plano de Aquisições", view: "plano-aquisicoes", icon: FolderOpen }, // 11º - Aquisições
    ]
  },
  {
    title: "Execução",
    icon: Rocket,
    view: null,
    items: [
      { title: "Tarefas", view: "tarefas", icon: CheckSquare },
      { title: "Equipe", view: "equipe", icon: UserCheck },
      { title: "Gestão de Fornecedores", view: "fornecedores", icon: Users },
      { title: "Registro de Entregas", view: "entregas", icon: FolderCheck },
    ]
  },
  {
    title: "Monitoramento e Controle",
    icon: TrendingUp,
    view: null,
    items: [
      { title: "Desempenho (KPIs)", view: "desempenho", icon: BarChart3 },
      { title: "Custos (Controle)", view: "custos", icon: DollarSign },
      { title: "Riscos (Controle)", view: "riscos-controle", icon: AlertTriangle },
      { title: "Gestão de Mudanças", view: "mudancas", icon: Network },
      { title: "Registro de Problemas", view: "problemas", icon: AlertTriangle },
      { title: "Controle de Qualidade", view: "qualidade", icon: Shield },
      { title: "Relatórios do Projeto", view: "relatorios-projeto", icon: FileText },
    ]
  },
  {
    title: "Comunicações",
    icon: MessageSquare,
    view: "comunicacoes",
    items: []
  },
  {
    title: "Encerramento",
    icon: Target,
    view: null,
    items: [
      { title: "Checklist de Fechamento", view: "fechamento", icon: CheckSquare },
      { title: "Lições Aprendidas", view: "licoes", icon: BookOpen },
      { title: "Relatório Final do Projeto", view: "relatorio-final", icon: FileText },
      { title: "Aceitação Formal do Cliente", view: "aceitacao", icon: UserCheck },
    ]
  },
  {
    title: "Documentos",
    icon: FolderOpen,
    view: "documentos",
    items: []
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { activeProject, currentView, closeProject, setCurrentView } = useProject();
  const currentPath = location.pathname;
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const isActive = (path: string) => {
    if (activeProject) {
      return currentView === path.replace('/', '');
    } else {
      return currentPath === path;
    }
  };

  const getNavClassName = (active: boolean) =>
    active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const isCollapsed = state === "collapsed";

  const handleNavigation = (view: string) => {
    if (activeProject) {
      setCurrentView(view);
    }
  };

  const handleBackToProjects = () => {
    closeProject();
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        {!activeProject ? (
          // Navegação Global
          <SidebarGroup>
            <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {globalNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={getNavClassName(isActive(item.url))}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          // Navegação Contextual do Projeto - Estrutura PMBOK
          <>
            <SidebarGroup>
              <SidebarGroupLabel>
                <Button
                  variant="link"
                  onClick={handleBackToProjects}
                  className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Voltar aos Projetos
                </Button>
              </SidebarGroupLabel>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>
                {!isCollapsed && (
                  <div className="text-xs">
                    <div className="font-medium truncate">{activeProject.name}</div>
                    <div className="text-muted-foreground">{activeProject.client}</div>
                  </div>
                )}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projectNavSections.map((section) => (
                    <SidebarMenuItem key={section.title}>
                      {section.items.length === 0 ? (
                        // Seção sem subitens - navegação direta
                        <SidebarMenuButton
                          onClick={() => handleNavigation(section.view!)}
                          className={getNavClassName(isActive(section.view!))}
                        >
                          <section.icon className="mr-2 h-4 w-4" />
                          {!isCollapsed && <span>{section.title}</span>}
                        </SidebarMenuButton>
                      ) : (
                        // Seção com subitens - collapsible
                        <Collapsible
                          open={expandedSections.includes(section.title)}
                          onOpenChange={() => toggleSection(section.title)}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="hover:bg-muted/50">
                              <section.icon className="mr-2 h-4 w-4" />
                              {!isCollapsed && (
                                <>
                                  <span className="flex-1">{section.title}</span>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${
                                    expandedSections.includes(section.title) ? 'rotate-180' : ''
                                  }`} />
                                </>
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-4">
                            <SidebarMenu>
                              {section.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton
                                    onClick={() => handleNavigation(item.view)}
                                    className={getNavClassName(isActive(item.view))}
                                  >
                                    <item.icon className="mr-2 h-3 w-3" />
                                    {!isCollapsed && <span className="text-sm">{item.title}</span>}
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))}
                            </SidebarMenu>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
