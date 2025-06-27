
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Calendar, List, Check, Home, DollarSign, BookOpen, ClipboardCheck, Users, FileText, FolderOpen, UserCircle, BarChart3, Settings, MessageCircle, AlertTriangle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const globalItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Meus Projetos", url: "/projetos", icon: FolderOpen },
  { title: "Clientes", url: "/clientes", icon: UserCircle },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Configurações", url: "/config", icon: Settings },
];

const projectItems = [
  { title: "Dashboard do Projeto", url: "/dashboard", icon: Home },
  { title: "TAP", url: "/tap", icon: FileText },
  { title: "Fases do Projeto", url: "/fases", icon: Calendar },
  { title: "EAP", url: "/eap", icon: List },
  { title: "Tarefas", url: "/tarefas", icon: Check },
  { title: "Custos", url: "/custos", icon: DollarSign },
  { title: "Riscos", url: "/riscos", icon: AlertTriangle },
  { title: "Documentos", url: "/documentos", icon: FileText },
  { title: "Comunicações", url: "/comunicacoes", icon: MessageCircle },
];

// Legacy project items (mantidos para compatibilidade)
const legacyProjectItems = [
  { title: "Lições Aprendidas", url: "/licoes", icon: BookOpen },
  { title: "Checklist Fechamento", url: "/fechamento", icon: ClipboardCheck },
  { title: "Equipe", url: "/equipe", icon: Users },
  { title: "Dicionário EAP", url: "/dicionario", icon: FileText },
];

export function AppSidebar() {
  const location = useLocation();
  const params = useParams();
  const currentPath = location.pathname;
  const projectId = params.projectId;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath === path || currentPath.startsWith(path);
  };

  const isProjectContext = currentPath.includes('/projetos/') && projectId;

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200" collapsible="offcanvas">
      <SidebarContent className="bg-white">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">PM</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">ProjectManager</h2>
              <p className="text-xs text-gray-500">PMBOK Edition</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup className="px-4 py-4">
          <SidebarGroupLabel className="text-gray-700 font-medium mb-2">
            Navegação Global
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {globalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          navIsActive || isActive(item.url)
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isProjectContext && (
          <SidebarGroup className="px-4 py-4">
            <SidebarGroupLabel className="text-gray-700 font-medium mb-2 flex items-center justify-between">
              <span>Projeto Atual</span>
              <Badge variant="outline" className="text-xs">ID: {projectId}</Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {projectItems.map((item) => {
                  const fullUrl = `/projetos/${projectId}${item.url}`;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={fullUrl}
                          className={({ isActive: navIsActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                              navIsActive || isActive(fullUrl)
                                ? "bg-green-50 text-green-700 border-l-4 border-green-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="px-4 py-4">
          <SidebarGroupLabel className="text-gray-700 font-medium mb-2">
            {isProjectContext ? "Ferramentas Extras" : "Projeto Demo"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {(isProjectContext ? legacyProjectItems : [...projectItems, ...legacyProjectItems]).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          navIsActive || isActive(item.url)
                            ? "bg-green-50 text-green-700 border-l-4 border-green-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
