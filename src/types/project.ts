
export interface ProjectPhase {
  id: string;
  name: string;
  status: 'nao-iniciado' | 'em-andamento' | 'pausado' | 'em-revisao' | 'concluido' | 'cancelado' | 'cancelado-com-ressalvas';
  responsible: string;
  startDate: string;
  endDate: string;
  description?: string;
  estimatedCost: number;
  actualCost: number;
  createdAt: string;
}

export interface WBSItem {
  id: string;
  code: string;
  activity: string;
  phaseId: string;
  daysAfterStart: number;
  responsible: string;
  notes?: string;
  requirements?: string;
  risks?: string;
  estimatedHours: number;
  actualHours: number;
  hourlyRate: number;
  estimatedCost: number;
  actualCost: number;
  createdAt: string;
}

export interface WBSSubTask {
  id: string;
  wbsItemId: string;
  description: string;
  completed: boolean;
  estimatedHours: number;
  actualHours: number;
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
  status: 'nao-iniciado' | 'em-andamento' | 'pausado' | 'em-revisao' | 'concluido' | 'cancelado' | 'cancelado-com-ressalvas';
  estimatedHours: number;
  actualHours: number;
  hourlyRate: number;
  createdAt: string;
}

export interface CostItem {
  id: string;
  name: string;
  type: 'mao-de-obra' | 'equipamento' | 'consultoria' | 'outros';
  category: string;
  estimatedCost: number;
  actualCost: number;
  responsible: string;
  phaseId?: string;
  wbsItemId?: string;
  description?: string;
  createdAt: string;
}

export interface LessonLearned {
  id: string;
  item: string;
  category: 'tecnica' | 'gerencial' | 'comunicacao' | 'riscos' | 'outros';
  description: string;
  impact: 'baixo' | 'medio' | 'alto';
  recommendation: string;
  createdAt: string;
}

export interface ClosureChecklist {
  id: string;
  contractsFinalized: boolean;
  stakeholderMeeting: boolean;
  teamReleased: boolean;
  documentsApproved: boolean;
  feedbackMeeting: boolean;
  lessonsLearned: boolean;
  createdAt: string;
}

export interface ProjectData {
  id: string;
  name: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  closureResponsible: string;
  status: 'ativo' | 'finalizado' | 'cancelado';
  createdAt: string;
}

export type ProjectDuration = 'curto' | 'medio' | 'longo' | 'requer-autorizacao';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface WBSDictionary {
  id: string;
  wbsCode: string;
  workPackage: string;
  description: string;
  deliverables: string;
  acceptance: string;
  assumptions: string;
  constraints: string;
  createdAt: string;
}
