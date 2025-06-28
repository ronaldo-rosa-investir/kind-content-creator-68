
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Clock, Users, CheckCircle, AlertCircle, FileText, Target, Shield, Calendar, ArrowRight, Download, Copy, Plus, Lightbulb, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { phases, wbsItems, tasks, costItems, requirements, scopeStatement, scopeValidations, getTotalProjectCost, projectCharter } = useProject();

  // Calcular estatísticas básicas de forma mais realista
  const currentTAP = projectCharter.length > 0 ? projectCharter[0] : null;
  
  // Verificar completude do TAP de forma mais detalhada
  const tapFields = [
    currentTAP?.projectName,
    currentTAP?.sponsors,
    currentTAP?.projectManager,
    currentTAP?.startDate,
    currentTAP?.estimatedEndDate,
    currentTAP?.projectObjectives,
    currentTAP?.businessDemand,
    currentTAP?.projectScope,
    currentTAP?.estimatedBudget
  ];
  
  const tapCompleteness = tapFields.filter(field => field && field.toString().trim() !== '').length;
  const tapCompletenessPercentage = Math.round((tapCompleteness / tapFields.length) * 100);
  const isTAPComplete = tapCompletenessPercentage >= 80;

  // Calcular status geral do projeto
  const tapWeight = 30;
  const eapWeight = 40;
  const tasksWeight = 30;
  
  const eapCompleteness = wbsItems.length > 0 ? 100 : 0;
  const tasksCompleteness = tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0;
  
  const overallProgress = Math.round(
    (tapCompletenessPercentage * tapWeight + eapCompleteness * eapWeight + tasksCompleteness * tasksWeight) / 100
  );

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
  const projectBudget = currentTAP?.estimatedBudget || 150000;
  const totalActualCost = projectCosts.actual + phasesCosts.actual;
  const budgetUsed = (totalActualCost / projectBudget) * 100;
  const remainingBudget = projectBudget - totalActualCost;

  // Função para determinar status do orçamento
  const getBudgetStatus = () => {
    if (budgetUsed > 100) return { status: 'Acima do Orçamento', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (budgetUsed > 80) return { status: 'Atenção', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Dentro do Orçamento', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const budgetStatus = getBudgetStatus();

  // Calcular níveis hierárquicos da EAP
  const eapLevels = wbsItems.length > 0 ? Math.max(...wbsItems.map(item => item.code.split('.').length)) : 0;

  // Calcular prazo final estimado
  const getProjectEndDate = () => {
    if (phases.length === 0) return 'Não definido';
    const endDates = phases.map(p => new Date(p.endDate));
    const projectEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
    return projectEnd.toLocaleDateString('pt-BR');
  };

  // Determinar próximos passos
  const getNextSteps = () => {
    if (tapCompletenessPercentage < 50) {
      return {
        title: 'Complete o TAP primeiro',
        description: 'Preencha as informações básicas do projeto no Termo de Abertura',
        action: 'Ir para TAP',
        link: '/tap',
        icon: FileText,
        priority: 'high'
      };
    }
    if (wbsItems.length === 0) {
      return {
        title: 'Organize o trabalho na EAP',
        description: 'Defina os pacotes de trabalho na Estrutura Analítica do Projeto',
        action: 'Criar EAP',
        link: '/eap',
        icon: Target,
        priority: 'medium'
      };
    }
    if (tasks.length === 0) {
      return {
        title: 'Crie tarefas para execução',
        description: 'Transforme os pacotes de trabalho em tarefas executáveis',
        action: 'Gerenciar Tarefas',
        link: '/tarefas',
        icon: CheckCircle,
        priority: 'medium'
      };
    }
    return {
      title: 'Acompanhe o progresso',
      description: 'Monitore o andamento das tarefas e entregas do projeto',
      action: 'Ver Cronograma',
      link: '/cronograma',
      icon: Activity,
      priority: 'low'
    };
  };

  const nextSteps = getNextSteps();

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

  const progressByWBS = wbsItems
    .filter(item => item.estimatedHours > 0)
    .map(item => ({
      name: item.code,
      progress: item.actualHours > 0 ? Math.round((item.actualHours / item.estimatedHours) * 100) : 0,
      activity: item.activity.substring(0, 30) + (item.activity.length > 30 ? '...' : '')
    }));

  const budgetData = [{
    name: 'Orçamento',
    'Orçamento Total': projectBudget,
    'Custo Real': totalActualCost,
    'Disponível': remainingBudget
  }];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard do Projeto</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Guia de Uso */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Lightbulb className="h-5 w-5" />
            💡 Como usar este sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
              <span>Comece criando o TAP (Termo de Abertura)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
              <span>Defina o escopo detalhado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
              <span>Organize o trabalho na EAP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
              <span>Acompanhe o progresso aqui</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-semibold ${isTAPComplete ? 'text-green-700' : 'text-orange-700'}`}>
                {tapCompletenessPercentage}% Completo
              </p>
              <Progress value={tapCompletenessPercentage} className="mt-1" />
            </div>
            {currentTAP && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Projeto</p>
                  <p className="font-semibold">{currentTAP.projectName || 'Não definido'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orçamento Aprovado</p>
                  <p className="font-semibold text-blue-700">
                    R$ {projectBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo Final</p>
                  <p className="font-semibold">
                    {currentTAP.estimatedEndDate ? 
                      new Date(currentTAP.estimatedEndDate).toLocaleDateString('pt-BR') : 
                      'Não definido'
                    }
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            <Link to="/tap">
              <Button size="sm">
                {currentTAP ? 'Ver TAP' : 'Criar TAP'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground">Progresso geral do projeto</p>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cronograma</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phases.length}</div>
            <p className="text-xs text-muted-foreground">
              Planejamento temporal • Fim: {getProjectEndDate()}
            </p>
            <Link to="/cronograma">
              <Button variant="link" size="sm" className="p-0 h-auto mt-2">Ver cronograma</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso do Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{budgetUsed.toFixed(1)}%</div>
              <div className={`px-2 py-1 rounded-full text-xs ${budgetStatus.bgColor} ${budgetStatus.color}`}>
                {budgetStatus.status}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {totalActualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {projectBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <Progress value={Math.min(budgetUsed, 100)} className="mt-2" />
            <Link to="/custos">
              <Button variant="link" size="sm" className="p-0 h-auto">Ver custos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacotes de Trabalho</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wbsItems.length}</div>
            <p className="text-xs text-muted-foreground">
              EAP com {eapLevels} {eapLevels === 1 ? 'nível' : 'níveis'} hierárquicos
            </p>
            <Link to="/eap">
              <Button variant="link" size="sm" className="p-0 h-auto mt-2">Ver EAP</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Passos */}
      <Card className={`border-2 ${
        nextSteps.priority === 'high' ? 'border-red-200 bg-red-50' :
        nextSteps.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
        'border-green-200 bg-green-50'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <nextSteps.icon className="h-5 w-5" />
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg">{nextSteps.title}</h3>
              <p className="text-muted-foreground">{nextSteps.description}</p>
            </div>
            <Link to={nextSteps.link}>
              <Button>
                {nextSteps.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Documentação do Projeto */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Documentação do Projeto</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requisitos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequirements}/{totalRequirements}</div>
              <p className="text-xs text-muted-foreground">
                O que o projeto deve atender • {requirementsApprovalRate.toFixed(1)}% aprovados
              </p>
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
                Definição clara do trabalho • {scopeStatement.length > 0 ? 'Definida' : 'Não definida'}
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
              <CardTitle className="text-sm font-medium">Aprovações</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedValidations}/{totalValidations}</div>
              <p className="text-xs text-muted-foreground">
                Aprovações e entregas validadas
              </p>
              <Link to="/validacao">
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Análise Visual - só mostrar se houver dados */}
      {(costByWBS.length > 0 || progressByWBS.length > 0 || totalActualCost > 0) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Análise Visual</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {progressByWBS.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Progresso por Pacote de Trabalho</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressByWBS}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Progresso']}
                        labelFormatter={(label) => {
                          const item = progressByWBS.find(p => p.name === label);
                          return item ? item.activity : label;
                        }}
                      />
                      <Bar dataKey="progress" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {costByWBS.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Custos por Pacote de Trabalho</CardTitle>
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
            ) : (
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
            )}
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
              <p className={`text-lg font-semibold ${budgetStatus.color}`}>
                {budgetStatus.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Disponível</p>
              <p className="text-lg font-semibold">
                R$ {remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Eficiência</p>
              <p className={`text-lg font-semibold ${completionRate > budgetUsed ? 'text-green-600' : 'text-orange-600'}`}>
                {completionRate > budgetUsed ? 'Eficiente' : 'Revisar Custos'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
