
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface EnhancedWBSDialogProps {
  trigger: React.ReactNode;
  wbsItem?: any;
}

const EnhancedWBSDialog = ({ trigger, wbsItem }: EnhancedWBSDialogProps) => {
  const { addWBSItem, updateWBSItem, wbsItems } = useProject();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: wbsItem?.code || '',
    activity: wbsItem?.activity || '',
    responsible: wbsItem?.responsible || '',
    estimatedCost: wbsItem?.estimatedCost || 0,
    description: wbsItem?.description || ''
  });

  const generateCode = () => {
    const maxNumber = wbsItems
      .map(item => {
        const parts = item.code.split('.');
        return parts.length === 2 ? parseInt(parts[0]) : 0;
      })
      .reduce((max, num) => Math.max(max, num || 0), 0);
    
    return `${maxNumber + 1}.0`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
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
        description: "O custo deve ser um número válido.",
        variant: "destructive"
      });
      return;
    }

    const finalCode = wbsItem ? formData.code : generateCode();
    
    // Verificar código duplicado apenas para novos itens
    if (!wbsItem && wbsItems.some(item => item.code === finalCode)) {
      toast({
        title: "Erro de validação",
        description: "Código já existe.",
        variant: "destructive"
      });
      return;
    }
    
    const itemData = {
      code: finalCode,
      activity: formData.activity,
      responsible: formData.responsible,
      estimatedCost: formData.estimatedCost,
      description: formData.description,
      itemType: 'projeto' as const,
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
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {wbsItem ? 'Editar Item EAP' : 'Novo Item EAP'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Código EAP</Label>
            <Input
              value={wbsItem ? formData.code : generateCode()}
              readOnly={true}
              disabled={true}
              className="bg-gray-100"
            />
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
            <Label>Notas</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Observações, detalhes adicionais..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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

export default EnhancedWBSDialog;
