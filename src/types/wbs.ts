
export interface WBSItemHierarchy {
  id: string;
  code: string;
  activity: string;
  itemType: 'projeto' | 'entrega' | 'componente' | 'pacote-trabalho';
  parentId?: string;
  responsible: string;
  estimatedCost: number;
  actualCost: number;
  description?: string;
  notes?: string;
  children?: WBSItemHierarchy[];
  level: number;
  createdAt: string;
}

export interface WBSStatistics {
  totalItems: number;
  itemsByLevel: { [level: number]: number };
  totalCost: number;
  uniqueResponsibles: string[];
  costByBranch: { [itemId: string]: number };
}

export const WBS_ITEM_TYPES = {
  projeto: { label: 'Projeto', icon: '📁', level: 1 },
  entrega: { label: 'Entrega', icon: '📦', level: 2 },
  componente: { label: 'Componente', icon: '📋', level: 3 },
  'pacote-trabalho': { label: 'Pacote de Trabalho', icon: '🔧', level: 4 }
} as const;
