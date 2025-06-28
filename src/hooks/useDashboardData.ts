
import { useProject } from '@/contexts/ProjectContext';

export const useDashboardData = () => {
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
        icon: 'FileText',
        priority: 'high'
      };
    }
    if (wbsItems.length === 0) {
      return {
        title: 'Organize o trabalho na EAP',
        description: 'Defina os pacotes de trabalho na Estrutura Analítica do Projeto',
        action: 'Criar EAP',
        link: '/eap',
        icon: 'Target',
        priority: 'medium'
      };
    }
    if (tasks.length === 0) {
      return {
        title: 'Crie tarefas para execução',
        description: 'Transforme os pacotes de trabalho em tarefas executáveis',
        action: 'Gerenciar Tarefas',
        link: '/tarefas',
        icon: 'CheckCircle',
        priority: 'medium'
      };
    }
    return {
      title: 'Acompanhe o progresso',
      description: 'Monitore o andamento das tarefas e entregas do projeto',
      action: 'Ver Cronograma',
      link: '/cronograma',
      icon: 'Activity',
      priority: 'low'
    };
  };

  const nextSteps = getNextSteps();

  // Preparar dados para gráficos
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

  return {
    // TAP data
    currentTAP,
    tapCompletenessPercentage,
    isTAPComplete,
    
    // Project stats
    overallProgress,
    totalTasks,
    completedTasks,
    completionRate,
    
    // Requirements
    totalRequirements,
    approvedRequirements,
    requirementsApprovalRate,
    
    // Validations
    totalValidations,
    approvedValidations,
    
    // Budget
    projectBudget,
    totalActualCost,
    budgetUsed,
    remainingBudget,
    budgetStatus,
    
    // EAP
    eapLevels,
    
    // Phases
    phases,
    getProjectEndDate,
    
    // Next steps
    nextSteps,
    
    // Chart data
    costByWBS,
    progressByWBS,
    budgetData,
    
    // Additional data
    wbsItems,
    scopeStatement
  };
};
