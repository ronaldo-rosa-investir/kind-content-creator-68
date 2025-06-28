
import { WBSItemHierarchy, WBS_ITEM_TYPES } from '@/types/wbs';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { WBSItemDialog } from './WBSItemDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WBSHierarchyTreeProps {
  items: WBSItemHierarchy[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  canDelete: (id: string) => boolean;
  level?: number;
}

export const WBSHierarchyTree = ({ 
  items, 
  onEdit, 
  onDelete, 
  canDelete, 
  level = 1 
}: WBSHierarchyTreeProps) => {
  const getIndentation = (level: number) => {
    return level === 1 ? '' : '│  '.repeat(level - 2) + '├─';
  };

  const getItemTypeInfo = (itemType: string, level: number) => {
    if (level === 1) return WBS_ITEM_TYPES.projeto;
    if (level === 2) return WBS_ITEM_TYPES.entrega;
    if (level >= 3) return WBS_ITEM_TYPES.componente;
    return WBS_ITEM_TYPES['pacote-trabalho'];
  };

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const typeInfo = getItemTypeInfo(item.itemType, item.level);
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.id}>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-gray-400 font-mono text-sm">
                  {getIndentation(item.level)}
                </span>
                <span className="text-lg">{typeInfo.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {item.code}
                    </span>
                    <span className="font-semibold">{item.activity}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>👤 {item.responsible}</span>
                    <span>💰 R$ {(item.estimatedCost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <WBSItemDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  }
                  wbsItem={item}
                />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-800"
                      disabled={!canDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Item EAP</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o item "{item.code} - {item.activity}"? 
                        {!canDelete(item.id) && " Este item possui filhos e não pode ser excluído."}
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={!canDelete(item.id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            {item.children && item.children.length > 0 && (
              <div className="ml-6">
                <WBSHierarchyTree
                  items={item.children}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  canDelete={canDelete}
                  level={item.level + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
