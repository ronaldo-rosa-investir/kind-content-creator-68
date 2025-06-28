
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, FolderOpen, Package, FileText, Wrench } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import WBSItemTooltip from "./WBSItemTooltip";

interface EnhancedWBSDialogProps {
  trigger: React.ReactNode;
  wbsItem?: any;
}

const EnhancedWBSDialog = ({ trigger, wbsItem }: EnhancedWBSDialogProps) => {
  const { phases, addWBSItem, updateWBSItem, wbsItems } = useProject();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: wbsItem?.code || '',
    itemType: wbsItem?.itemType || 'pacote-trabalho',
    activity: wbsItem?.activity || '',
    parentId: wbsItem?.parentId || '',
    responsible: wbsItem?.responsible || '',
    estimatedHours: wbsItem?.estimatedHours || 0,
    hourlyRate: wbsItem?.hourlyRate || 0,
    description: wbsItem?.description || '',
    deliverables: wbsItem?.deliverables || '',
    acceptanceCriteria: wbsItem?.acceptanceCriteria || '',
    requirements: wbsItem?.requirements || '',
    risks: wbsItem?.risks || '',
    phaseId: wbsItem?.phaseId || (phases[0]?.id || '')
  });

  const getItemTypeInfo = (type: string) => {
    switch (type) {
      case 'projeto':
        return { icon: '📁', label: 'Projeto', description: 'O projeto completo' };
      case 'entrega':
        return { icon: '📦', label: 'Entrega', description: 'Parte principal do projeto' };
      case 'componente':
        return { icon: '📋', label: 'Componente', description: 'Grupo de tarefas relacionadas' };
      default:
        return { icon: '🔧', label: 'Pacote de Trabalho', description: 'Tarefa específica que alguém faz' };
    }
  };

  const generateCode = () => {
    if (!formData.phaseId) return '1.1';
    
    const phaseIndex = phases.findIndex(p => p.id === formData.phaseId);
    const existingCodes = wbsItems
      .filter(item => item.phaseId === formData.phaseId)
      .map(item => item.code);
    
    const phasePrefix = `${phaseIndex + 1}`;
    const maxNumber = existingCodes
      .filter(code => code.startsWith(phasePrefix + '.'))
      .map(code => parseInt(code.split('.')[1]))
      .reduce((max, num) => Math.max(max, num || 0), 0);
    
    return `${phasePrefix}.${maxNumber + 1}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCode = formData.code || generateCode();
    const estimatedCost = formData.estimatedHours * formData.hourlyRate;
    
    const itemData = {
      ...formData,
      code: finalCode,
      contractType: 'horas' as const,
      contractValue: 0,
      daysAfterStart: 0,
      actualHours: wbsItem?.actualHours || 0,
      estimatedCost: estimatedCost,
      actualCost: wbsItem?.actualCost || 0
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

  const isWorkPackage = formData.itemType === 'pacote-trabalho';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {wbsItem ? 'Editar Item EAP' : 'Novo Item EAP'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                Código EAP
                <WBSItemTooltip content="Numeração automática baseada na hierarquia">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </WBSItemTooltip>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder={generateCode()}
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2">
                Fase
                <WBSItemTooltip content="Em qual fase do projeto este item se encaixa">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </WBSItemTooltip>
              </Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.phaseId}
                onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })}
              >
                {phases.map(phase => (
                  <option key={phase.id} value={phase.id}>{phase.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-3">
              Tipo de Item
              <WBSItemTooltip content="Escolha o tipo baseado no nível hierárquico">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </WBSItemTooltip>
            </Label>
            <RadioGroup
              value={formData.itemType}
              onValueChange={(value) => setFormData({ ...formData, itemType: value })}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: 'projeto', ...getItemTypeInfo('projeto') },
                { value: 'entrega', ...getItemTypeInfo('entrega') },
                { value: 'componente', ...getItemTypeInfo('componente') },
                { value: 'pacote-trabalho', ...getItemTypeInfo('pacote-trabalho') }
              ].map(type => (
                <div key={type.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                Nome
                <WBSItemTooltip content="Nome claro e descritivo do item">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </WBSItemTooltip>
              </Label>
              <Input
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="O que é este item?"
                required
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2">
                Responsável
                <WBSItemTooltip content="Pessoa responsável por executar ou coordenar">
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </WBSItemTooltip>
              </Label>
              <Input
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Quem vai fazer?"
                required
              />
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              Estimativas
              <WBSItemTooltip content="Previsão de tempo e custo necessários">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </WBSItemTooltip>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Horas</Label>
                <Input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-sm">Custo por Hora (R$)</Label>
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {isWorkPackage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Detalhes do Pacote de Trabalho
                  <Badge variant="secondary" className="text-xs">
                    Complete apenas para tarefas específicas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    Descrição Detalhada
                    <WBSItemTooltip content="O que fazer exatamente? Passos detalhados">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </WBSItemTooltip>
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva em detalhes o que deve ser feito..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    Entregas
                    <WBSItemTooltip content="O que será entregue quando concluído?">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </WBSItemTooltip>
                  </Label>
                  <Textarea
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                    placeholder="• Código funcionando&#10;• Documentação&#10;• Testes realizados"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    Critérios de Aceitação
                    <WBSItemTooltip content="Como saber que está pronto e aprovado?">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </WBSItemTooltip>
                  </Label>
                  <Textarea
                    value={formData.acceptanceCriteria}
                    onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                    placeholder="• Performance < 2 segundos&#10;• Aprovado pelos usuários&#10;• Sem bugs críticos"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      Requisitos
                      <WBSItemTooltip content="O que é necessário para executar?">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </WBSItemTooltip>
                    </Label>
                    <Textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Tecnologias, permissões, recursos..."
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2">
                      Riscos
                      <WBSItemTooltip content="O que pode dar errado ou atrasar?">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </WBSItemTooltip>
                    </Label>
                    <Textarea
                      value={formData.risks}
                      onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                      placeholder="Dependências, complexidade técnica..."
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
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
