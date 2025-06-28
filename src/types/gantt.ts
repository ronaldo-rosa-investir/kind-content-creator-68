
export interface GanttSettings {
  scale: 'day' | 'week' | 'month';
  showCriticalPath: boolean;
  showDependencies: boolean;
  allowDragDrop: boolean;
  showProgress: boolean;
}

export interface GanttDependency {
  id: string;
  source: string;
  target: string;
  type: 'FS' | 'SS' | 'FF' | 'SF'; // Finish-to-Start, Start-to-Start, etc.
  lag: number; // Em dias
}

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  parentId?: string;
  dependencies: string[];
  resources: string[];
  status: 'nao-iniciado' | 'em-andamento' | 'concluido' | 'atrasado';
  milestone: boolean;
  critical: boolean;
  level: number;
  cost?: number;
  earnedValue?: number;
  actualCost?: number;
  plannedValue?: number;
}

export interface BaselineSnapshot {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  tasks: GanttTask[];
  totalBudget: number;
  totalDuration: number;
  status: 'active' | 'archived';
  version: string;
}

export interface VarianceReport {
  taskId: string;
  taskName: string;
  scheduleVariance: number; // SV = EV - PV
  costVariance: number; // CV = EV - AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  costPerformanceIndex: number; // CPI = EV / AC
  estimateAtCompletion: number; // EAC
  varianceAtCompletion: number; // VAC = BAC - EAC
}

export interface EVMMetrics {
  plannedValue: number; // PV - Valor Planejado
  earnedValue: number; // EV - Valor Agregado
  actualCost: number; // AC - Custo Real
  budgetAtCompletion: number; // BAC - Orçamento no Término
  scheduleVariance: number; // SV = EV - PV
  costVariance: number; // CV = EV - AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  costPerformanceIndex: number; // CPI = EV / AC
  estimateAtCompletion: number; // EAC
  estimateToComplete: number; // ETC = EAC - AC
  varianceAtCompletion: number; // VAC = BAC - EAC
  toCompletePerformanceIndex: number; // TCPI
}

export interface CPMResult {
  criticalPath: string[];
  totalProjectDuration: number;
  float: { [taskId: string]: number };
  earlyStart: { [taskId: string]: Date };
  earlyFinish: { [taskId: string]: Date };
  lateStart: { [taskId: string]: Date };
  lateFinish: { [taskId: string]: Date };
}
