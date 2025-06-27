
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

const Index = () => {
  const { phases, wbsItems, tasks, costItems, getTotalProjectCost } = useProject();

  // Calcula o número total de fases, itens EAP e tarefas
  const totalPhases = phases.length;
  const totalWBSItems = wbsItems.length;
  const totalTasks = tasks.length;

  // Calcula o número de tarefas concluídas
  const completedTasks = tasks.filter(task => task.completed).length;

  // Calcula o custo total estimado e real do projeto
  const totalCost = getTotalProjectCost();

  const totalStats = {
    phases: phases.length,
    wbsItems: wbsItems.length,
    tasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    totalCost: getTotalProjectCost()
  };

  const completionRate = totalStats.tasks > 0 ? (totalStats.completedTasks / totalStats.tasks) * 100 : 0;

  // Calcula a variação de custos
  const costVariance = totalCost.actual - totalCost.estimated;

  // Define as cores para os gráficos
  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8834D8', '#82CA9D'];

  // Prepara os dados para o gráfico de pizza de custos por item EAP
  const costByWBS = wbsItems.map(item => ({
    name: `${item.code} - ${item.activity.substring(0, 20)}...`,
    value: item.actualCost || item.estimatedCost,
    estimated: item.estimatedCost,
    actual: item.actualCost
  })).filter(item => item.value > 0);

  // Define um orçamento total de exemplo
  const totalBudget = 150000; // Orçamento total exemplo

  // Calcula o orçamento disponível
  const availableBudget = totalBudget - totalCost.actual;

  // Calcula o progresso do orçamento
  const budgetProgress = (totalCost.actual / totalBudget) * 100;

  // Prepara os dados para o gráfico de barras de orçamento
  const budgetData = [
    {
      name: 'Orçamento',
      Orçamento: totalBudget,
      Consumido: totalCost.actual,
      Disponível: availableBudget
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard do Projeto</h1>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.phases}</div>
            <p className="text-xs text-muted-foreground">Total de fases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens EAP</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.wbsItems}</div>
            <p className="text-xs text-muted-foreground">Estrutura analítica</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.completedTasks}/{totalStats.tasks}</div>
            <p className="text-xs text-muted-foreground">{completionRate.toFixed(1)}% concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Seção de Custos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Gestão de Custos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Estimado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalStats.totalCost.estimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Planejado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Real</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalStats.totalCost.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Executado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Aprovado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Disponível</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {availableBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Restante</p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso do Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Orçamento Consumido</span>
                <span>{budgetProgress.toFixed(1)}%</span>
              </div>
              <Progress value={budgetProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ {totalStats.totalCost.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span>R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Custos por Item EAP</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costByWBS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costByWBS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orçamento: Consumido vs Disponível</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="Orçamento" fill="#8884d8" />
                  <Bar dataKey="Consumido" fill="#82ca9d" />
                  <Bar dataKey="Disponível" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Variação de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Variação de Custos
            {totalStats.totalCost.actual > totalStats.totalCost.estimated ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {Math.abs(totalStats.totalCost.actual - totalStats.totalCost.estimated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalStats.totalCost.actual > totalStats.totalCost.estimated ? 'Acima do orçamento' : 'Dentro do orçamento'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
