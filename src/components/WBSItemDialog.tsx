
import { useState, useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WBSItem } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

interface WBSItemDialogProps {
  trigger: React.ReactNode;
  wbsItem?: WBSItem;
  onSave?: () => void;
}

const WBSItemDialog = ({ trigger, wbsItem, onSave }: WBSItemDialogProps) => {
  const { phases, addWBSItem, updateWBSItem } = useProject();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    activity: "",
    phaseId: "",
    daysAfterStart: 0,
    responsible: "",
    notes: "",
    requirements: "",
    risks: "",
    estimatedHours: 0,
    actualHours: 0,
    hourlyRate: 0,
    estimatedCost: 0,
    actualCost: 0,
    contractType: 'horas' as const,
    contractValue: 0,
    contractDuration: 0,
  });

  useEffect(() => {
    if (wbsItem) {
      setFormData({
        code: wbsItem.code,
        activity: wbsItem.activity,
        phaseId: wbsItem.phaseId,
        daysAfterStart: wbsItem.daysAfterStart,
        responsible: wbsItem.responsible,
        notes: wbsItem.notes || "",
        requirements: wbsItem.requirements || "",
        risks: wbsItem.risks || "",
        estimatedHours: wbsItem.estimatedHours,
        actualHours: wbsItem.actualHours,
        hourlyRate: wbsItem.hourlyRate,
        estimatedCost: wbsItem.estimatedCost,
        actualCost: wbsItem.actualCost,
        contractType: wbsItem.contractType,
        contractValue: wbsItem.contractValue || 0,
        contractDuration: wbsItem.contractDuration || 0,
      });
    } else {
      setFormData({
        code: "",
        activity: "",
        phaseId: "",
        daysAfterStart: 0,
        responsible: "",
        notes: "",
        requirements: "",
        risks: "",
        estimatedHours: 0,
        actualHours: 0,
        hourlyRate: 0,
        estimatedCost: 0,
        actualCost: 0,
        contractType: 'horas' as const,
        contractValue: 0,
        contractDuration: 0,
      });
    }
  }, [wbsItem, open]);

  useEffect(() => {
    const estimated = formData.estimatedHours * formData.hourlyRate;
    const actual = formData.actualHours * formData.hourlyRate;
    setFormData(prev => ({
      ...prev,
      estimatedCost: estimated,
      actualCost: actual,
    }));
  }, [formData.estimatedHours, formData.actualHours, formData.hourlyRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (wbsItem) {
      updateWBSItem(wbsItem.id, formData);
      toast({
        title: "Item EAP atualizado",
        description: "O item foi atualizado com sucesso.",
      });
    } else {
      addWBSItem(formData);
      toast({
        title: "Item EAP criado",
        description: "O novo item foi adicionado com sucesso.",
      });
    }
    
    setOpen(false);
    onSave?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {wbsItem ? "Editar Item EAP" : "Novo Item EAP"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código EAP *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: 1.1.1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phaseId">Fase do Projeto *</Label>
              <Select
                value={formData.phaseId}
                onValueChange={(value) => setFormData({ ...formData, phaseId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="activity">Atividade *</Label>
            <Input
              id="activity"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              placeholder="Descreva a atividade"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Nome do responsável"
                required
              />
            </div>
            <div>
              <Label htmlFor="daysAfterStart">Dias Após Início</Label>
              <Input
                id="daysAfterStart"
                type="number"
                value={formData.daysAfterStart}
                onChange={(e) => setFormData({ ...formData, daysAfterStart: Number(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contractType">Tipo de Contrato</Label>
            <Select
              value={formData.contractType}
              onValueChange={(value: 'horas' | 'valor-fixo' | 'consultoria-projeto') => 
                setFormData({ ...formData, contractType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horas">Por Horas</SelectItem>
                <SelectItem value="valor-fixo">Valor Fixo</SelectItem>
                <SelectItem value="consultoria-projeto">Consultoria/Projeto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.contractType !== 'horas' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractValue">Valor do Contrato (R$)</Label>
                <Input
                  id="contractValue"
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              {formData.contractType === 'consultoria-projeto' && (
                <div>
                  <Label htmlFor="contractDuration">Duração (meses)</Label>
                  <Input
                    id="contractDuration"
                    type="number"
                    value={formData.contractDuration}
                    onChange={(e) => setFormData({ ...formData, contractDuration: Number(e.target.value) })}
                    min="0"
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <Label htmlFor="actualHours">Horas Reais</Label>
              <Input
                id="actualHours"
                type="number"
                value={formData.actualHours}
                onChange={(e) => setFormData({ ...formData, actualHours: Number(e.target.value) })}
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Valor/Hora (R$)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Custo Estimado (R$)</Label>
              <Input
                value={formData.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Custo Real (R$)</Label>
              <Input
                value={formData.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione notas sobre este item..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requisitos</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Descreva os requisitos..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="risks">Riscos</Label>
            <Textarea
              id="risks"
              value={formData.risks}
              onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
              placeholder="Identifique os riscos..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {wbsItem ? "Atualizar" : "Criar"} Item EAP
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WBSItemDialog;
