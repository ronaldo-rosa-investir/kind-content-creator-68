
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Move } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WBSItemHierarchy } from '@/types/wbs';

interface WBSTreeProps {
  items: WBSItemHierarchy[];
  selectedItem?: WBSItemHierarchy | null;
  onSelectItem: (item: WBSItemHierarchy | null) => void;
  onEditItem: (item: WBSItemHierarchy) => void;
  onDeleteItem: (item: WBSItemHierarchy) => void;
  onAddChild: (parentItem: WBSItemHierarchy) => void;
  canDelete: (itemId: string) => boolean;
}

interface TreeNodeProps {
  item: WBSItemHierarchy;
  level: number;
  selectedItem?: WBSItemHierarchy | null;
  onSelectItem: (item: WBSItemHierarchy | null) => void;
  onEditItem: (item: WBSItemHierarchy) => void;
  onDeleteItem: (item: WBSItemHierarchy) => void;
  onAddChild: (parentItem: WBSItemHierarchy) => void;
  canDelete: (itemId: string) => boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  level,
  selectedItem,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  onAddChild,
  canDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedItem?.id === item.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelectItem(item);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit button clicked for item:', item.id);
    onEditItem(item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete button clicked for item:', item.id);
    onDeleteItem(item);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add child button clicked for item:', item.id);
    onAddChild(item);
  };

  const getItemTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'projeto': return '📁';
      case 'entrega': return '📦';
      case 'componente': return '📋';
      case 'pacote-trabalho': return '🔧';
      default: return '📄';
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
          isSelected && "bg-blue-50 border border-blue-200"
        )}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Icon */}
        <div className="flex items-center justify-center w-4 h-4">
          {hasChildren ? (
            <button 
              onClick={handleToggle} 
              className="hover:bg-gray-200 rounded p-0.5 flex items-center justify-center"
              type="button"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <div className="w-3 h-3" />
          )}
        </div>

        {/* Item Content */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm">{getItemTypeIcon(item.itemType)}</span>
          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
            {item.code}
          </span>
          <span className="font-medium truncate">{item.activity}</span>
          <span className="text-xs text-gray-500">
            R$ {item.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-blue-100"
            onClick={handleAddChild}
            title="Adicionar filho"
            type="button"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-green-100"
            onClick={handleEdit}
            title="Editar"
            type="button"
          >
            <Edit className="h-3 w-3" />
          </Button>
          {canDelete(item.id) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={handleDelete}
              title="Excluir"
              type="button"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-100"
            title="Mover (em breve)"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Move functionality not implemented yet');
            }}
          >
            <Move className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedItem={selectedItem}
              onSelectItem={onSelectItem}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onAddChild={onAddChild}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const WBSTree: React.FC<WBSTreeProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  onAddChild,
  canDelete
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-lg font-medium mb-2">Nenhum item EAP criado</p>
        <p className="text-sm">Use o botão "Novo Item EAP" para começar a estruturar seu projeto</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          onAddChild={onAddChild}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
};
