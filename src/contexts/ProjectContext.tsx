import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ProjectPhase, 
  WBSItem, 
  WBSSubTask, 
  ProjectTask, 
  CostItem, 
  LessonLearned, 
  ClosureChecklist, 
  ProjectData, 
  TeamMember, 
  WBSDictionary,
  Requirement,
  ScopeStatement,
  ScopeValidation,
  ProjectCharter,
  ProjectLifecycle,
  ScheduleItem
} from '@/types/project';
import { WBSCodeGenerator } from '@/utils/wbsCodeGenerator';

// Tipo para projeto na lista
interface ProjectItem {
  id: number;
  name: string;
  client: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent?: number;
  progress: number;
  manager: string;
}

interface ProjectContextType {
  // Estado central de navegação
  currentView: string;
  activeProject: ProjectItem | null;
  projects: ProjectItem[];
  
  // Funções de navegação
  setCurrentView: (view: string) => void;
  openProject: (project: ProjectItem) => void;
  closeProject: () => void;
  
  // Estado atual do projeto
  phases: ProjectPhase[];
  wbsItems: WBSItem[];
  subTasks: WBSSubTask[];
  tasks: ProjectTask[];
  costItems: CostItem[];
  lessonsLearned: LessonLearned[];
  closureChecklist: ClosureChecklist[];
  projectData: ProjectData[];
  teamMembers: TeamMember[];
  wbsDictionary: WBSDictionary[];
  requirements: Requirement[];
  scopeStatement: ScopeStatement[];
  scopeValidations: ScopeValidation[];
  projectCharter: ProjectCharter[];
  projectLifecycle: ProjectLifecycle[];
  scheduleItems: ScheduleItem[];
  
  // Phase operations
  addPhase: (phase: Omit<ProjectPhase, 'id' | 'createdAt'>) => void;
  updatePhase: (id: string, updates: Partial<ProjectPhase>) => void;
  deletePhase: (id: string) => void;
  
  // WBS operations
  addWBSItem: (item: Omit<WBSItem, 'id' | 'createdAt'>) => void;
  updateWBSItem: (id: string, updates: Partial<WBSItem>) => void;
  deleteWBSItem: (id: string) => void;
  
  // SubTask operations
  addSubTask: (subTask: Omit<WBSSubTask, 'id' | 'createdAt'>) => void;
  updateSubTask: (id: string, updates: Partial<WBSSubTask>) => void;
  deleteSubTask: (id: string) => void;
  
  // Task operations
  addTask: (task: Omit<ProjectTask, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<ProjectTask>) => void;
  deleteTask: (id: string) => void;
  
  // Cost operations
  addCostItem: (cost: Omit<CostItem, 'id' | 'createdAt'>) => void;
  updateCostItem: (id: string, updates: Partial<CostItem>) => void;
  deleteCostItem: (id: string) => void;
  
  // Lessons learned operations
  addLessonLearned: (lesson: Omit<LessonLearned, 'id' | 'createdAt'>) => void;
  updateLessonLearned: (id: string, updates: Partial<LessonLearned>) => void;
  deleteLessonLearned: (id: string) => void;
  
  // Closure checklist operations
  updateClosureChecklist: (updates: Partial<ClosureChecklist>) => void;
  
  // Team operations
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  
  // WBS Dictionary operations
  addWBSDictionary: (dict: Omit<WBSDictionary, 'id' | 'createdAt'>) => void;
  updateWBSDictionary: (id: string, updates: Partial<WBSDictionary>) => void;
  deleteWBSDictionary: (id: string) => void;
  
  // Requirements operations
  addRequirement: (requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  deleteRequirement: (id: string) => void;
  
  // Scope Statement operations
  addScopeStatement: (statement: Omit<ScopeStatement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScopeStatement: (id: string, updates: Partial<ScopeStatement>) => void;
  
  // Scope Validation operations
  addScopeValidation: (validation: Omit<ScopeValidation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScopeValidation: (id: string, updates: Partial<ScopeValidation>) => void;
  deleteScopeValidation: (id: string) => void;
  
  // Project Charter operations
  addProjectCharter: (charter: Omit<ProjectCharter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProjectCharter: (id: string, updates: Partial<ProjectCharter>) => void;
  
  // Project Lifecycle operations
  addProjectLifecycle: (lifecycle: Omit<ProjectLifecycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProjectLifecycle: (id: string, updates: Partial<ProjectLifecycle>) => void;
  
  // Schedule operations
  addScheduleItem: (item: Omit<ScheduleItem, 'id' | 'createdAt'>) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  
  // Helper functions
  getWBSItemsByPhase: (phaseId: string) => WBSItem[];
  getSubTasksByWBS: (wbsItemId: string) => WBSSubTask[];
  getTasksByWBS: (wbsItemId: string) => ProjectTask[];
  getWBSProgress: (wbsItemId: string) => number;
  getTotalProjectCost: () => { estimated: number; actual: number };
  getProjectDuration: () => number;
  getProjectDurationType: () => string;
  calculateWBSCost: (item: WBSItem) => { estimated: number; actual: number };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado central de navegação
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 1,
      name: "Sistema ERP Corporativo",
      client: "Empresa ABC Ltda",
      status: "Em Andamento",
      startDate: "2024-01-15",
      endDate: "2024-08-15",
      budget: 120000,
      spent: 90000,
      progress: 75,
      manager: "João Silva"
    },
    {
      id: 2,
      name: "Aplicativo Mobile E-commerce",
      client: "Tech Solutions Inc",
      status: "Planejamento",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      budget: 80000,
      spent: 20000,
      progress: 25,
      manager: "Maria Santos"
    },
    {
      id: 3,
      name: "Migração para Cloud AWS",
      client: "StartUp Inovadora",
      status: "Em Andamento",
      startDate: "2024-02-10",
      endDate: "2024-07-20",
      budget: 200000,
      spent: 120000,
      progress: 60,
      manager: "Pedro Costa"
    },
    {
      id: 4,
      name: "Portal do Cliente",
      client: "Empresa ABC Ltda",
      status: "Concluído",
      startDate: "2024-01-01",
      endDate: "2024-06-15",
      budget: 95000,
      spent: 92000,
      progress: 100,
      manager: "Ana Oliveira"
    },
  ]);

  // Estados do projeto atual
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [wbsItems, setWBSItems] = useState<WBSItem[]>([]);
  const [subTasks, setSubTasks] = useState<WBSSubTask[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [lessonsLearned, setLessonsLearned] = useState<LessonLearned[]>([]);
  const [closureChecklist, setClosureChecklist] = useState<ClosureChecklist[]>([]);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [wbsDictionary, setWBSDictionary] = useState<WBSDictionary[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [scopeStatement, setScopeStatement] = useState<ScopeStatement[]>([]);
  const [scopeValidations, setScopeValidations] = useState<ScopeValidation[]>([]);
  const [projectCharter, setProjectCharter] = useState<ProjectCharter[]>([]);
  const [projectLifecycle, setProjectLifecycle] = useState<ProjectLifecycle[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  // Funções de navegação
  const openProject = (project: ProjectItem) => {
    setActiveProject(project);
    setCurrentView('project-dashboard');
  };

  const closeProject = () => {
    setActiveProject(null);
    setCurrentView('dashboard');
  };

  // Load initial data
  useEffect(() => {
    const loadData = (key: string, setter: any) => {
      const saved = localStorage.getItem(key);
      if (saved) setter(JSON.parse(saved));
    };

    loadData('project-phases', setPhases);
    loadData('project-wbs-items', setWBSItems);
    loadData('project-subtasks', setSubTasks);
    loadData('project-tasks', setTasks);
    loadData('project-cost-items', setCostItems);
    loadData('project-lessons-learned', setLessonsLearned);
    loadData('project-closure-checklist', setClosureChecklist);
    loadData('project-data', setProjectData);
    loadData('project-team-members', setTeamMembers);
    loadData('project-wbs-dictionary', setWBSDictionary);
    loadData('project-requirements', setRequirements);
    loadData('project-scope-statement', setScopeStatement);
    loadData('project-scope-validations', setScopeValidations);
    loadData('project-charter', setProjectCharter);
    loadData('project-lifecycle', setProjectLifecycle);
    loadData('project-schedule-items', setScheduleItems);
  }, []);

  // Save data when changed
  useEffect(() => { localStorage.setItem('project-phases', JSON.stringify(phases)); }, [phases]);
  useEffect(() => { localStorage.setItem('project-wbs-items', JSON.stringify(wbsItems)); }, [wbsItems]);
  useEffect(() => { localStorage.setItem('project-subtasks', JSON.stringify(subTasks)); }, [subTasks]);
  useEffect(() => { localStorage.setItem('project-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('project-cost-items', JSON.stringify(costItems)); }, [costItems]);
  useEffect(() => { localStorage.setItem('project-lessons-learned', JSON.stringify(lessonsLearned)); }, [lessonsLearned]);
  useEffect(() => { localStorage.setItem('project-closure-checklist', JSON.stringify(closureChecklist)); }, [closureChecklist]);
  useEffect(() => { localStorage.setItem('project-data', JSON.stringify(projectData)); }, [projectData]);
  useEffect(() => { localStorage.setItem('project-team-members', JSON.stringify(teamMembers)); }, [teamMembers]);
  useEffect(() => { localStorage.setItem('project-wbs-dictionary', JSON.stringify(wbsDictionary)); }, [wbsDictionary]);
  useEffect(() => { localStorage.setItem('project-requirements', JSON.stringify(requirements)); }, [requirements]);
  useEffect(() => { localStorage.setItem('project-scope-statement', JSON.stringify(scopeStatement)); }, [scopeStatement]);
  useEffect(() => { localStorage.setItem('project-scope-validations', JSON.stringify(scopeValidations)); }, [scopeValidations]);
  useEffect(() => { localStorage.setItem('project-charter', JSON.stringify(projectCharter)); }, [projectCharter]);
  useEffect(() => { localStorage.setItem('project-lifecycle', JSON.stringify(projectLifecycle)); }, [projectLifecycle]);
  useEffect(() => { localStorage.setItem('project-schedule-items', JSON.stringify(scheduleItems)); }, [scheduleItems]);

  // Phase operations
  const addPhase = (phase: Omit<ProjectPhase, 'id' | 'createdAt'>) => {
    const newPhase: ProjectPhase = {
      ...phase,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPhases(prev => [...prev, newPhase]);
  };

  const updatePhase = (id: string, updates: Partial<ProjectPhase>) => {
    setPhases(prev => prev.map(phase => 
      phase.id === id ? { ...phase, ...updates } : phase
    ));
  };

  const deletePhase = (id: string) => {
    setPhases(prev => prev.filter(phase => phase.id !== id));
  };

  // WBS operations with automatic code generation
  const addWBSItem = (item: Omit<WBSItem, 'id' | 'createdAt'>) => {
    const code = item.code || WBSCodeGenerator.generateWBSCode(item.phaseId, phases, wbsItems);
    const newItem: WBSItem = {
      ...item,
      code,
      contractType: item.contractType || 'horas',
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWBSItems(prev => [...prev, newItem]);
  };

  const updateWBSItem = (id: string, updates: Partial<WBSItem>) => {
    setWBSItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteWBSItem = (id: string) => {
    setWBSItems(prev => prev.filter(item => item.id !== id));
  };

  // SubTask operations
  const addSubTask = (subTask: Omit<WBSSubTask, 'id' | 'createdAt'>) => {
    const newSubTask: WBSSubTask = {
      ...subTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSubTasks(prev => [...prev, newSubTask]);
  };

  const updateSubTask = (id: string, updates: Partial<WBSSubTask>) => {
    setSubTasks(prev => prev.map(subTask => 
      subTask.id === id ? { ...subTask, ...updates } : subTask
    ));
  };

  const deleteSubTask = (id: string) => {
    setSubTasks(prev => prev.filter(subTask => subTask.id !== id));
  };

  // Task operations
  const addTask = (task: Omit<ProjectTask, 'id' | 'createdAt'>) => {
    const newTask: ProjectTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<ProjectTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Cost operations
  const addCostItem = (cost: Omit<CostItem, 'id' | 'createdAt'>) => {
    const newCost: CostItem = {
      ...cost,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCostItems(prev => [...prev, newCost]);
  };

  const updateCostItem = (id: string, updates: Partial<CostItem>) => {
    setCostItems(prev => prev.map(cost => 
      cost.id === id ? { ...cost, ...updates } : cost
    ));
  };

  const deleteCostItem = (id: string) => {
    setCostItems(prev => prev.filter(cost => cost.id !== id));
  };

  // Lessons learned operations
  const addLessonLearned = (lesson: Omit<LessonLearned, 'id' | 'createdAt'>) => {
    const newLesson: LessonLearned = {
      ...lesson,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setLessonsLearned(prev => [...prev, newLesson]);
  };

  const updateLessonLearned = (id: string, updates: Partial<LessonLearned>) => {
    setLessonsLearned(prev => prev.map(lesson => 
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  const deleteLessonLearned = (id: string) => {
    setLessonsLearned(prev => prev.filter(lesson => lesson.id !== id));
  };

  // Closure checklist operations
  const updateClosureChecklist = (updates: Partial<ClosureChecklist>) => {
    if (closureChecklist.length === 0) {
      const newChecklist: ClosureChecklist = {
        id: Date.now().toString(),
        contractsFinalized: false,
        stakeholderMeeting: false,
        teamReleased: false,
        documentsApproved: false,
        feedbackMeeting: false,
        lessonsLearned: false,
        createdAt: new Date().toISOString(),
        ...updates
      };
      setClosureChecklist([newChecklist]);
    } else {
      setClosureChecklist(prev => prev.map(checklist => ({ ...checklist, ...updates })));
    }
  };

  // Team operations
  const addTeamMember = (member: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  // WBS Dictionary operations
  const addWBSDictionary = (dict: Omit<WBSDictionary, 'id' | 'createdAt'>) => {
    const newDict: WBSDictionary = {
      ...dict,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWBSDictionary(prev => [...prev, newDict]);
  };

  const updateWBSDictionary = (id: string, updates: Partial<WBSDictionary>) => {
    setWBSDictionary(prev => prev.map(dict => 
      dict.id === id ? { ...dict, ...updates } : dict
    ));
  };

  const deleteWBSDictionary = (id: string) => {
    setWBSDictionary(prev => prev.filter(dict => dict.id !== id));
  };

  // Requirements operations
  const addRequirement = (requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequirement: Requirement = {
      ...requirement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRequirements(prev => [...prev, newRequirement]);
  };

  const updateRequirement = (id: string, updates: Partial<Requirement>) => {
    setRequirements(prev => prev.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
  };

  const deleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
  };

  // Scope Statement operations
  const addScopeStatement = (statement: Omit<ScopeStatement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStatement: ScopeStatement = {
      ...statement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setScopeStatement([newStatement]);
  };

  const updateScopeStatement = (id: string, updates: Partial<ScopeStatement>) => {
    setScopeStatement(prev => prev.map(statement => 
      statement.id === id ? { ...statement, ...updates } : statement
    ));
  };

  // Scope Validation operations
  const addScopeValidation = (validation: Omit<ScopeValidation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newValidation: ScopeValidation = {
      ...validation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setScopeValidations(prev => [...prev, newValidation]);
  };

  const updateScopeValidation = (id: string, updates: Partial<ScopeValidation>) => {
    setScopeValidations(prev => prev.map(validation => 
      validation.id === id ? { ...validation, ...updates } : validation
    ));
  };

  const deleteScopeValidation = (id: string) => {
    setScopeValidations(prev => prev.filter(validation => validation.id !== id));
  };

  // Project Charter operations
  const addProjectCharter = (charter: Omit<ProjectCharter, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCharter: ProjectCharter = {
      ...charter,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjectCharter([newCharter]);
  };

  const updateProjectCharter = (id: string, updates: Partial<ProjectCharter>) => {
    setProjectCharter(prev => prev.map(charter => 
      charter.id === id ? { ...charter, ...updates } : charter
    ));
  };

  // Project Lifecycle operations
  const addProjectLifecycle = (lifecycle: Omit<ProjectLifecycle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLifecycle: ProjectLifecycle = {
      ...lifecycle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjectLifecycle([newLifecycle]);
  };

  const updateProjectLifecycle = (id: string, updates: Partial<ProjectLifecycle>) => {
    setProjectLifecycle(prev => prev.map(lifecycle => 
      lifecycle.id === id ? { ...lifecycle, ...updates } : lifecycle
    ));
  };

  // Schedule operations
  const addScheduleItem = (item: Omit<ScheduleItem, 'id' | 'createdAt'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setScheduleItems(prev => [...prev, newItem]);
  };

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setScheduleItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteScheduleItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
  };

  // Enhanced cost calculation for different contract types
  const calculateWBSCost = (item: WBSItem) => {
    switch (item.contractType) {
      case 'valor-fixo':
        return {
          estimated: item.contractValue || 0,
          actual: item.actualCost
        };
      case 'consultoria-projeto':
        return {
          estimated: item.contractValue || 0,
          actual: item.actualCost
        };
      default: // 'horas'
        return {
          estimated: item.estimatedHours * item.hourlyRate,
          actual: item.actualHours * item.hourlyRate
        };
    }
  };

  // Helper functions
  const getWBSItemsByPhase = (phaseId: string) => {
    return wbsItems.filter(item => item.phaseId === phaseId);
  };

  const getSubTasksByWBS = (wbsItemId: string) => {
    return subTasks.filter(subTask => subTask.wbsItemId === wbsItemId);
  };

  const getTasksByWBS = (wbsItemId: string) => {
    return tasks.filter(task => task.wbsItemId === wbsItemId);
  };

  const getWBSProgress = (wbsItemId: string) => {
    const itemSubTasks = subTasks.filter(subTask => subTask.wbsItemId === wbsItemId);
    if (itemSubTasks.length === 0) return 0;
    const completedCount = itemSubTasks.filter(st => st.completed).length;
    return Math.round((completedCount / itemSubTasks.length) * 100);
  };

  const getTotalProjectCost = () => {
    const wbsCosts = wbsItems.reduce((sum, item) => {
      const cost = calculateWBSCost(item);
      return {
        estimated: sum.estimated + cost.estimated,
        actual: sum.actual + cost.actual
      };
    }, { estimated: 0, actual: 0 });
    
    const costItemsCosts = costItems.reduce((sum, item) => ({
      estimated: sum.estimated + item.estimatedCost,
      actual: sum.actual + item.actualCost
    }), { estimated: 0, actual: 0 });
    
    return {
      estimated: wbsCosts.estimated + costItemsCosts.estimated,
      actual: wbsCosts.actual + costItemsCosts.actual
    };
  };

  const getProjectDuration = () => {
    if (projectData.length === 0) return 0;
    const project = projectData[0];
    const start = new Date(project.estimatedStartDate);
    const end = new Date(project.estimatedEndDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProjectDurationType = () => {
    const duration = (() => {
      if (projectData.length === 0) return 0;
      const project = projectData[0];
      const start = new Date(project.estimatedStartDate);
      const end = new Date(project.estimatedEndDate);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    })();
    if (duration <= 15) return 'curto';
    if (duration <= 50) return 'medio';
    if (duration <= 60) return 'longo';
    return 'requer-autorizacao';
  };

  return (
    <ProjectContext.Provider value={{
      // Estado central
      currentView,
      activeProject,
      projects,
      setCurrentView,
      openProject,
      closeProject,
      
      // Estados do projeto
      phases,
      wbsItems,
      subTasks,
      tasks,
      costItems,
      lessonsLearned,
      closureChecklist,
      projectData,
      teamMembers,
      wbsDictionary,
      requirements,
      scopeStatement,
      scopeValidations,
      projectCharter,
      projectLifecycle,
      scheduleItems,
      
      // Operações CRUD
      addPhase,
      updatePhase,
      deletePhase,
      addWBSItem,
      updateWBSItem,
      deleteWBSItem,
      addSubTask,
      updateSubTask,
      deleteSubTask,
      addTask,
      updateTask,
      deleteTask,
      addCostItem,
      updateCostItem,
      deleteCostItem,
      addLessonLearned,
      updateLessonLearned,
      deleteLessonLearned,
      updateClosureChecklist,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      addWBSDictionary,
      updateWBSDictionary,
      deleteWBSDictionary,
      addRequirement,
      updateRequirement,
      deleteRequirement,
      addScopeStatement,
      updateScopeStatement,
      addScopeValidation,
      updateScopeValidation,
      deleteScopeValidation,
      addProjectCharter,
      updateProjectCharter,
      addProjectLifecycle,
      updateProjectLifecycle,
      addScheduleItem,
      updateScheduleItem,
      deleteScheduleItem,
      
      // Funções auxiliares
      getWBSItemsByPhase,
      getSubTasksByWBS,
      getTasksByWBS,
      getWBSProgress,
      getTotalProjectCost,
      getProjectDuration,
      getProjectDurationType,
      calculateWBSCost
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
