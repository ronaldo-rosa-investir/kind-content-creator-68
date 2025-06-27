
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

// Navegação Contextual do Projeto (quando há projeto ativo)
const projectNavItems = [
  { title: "Dashboard do Projeto", url: "/dashboard-projeto", icon: BarChart3 },
  { title: "TAP", url: "/tap", icon: Briefcase },
  { title: "Ciclo de Vida", url: "/ciclo-vida", icon: Target },
  { title: "Cronograma", url: "/cronograma", icon: Calendar },
  { title: "Fases", url: "/fases", icon: Network },
  { title: "EAP", url: "/eap", icon: ListTodo },
  { title: "Tarefas", url: "/tarefas", icon: CheckSquare },
  { title: "Custos", url: "/custos", icon: DollarSign },
  { title: "Equipe", url: "/equipe", icon: UserCheck },
  { title: "Dicionário EAP", url: "/dicionario", icon: BookOpen },
  { title: "Requisitos", url: "/requisitos", icon: FileStack },
  { title: "Escopo", url: "/escopo", icon: Target },
  { title: "Validação", url: "/validacao", icon: Shield },
  { title: "Lições Aprendidas", url: "/licoes", icon: MessageSquare },
  { title: "Checklist Fechamento", url: "/fechamento", icon: CheckSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { activeProject, currentView, closeProject, setCurrentView } = useProject();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (activeProject) {
      // Para contexto de projeto, comparar com a view atual
      return currentView === path.replace('/', '');
    } else {
      // Para navegação global, comparar URL completa
      return currentPath === path;
    }
  };

  const getNavClassName = (active: boolean) =>
    active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const isCollapsed = state === "collapsed";

  const handleNavigation = (path: string) => {
    if (activeProject) {
      setCurrentView(path.replace('/', ''));
    }
  };

  const handleBackToProjects = () => {
    closeProject();
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
          // Navegação Contextual do Projeto
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
                  {projectNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => handleNavigation(item.url)}
                        className={getNavClassName(isActive(item.url))}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
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
