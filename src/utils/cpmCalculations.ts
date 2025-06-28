
import { GanttTask, CPMResult } from '@/types/gantt';

export class CPMCalculator {
  static calculateCriticalPath(tasks: GanttTask[]): CPMResult {
    const taskMap = new Map(tasks.map(task => [task.id, task]));
    const earlyStart: { [taskId: string]: Date } = {};
    const earlyFinish: { [taskId: string]: Date } = {};
    const lateStart: { [taskId: string]: Date } = {};
    const lateFinish: { [taskId: string]: Date } = {};
    const float: { [taskId: string]: number } = {};

    // Forward Pass - Calcular Early Start e Early Finish
    const sortedTasks = this.topologicalSort(tasks);
    
    sortedTasks.forEach(task => {
      const taskStartDate = new Date(task.startDate);
      
      if (task.dependencies.length === 0) {
        earlyStart[task.id] = taskStartDate;
      } else {
        let maxFinish = taskStartDate;
        task.dependencies.forEach(depId => {
          const depFinish = earlyFinish[depId];
          if (depFinish && depFinish > maxFinish) {
            maxFinish = depFinish;
          }
        });
        earlyStart[task.id] = maxFinish;
      }

      earlyFinish[task.id] = new Date(earlyStart[task.id]);
      earlyFinish[task.id].setDate(earlyFinish[task.id].getDate() + task.duration);
    });

    // Backward Pass - Calcular Late Start e Late Finish
    const projectEndDate = Math.max(...Object.values(earlyFinish).map(date => date.getTime()));
    const reversedTasks = [...sortedTasks].reverse();

    reversedTasks.forEach(task => {
      const successors = tasks.filter(t => t.dependencies.includes(task.id));
      
      if (successors.length === 0) {
        lateFinish[task.id] = new Date(projectEndDate);
      } else {
        let minStart = new Date(projectEndDate);
        successors.forEach(successor => {
          const succStart = lateStart[successor.id];
          if (succStart && succStart < minStart) {
            minStart = succStart;
          }
        });
        lateFinish[task.id] = minStart;
      }

      lateStart[task.id] = new Date(lateFinish[task.id]);
      lateStart[task.id].setDate(lateStart[task.id].getDate() - task.duration);

      // Calcular folga
      const earlyStartTime = earlyStart[task.id].getTime();
      const lateStartTime = lateStart[task.id].getTime();
      float[task.id] = Math.floor((lateStartTime - earlyStartTime) / (1000 * 60 * 60 * 24));
    });

    // Identificar caminho crítico
    const criticalPath = tasks
      .filter(task => float[task.id] === 0)
      .map(task => task.id);

    const totalProjectDuration = Math.floor(
      (projectEndDate - Math.min(...Object.values(earlyStart).map(date => date.getTime()))) / 
      (1000 * 60 * 60 * 24)
    );

    return {
      criticalPath,
      totalProjectDuration,
      float,
      earlyStart,
      earlyFinish,
      lateStart,
      lateFinish
    };
  }

  private static topologicalSort(tasks: GanttTask[]): GanttTask[] {
    const visited = new Set<string>();
    const result: GanttTask[] = [];
    const taskMap = new Map(tasks.map(task => [task.id, task]));

    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      
      const task = taskMap.get(taskId);
      if (!task) return;

      task.dependencies.forEach(depId => visit(depId));
      visited.add(taskId);
      result.push(task);
    };

    tasks.forEach(task => visit(task.id));
    return result;
  }

  static optimizeResourceLeveling(tasks: GanttTask[]): {
    optimizedTasks: GanttTask[];
    resourceUtilization: { [resource: string]: { [date: string]: number } };
    recommendations: string[];
  } {
    const resourceUtilization: { [resource: string]: { [date: string]: number } } = {};
    const recommendations: string[] = [];
    const optimizedTasks = [...tasks];

    // Análise de utilização de recursos
    tasks.forEach(task => {
      task.resources.forEach(resource => {
        if (!resourceUtilization[resource]) {
          resourceUtilization[resource] = {};
        }

        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split('T')[0];
          resourceUtilization[resource][dateKey] = 
            (resourceUtilization[resource][dateKey] || 0) + (100 / task.duration);
        }
      });
    });

    // Identificar conflitos de recursos
    Object.entries(resourceUtilization).forEach(([resource, utilization]) => {
      const overallocatedDates = Object.entries(utilization)
        .filter(([date, usage]) => usage > 100)
        .map(([date]) => date);

      if (overallocatedDates.length > 0) {
        recommendations.push(
          `Recurso ${resource} está sobrecarregado em ${overallocatedDates.length} dias`
        );
      }
    });

    return {
      optimizedTasks,
      resourceUtilization,
      recommendations
    };
  }

  static runMonteCarloSimulation(
    tasks: GanttTask[], 
    iterations: number = 1000
  ): {
    meanDuration: number;
    standardDeviation: number;
    percentiles: { [key: string]: number };
    probabilityDistribution: number[];
  } {
    const durations: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const simulatedTasks = tasks.map(task => ({
        ...task,
        duration: this.generateRandomDuration(task.duration)
      }));

      const cpmResult = this.calculateCriticalPath(simulatedTasks);
      durations.push(cpmResult.totalProjectDuration);
    }

    durations.sort((a, b) => a - b);

    const meanDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - meanDuration, 2), 0) / durations.length;
    const standardDeviation = Math.sqrt(variance);

    const percentiles = {
      P10: durations[Math.floor(iterations * 0.1)],
      P25: durations[Math.floor(iterations * 0.25)],
      P50: durations[Math.floor(iterations * 0.5)],
      P75: durations[Math.floor(iterations * 0.75)],
      P90: durations[Math.floor(iterations * 0.9)]
    };

    return {
      meanDuration,
      standardDeviation,
      percentiles,
      probabilityDistribution: durations
    };
  }

  private static generateRandomDuration(baseDuration: number): number {
    // Distribuição triangular: mínimo = 80%, mais provável = 100%, máximo = 150%
    const min = baseDuration * 0.8;
    const mode = baseDuration;
    const max = baseDuration * 1.5;

    const u = Math.random();
    const c = (mode - min) / (max - min);

    if (u < c) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
  }
}
