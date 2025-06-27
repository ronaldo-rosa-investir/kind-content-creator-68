
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, CheckCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjectCharter = () => {
  const { projectCharter, addProjectCharter, updateProjectCharter } = useProject();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    projectManager: '',
    sponsor: '',
    businessJustification: '',
    projectObjectives: [''],
    highLevelRequirements: [''],
    assumptions: [''],
    constraints: [''],
    risks: [''],
    budget: 0,
    timeline: '',
    stakeholders: [''],
    successCriteria: [''],
    approvedBy: '',
    approvalDate: '',
    version: '1.0'
  });

  React.useEffect(() => {
    if (projectCharter.length > 0) {
      const charter = projectCharter[0];
      setFormData({
        projectName: charter.projectName,
        projectManager: charter.projectManager,
        sponsor: charter.sponsor,
        businessJustification: charter.businessJustification,
        projectObjectives: charter.projectObjectives,
        highLevelRequirements: charter.highLevelRequirements,
        assumptions: charter.assumptions,
        constraints: charter.constraints,
        risks: charter.risks,
        budget: charter.budget,
        timeline: charter.timeline,
        stakeholders: charter.stakeholders,
        successCriteria: charter.successCriteria,
        approvedBy: charter.approvedBy,
        approvalDate: charter.approvalDate,
        version: charter.version
      });
    }
  }, [projectCharter]);

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectCharter.length > 0) {
      updateProjectCharter(projectCharter[0].id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "TAP atualizado com sucesso!",
        description: "O Termo de Abertura do Projeto foi atualizado.",
      });
    } else {
      addProjectCharter(formData);
      toast({
        title: "TAP criado com sucesso!",
        description: "O Termo de Abertura do Projeto foi criado.",
      });
    }
    
    setIsEditing(false);
  };

  const currentCharter = projectCharter.length > 0 ? projectCharter[0] : null;

  if (!isEditing && currentCharter) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Termo de Abertura do Projeto (TAP)</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar TAP
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Nome do Projeto</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentCharter.projectName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Gerente do Projeto</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentCharter.projectManager}</p>
                </div>
                <div>
                  <Label className="font-semibold">Patrocinador</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentCharter.sponsor}</p>
                </div>
                <div>
                  <Label className="font-semibold">Orçamento</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    R$ {currentCharter.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Justificativa de Negócio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{currentCharter.businessJustification}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentCharter.projectObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critérios de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentCharter.successCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Aprovado por: {currentCharter.approvedBy}
                </Badge>
                <Badge variant="outline">
                  Data: {new Date(currentCharter.approvalDate).toLocaleDateString('pt-BR')}
                </Badge>
                <Badge variant="outline">
                  Versão: {currentCharter.version}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {currentCharter ? 'Editar' : 'Criar'} Termo de Abertura do Projeto (TAP)
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Nome do Projeto</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectManager">Gerente do Projeto</Label>
                <Input
                  id="projectManager"
                  value={formData.projectManager}
                  onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sponsor">Patrocinador</Label>
                <Input
                  id="sponsor"
                  value={formData.sponsor}
                  onChange={(e) => setFormData({...formData, sponsor: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Justificativa de Negócio</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.businessJustification}
              onChange={(e) => setFormData({...formData, businessJustification: e.target.value})}
              placeholder="Descreva a justificativa de negócio para o projeto..."
              className="min-h-[100px]"
              required
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit">
            {currentCharter ? 'Atualizar TAP' : 'Criar TAP'}
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectCharter;
