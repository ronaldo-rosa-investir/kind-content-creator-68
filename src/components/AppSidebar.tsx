
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
} from "lucide-react";

// Navegação Global (sempre visível)
const globalNavItems = [
  { title: "Dashboard Geral", url: "/dashboard", icon: Home },
  { title: "Meus Projetos", url: "/projetos", icon: FolderOpen },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Configurações", url: "/config", icon: Settings },
];

// Navegação Contextual do Projeto (só aparece dentro de um projeto)
const projectNavItems = [
  { title: "Dashboard do Projeto", url: "/dashboard", icon: BarChart3 },
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
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  // Verificar se estamos em um projeto específico (rotas contextuais)
  const isInProjectContext = currentPath.match(/^\/projetos\/\d+\//) || 
    (!currentPath.startsWith('/dashboard') && 
     !currentPath.startsWith('/projetos') && 
     !currentPath.startsWith('/clientes') && 
     !currentPath.startsWith('/relatorios') && 
     !currentPath.startsWith('/config') &&
     currentPath !== '/');

  const isActive = (path: string) => {
    if (isInProjectContext) {
      // Para contexto de projeto, comparar apenas a parte final da URL
      return currentPath.endsWith(path) || (path === '/dashboard' && currentPath === '/');
    } else {
      // Para navegação global, comparar URL completa
      return currentPath === path;
    }
  };

  const getNavClassName = (active: boolean) =>
    active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
      <SidebarContent>
        {!isInProjectContext ? (
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
                        {!collapsed && <span>{item.title}</span>}
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
                <Link to="/projetos" className="text-sm text-muted-foreground hover:text-primary">
                  ← Voltar aos Projetos
                </Link>
              </SidebarGroupLabel>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Dentro do Projeto</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projectNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={getNavClassName(isActive(item.url))}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
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
