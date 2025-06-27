
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

  // Calcular custos das fases
  const getTotalPhasesCost = () => {
    const estimated = phases.reduce((total, phase) => total + phase.estimatedCost, 0);
    const actual = phases.reduce((total, phase) => total + phase.actualCost, 0);
    return { estimated, actual };
  };

  // Verificar TAP
  const currentTAP = projectCharter.length > 0 ? projectCharter[0] : null;
  const isTAPComplete = currentTAP ? !!(
    currentTAP.projectName && 
    currentTAP.sponsors && 
    currentTAP.projectManager && 
    currentTAP.startDate && 
    currentTAP.estimatedEndDate &&
    currentTAP.projectObjectives &&
    currentTAP.businessDemand &&
    currentTAP.projectScope &&
    currentTAP.projectNotScope &&
    currentTAP.stakeholders &&
    currentTAP.existingProjectsInterface &&
    currentTAP.constraints &&
    currentTAP.assumptions &&
    currentTAP.estimatedBudget &&
    currentTAP.basicTeam?.length > 0 &&
    currentTAP.sponsorSignatures?.length > 0
  ) : false;

  const totalStats = {
    phases: phases.length,
    wbsItems: wbsItems.length,
    tasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    requirements: requirements.length,
    approvedRequirements: requirements.filter(req => req.status === 'aprovado').length,
    scopeValidations: scopeValidations.length,
    approvedValidations: scopeValidations.filter(val => val.status === 'aprovado').length,
    totalCost: getTotalProjectCost(),
    phasesCost: getTotalPhasesCost()
  };

  const completionRate = totalStats.tasks > 0 ? (totalStats.completedTasks / totalStats.tasks) * 100 : 0;
  const requirementsApprovalRate = totalStats.requirements > 0 ? (totalStats.approvedRequirements / totalStats.requirements) * 100 : 0;

  // Define as cores para os gráficos
  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8834D8', '#82CA9D'];

  // Prepara os dados para o gráfico de pizza de custos por item EAP
  const costByWBS = wbsItems.map(item => ({
    name: `${item.code} - ${item.activity.substring(0, 20)}...`,
    value: item.actualCost || item.estimatedCost,
    estimated: item.estimatedCost,
    actual: item.actualCost
  })).filter(item => item.value > 0);

  // Usar orçamento do TAP se disponível, senão usar o máximo entre custo das fases e um valor padrão
  const totalBudget = currentTAP?.estimatedBudget || Math.max(150000, totalStats.phasesCost.estimated);
  const totalActualCost = totalStats.totalCost.actual + totalStats.phasesCost.actual;
  const availableBudget = totalBudget - totalActualCost;
  const budgetProgress = (totalActualCost / totalBudget) * 100;

  // Prepara os dados para o gráfico de barras de orçamento
  const budgetData = [
    {
      name: 'Orçamento',
      Orçamento: totalBudget,
      Consumido: totalActualCost,
      Disponível: availableBudget
    }
  ];

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

      {/* Seção do TAP */}
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
                  <p className="text-sm text-muted-foreground">Orçamento TAP</p>
                  <p className="font-semibold text-blue-700">
                    R$ {currentTAP.estimatedBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            <Link to="/tap">
              <Button size="sm" variant={isTAPComplete ? "outline" : "default"}>
                {currentTAP ? (isTAPComplete ? 'Ver TAP' : 'Completar TAP') : 'Criar TAP'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
            <Link to="/fases">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver detalhes</Button>
            </Link>
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
            <Link to="/eap">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver detalhes</Button>
            </Link>
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
            <Link to="/tarefas">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver detalhes</Button>
            </Link>
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

      {/* Seção PMBOK - Gestão de Escopo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Gestão de Escopo (PMBOK)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requisitos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.approvedRequirements}/{totalStats.requirements}</div>
              <p className="text-xs text-muted-foreground">{requirementsApprovalRate.toFixed(1)}% aprovados</p>
              <Progress value={requirementsApprovalRate} className="mt-2" />
              <Link to="/requisitos">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar requisitos</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Declaração de Escopo</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scopeStatement.length}</div>
              <p className="text-xs text-muted-foreground">
                {scopeStatement.length > 0 ? 'Definida' : 'Não definida'}
              </p>
              <Link to="/escopo">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  {scopeStatement.length > 0 ? 'Ver escopo' : 'Definir escopo'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validação do Escopo</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.approvedValidations}/{totalStats.scopeValidations}</div>
              <p className="text-xs text-muted-foreground">Entregas validadas</p>
              <Link to="/validacao">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar validações</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção de Custos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Gestão de Custos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Estimado (Fases)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalStats.phasesCost.estimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Planejado nas fases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Real (Total)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalActualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              <p className="text-xs text-muted-foreground">
                {currentTAP ? 'Do TAP' : 'Estimado'}
              </p>
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
              <Link to="/custos">
                <Button variant="link" size="sm" className="p-0 h-auto">Ver detalhes</Button>
              </Link>
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
                <span>R$ {totalActualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span>R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        {costByWBS.length > 0 && (
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
        )}
      </div>

      {/* Variação de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Variação de Custos
            {totalActualCost > totalStats.phasesCost.estimated ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {Math.abs(totalActualCost - totalStats.phasesCost.estimated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalActualCost > totalStats.phasesCost.estimated ? 'Acima do orçamento das fases' : 'Dentro do orçamento das fases'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
