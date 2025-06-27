
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, List, Check, Plus, TrendingUp, AlertTriangle, Users, DollarSign, TrendingDown, PieChart, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Index = () => {
  const { phases, wbsItems, tasks, getTotalProjectCost } = useProject();

  const completedTasks = tasks.filter(task => task.completed).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const activePhases = phases.filter(phase => phase.status === 'em-andamento').length;
  const completedPhases = phases.filter(phase => phase.status === 'concluido').length;

  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  const { estimated: estimatedCost, actual: actualCost } = getTotalProjectCost();
  const costVariance = estimatedCost > 0 ? ((actualCost - estimatedCost) / estimatedCost) * 100 : 0;
  const budgetProgress = estimatedCost > 0 ? Math.round((actualCost / estimatedCost) * 100) : 0;
  const availableBudget = estimatedCost - actualCost;

  // Dados para gráfico de pizza (distribuição por itens EAP)
  const pieChartData = wbsItems.map(item => ({
    name: item.activity,
    value: item.estimatedCost,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  })).filter(item => item.value > 0);

  // Dados para gráfico de barras (orçamento vs real)
  const barChartData = [
    {
      name: 'Orçado',
      value: estimatedCost,
      fill: '#3b82f6'
    },
    {
      name: 'Consumido',
      value: actualCost,
      fill: actualCost > estimatedCost ? '#ef4444' : '#10b981'
    },
    {
      name: 'Disponível',
      value: availableBudget > 0 ? availableBudget : 0,
      fill: '#f59e0b'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Projeto</h1>
          <p className="text-gray-600 text-lg">
            Acompanhe o progresso geral do seu projeto baseado na metodologia PMBOK
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/fases">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Nova Fase
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Fases do Projeto</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{phases.length}</div>
            <p className="text-sm text-gray-500">
              {activePhases} ativas • {completedPhases} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Itens EAP</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <List className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{wbsItems.length}</div>
            <p className="text-sm text-gray-500">
              Estrutura analítica definida
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tarefas</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{tasks.length}</div>
            <p className="text-sm text-gray-500">
              {completedTasks} concluídas • {overdueTasks} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Progresso Geral</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">{taskProgress}%</div>
            <Progress value={taskProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Seção de Custos Reorganizada */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Gestão de Custos</h2>
        
        {/* Cards de Custos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Orçamento Total</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                R$ {estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-gray-500">Total planejado</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Valor Consumido</CardTitle>
              <div className="p-2 bg-red-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                R$ {actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-gray-500">Total executado</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Valor Disponível</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {availableBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-gray-500">Saldo restante</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Variação de Custo</CardTitle>
              <div className={`p-2 rounded-lg ${costVariance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                {costVariance > 0 ? (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${costVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {costVariance > 0 ? '+' : ''}{costVariance.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-500">
                {costVariance > 0 ? 'Acima do orçamento' : 'Dentro do orçamento'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Progresso do Orçamento</CardTitle>
              <div className="p-2 bg-orange-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">{budgetProgress}%</div>
              <Progress 
                value={budgetProgress} 
                className="h-2" 
                indicatorClassName={budgetProgress > 100 ? "bg-red-500" : "bg-green-500"}
              />
              <p className="text-sm text-gray-500 mt-1">
                {budgetProgress > 100 ? 'Orçamento excedido' : 'Do orçamento consumido'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de Custo */}
        {pieChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Distribuição de Custos por Item EAP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cost: {
                      label: "Custo",
                    },
                  }}
                  className="h-64"
                >
                  <RechartsPieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Custo']}
                    />
                    <RechartsPieChart data={pieChartData} innerRadius={60} outerRadius={100}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Orçamento vs Consumido vs Disponível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Valor",
                    },
                  }}
                  className="h-64"
                >
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Ações Rápidas */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/fases">
              <Button className="w-full h-24 flex flex-col items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
                <Calendar className="h-6 w-6" />
                <span className="font-medium">Gerenciar Fases</span>
              </Button>
            </Link>
            <Link to="/eap">
              <Button className="w-full h-24 flex flex-col items-center gap-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
                <List className="h-6 w-6" />
                <span className="font-medium">Visualizar EAP</span>
              </Button>
            </Link>
            <Link to="/tarefas">
              <Button className="w-full h-24 flex flex-col items-center gap-3 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
                <Check className="h-6 w-6" />
                <span className="font-medium">Ver Tarefas</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Tarefas Atrasadas */}
      {overdueTasks > 0 && (
        <Card className="bg-red-50 border border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Tarefas Atrasadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              Você tem {overdueTasks} tarefa(s) atrasada(s) que precisam de atenção imediata.
            </p>
            <Link to="/tarefas">
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Ver Detalhes das Tarefas
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Estado Inicial */}
      {phases.length === 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Bem-vindo ao Sistema de Gerenciamento de Projetos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-lg">
              Este sistema segue a metodologia PMBOK com o ciclo completo do projeto:
              <strong> Iniciação, Planejamento, Execução, Monitoramento e Controle, e Encerramento.</strong>
            </p>
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">Para começar:</h4>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Crie as fases do seu projeto baseadas no PMBOK</li>
                <li>Defina os itens da Estrutura Analítica do Projeto (EAP)</li>
                <li>Adicione sub-tarefas e gere tarefas operacionais</li>
                <li>Monitore o progresso e complete as atividades</li>
              </ol>
            </div>
            <Link to="/fases">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-5 w-5 mr-2" />
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
