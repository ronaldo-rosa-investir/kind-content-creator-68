
import { GanttTask, EVMMetrics, VarianceReport } from '@/types/gantt';

export class EVMCalculator {
  static calculateEVMMetrics(tasks: GanttTask[], baselineDate: Date = new Date()): EVMMetrics {
    const totalPlannedValue = tasks.reduce((sum, task) => {
      const taskStartDate = new Date(task.startDate);
      const taskEndDate = new Date(task.endDate);
      
      if (baselineDate >= taskEndDate) {
        return sum + (task.plannedValue || 0);
      } else if (baselineDate >= taskStartDate && baselineDate < taskEndDate) {
        const totalDuration = taskEndDate.getTime() - taskStartDate.getTime();
        const elapsedDuration = baselineDate.getTime() - taskStartDate.getTime();
        const percentageComplete = elapsedDuration / totalDuration;
        return sum + (task.plannedValue || 0) * percentageComplete;
      }
      return sum;
    }, 0);

    const totalEarnedValue = tasks.reduce((sum, task) => {
      return sum + (task.earnedValue || 0);
    }, 0);

    const totalActualCost = tasks.reduce((sum, task) => {
      return sum + (task.actualCost || 0);
    }, 0);

    const totalBudgetAtCompletion = tasks.reduce((sum, task) => {
      return sum + (task.cost || 0);
    }, 0);

    const scheduleVariance = totalEarnedValue - totalPlannedValue;
    const costVariance = totalEarnedValue - totalActualCost;
    
    const schedulePerformanceIndex = totalPlannedValue > 0 ? totalEarnedValue / totalPlannedValue : 0;
    const costPerformanceIndex = totalActualCost > 0 ? totalEarnedValue / totalActualCost : 0;

    // EAC usando CPI
    const estimateAtCompletion = costPerformanceIndex > 0 ? 
      totalActualCost + ((totalBudgetAtCompletion - totalEarnedValue) / costPerformanceIndex) : 
      totalBudgetAtCompletion;

    const estimateToComplete = estimateAtCompletion - totalActualCost;
    const varianceAtCompletion = totalBudgetAtCompletion - estimateAtCompletion;

    // TCPI para orçamento restante
    const remainingWork = totalBudgetAtCompletion - totalEarnedValue;
    const remainingBudget = totalBudgetAtCompletion - totalActualCost;
    const toCompletePerformanceIndex = remainingBudget > 0 ? remainingWork / remainingBudget : 0;

    return {
      plannedValue: totalPlannedValue,
      earnedValue: totalEarnedValue,
      actualCost: totalActualCost,
      budgetAtCompletion: totalBudgetAtCompletion,
      scheduleVariance,
      costVariance,
      schedulePerformanceIndex,
      costPerformanceIndex,
      estimateAtCompletion,
      estimateToComplete,
      varianceAtCompletion,
      toCompletePerformanceIndex
    };
  }

  static generateVarianceReport(tasks: GanttTask[]): VarianceReport[] {
    return tasks.map(task => {
      const plannedValue = task.plannedValue || 0;
      const earnedValue = task.earnedValue || 0;
      const actualCost = task.actualCost || 0;
      const budgetAtCompletion = task.cost || 0;

      const scheduleVariance = earnedValue - plannedValue;
      const costVariance = earnedValue - actualCost;
      const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0;
      const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;

      const estimateAtCompletion = costPerformanceIndex > 0 ? 
        actualCost + ((budgetAtCompletion - earnedValue) / costPerformanceIndex) : 
        budgetAtCompletion;

      const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;

      return {
        taskId: task.id,
        taskName: task.name,
        scheduleVariance,
        costVariance,
        schedulePerformanceIndex,
        costPerformanceIndex,
        estimateAtCompletion,
        varianceAtCompletion
      };
    });
  }

  static predictProjectCompletion(evmMetrics: EVMMetrics): {
    estimatedCompletionDate: Date;
    probabilityOnTime: number;
    recommendedActions: string[];
  } {
    const today = new Date();
    const { schedulePerformanceIndex, costPerformanceIndex } = evmMetrics;

    // Estimativa baseada no SPI
    const remainingDuration = evmMetrics.estimateToComplete / (evmMetrics.earnedValue / 30); // Assumindo trabalho mensal
    const estimatedCompletionDate = new Date(today);
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + remainingDuration);

    // Probabilidade baseada nos índices de performance
    const avgPerformance = (schedulePerformanceIndex + costPerformanceIndex) / 2;
    const probabilityOnTime = Math.max(0, Math.min(100, avgPerformance * 100));

    const recommendedActions: string[] = [];
    
    if (schedulePerformanceIndex < 0.9) {
      recommendedActions.push("Acelerar atividades críticas");
      recommendedActions.push("Considerar recursos adicionais");
    }
    
    if (costPerformanceIndex < 0.9) {
      recommendedActions.push("Revisar eficiência dos recursos");
      recommendedActions.push("Renegociar escopo ou orçamento");
    }

    if (evmMetrics.toCompletePerformanceIndex > 1.1) {
      recommendedActions.push("Performance futura deve melhorar significativamente");
    }

    return {
      estimatedCompletionDate,
      probabilityOnTime,
      recommendedActions
    };
  }
}
