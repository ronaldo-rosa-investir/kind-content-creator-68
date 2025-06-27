
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectPhase, WBSItem, WBSSubTask, ProjectTask } from '@/types/project';

interface ProjectContextType {
  phases: ProjectPhase[];
  wbsItems: WBSItem[];
  subTasks: WBSSubTask[];
  tasks: ProjectTask[];
  addPhase: (phase: Omit<ProjectPhase, 'id' | 'createdAt'>) => void;
  updatePhase: (id: string, updates: Partial<ProjectPhase>) => void;
  addWBSItem: (item: Omit<WBSItem, 'id' | 'createdAt'>) => void;
  updateWBSItem: (id: string, updates: Partial<WBSItem>) => void;
  addSubTask: (subTask: Omit<WBSSubTask, 'id' | 'createdAt'>) => void;
  updateSubTask: (id: string, updates: Partial<WBSSubTask>) => void;
  addTask: (task: Omit<ProjectTask, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<ProjectTask>) => void;
  getWBSItemsByPhase: (phaseId: string) => WBSItem[];
  getSubTasksByWBS: (wbsItemId: string) => WBSSubTask[];
  getTasksByWBS: (wbsItemId: string) => ProjectTask[];
  getWBSProgress: (wbsItemId: string) => number;
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

  // Carregar dados iniciais
  useEffect(() => {
    const savedPhases = localStorage.getItem('project-phases');
    const savedWBSItems = localStorage.getItem('project-wbs-items');
    const savedSubTasks = localStorage.getItem('project-subtasks');
    const savedTasks = localStorage.getItem('project-tasks');

    if (savedPhases) setPhases(JSON.parse(savedPhases));
    if (savedWBSItems) setWBSItems(JSON.parse(savedWBSItems));
    if (savedSubTasks) setSubTasks(JSON.parse(savedSubTasks));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // Salvar dados quando mudarem
  useEffect(() => {
    localStorage.setItem('project-phases', JSON.stringify(phases));
  }, [phases]);

  useEffect(() => {
    localStorage.setItem('project-wbs-items', JSON.stringify(wbsItems));
  }, [wbsItems]);

  useEffect(() => {
    localStorage.setItem('project-subtasks', JSON.stringify(subTasks));
  }, [subTasks]);

  useEffect(() => {
    localStorage.setItem('project-tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  return (
    <ProjectContext.Provider value={{
      phases,
      wbsItems,
      subTasks,
      tasks,
      addPhase,
      updatePhase,
      addWBSItem,
      updateWBSItem,
      addSubTask,
      updateSubTask,
      addTask,
      updateTask,
      getWBSItemsByPhase,
      getSubTasksByWBS,
      getTasksByWBS,
      getWBSProgress
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
