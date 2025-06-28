
import { WBSItem } from '@/types/project';
import { WBSItemHierarchy, WBSStatistics } from '@/types/wbs';

export class WBSHierarchyManager {
  static buildHierarchy(flatItems: WBSItem[]): WBSItemHierarchy[] {
    const itemMap = new Map<string, WBSItemHierarchy>();
    const roots: WBSItemHierarchy[] = [];

    // Convert flat items to hierarchy items
    flatItems.forEach(item => {
      const hierarchyItem: WBSItemHierarchy = {
        ...item,
        itemType: item.itemType || 'componente',
        children: [],
        level: this.calculateLevel(item.code)
      };
      itemMap.set(item.id, hierarchyItem);
    });

    // Build parent-child relationships
    flatItems.forEach(item => {
      const hierarchyItem = itemMap.get(item.id)!;
      
      if (!item.parentId) {
        roots.push(hierarchyItem);
      } else {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(hierarchyItem);
        }
      }
    });

    // Sort by code
    const sortByCode = (items: WBSItemHierarchy[]) => {
      items.sort((a, b) => this.compareWBSCodes(a.code, b.code));
      items.forEach(item => {
        if (item.children) {
          sortByCode(item.children);
        }
      });
    };

    sortByCode(roots);
    return roots;
  }

  static generateNextCode(parentId: string | null, existingItems: WBSItem[]): string {
    if (!parentId) {
      // Root level: find next 1.0, 2.0, 3.0...
      const rootCodes = existingItems
        .filter(item => !item.parentId)
        .map(item => parseInt(item.code.split('.')[0]))
        .filter(num => !isNaN(num));
      
      const maxRoot = rootCodes.length > 0 ? Math.max(...rootCodes) : 0;
      return `${maxRoot + 1}.0`;
    }

    // Find parent code
    const parent = existingItems.find(item => item.id === parentId);
    if (!parent) return '1.0';

    // Find siblings
    const siblings = existingItems
      .filter(item => item.parentId === parentId)
      .map(item => item.code);

    // Generate next sibling code
    const parentCode = parent.code;
    const siblingNumbers = siblings
      .map(code => {
        const parts = code.split('.');
        return parseInt(parts[parts.length - 1]);
      })
      .filter(num => !isNaN(num));

    const maxSibling = siblingNumbers.length > 0 ? Math.max(...siblingNumbers) : 0;
    return `${parentCode}.${maxSibling + 1}`;
  }

  static calculateLevel(code: string): number {
    return code.split('.').length;
  }

  static compareWBSCodes(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0;
      const bVal = bParts[i] || 0;
      
      if (aVal !== bVal) {
        return aVal - bVal;
      }
    }
    
    return 0;
  }

  static canDelete(itemId: string, allItems: WBSItem[]): boolean {
    return !allItems.some(item => item.parentId === itemId);
  }

  static hasCircularReference(parentId: string, childId: string, allItems: WBSItem[]): boolean {
    const visited = new Set<string>();
    
    const checkPath = (currentId: string): boolean => {
      if (currentId === childId) return true;
      if (visited.has(currentId)) return false;
      
      visited.add(currentId);
      
      const parent = allItems.find(item => item.id === currentId);
      if (parent?.parentId) {
        return checkPath(parent.parentId);
      }
      
      return false;
    };
    
    return checkPath(parentId);
  }

  static calculateStatistics(items: WBSItem[]): WBSStatistics {
    const hierarchy = this.buildHierarchy(items);
    
    const stats: WBSStatistics = {
      totalItems: items.length,
      itemsByLevel: {} as { [level: number]: number },
      totalCost: items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0),
      uniqueResponsibles: [...new Set(items.map(item => item.responsible))],
      costByBranch: {} as { [itemId: string]: number }
    };

    // Count by level
    items.forEach(item => {
      const level = this.calculateLevel(item.code);
      stats.itemsByLevel[level] = (stats.itemsByLevel[level] || 0) + 1;
    });

    // Calculate cost by branch
    const calculateBranchCost = (item: WBSItemHierarchy): number => {
      let cost = item.estimatedCost || 0;
      if (item.children) {
        cost += item.children.reduce((sum, child) => sum + calculateBranchCost(child), 0);
      }
      stats.costByBranch[item.id] = cost;
      return cost;
    };

    hierarchy.forEach(root => calculateBranchCost(root));
    
    return stats;
  }
}
