
export interface ProjectPhase {
  id: string;
  name: string;
  status: 'planejamento' | 'em-andamento' | 'concluida' | 'cancelada';
  responsible: string;
  startDate: string;
  endDate: string;
  description?: string;
  createdAt: string;
}

export interface WBSItem {
  id: string;
  code: string; // ex: 1.1, 2.4
  activity: string;
  phaseId: string;
  daysAfterStart: number;
  responsible: string;
  notes?: string;
  requirements?: string;
  risks?: string;
  createdAt: string;
}

export interface WBSSubTask {
  id: string;
  wbsItemId: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  wbsItemId: string;
  phaseId: string;
  dueDate: string;
  completed: boolean;
  responsible: string;
  description?: string;
  comments?: string;
  createdAt: string;
}
