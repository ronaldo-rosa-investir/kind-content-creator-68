import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Requirement } from '@/types/project';

const Requirements = () => {
  const { requirements, addRequirement, updateRequirement, deleteRequirement, phases, wbsItems } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState<Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>>({
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
    traceability: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRequirement) {
      updateRequirement(editingRequirement.id, { ...formData, updatedAt: new Date().toISOString() });
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
    setFormData({ ...requirement });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este requisito?')) {
      deleteRequirement(id);
      toast.success('Requisito deletado com sucesso!');
    }
  };

  const getStatusColor = (status: Requirement['status']) => {
    const colors = {
      'rascunho': 'bg-gray-100 text-gray-800',
      'aprovado': 'bg-green-100 text-green-800',
      'rejeitado': 'bg-red-100 text-red-800',
      'em-analise': 'bg-yellow-100 text-yellow-800',
      'implementado': 'bg-blue-100 text-blue-800',
      'testado': 'bg-purple-100 text-purple-800',
      'validado': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: Requirement['priority']) => {
    const colors = {
      'baixa': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-orange-100 text-orange-800',
      'critica': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredRequirements = requirements.filter(req => {
    if (activeTab === 'all') return true;
    return req.category === activeTab;
  });

  const getStats = () => {
    const total = requirements.length;
    const approved = requirements.filter(r => r.status === 'aprovado').length;
    const pending = requirements.filter(r => ['rascunho', 'em-analise'].includes(r.status)).length;
    const implemented = requirements.filter(r => ['implementado', 'testado', 'validado'].includes(r.status)).length;
    
    return { total, approved, pending, implemented };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registro de Requisitos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Requisito
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRequirement ? 'Editar Requisito' : 'Novo Requisito'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="REQ-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value: Requirement['category']) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funcional">Funcional</SelectItem>
                      <SelectItem value="nao-funcional">Não Funcional</SelectItem>
                      <SelectItem value="negocio">Negócio</SelectItem>
                      <SelectItem value="tecnico">Técnicos</SelectItem>
                      <SelectItem value="qualidade">Qualidade</SelectItem>
                      <SelectItem value="restricao">Restrição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value: Requirement['priority']) => setFormData({ ...formData, priority: value })}>
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
                  <Select value={formData.status} onValueChange={(value: Requirement['status']) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="em-analise">Em Análise</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      <SelectItem value="implementado">Implementado</SelectItem>
                      <SelectItem value="testado">Testado</SelectItem>
                      <SelectItem value="validado">Validado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Fonte</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Stakeholder, documento, reunião..."
                  />
                </div>
                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stakeholder">Stakeholder</Label>
                <Input
                  id="stakeholder"
                  value={formData.stakeholder}
                  onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="acceptanceCriteria">Critérios de Aceitação</Label>
                <Textarea
                  id="acceptanceCriteria"
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="businessRule">Regra de Negócio</Label>
                <Textarea
                  id="businessRule"
                  value={formData.businessRule}
                  onChange={(e) => setFormData({ ...formData, businessRule: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingRequirement ? 'Atualizar' : 'Criar'} Requisito
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Requisitos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implementados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.implemented}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros por categoria */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="funcional">Funcionais</TabsTrigger>
          <TabsTrigger value="nao-funcional">Não Funcionais</TabsTrigger>
          <TabsTrigger value="negocio">Negócio</TabsTrigger>
          <TabsTrigger value="tecnico">Técnicos</TabsTrigger>
          <TabsTrigger value="qualidade">Qualidade</TabsTrigger>
          <TabsTrigger value="restricao">Restrições</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum requisito encontrado</p>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'all' ? 'Comece criando o primeiro requisito' : `Não há requisitos na categoria ${activeTab}`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRequirements.map((requirement) => (
                <Card key={requirement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {requirement.code}
                          </span>
                          <h3 className="font-semibold">{requirement.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(requirement.status)}>
                            {requirement.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(requirement.priority)}>
                            {requirement.priority}
                          </Badge>
                          <Badge variant="outline">
                            {requirement.category.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(requirement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(requirement.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{requirement.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Fonte:</strong> {requirement.source}
                      </div>
                      <div>
                        <strong>Responsável:</strong> {requirement.responsible}
                      </div>
                      <div>
                        <strong>Stakeholder:</strong> {requirement.stakeholder}
                      </div>
                      <div>
                        <strong>Atualizado:</strong> {new Date(requirement.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    {requirement.acceptanceCriteria && (
                      <div className="mt-3">
                        <strong className="text-sm">Critérios de Aceitação:</strong>
                        <p className="text-sm text-muted-foreground mt-1">{requirement.acceptanceCriteria}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Requirements;
