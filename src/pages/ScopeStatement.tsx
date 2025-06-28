
import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Edit, 
  Save, 
  Trash2, 
  Download, 
  Printer, 
  Mail, 
  Eye,
  Lightbulb,
  Package,
  Rocket,
  AlertTriangle,
  Target,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import HelpTooltip from '@/components/ScopeHelpers/HelpTooltip';
import DeliverableModal from '@/components/ScopeHelpers/DeliverableModal';
import ConstraintModal from '@/components/ScopeHelpers/ConstraintModal';
import AssumptionModal from '@/components/ScopeHelpers/AssumptionModal';
import ExclusionModal from '@/components/ScopeHelpers/ExclusionModal';
import CharacterCounter from '@/components/ProjectCharter/CharacterCounter';

const ScopeStatement = () => {
  const { scopeStatement, updateScopeStatement, addScopeStatement } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
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

  // Auto-save functionality
  useEffect(() => {
    if (isEditing) {
      const autoSaveInterval = setInterval(() => {
        handleAutoSave();
      }, 30000); // 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [isEditing, formData]);

  useEffect(() => {
    if (scopeStatement && scopeStatement.length > 0) {
      setFormData(scopeStatement[0]);
    }
  }, [scopeStatement]);

  const handleAutoSave = () => {
    if (formData.projectObjective || formData.productDescription) {
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (scopeStatement && scopeStatement.length > 0) {
        updateScopeStatement(scopeStatement[0].id, updatedData);
      } else {
        addScopeStatement(updatedData);
      }

      setLastSaved(new Date());
      console.log('Auto-save realizado');
    }
  };

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
    setLastSaved(new Date());
    toast.success('Declaração de Escopo salva com sucesso!');
  };

  const addDeliverable = (deliverable: any) => {
    setFormData({
      ...formData,
      deliverables: [...formData.deliverables, deliverable]
    });
  };

  const addConstraint = (constraint: any) => {
    setFormData({
      ...formData,
      constraints: [...formData.constraints, constraint]
    });
  };

  const addAssumption = (assumption: any) => {
    setFormData({
      ...formData,
      assumptions: [...formData.assumptions, assumption]
    });
  };

  const addExclusion = (exclusion: any) => {
    setFormData({
      ...formData,
      exclusions: [...formData.exclusions, exclusion]
    });
  };

  const removeFromList = (section: string, index: number) => {
    setFormData({
      ...formData,
      [section]: formData[section].filter((_, i) => i !== index)
    });
  };

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

      {/* Guia Rápido */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="font-medium mb-2">💡 Guia Rápido</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span><strong>PRODUTO</strong> = O que será entregue ao cliente</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span><strong>PROJETO</strong> = Trabalho necessário para entregar</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span><strong>Foque no resultado, não nas atividades</strong></span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* TAP Integration */}
      {currentStatement && (
        <div className="mb-4">
          <Alert className="border-green-200 bg-green-50">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              📋 Baseado no escopo conceitual do TAP v1.0 
              <Button variant="link" className="p-0 h-auto ml-2 text-green-700">
                [Ver TAP]
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Version and Status Info */}
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
            <Badge variant="secondary">📝 Rascunho</Badge>
            {lastSaved && (
              <span className="text-sm text-muted-foreground">
                Última edição: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {/* Objetivo do Projeto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              📋 Objetivo do Projeto
              <HelpTooltip content="A razão de existir do projeto. Problema que resolve ou oportunidade que aproveita." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={formData.projectObjective}
                  onChange={(e) => setFormData({ ...formData, projectObjective: e.target.value })}
                  placeholder="Por que este projeto existe? Que problema resolve ou oportunidade aproveita?"
                  rows={4}
                  maxLength={1000}
                />
                <CharacterCounter 
                  current={formData.projectObjective.length} 
                  max={1000} 
                />
              </div>
            ) : (
              <p className="text-sm">
                {formData.projectObjective || 'Objetivo não definido ainda'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Descrição do Produto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              📦 Descrição do Produto
              <HelpTooltip content="O resultado final. Foque no QUE será entregue, não COMO será feito." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  placeholder="O que o cliente receberá? Características, funcionalidades e benefícios do resultado final"
                  rows={4}
                  maxLength={1000}
                />
                <CharacterCounter 
                  current={formData.productDescription.length} 
                  max={1000} 
                />
              </div>
            ) : (
              <p className="text-sm">
                {formData.productDescription || 'Descrição não definida ainda'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Entregas Principais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                📋 Entregas Principais (Deliverables)
                <HelpTooltip content="Produtos tangíveis de cada fase: documentos, protótipos, sistema funcionando." />
              </div>
              {isEditing && <DeliverableModal onAdd={addDeliverable} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded border">
                  <div className="flex-1">
                    <div className="font-medium">{deliverable.name}</div>
                    {deliverable.description && (
                      <div className="text-sm text-muted-foreground">{deliverable.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {deliverable.dueDate && `Prazo: ${new Date(deliverable.dueDate).toLocaleDateString()}`}
                      {deliverable.responsible && ` | Responsável: ${deliverable.responsible}`}
                    </div>
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromList('deliverables', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.deliverables.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma entrega definida ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Critérios de Aceitação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              ✅ Critérios de Aceitação
              <HelpTooltip content="Condições mensuráveis que definem quando o trabalho está completo." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                  placeholder="Como saberemos que está pronto? Métricas, padrões e condições para aprovação"
                  rows={4}
                  maxLength={1000}
                />
                <CharacterCounter 
                  current={formData.acceptanceCriteria.length} 
                  max={1000} 
                />
              </div>
            ) : (
              <p className="text-sm">
                {formData.acceptanceCriteria || 'Critérios não definidos ainda'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Restrições, Premissas e Exclusões */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Restrições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  ⚠️ Restrições
                  <HelpTooltip content="Limitações: orçamento máximo, prazo fixo, tecnologias específicas." />
                </div>
                {isEditing && <ConstraintModal onAdd={addConstraint} />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.constraints.map((constraint, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded border">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{constraint.type}</div>
                      <div className="text-xs text-muted-foreground">{constraint.description}</div>
                      <Badge size="sm" variant={constraint.impact === 'alto' ? 'destructive' : constraint.impact === 'medio' ? 'default' : 'secondary'}>
                        {constraint.impact}
                      </Badge>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromList('constraints', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.constraints.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma restrição definida ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Premissas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  🎯 Premissas
                  <HelpTooltip content="O que assumimos como verdadeiro: disponibilidade da equipe, aprovações." />
                </div>
                {isEditing && <AssumptionModal onAdd={addAssumption} />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.assumptions.map((assumption, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded border">
                    <div className="flex-1">
                      <div className="text-sm">{assumption.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Probabilidade: {assumption.probability}
                        {assumption.riskIfFalse && ` | Risco: ${assumption.riskIfFalse}`}
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromList('assumptions', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.assumptions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma premissa definida ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exclusões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5" />
                  🚫 Exclusões
                  <HelpTooltip content="O que NÃO será feito para evitar expectativas incorretas." />
                </div>
                {isEditing && <ExclusionModal onAdd={addExclusion} />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded border">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{exclusion.item}</div>
                      <div className="text-xs text-muted-foreground">{exclusion.justification}</div>
                      <Badge size="sm" variant={exclusion.communicated === 'sim' ? 'default' : 'destructive'}>
                        Cliente {exclusion.communicated === 'sim' ? 'Comunicado' : 'Não Comunicado'}
                      </Badge>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromList('exclusions', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.exclusions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma exclusão definida ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações de Aprovação */}
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

      {/* Ações do Escopo */}
      <Card>
        <CardHeader>
          <CardTitle>Ações do Escopo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Save className="h-4 w-4 mr-2" />
              💾 Salvar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              📄 Gerar PDF
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              📧 Enviar Email
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              🖨️ Imprimir
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              👁️ Pré-visualizar
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Status: 📝 Rascunho | Última edição: {lastSaved ? `há ${Math.floor((Date.now() - lastSaved.getTime()) / 60000)} min` : 'nunca'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScopeStatement;
