
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
import { Plus, Edit, Trash2, Calendar, User, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ScopeValidation } from '@/types/project';

const ScopeValidations = () => {
  const { 
    scopeValidations, 
    wbsItems,
    phases,
    addScopeValidation, 
    updateScopeValidation, 
    deleteScopeValidation 
  } = useProject();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValidation, setEditingValidation] = useState<ScopeValidation | null>(null);
  const [formData, setFormData] = useState({
    deliverableId: '',
    deliverableName: '',
    description: '',
    acceptanceCriteria: '',
    validationMethod: 'inspecao' as ScopeValidation['validationMethod'],
    responsible: '',
    stakeholder: '',
    plannedDate: '',
    actualDate: '',
    status: 'planejado' as ScopeValidation['status'],
    comments: '',
    attachments: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingValidation) {
      updateScopeValidation(editingValidation.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
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

  const handleEdit = (validation: ScopeValidation) => {
    setEditingValidation(validation);
    setFormData({
      deliverableId: validation.deliverableId,
      deliverableName: validation.deliverableName,
      description: validation.description,
      acceptanceCriteria: validation.acceptanceCriteria,
      validationMethod: validation.validationMethod,
      responsible: validation.responsible,
      stakeholder: validation.stakeholder,
      plannedDate: validation.plannedDate,
      actualDate: validation.actualDate || '',
      status: validation.status,
      comments: validation.comments || '',
      attachments: validation.attachments || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta validação?')) {
      deleteScopeValidation(id);
      toast.success('Validação deletada com sucesso!');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planejado': 'bg-blue-100 text-blue-800',
      'em-andamento': 'bg-yellow-100 text-yellow-800',
      'aprovado': 'bg-green-100 text-green-800',
      'rejeitado': 'bg-red-100 text-red-800',
      'pendente': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodLabel = (method: string) => {
    const labels = {
      'inspecao': 'Inspeção',
      'teste': 'Teste',
      'demonstracao': 'Demonstração',
      'revisao': 'Revisão',
      'auditoria': 'Auditoria'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getWBSItemById = (deliverableId: string) => {
    return wbsItems.find(item => item.id === deliverableId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Validação do Escopo</h1>
          <p className="text-muted-foreground">Gerencie a aceitação formal das entregas do projeto</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nova Validação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingValidation ? 'Editar Validação' : 'Nova Validação de Escopo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliverableName">Nome da Entrega</Label>
                  <Input
                    id="deliverableName"
                    value={formData.deliverableName}
                    onChange={(e) => setFormData({ ...formData, deliverableName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deliverableId">Item EAP Relacionado</Label>
                  <Select
                    value={formData.deliverableId}
                    onValueChange={(value) => setFormData({ ...formData, deliverableId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um item EAP" />
                    </SelectTrigger>
                    <SelectContent>
                      {wbsItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.code} - {item.activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição da Entrega</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validationMethod">Método de Validação</Label>
                  <Select
                    value={formData.validationMethod}
                    onValueChange={(value: ScopeValidation['validationMethod']) => 
                      setFormData({ ...formData, validationMethod: value })
                    }
                  >
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
                  <Select
                    value={formData.status}
                    onValueChange={(value: ScopeValidation['status']) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
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
                  <Label htmlFor="responsible">Responsável pela Validação</Label>
                  <Input
                    id="responsible"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stakeholder">Stakeholder Aprovador</Label>
                  <Input
                    id="stakeholder"
                    value={formData.stakeholder}
                    onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })}
                    required
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
                    required
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
                  placeholder="Observações sobre a validação..."
                />
              </div>

              <Button type="submit" className="w-full">
                {editingValidation ? 'Atualizar Validação' : 'Salvar Validação'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scopeValidations.map((validation) => {
          const wbsItem = getWBSItemById(validation.deliverableId);

          return (
            <Card key={validation.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(validation.status)}>
                        {validation.status}
                      </Badge>
                      <Badge variant="outline">
                        {getMethodLabel(validation.validationMethod)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold">{validation.deliverableName}</h3>
                    {wbsItem && (
                      <p className="text-sm text-muted-foreground">
                        Relacionado a: {wbsItem.code} - {wbsItem.activity}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(validation)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(validation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p><strong>Descrição:</strong> {validation.description}</p>
                  <p><strong>Critérios de Aceitação:</strong> {validation.acceptanceCriteria}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Responsável:</strong> {validation.responsible}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Aprovador:</strong> {validation.stakeholder}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Data Planejada:</strong> {new Date(validation.plannedDate).toLocaleDateString()}</span>
                    </div>
                    {validation.actualDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Data Real:</strong> {new Date(validation.actualDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {validation.comments && (
                    <div className="pt-2 border-t">
                      <p><strong>Comentários:</strong> {validation.comments}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {scopeValidations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma validação de escopo criada ainda</p>
          <p className="text-sm text-muted-foreground">
            Crie validações para formalizar a aceitação das entregas do projeto
          </p>
        </div>
      )}
    </div>
  );
};

export default ScopeValidations;
