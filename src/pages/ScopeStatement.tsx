
import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ScopeStatement = () => {
  const { scopeStatement, updateScopeStatement, addScopeStatement } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    projectObjective: '',
    productDescription: '',
    deliverables: [],
    acceptanceCriteria: '',
    constraints: [],
    assumptions: [],
    exclusions: [],
    approvedBy: '',
    approvalDate: '',
    version: '1.0'
  });

  const [newItem, setNewItem] = useState('');
  const [currentSection, setCurrentSection] = useState('');

  useEffect(() => {
    if (scopeStatement && scopeStatement.length > 0) {
      setFormData(scopeStatement[0]);
    }
  }, [scopeStatement]);

  const handleSave = () => {
    const updatedData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };

    if (scopeStatement && scopeStatement.length > 0) {
      updateScopeStatement(scopeStatement[0].id, updatedData);
    } else {
      addScopeStatement(updatedData);
    }

    setIsEditing(false);
    toast.success('Declaração de Escopo salva com sucesso!');
  };

  const addItemToList = (section) => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        [section]: [...formData[section], newItem.trim()]
      });
      setNewItem('');
      setCurrentSection('');
    }
  };

  const removeItemFromList = (section, index) => {
    setFormData({
      ...formData,
      [section]: formData[section].filter((_, i) => i !== index)
    });
  };

  const renderListSection = (title, section, items) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{title}</Label>
        {isEditing && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentSection(section)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {currentSection === section && isEditing && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Adicionar ${title.toLowerCase()}`}
            onKeyPress={(e) => e.key === 'Enter' && addItemToList(section)}
          />
          <Button size="sm" onClick={() => addItemToList(section)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm">{item}</span>
            {isEditing && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeItemFromList(section, index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Nenhum item adicionado ainda
          </p>
        )}
      </div>
    </div>
  );

  const currentStatement = scopeStatement && scopeStatement.length > 0 ? scopeStatement[0] : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Declaração de Escopo do Projeto</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      {currentStatement && (
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline">Versão {currentStatement.version}</Badge>
            <span className="text-sm text-muted-foreground">
              Aprovado por: {currentStatement.approvedBy}
            </span>
            <span className="text-sm text-muted-foreground">
              Data: {new Date(currentStatement.approvalDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Objetivo do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={formData.projectObjective}
                onChange={(e) => setFormData({ ...formData, projectObjective: e.target.value })}
                placeholder="Descreva o objetivo principal do projeto..."
                rows={4}
              />
            ) : (
              <p className="text-sm">
                {formData.projectObjective || 'Objetivo não definido ainda'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Descrição do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                placeholder="Descreva o produto ou serviço que será entregue..."
                rows={4}
              />
            ) : (
              <p className="text-sm">
                {formData.productDescription || 'Descrição não definida ainda'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entregas Principais (Deliverables)</CardTitle>
          </CardHeader>
          <CardContent>
            {renderListSection('Entregas', 'deliverables', formData.deliverables)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critérios de Aceitação</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={formData.acceptanceCriteria}
                onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                placeholder="Defina os critérios gerais de aceitação do projeto..."
                rows={4}
              />
            ) : (
              <p className="text-sm">
                {formData.acceptanceCriteria || 'Critérios não definidos ainda'}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Restrições</CardTitle>
            </CardHeader>
            <CardContent>
              {renderListSection('Restrições', 'constraints', formData.constraints)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Premissas</CardTitle>
            </CardHeader>
            <CardContent>
              {renderListSection('Premissas', 'assumptions', formData.assumptions)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exclusões</CardTitle>
            </CardHeader>
            <CardContent>
              {renderListSection('Exclusões', 'exclusions', formData.exclusions)}
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Informações de Aprovação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="approvedBy">Aprovado por</Label>
                  <Input
                    id="approvedBy"
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                    placeholder="Nome do aprovador"
                  />
                </div>
                <div>
                  <Label htmlFor="approvalDate">Data de Aprovação</Label>
                  <Input
                    id="approvalDate"
                    type="date"
                    value={formData.approvalDate}
                    onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="version">Versão</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="1.0"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScopeStatement;
