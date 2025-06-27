
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderOpen, Users, DollarSign, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

export default function Dashboard() {
  const { projects, openProject } = useProject();

  // Calcular estatísticas automaticamente dos dados reais
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'Em Andamento').length,
    completedProjects: projects.filter(p => p.status === 'Concluído').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    usedBudget: projects.reduce((sum, p) => sum + (p.spent || 0), 0),
    totalTeamMembers: projects.length * 5, // Estimativa baseada nos projetos
    overdueProjects: projects.filter(p => {
      const endDate = new Date(p.endDate);
      const today = new Date();
      return p.status !== 'Concluído' && endDate < today;
    }).length
  };

  const recentProjects = projects.slice(0, 4);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-blue-100 text-blue-800";
      case "Planejamento": return "bg-yellow-100 text-yellow-800";
      case "Concluído": return "bg-green-100 text-green-800";
      case "Atrasado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleProjectClick = (project: any) => {
    openProject(project);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Visão Geral</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} ativos, {stats.completedProjects} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalBudget.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {stats.usedBudget.toLocaleString('pt-BR')} utilizados ({Math.round((stats.usedBudget / stats.totalBudget) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Membros ativos em todos os projetos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Atrasados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueProjects}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção imediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Projetos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Projetos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-left"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.name}
                    </Button>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Orçamento: R$ {project.budget.toLocaleString('pt-BR')}</span>
                    <span>Prazo: {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{project.progress}%</div>
                    <Progress value={project.progress} className="w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
