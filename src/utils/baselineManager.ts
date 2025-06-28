
import { BaselineSnapshot, GanttTask } from '@/types/gantt';

export class BaselineManager {
  private static readonly STORAGE_KEY = 'project_baselines';

  static saveBaseline(
    projectId: string,
    name: string,
    description: string,
    tasks: GanttTask[],
    totalBudget: number,
    createdBy: string
  ): BaselineSnapshot {
    const baseline: BaselineSnapshot = {
      id: `baseline_${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      createdBy,
      tasks: JSON.parse(JSON.stringify(tasks)), // Deep clone
      totalBudget,
      totalDuration: this.calculateTotalDuration(tasks),
      status: 'active',
      version: this.generateVersion(projectId)
    };

    this.storeBaseline(projectId, baseline);
    return baseline;
  }

  static getBaselines(projectId: string): BaselineSnapshot[] {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${projectId}`);
    return stored ? JSON.parse(stored) : [];
  }

  static getActiveBaseline(projectId: string): BaselineSnapshot | null {
    const baselines = this.getBaselines(projectId);
    return baselines.find(b => b.status === 'active') || null;
  }

  static compareWithBaseline(
    currentTasks: GanttTask[],
    baselineTasks: GanttTask[]
  ): {
    scheduleVariances: { taskId: string; taskName: string; variance: number }[];
    costVariances: { taskId: string; taskName: string; variance: number }[];
    scopeChanges: { taskId: string; changeType: 'added' | 'removed' | 'modified'; details: string }[];
    overallHealth: 'green' | 'yellow' | 'red';
  } {
    const scheduleVariances: { taskId: string; taskName: string; variance: number }[] = [];
    const costVariances: { taskId: string; taskName: string; variance: number }[] = [];
    const scopeChanges: { taskId: string; changeType: 'added' | 'removed' | 'modified'; details: string }[] = [];

    const currentTaskMap = new Map(currentTasks.map(t => [t.id, t]));
    const baselineTaskMap = new Map(baselineTasks.map(t => [t.id, t]));

    // Verificar tarefas modificadas
    baselineTasks.forEach(baselineTask => {
      const currentTask = currentTaskMap.get(baselineTask.id);
      
      if (!currentTask) {
        scopeChanges.push({
          taskId: baselineTask.id,
          changeType: 'removed',
          details: `Tarefa removida: ${baselineTask.name}`
        });
        return;
      }

      // Verificar variação de cronograma
      const baselineEnd = new Date(baselineTask.endDate);
      const currentEnd = new Date(currentTask.endDate);
      const scheduleVariance = Math.floor((currentEnd.getTime() - baselineEnd.getTime()) / (1000 * 60 * 60 * 24));
      
      if (Math.abs(scheduleVariance) > 0) {
        scheduleVariances.push({
          taskId: currentTask.id,
          taskName: currentTask.name,
          variance: scheduleVariance
        });
      }

      // Verificar variação de custo
      const costVariance = (currentTask.actualCost || 0) - (baselineTask.cost || 0);
      if (Math.abs(costVariance) > 0) {
        costVariances.push({
          taskId: currentTask.id,
          taskName: currentTask.name,
          variance: costVariance
        });
      }

      // Verificar mudanças no escopo
      if (currentTask.name !== baselineTask.name || 
          currentTask.duration !== baselineTask.duration) {
        scopeChanges.push({
          taskId: currentTask.id,
          changeType: 'modified',
          details: `Modificações detectadas em: ${currentTask.name}`
        });
      }
    });

    // Verificar novas tarefas
    currentTasks.forEach(currentTask => {
      if (!baselineTaskMap.has(currentTask.id)) {
        scopeChanges.push({
          taskId: currentTask.id,
          changeType: 'added',
          details: `Nova tarefa adicionada: ${currentTask.name}`
        });
      }
    });

    // Determinar saúde geral do projeto
    const criticalVariances = scheduleVariances.filter(sv => Math.abs(sv.variance) > 7).length;
    const significantCostVariances = costVariances.filter(cv => Math.abs(cv.variance) > 5000).length;
    const majorScopeChanges = scopeChanges.length;

    let overallHealth: 'green' | 'yellow' | 'red' = 'green';
    if (criticalVariances > 2 || significantCostVariances > 2 || majorScopeChanges > 5) {
      overallHealth = 'red';
    } else if (criticalVariances > 0 || significantCostVariances > 0 || majorScopeChanges > 2) {
      overallHealth = 'yellow';
    }

    return {
      scheduleVariances,
      costVariances,
      scopeChanges,
      overallHealth
    };
  }

  private static storeBaseline(projectId: string, baseline: BaselineSnapshot): void {
    const existing = this.getBaselines(projectId);
    
    // Marcar baseline anterior como arquivada
    existing.forEach(b => {
      if (b.status === 'active') {
        b.status = 'archived';
      }
    });

    existing.push(baseline);
    localStorage.setItem(`${this.STORAGE_KEY}_${projectId}`, JSON.stringify(existing));
  }

  private static calculateTotalDuration(tasks: GanttTask[]): number {
    if (tasks.length === 0) return 0;
    
    const startDates = tasks.map(t => new Date(t.startDate).getTime());
    const endDates = tasks.map(t => new Date(t.endDate).getTime());
    
    const projectStart = Math.min(...startDates);
    const projectEnd = Math.max(...endDates);
    
    return Math.floor((projectEnd - projectStart) / (1000 * 60 * 60 * 24));
  }

  private static generateVersion(projectId: string): string {
    const baselines = this.getBaselines(projectId);
    return `v${baselines.length + 1}.0`;
  }

  static generateBaselineReport(
    projectId: string,
    currentTasks: GanttTask[]
  ): {
    reportDate: string;
    baselineInfo: BaselineSnapshot | null;
    comparison: ReturnType<typeof BaselineManager.compareWithBaseline> | null;
    recommendations: string[];
  } {
    const baseline = this.getActiveBaseline(projectId);
    const comparison = baseline ? this.compareWithBaseline(currentTasks, baseline.tasks) : null;
    
    const recommendations: string[] = [];
    
    if (comparison) {
      if (comparison.scheduleVariances.length > 0) {
        recommendations.push("Revisar cronograma das tarefas com variação significativa");
      }
      
      if (comparison.costVariances.length > 0) {
        recommendations.push("Analisar causas das variações de custo");
      }
      
      if (comparison.scopeChanges.length > 0) {
        recommendations.push("Documentar e aprovar formalmente as mudanças de escopo");
      }

      if (comparison.overallHealth === 'red') {
        recommendations.push("AÇÃO URGENTE: Projeto apresenta desvios críticos");
      }
    }

    return {
      reportDate: new Date().toISOString(),
      baselineInfo: baseline,
      comparison,
      recommendations
    };
  }
}
