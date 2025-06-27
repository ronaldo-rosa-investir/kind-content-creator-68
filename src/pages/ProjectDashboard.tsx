
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Users, DollarSign, Calendar, TrendingUp, AlertTriangle } from "lucide-react";

export default function ProjectDashboard() {
  const { projectId } = useParams();

  // Mock data para demonstração
  const projectData = {
    id: projectId,
    name: "Sistema ERP Corporativo",
    status: "Em Andamento",
    progress: 75,
    budget: 120000,
    usedBudget: 90000,
    startDate: "2024-01-15",
    endDate: "2024-08-15",
    manager: "João Silva",
    teamMembers: 8,
    pendingTasks: 12,
    completedTasks: 45,
    overdueItems: 3
  };

  const upcomingMilestones = [
    { name: "Entrega do Módulo de Vendas", date: "2024-07-15", status: "Em Andamento" },
    { name: "Testes de Integração", date: "2024-07-30", status: "Planejado" },
    { name: "Treinamento dos Usuários", date: "2024-08-10", status: "Planejado" }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{projectData.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={getStatusColor(projectData.status)}>
              {projectData.status}
            </Badge>
            <span className="text-gray-500">ID: {projectId}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progresso Geral</div>
          <div className="flex items-center gap-2">
            <Progress value={projectData.progress} className="w-32" />
            <span className="font-semibold">{projectData.progress}%</span>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {projectData.budget.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {projectData.usedBudget.toLocaleString('pt-BR')} utilizados ({Math.round((projectData.usedBudget / projectData.budget) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectData.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Membros ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectData.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {projectData.completedTasks} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Atrasados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{projectData.overdueItems}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Marcos */}
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
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{milestone.name}</h3>
                  <p className="text-sm text-gray-500">
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
  );
}
