
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
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ScopeValidation = () => {
  const { scopeValidations, addScopeValidation, updateScopeValidation, deleteScopeValidation } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValidation, setEditingValidation] = useState(null);
  const [formData, setFormData] = useState({
    deliverableId: '',
    deliverableName: '',
    description: '',
    acceptanceCriteria: '',
    validationMethod: 'inspecao',
    responsible: '',
    stakeholder: '',
    plannedDate: '',
    actualDate: '',
    status: 'planejado',
    comments: '',
    attachments: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingValidation) {
      updateScopeValidation(editingValidation.id, { ...formData, updatedAt: new Date().toISOString() });
      toast.success('Validação atualizada com sucesso!');
    } else {
      addScopeValidation(formData);
      toast.success('Validação criada com sucesso!');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      deliverableId: '',
      deliverableName: '',
      description: '',
      acceptanceCriteria: '',
      validationMethod: 'inspecao',
      responsible: '',
      stakeholder: '',
      plannedDate: '',
      actualDate: '',
      status: 'planejado',
      comments: '',
      attachments: []
    });
    setEditingValidation(null);
  };

  const handleEdit = (validation) => {
    setEditingValidation(validation);
    setFormData({ ...validation });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja deletar esta validação?')) {
      deleteScopeValidation(id);
      toast.success('Validação deletada com sucesso!');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'planejado': 'bg-gray-100 text-gray-800',
      'em-andamento': 'bg-blue-100 text-blue-800',
      'aprovado': 'bg-green-100 text-green-800',
      'rejeitado': 'bg-red-100 text-red-800',
      'pendente': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'planejado': <Clock className="h-4 w-4" />,
      'em-andamento': <AlertCircle className="h-4 w-4" />,
      'aprovado': <CheckCircle className="h-4 w-4" />,
      'rejeitado': <XCircle className="h-4 w-4" />,
      'pendente': <Clock className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getStats = () => {
    const total = scopeValidations.length;
    const approved = scopeValidations.filter(v => v.status === 'aprovado').length;
    const rejected = scopeValidations.filter(v => v.status === 'rejeitado').length;
    const pending = scopeValidations.filter(v => ['planejado', 'em-andamento', 'pendente'].includes(v.status)).length;
    
    return { total, approved, rejected, pending };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Validação do Escopo</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Validação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingValidation ? 'Editar Validação' : 'Nova Validação de Escopo'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliverableId">ID da Entrega</Label>
                  <Input
                    id="deliverableId"
                    value={formData.deliverableId}
                    onChange={(e) => setFormData({ ...formData, deliverableId: e.target.value })}
                    placeholder="DELIV-001"
                  />
                </div>
                <div>
                  <Label htmlFor="deliverableName">Nome da Entrega *</Label>
                  <Input
                    id="deliverableName"
                    value={formData.deliverableName}
                    onChange={(e) => setFormData({ ...formData, deliverableName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="acceptanceCriteria">Critérios de Aceitação *</Label>
                <Textarea
                  id="acceptanceCriteria"
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validationMethod">Método de Validação</Label>
                  <Select value={formData.validationMethod} onValueChange={(value) => setFormData({ ...formData, validationMethod: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inspecao">Inspeção</SelectItem>
                      <SelectItem value="teste">Teste</SelectItem>
                      <SelectItem value="demonstracao">Demonstração</SelectItem>
                      <SelectItem value="revisao">Revisão</SelectItem>
                      <SelectItem value="auditoria">Auditoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planejado">Planejado</SelectItem>
                      <SelectItem value="em-andamento">Em Andamento</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stakeholder">Stakeholder</Label>
                  <Input
                    id="stakeholder"
                    value={formData.stakeholder}
                    onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plannedDate">Data Planejada</Label>
                  <Input
                    id="plannedDate"
                    type="date"
                    value={formData.plannedDate}
                    onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="actualDate">Data Real</Label>
                  <Input
                    id="actualDate"
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comentários</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingValidation ? 'Atualizar' : 'Criar'} Validação
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
            <CardTitle className="text-sm font-medium">Total de Validações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
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
      </div>

      {/* Lista de Validações */}
      <div className="space-y-4">
        {scopeValidations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma validação de escopo criada ainda</p>
            <p className="text-sm text-muted-foreground">
              Comece definindo as validações necessárias para as entregas do projeto
            </p>
          </div>
        ) : (
          scopeValidations.map((validation) => (
            <Card key={validation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{validation.deliverableName}</h3>
                      <Badge className={getStatusColor(validation.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(validation.status)}
                          {validation.status.replace('-', ' ')}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{validation.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(validation)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(validation.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <strong>Método:</strong> {validation.validationMethod}
                  </div>
                  <div>
                    <strong>Responsável:</strong> {validation.responsible}
                  </div>
                  <div>
                    <strong>Stakeholder:</strong> {validation.stakeholder}
                  </div>
                  <div>
                    <strong>Data Planejada:</strong> {validation.plannedDate ? new Date(validation.plannedDate).toLocaleDateString() : '-'}
                  </div>
                  {validation.actualDate && (
                    <div>
                      <strong>Data Real:</strong> {new Date(validation.actualDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Critérios de Aceitação:</strong>
                    <p className="text-sm text-muted-foreground mt-1">{validation.acceptanceCriteria}</p>
                  </div>
                  
                  {validation.comments && (
                    <div>
                      <strong className="text-sm">Comentários:</strong>
                      <p className="text-sm text-muted-foreground mt-1">{validation.comments}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ScopeValidation;
