
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectPhase } from '@/types/project';

const Phases = () => {
  const { phases, addPhase, updatePhase, deletePhase } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<ProjectPhase | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 'nao-iniciado' as ProjectPhase['status'],
    responsible: '',
    startDate: '',
    endDate: '',
    description: '',
    estimatedCost: 0,
    actualCost: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPhase) {
      updatePhase(editingPhase.id, formData);
      toast.success('Fase atualizada com sucesso!');
    } else {
      addPhase({
        name: formData.name,
        status: formData.status,
        responsible: formData.responsible,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        estimatedCost: formData.estimatedCost,
        actualCost: formData.actualCost
      });
      toast.success('Fase criada com sucesso!');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'nao-iniciado' as ProjectPhase['status'],
      responsible: '',
      startDate: '',
      endDate: '',
      description: '',
      estimatedCost: 0,
      actualCost: 0
    });
    setEditingPhase(null);
  };

  const handleEdit = (phase: ProjectPhase) => {
    setEditingPhase(phase);
    setFormData({
      name: phase.name,
      status: phase.status,
      responsible: phase.responsible,
      startDate: phase.startDate,
      endDate: phase.endDate,
      description: phase.description || '',
      estimatedCost: phase.estimatedCost,
      actualCost: phase.actualCost
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta fase?')) {
      deletePhase(id);
      toast.success('Fase deletada com sucesso!');
    }
  };

  const getTotalEstimatedCost = () => {
    return phases.reduce((total, phase) => total + phase.estimatedCost, 0);
  };

  const getTotalActualCost = () => {
    return phases.reduce((total, phase) => total + phase.actualCost, 0);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fases do Projeto</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Custo Total Estimado: <span className="font-semibold">R$ {getTotalEstimatedCost().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
            <p>Custo Total Realizado: <span className="font-semibold">R$ {getTotalActualCost().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Adicionar Fase</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPhase ? 'Editar Fase' : 'Adicionar Nova Fase'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input type="text" id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select value={formData.status} onValueChange={(value: ProjectPhase['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao-iniciado">Não Iniciado</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="em-revisao">Em Revisão</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="concluido-com-ressalvas">Concluído com Ressalvas</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="cancelado-com-ressalvas">Cancelado com Ressalvas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible" className="text-right">Responsável</Label>
                <Input type="text" id="responsible" value={formData.responsible} onChange={e => setFormData({ ...formData, responsible: e.target.value })} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Data de Início</Label>
                <Input type="date" id="startDate" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">Data de Término</Label>
                <Input type="date" id="endDate" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-1">Descrição</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedCost" className="text-right">Custo Estimado</Label>
                <Input
                  type="number"
                  id="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="actualCost" className="text-right">Custo Real</Label>
                <Input
                  type="number"
                  id="actualCost"
                  value={formData.actualCost}
                  onChange={(e) => setFormData({ ...formData, actualCost: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button type="submit">{editingPhase ? 'Atualizar Fase' : 'Salvar Fase'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phases.map(phase => (
          <Card key={phase.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {phase.name}
                <div>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(phase)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(phase.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Status:</strong> {phase.status.replace('-', ' ')}</p>
              <p><strong>Responsável:</strong> {phase.responsible}</p>
              <p><strong>Início:</strong> {new Date(phase.startDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Término:</strong> {new Date(phase.endDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Custo Estimado:</strong> R$ {phase.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Custo Real:</strong> R$ {phase.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              {phase.description && <p><strong>Descrição:</strong> {phase.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Phases;
