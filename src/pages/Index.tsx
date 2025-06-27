
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Clock, Users, CheckCircle, AlertCircle, FileText, Target, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { phases, wbsItems, tasks, costItems, requirements, scopeStatement, scopeValidations, getTotalProjectCost, projectCharter } = useProject();

  // Calcular estatísticas básicas de forma mais realista
  const currentTAP = projectCharter.length > 0 ? projectCharter[0] : null;
  
  // Verificar se o TAP tem os campos essenciais preenchidos
  const isTAPComplete = currentTAP ? !!(
    currentTAP.projectName && 
    currentTAP.sponsors && 
    currentTAP.projectManager && 
    currentTAP.startDate && 
    currentTAP.estimatedEndDate &&
    currentTAP.projectObjectives &&
    currentTAP.businessDemand &&
    currentTAP.projectScope
  ) : false;

  // Estatísticas principais
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalRequirements = requirements.length;
  const approvedRequirements = requirements.filter(req => req.status === 'aprovado').length;
  const requirementsApprovalRate = totalRequirements > 0 ? (approvedRequirements / totalRequirements) * 100 : 0;

  const totalValidations = scopeValidations.length;
  const approvedValidations = scopeValidations.filter(val => val.status === 'aprovado').length;

  // Calcular custos de forma mais precisa
  const projectCosts = getTotalProjectCost();
  const phasesCosts = phases.reduce((acc, phase) => ({
    estimated: acc.estimated + phase.estimatedCost,
    actual: acc.actual + phase.actualCost
  }), { estimated: 0, actual: 0 });

  // Usar orçamento do TAP como referência principal
  const projectBudget = currentTAP?.estimatedBudget || 150000; // Valor padrão apenas se não houver TAP
  const totalActualCost = projectCosts.actual + phasesCosts.actual;
  const totalEstimatedCost = projectCosts.estimated + phasesCosts.estimated;
  const budgetUsed = (totalActualCost / projectBudget) * 100;
  const remainingBudget = projectBudget - totalActualCost;

  // Preparar dados para gráficos (apenas se houver dados)
  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8834D8', '#82CA9D'];

  const costByWBS = wbsItems
    .filter(item => item.actualCost > 0 || item.estimatedCost > 0)
    .map(item => ({
      name: `${item.code} - ${item.activity.substring(0, 20)}${item.activity.length > 20 ? '...' : ''}`,
      value: item.actualCost || item.estimatedCost,
      estimated: item.estimatedCost,
      actual: item.actualCost
    }));

  const budgetData = [{
    name: 'Orçamento',
    'Orçamento Total': projectBudget,
    'Custo Real': totalActualCost,
    'Disponível': remainingBudget
  }];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard do Projeto</h1>
        <Link to="/tap">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            {currentTAP ? 'Ver TAP' : 'Criar TAP'}
          </Button>
        </Link>
      </div>

      {/* Status do TAP */}
      <Card className={`border-2 ${isTAPComplete ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Termo de Abertura do Projeto (TAP)
            {isTAPComplete ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-semibold ${isTAPComplete ? 'text-green-700' : 'text-orange-700'}`}>
                {isTAPComplete ? 'TAP Completo' : 'TAP Incompleto'}
              </p>
            </div>
            {currentTAP && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Projeto</p>
                  <p className="font-semibold">{currentTAP.projectName || 'Não definido'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orçamento Aprovado</p>
                  <p className="font-semibold text-blue-700">
                    R$ {projectBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fases do Projeto</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phases.length}</div>
            <p className="text-xs text-muted-foreground">Fases planejadas</p>
            <Link to="/fases">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver fases</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso das Tarefas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{completionRate.toFixed(1)}% concluídas</p>
            <Progress value={completionRate} className="mt-2" />
            <Link to="/tarefas">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver tarefas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso do Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUsed.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              R$ {totalActualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {projectBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <Progress value={budgetUsed} className="mt-2" />
            <Link to="/custos">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver custos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens EAP</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wbsItems.length}</div>
            <p className="text-xs text-muted-foreground">Pacotes de trabalho</p>
            <Link to="/eap">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver EAP</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Gestão de Escopo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Gestão de Escopo (PMBOK)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requisitos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequirements}/{totalRequirements}</div>
              <p className="text-xs text-muted-foreground">{requirementsApprovalRate.toFixed(1)}% aprovados</p>
              <Progress value={requirementsApprovalRate} className="mt-2" />
              <Link to="/requisitos">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Declaração de Escopo</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scopeStatement.length > 0 ? '1' : '0'}</div>
              <p className="text-xs text-muted-foreground">
                {scopeStatement.length > 0 ? 'Definida' : 'Não definida'}
              </p>
              <Link to="/escopo">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  {scopeStatement.length > 0 ? 'Ver' : 'Definir'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validações</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedValidations}/{totalValidations}</div>
              <p className="text-xs text-muted-foreground">Entregas validadas</p>
              <Link to="/validacao">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Análise de Custos */}
      {(costByWBS.length > 0 || totalActualCost > 0) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Análise Financeira</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {costByWBS.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Custos por Item EAP</CardTitle>
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
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Status do Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="Orçamento Total" fill="#8884d8" />
                    <Bar dataKey="Custo Real" fill="#82ca9d" />
                    <Bar dataKey="Disponível" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Indicadores de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Performance do Projeto
            {budgetUsed > 100 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status Orçamentário</p>
              <p className={`text-lg font-semibold ${budgetUsed > 100 ? 'text-red-600' : budgetUsed > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                {budgetUsed > 100 ? 'Acima do Orçamento' : budgetUsed > 80 ? 'Atenção' : 'Dentro do Orçamento'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Disponível</p>
              <p className="text-lg font-semibold">
                R$ {remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progresso vs Custo</p>
              <p className={`text-lg font-semibold ${completionRate > budgetUsed ? 'text-green-600' : 'text-orange-600'}`}>
                {completionRate > budgetUsed ? 'Eficiente' : 'Revisar'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
