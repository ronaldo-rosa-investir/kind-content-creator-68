
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { Requirement } from '@/types/project';

const Requirements = () => {
  const { 
    requirements, 
    phases, 
    wbsItems, 
    addRequirement, 
    updateRequirement, 
    deleteRequirement 
  } = useProject();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    category: 'funcional' as Requirement['category'],
    priority: 'media' as Requirement['priority'],
    status: 'rascunho' as Requirement['status'],
    source: '',
    responsible: '',
    stakeholder: '',
    acceptanceCriteria: '',
    businessRule: '',
    phaseId: '',
    wbsItemId: '',
    traceability: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRequirement) {
      updateRequirement(editingRequirement.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      toast.success('Requisito atualizado com sucesso!');
    } else {
      addRequirement(formData);
      toast.success('Requisito criado com sucesso!');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      category: 'funcional',
      priority: 'media',
      status: 'rascunho',
      source: '',
      responsible: '',
      stakeholder: '',
      acceptanceCriteria: '',
      businessRule: '',
      phaseId: '',
      wbsItemId: '',
      traceability: []
    });
    setEditingRequirement(null);
  };

  const handleEdit = (requirement: Requirement) => {
    setEditingRequirement(requirement);
    setFormData({
      code: requirement.code,
      title: requirement.title,
      description: requirement.description,
      category: requirement.category,
      priority: requirement.priority,
      status: requirement.status,
      source: requirement.source,
      responsible: requirement.responsible,
      stakeholder: requirement.stakeholder,
      acceptanceCriteria: requirement.acceptanceCriteria,
      businessRule: requirement.businessRule || '',
      phaseId: requirement.phaseId || '',
      wbsItemId: requirement.wbsItemId || '',
      traceability: requirement.traceability
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este requisito?')) {
      deleteRequirement(id);
      toast.success('Requisito deletado com sucesso!');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'funcional': 'bg-blue-100 text-blue-800',
      'nao-funcional': 'bg-green-100 text-green-800',
      'negocio': 'bg-purple-100 text-purple-800',
      'tecnico': 'bg-orange-100 text-orange-800',
      'qualidade': 'bg-yellow-100 text-yellow-800',
      'restricao': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'baixa': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-orange-100 text-orange-800',
      'critica': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'rascunho': 'bg-gray-100 text-gray-800',
      'aprovado': 'bg-green-100 text-green-800',
      'rejeitado': 'bg-red-100 text-red-800',
      'em-analise': 'bg-blue-100 text-blue-800',
      'implementado': 'bg-purple-100 text-purple-800',
      'testado': 'bg-orange-100 text-orange-800',
      'validado': 'bg-teal-100 text-teal-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPhaseById = (phaseId: string) => {
    return phases.find(phase => phase.id === phaseId);
  };

  const getWBSItemById = (wbsItemId: string) => {
    return wbsItems.find(item => item.id === wbsItemId);
  };

  const availableWBSItems = wbsItems.filter(item => 
    formData.phaseId ? item.phaseId === formData.phaseId : true
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Registro de Requisitos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Adicionar Requisito</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRequirement ? 'Editar Requisito' : 'Adicionar Novo Requisito'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="REQ-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Requirement['category']) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funcional">Funcional</SelectItem>
                      <SelectItem value="nao-funcional">Não Funcional</SelectItem>
                      <SelectItem value="negocio">Negócio</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="qualidade">Qualidade</SelectItem>
                      <SelectItem value="restricao">Restrição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Requirement['priority']) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Requirement['status']) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      <SelectItem value="em-analise">Em Análise</SelectItem>
                      <SelectItem value="implementado">Implementado</SelectItem>
                      <SelectItem value="testado">Testado</SelectItem>
                      <SelectItem value="validado">Validado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="source">Fonte</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stakeholder">Stakeholder</Label>
                  <Input
                    id="stakeholder"
                    value={formData.stakeholder}
                    onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="acceptanceCriteria">Critérios de Aceitação</Label>
                <Textarea
                  id="acceptanceCriteria"
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessRule">Regra de Negócio</Label>
                <Textarea
                  id="businessRule"
                  value={formData.businessRule}
                  onChange={(e) => setFormData({ ...formData, businessRule: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phaseId">Fase Relacionada</Label>
                  <Select
                    value={formData.phaseId}
                    onValueChange={(value) => setFormData({ ...formData, phaseId: value, wbsItemId: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma fase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {phases.map((phase) => (
                        <SelectItem key={phase.id} value={phase.id}>
                          {phase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wbsItemId">Item EAP Relacionado</Label>
                  <Select
                    value={formData.wbsItemId}
                    onValueChange={(value) => setFormData({ ...formData, wbsItemId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um item EAP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {availableWBSItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.code} - {item.activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingRequirement ? 'Atualizar Requisito' : 'Salvar Requisito'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requirements.map((requirement) => {
          const phase = getPhaseById(requirement.phaseId || '');
          const wbsItem = getWBSItemById(requirement.wbsItemId || '');

          return (
            <Card key={requirement.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {requirement.code}
                      </span>
                      <Badge className={getCategoryColor(requirement.category)}>
                        {requirement.category}
                      </Badge>
                      <Badge className={getPriorityColor(requirement.priority)}>
                        {requirement.priority}
                      </Badge>
                      <Badge className={getStatusColor(requirement.status)}>
                        {requirement.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold">{requirement.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(requirement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(requirement.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p><strong>Descrição:</strong> {requirement.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>Fonte:</strong> {requirement.source}</p>
                    <p><strong>Stakeholder:</strong> {requirement.stakeholder}</p>
                    <p><strong>Responsável:</strong> {requirement.responsible}</p>
                  </div>

                  <p><strong>Critérios de Aceitação:</strong> {requirement.acceptanceCriteria}</p>
                  
                  {requirement.businessRule && (
                    <p><strong>Regra de Negócio:</strong> {requirement.businessRule}</p>
                  )}

                  {(phase || wbsItem) && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Relacionado a:</span>
                      {phase && (
                        <Badge variant="outline">Fase: {phase.name}</Badge>
                      )}
                      {wbsItem && (
                        <Badge variant="outline">EAP: {wbsItem.code} - {wbsItem.activity}</Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {requirements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum requisito cadastrado ainda</p>
          <p className="text-sm text-muted-foreground">
            Comece criando requisitos para estruturar adequadamente o escopo do projeto
          </p>
        </div>
      )}
    </div>
  );
};

export default Requirements;
