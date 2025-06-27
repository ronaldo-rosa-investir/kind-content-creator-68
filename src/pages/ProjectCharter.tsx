
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, Edit, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamMemberBasic, SponsorSignature } from '@/types/project';

const ProjectCharter = () => {
  const { projectCharter, addProjectCharter, updateProjectCharter } = useProject();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    sponsors: '',
    projectManager: '',
    startDate: '',
    estimatedEndDate: '',
    estimatedBudget: 0,
    projectObjectives: '',
    businessDemand: '',
    projectScope: '',
    projectNotScope: '',
    stakeholders: '',
    existingProjectsInterface: '',
    constraints: '',
    assumptions: '',
    basicTeam: [] as TeamMemberBasic[],
    sponsorSignatures: [] as SponsorSignature[]
  });

  React.useEffect(() => {
    if (projectCharter.length > 0) {
      const charter = projectCharter[0];
      setFormData({
        projectName: charter.projectName,
        sponsors: charter.sponsors,
        projectManager: charter.projectManager,
        startDate: charter.startDate,
        estimatedEndDate: charter.estimatedEndDate,
        estimatedBudget: charter.estimatedBudget,
        projectObjectives: charter.projectObjectives,
        businessDemand: charter.businessDemand,
        projectScope: charter.projectScope,
        projectNotScope: charter.projectNotScope,
        stakeholders: charter.stakeholders,
        existingProjectsInterface: charter.existingProjectsInterface,
        constraints: charter.constraints,
        assumptions: charter.assumptions,
        basicTeam: charter.basicTeam || [],
        sponsorSignatures: charter.sponsorSignatures || []
      });
    }
  }, [projectCharter]);

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      basicTeam: [...prev.basicTeam, {
        id: Date.now().toString(),
        name: '',
        role: '',
        contractType: 'projeto-fechado',
        hourlyRate: 0
      }]
    }));
  };

  const updateTeamMember = (id: string, field: keyof TeamMemberBasic, value: any) => {
    setFormData(prev => ({
      ...prev,
      basicTeam: prev.basicTeam.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      basicTeam: prev.basicTeam.filter(member => member.id !== id)
    }));
  };

  const addSponsorSignature = () => {
    setFormData(prev => ({
      ...prev,
      sponsorSignatures: [...prev.sponsorSignatures, {
        id: Date.now().toString(),
        sponsorName: '',
        signatureDate: ''
      }]
    }));
  };

  const updateSponsorSignature = (id: string, field: keyof SponsorSignature, value: string) => {
    setFormData(prev => ({
      ...prev,
      sponsorSignatures: prev.sponsorSignatures.map(signature => 
        signature.id === id ? { ...signature, [field]: value } : signature
      )
    }));
  };

  const removeSponsorSignature = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sponsorSignatures: prev.sponsorSignatures.filter(signature => signature.id !== id)
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
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar TAP
          </Button>
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
                  <Label className="font-semibold">Patrocinadores</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentCharter.sponsors}</p>
                </div>
                <div>
                  <Label className="font-semibold">Gerente do Projeto</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentCharter.projectManager}</p>
                </div>
                <div>
                  <Label className="font-semibold">Data de Início</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(currentCharter.startDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Data Estimada de Conclusão</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(currentCharter.estimatedEndDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Orçamento Estimado</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    R$ {currentCharter.estimatedBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.projectObjectives}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demanda do Negócio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.businessDemand}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>O que é o Escopo do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.projectScope}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>O que não é o Escopo do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.projectNotScope}</p>
              </CardContent>
            </Card>
          </div>

          {currentCharter.basicTeam && currentCharter.basicTeam.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Equipe Básica do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentCharter.basicTeam.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {member.contractType === 'projeto-fechado' ? 'Projeto Fechado' : 
                           member.contractType === 'horas-dias' ? `R$ ${member.hourlyRate}/hora` : 'Gratuito'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentCharter.sponsorSignatures && currentCharter.sponsorSignatures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Assinaturas dos Patrocinadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentCharter.sponsorSignatures.map((signature) => (
                    <div key={signature.id} className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">{signature.sponsorName}</span>
                      <Badge className="bg-green-100 text-green-800">
                        Assinado em: {new Date(signature.signatureDate).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                <Label htmlFor="sponsors">Patrocinadores</Label>
                <Input
                  id="sponsors"
                  value={formData.sponsors}
                  onChange={(e) => setFormData({...formData, sponsors: e.target.value})}
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
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estimatedEndDate">Data Estimada de Conclusão</Label>
                <Input
                  id="estimatedEndDate"
                  type="date"
                  value={formData.estimatedEndDate}
                  onChange={(e) => setFormData({...formData, estimatedEndDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estimatedBudget">Orçamento Estimado (R$)</Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  value={formData.estimatedBudget}
                  onChange={(e) => setFormData({...formData, estimatedBudget: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos do Projeto</CardTitle>
              <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.projectObjectives}
                onChange={(e) => setFormData({...formData, projectObjectives: e.target.value})}
                placeholder="Descreva os objetivos principais do projeto..."
                className="min-h-[120px]"
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.projectObjectives.length}/1000 caracteres
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Demanda do Negócio</CardTitle>
              <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.businessDemand}
                onChange={(e) => setFormData({...formData, businessDemand: e.target.value})}
                placeholder="Descreva a demanda de negócio que originou o projeto..."
                className="min-h-[120px]"
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.businessDemand.length}/1000 caracteres
              </p>
            </CardContent>
          </Card>
        </div>

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
