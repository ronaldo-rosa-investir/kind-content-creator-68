
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, List, Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { phases, wbsItems, tasks } = useProject();

  const completedTasks = tasks.filter(task => task.completed).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const activePhases = phases.filter(phase => phase.status === 'em-andamento').length;
  const completedPhases = phases.filter(phase => phase.status === 'concluida').length;

  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard do Projeto</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso geral do seu projeto
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fases</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phases.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePhases} ativas, {completedPhases} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens EAP</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wbsItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Estrutura analítica definida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} concluídas, {overdueTasks} atrasadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <div className="text-2xl font-bold">{taskProgress}%</div>
          </CardHeader>
          <CardContent>
            <Progress value={taskProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/fases">
              <Button className="w-full h-20 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <span>Gerenciar Fases</span>
              </Button>
            </Link>
            <Link to="/eap">
              <Button className="w-full h-20 flex flex-col items-center gap-2" variant="outline">
                <List className="h-6 w-6" />
                <span>Visualizar EAP</span>
              </Button>
            </Link>
            <Link to="/tarefas">
              <Button className="w-full h-20 flex flex-col items-center gap-2" variant="outline">
                <Check className="h-6 w-6" />
                <span>Ver Tarefas</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Tarefas Pendentes */}
      {overdueTasks > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Atenção: Tarefas Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              Você tem {overdueTasks} tarefa(s) atrasada(s). 
              <Link to="/tarefas" className="ml-2 text-red-700 underline hover:text-red-800">
                Ver detalhes
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estado Inicial */}
      {phases.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Sistema de Gerenciamento de Projetos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Este sistema segue a metodologia PMBOK com o ciclo completo do projeto:
              Iniciação, Planejamento, Execução, Monitoramento e Controle, e Encerramento.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Para começar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Crie as fases do seu projeto</li>
                <li>Defina os itens da Estrutura Analítica do Projeto (EAP)</li>
                <li>Adicione sub-tarefas e gere tarefas operacionais</li>
                <li>Monitore o progresso e complete as atividades</li>
              </ol>
            </div>
            <Link to="/fases">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Fase
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
