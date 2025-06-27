
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
  WBSDictionary 
} from '@/types/project';

interface ProjectContextType {
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
  
  // Helper functions
  getWBSItemsByPhase: (phaseId: string) => WBSItem[];
  getSubTasksByWBS: (wbsItemId: string) => WBSSubTask[];
  getTasksByWBS: (wbsItemId: string) => ProjectTask[];
  getWBSProgress: (wbsItemId: string) => number;
  getTotalProjectCost: () => { estimated: number; actual: number };
  getProjectDuration: () => number;
  getProjectDurationType: () => string;
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

  // WBS operations
  const addWBSItem = (item: Omit<WBSItem, 'id' | 'createdAt'>) => {
    const newItem: WBSItem = {
      ...item,
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
    const itemSubTasks = getSubTasksByWBS(wbsItemId);
    if (itemSubTasks.length === 0) return 0;
    const completedCount = itemSubTasks.filter(st => st.completed).length;
    return Math.round((completedCount / itemSubTasks.length) * 100);
  };

  const getTotalProjectCost = () => {
    const estimated = costItems.reduce((sum, item) => sum + item.estimatedCost, 0) + 
                    wbsItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    const actual = costItems.reduce((sum, item) => sum + item.actualCost, 0) + 
                  wbsItems.reduce((sum, item) => sum + item.actualCost, 0);
    return { estimated, actual };
  };

  const getProjectDuration = () => {
    if (projectData.length === 0) return 0;
    const project = projectData[0];
    const start = new Date(project.estimatedStartDate);
    const end = new Date(project.estimatedEndDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProjectDurationType = () => {
    const duration = getProjectDuration();
    if (duration <= 15) return 'curto';
    if (duration <= 50) return 'medio';
    if (duration <= 60) return 'longo';
    return 'requer-autorizacao';
  };

  return (
    <ProjectContext.Provider value={{
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
      getWBSItemsByPhase,
      getSubTasksByWBS,
      getTasksByWBS,
      getWBSProgress,
      getTotalProjectCost,
      getProjectDuration,
      getProjectDurationType
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
