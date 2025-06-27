
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
  contractType: 'horas' | 'valor-fixo' | 'consultoria-projeto';
  contractValue?: number; // Para valor fixo ou consultoria
  contractDuration?: number; // Para consultoria (em meses)
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

// Novos tipos para PMBOK
export interface Requirement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'funcional' | 'nao-funcional' | 'negocio' | 'tecnico' | 'qualidade' | 'restricao';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'rascunho' | 'aprovado' | 'rejeitado' | 'em-analise' | 'implementado' | 'testado' | 'validado';
  source: string;
  responsible: string;
  stakeholder: string;
  acceptanceCriteria: string;
  businessRule?: string;
  phaseId?: string;
  wbsItemId?: string;
  traceability: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScopeStatement {
  id: string;
  projectObjective: string;
  productDescription: string;
  deliverables: string[];
  acceptanceCriteria: string;
  constraints: string[];
  assumptions: string[];
  exclusions: string[];
  approvedBy: string;
  approvalDate: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScopeValidation {
  id: string;
  deliverableId: string;
  deliverableName: string;
  description: string;
  acceptanceCriteria: string;
  validationMethod: 'inspecao' | 'teste' | 'demonstracao' | 'revisao' | 'auditoria';
  responsible: string;
  stakeholder: string;
  plannedDate: string;
  actualDate?: string;
  status: 'planejado' | 'em-andamento' | 'aprovado' | 'rejeitado' | 'pendente';
  comments?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Novos tipos para TAP e Ciclo de Vida
export interface ProjectCharter {
  id: string;
  projectName: string;
  projectManager: string;
  sponsor: string;
  businessJustification: string;
  projectObjectives: string[];
  highLevelRequirements: string[];
  assumptions: string[];
  constraints: string[];
  risks: string[];
  budget: number;
  timeline: string;
  stakeholders: string[];
  successCriteria: string[];
  approvedBy: string;
  approvalDate: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectLifecycle {
  id: string;
  currentPhase: string;
  phases: {
    name: string;
    status: 'nao-iniciado' | 'em-andamento' | 'concluido';
    startDate?: string;
    endDate?: string;
    deliverables: string[];
    gatesCriteria: string[];
  }[];
  methodology: 'tradicional' | 'agil' | 'hibrido';
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleItem {
  id: string;
  wbsCode: string;
  taskName: string;
  duration: number;
  startDate: string;
  endDate: string;
  predecessors: string[];
  resources: string[];
  progress: number;
  status: 'nao-iniciado' | 'em-andamento' | 'concluido' | 'atrasado';
  createdAt: string;
}
