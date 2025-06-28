
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { WBSHierarchyManager } from '@/utils/wbsHierarchyUtils';
import { WBS_ITEM_TYPES } from '@/types/wbs';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WBSItemHierarchy } from '@/types/wbs';

interface WBSItemDialogProps {
  trigger: React.ReactNode;
  wbsItem?: WBSItemHierarchy;
  parentItem?: WBSItemHierarchy | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const WBSItemDialog = ({ 
  trigger, 
  wbsItem, 
  parentItem, 
  isOpen = false, 
  onOpenChange 
}: WBSItemDialogProps) => {
  const { addWBSItem, updateWBSItem, wbsItems, projectCharter } = useProject();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({
    parentId: wbsItem?.parentId || parentItem?.id || 'root',
    activity: wbsItem?.activity || '',
    itemType: wbsItem?.itemType || 'componente',
    responsible: wbsItem?.responsible || '',
    estimatedCost: wbsItem?.estimatedCost || 0,
    description: wbsItem?.description || '',
    notes: wbsItem?.notes || ''
  });

  // Control dialog state
  const dialogOpen = onOpenChange ? isOpen : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  // Get project name
  const projectName = projectCharter.length > 0 ? projectCharter[0].projectName : 'Projeto';

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (dialogOpen) {
      setFormData({
        parentId: wbsItem?.parentId || parentItem?.id || 'root',
        activity: wbsItem?.activity || '',
        itemType: wbsItem?.itemType || 'componente',
        responsible: wbsItem?.responsible || '',
        estimatedCost: wbsItem?.estimatedCost || 0,
        description: wbsItem?.description || '',
        notes: wbsItem?.notes || ''
      });
    }
  }, [dialogOpen, wbsItem, parentItem]);

  const generateCode = () => {
    const actualParentId = formData.parentId === 'root' ? null : formData.parentId;
    return WBSHierarchyManager.generateNextCode(actualParentId, wbsItems);
  };

  const getAvailableParents = () => {
    const parents = [{ id: 'root', label: `Raiz - ${projectName}` }];
    
    wbsItems
      .filter(item => wbsItem ? item.id !== wbsItem.id : true)
      .filter(item => {
        // Prevent circular references
        if (wbsItem && WBSHierarchyManager.hasCircularReference(item.id, wbsItem.id, wbsItems)) {
          return false;
        }
        return true;
      })
      .forEach(item => {
        parents.push({
          id: item.id,
          label: `${item.code} - ${item.activity}`
        });
      });
    
    return parents;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.activity.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome/atividade é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.responsible.trim()) {
      toast({
        title: "Erro de validação",
        description: "O responsável é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(formData.estimatedCost) || formData.estimatedCost < 0) {
      toast({
        title: "Erro de validação",
        description: "O custo deve ser um número válido e positivo.",
        variant: "destructive"
      });
      return;
    }

    // Check circular reference
    const actualParentId = formData.parentId === 'root' ? null : formData.parentId;
    
    if (actualParentId && wbsItem && 
        WBSHierarchyManager.hasCircularReference(actualParentId, wbsItem.id, wbsItems)) {
      toast({
        title: "Erro de validação",
        description: "Não é possível criar uma referência circular.",
        variant: "destructive"
      });
      return;
    }

    const finalCode = wbsItem ? wbsItem.code : generateCode();
    
    const itemData = {
      code: finalCode,
      activity: formData.activity,
      itemType: formData.itemType as 'projeto' | 'entrega' | 'componente' | 'pacote-trabalho',
      parentId: actualParentId || undefined,
      responsible: formData.responsible,
      estimatedCost: formData.estimatedCost,
      description: formData.description,
      notes: formData.notes,
      phaseId: '',
      daysAfterStart: 0,
      estimatedHours: 0,
      actualHours: 0,
      hourlyRate: 0,
      actualCost: wbsItem?.actualCost || 0,
      contractType: 'horas' as const
    };

    if (wbsItem) {
      updateWBSItem(wbsItem.id, itemData);
      toast({
        title: "Item EAP atualizado",
        description: `${finalCode} - ${formData.activity} foi atualizado.`,
      });
    } else {
      addWBSItem(itemData);
      toast({
        title: "Item EAP criado",
        description: `${finalCode} - ${formData.activity} foi criado.`,
      });
    }
    
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {wbsItem ? 'Editar Item EAP' : 'Novo Item EAP'}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>ℹ️ A EAP organiza o trabalho em pacotes hierárquicos:</p>
                  <p>• Nível 1: Projeto completo</p>
                  <p>• Nível 2: Principais entregas</p>
                  <p>• Nível 3+: Componentes e pacotes de trabalho</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            {wbsItem ? 'Edite as informações do item EAP' : 'Crie um novo item na estrutura analítica do projeto'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Código EAP</Label>
            <Input
              value={wbsItem ? wbsItem.code : generateCode()}
              readOnly={true}
              disabled={true}
              className="bg-gray-100 font-mono"
            />
          </div>

          <div>
            <Label>Item Pai *</Label>
            <Select 
              value={formData.parentId} 
              onValueChange={(value) => setFormData({ ...formData, parentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o item pai" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableParents().map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nome/Atividade *</Label>
            <Input
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              placeholder="Ex: Desenvolvimento do Backend"
              required
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select 
              value={formData.itemType} 
              onValueChange={(value) => setFormData({ ...formData, itemType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WBS_ITEM_TYPES).map(([key, type]) => (
                  <SelectItem key={key} value={key}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Responsável *</Label>
            <Input
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              placeholder="Quem vai fazer?"
              required
            />
          </div>

          <div>
            <Label>Custo Estimado (R$)</Label>
            <Input
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição detalhada da atividade..."
              rows={3}
            />
          </div>

          <div>
            <Label>Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações, riscos, dependências..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {wbsItem ? 'Atualizar' : 'Criar'} Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
