
import { NavLink, useLocation } from "react-router-dom";
import { Calendar, List, Check, Home, DollarSign, BookOpen, ClipboardCheck, Users, FileText } from "lucide-react";
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

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "TAP", url: "/tap", icon: FileText },
  { title: "Fases do Projeto", url: "/fases", icon: Calendar },
  { title: "Itens EAP", url: "/eap", icon: List },
  { title: "Tarefas", url: "/tarefas", icon: Check },
  { title: "Gestão de Custos", url: "/custos", icon: DollarSign },
  { title: "Lições Aprendidas", url: "/licoes", icon: BookOpen },
  { title: "Checklist Fechamento", url: "/fechamento", icon: ClipboardCheck },
  { title: "Equipe", url: "/equipe", icon: Users },
  { title: "Dicionário EAP", url: "/dicionario", icon: FileText },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath === path || currentPath.startsWith(path);
  };

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
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
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
