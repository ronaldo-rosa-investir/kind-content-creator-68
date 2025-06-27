
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderOpen, Users, DollarSign, Calendar, TrendingUp, AlertTriangle, ArrowLeft } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

export default function InternalProjectDashboard() {
  const { activeProject, closeProject, phases, tasks, costItems, teamMembers } = useProject();

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum projeto selecionado</p>
      </div>
    );
  }

  // Calcular estatísticas do projeto específico
  const projectStats = {
    totalPhases: phases.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    totalTeamMembers: teamMembers.length,
    totalCosts: costItems.reduce((sum, item) => sum + item.actualCost, 0),
    budgetUsed: ((activeProject.spent || 0) / activeProject.budget) * 100
  };

  const upcomingMilestones = [
    { name: "Entrega do Módulo Principal", date: "2024-07-15", status: "Em Andamento" },
    { name: "Testes de Integração", date: "2024-07-30", status: "Planejado" },
    { name: "Treinamento da Equipe", date: "2024-08-10", status: "Planejado" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-blue-100 text-blue-800";
      case "Planejado": return "bg-yellow-100 text-yellow-800";
      case "Concluído": return "bg-green-100 text-green-800";
      case "Atrasado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleBackToProjects = () => {
    closeProject();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="outline"
              onClick={handleBackToProjects}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Projetos
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{activeProject.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={getStatusColor(activeProject.status)}>
              {activeProject.status}
            </Badge>
            <span className="text-gray-500">Cliente: {activeProject.client}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progresso Geral</div>
          <div className="flex items-center gap-2">
            <Progress value={activeProject.progress} className="w-32" />
            <span className="font-semibold">{activeProject.progress}%</span>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas do Projeto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {activeProject.budget.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {(activeProject.spent || 0).toLocaleString('pt-BR')} utilizados ({Math.round(projectStats.budgetUsed)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fases</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.totalPhases}</div>
            <p className="text-xs text-muted-foreground">
              Fases planejadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {projectStats.completedTasks} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.totalTeamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Membros ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Projeto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Gerente do Projeto</p>
                <p className="font-semibold">{activeProject.manager}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Início</p>
                <p className="font-semibold">{new Date(activeProject.startDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Conclusão</p>
                <p className="font-semibold">{new Date(activeProject.endDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Restante</p>
                <p className="font-semibold text-green-600">
                  R$ {(activeProject.budget - (activeProject.spent || 0)).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Marcos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-sm">{milestone.name}</h3>
                    <p className="text-xs text-gray-500">
                      Prazo: {new Date(milestone.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Performance do Projeto
            {projectStats.budgetUsed > 100 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status Orçamentário</p>
              <p className={`text-lg font-semibold ${projectStats.budgetUsed > 100 ? 'text-red-600' : projectStats.budgetUsed > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                {projectStats.budgetUsed > 100 ? 'Acima do Orçamento' : projectStats.budgetUsed > 80 ? 'Atenção' : 'Dentro do Orçamento'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-lg font-semibold">
                {projectStats.totalTasks > 0 ? Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progresso vs Custo</p>
              <p className={`text-lg font-semibold ${activeProject.progress > projectStats.budgetUsed ? 'text-green-600' : 'text-orange-600'}`}>
                {activeProject.progress > projectStats.budgetUsed ? 'Eficiente' : 'Revisar'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
