
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, FileText, Edit, Users, Calendar, CheckCircle, Printer, Mail, Download } from 'lucide-react';
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

  const [completionStatus, setCompletionStatus] = useState({
    basicInfo: false,
    objectives: false,
    scope: false,
    stakeholders: false,
    budget: false,
    team: false,
    signatures: false
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

      // Verificar status de completude
      setCompletionStatus({
        basicInfo: !!(charter.projectName && charter.sponsors && charter.projectManager && charter.startDate && charter.estimatedEndDate),
        objectives: !!(charter.projectObjectives && charter.businessDemand),
        scope: !!(charter.projectScope && charter.projectNotScope),
        stakeholders: !!(charter.stakeholders && charter.existingProjectsInterface),
        budget: !!charter.estimatedBudget,
        team: charter.basicTeam && charter.basicTeam.length > 0,
        signatures: charter.sponsorSignatures && charter.sponsorSignatures.length > 0
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

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exportação para PDF será implementada em breve.",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "O envio por e-mail será implementado em breve.",
    });
  };

  const currentCharter = projectCharter.length > 0 ? projectCharter[0] : null;
  const isComplete = Object.values(completionStatus).every(status => status);

  if (!isEditing && currentCharter) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Termo de Abertura do Projeto (TAP)</h1>
            <div className="flex items-center gap-2 mt-2">
              {isComplete ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  TAP Completo
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600">
                  TAP Incompleto
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              E-mail
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar TAP
            </Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="info" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Info Básica
            </TabsTrigger>
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="scope">Escopo</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="budget">Orçamento</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="signatures">Assinaturas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Básicas
                  {completionStatus.basicInfo && <CheckCircle className="h-4 w-4 text-green-600" />}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Objetivos do Projeto
                    {completionStatus.objectives && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </CardTitle>
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
          </TabsContent>

          <TabsContent value="scope" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    O que é o Escopo do Projeto
                    {completionStatus.scope && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </CardTitle>
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

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Restrições</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.constraints}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premissas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.assumptions}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Interessados (Stakeholders)
                    {completionStatus.stakeholders && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.stakeholders}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interface com Projetos Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.existingProjectsInterface}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Orçamento Estimado
                  {completionStatus.budget && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  R$ {currentCharter.estimatedBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Orçamento total estimado para conclusão do projeto</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            {currentCharter.basicTeam && currentCharter.basicTeam.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Equipe Básica do Projeto
                    {completionStatus.team && <CheckCircle className="h-4 w-4 text-green-600" />}
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
          </TabsContent>

          <TabsContent value="signatures" className="space-y-4">
            {currentCharter.sponsorSignatures && currentCharter.sponsorSignatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Assinaturas dos Patrocinadores
                    {completionStatus.signatures && <CheckCircle className="h-4 w-4 text-green-600" />}
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
          </TabsContent>
        </Tabs>
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

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="info">Info Básica</TabsTrigger>
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="scope">Escopo</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="budget">Orçamento</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="signatures">Assinaturas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="scope" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>O que é o Escopo do Projeto</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.projectScope}
                    onChange={(e) => setFormData({...formData, projectScope: e.target.value})}
                    placeholder="Descreva o que está incluído no escopo..."
                    className="min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.projectScope.length}/1000 caracteres
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>O que não é o Escopo do Projeto</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.projectNotScope}
                    onChange={(e) => setFormData({...formData, projectNotScope: e.target.value})}
                    placeholder="Descreva o que NÃO está incluído no escopo..."
                    className="min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.projectNotScope.length}/1000 caracteres
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Restrições</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.constraints}
                    onChange={(e) => setFormData({...formData, constraints: e.target.value})}
                    placeholder="Liste as restrições do projeto..."
                    className="min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.constraints.length}/1000 caracteres
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premissas</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.assumptions}
                    onChange={(e) => setFormData({...formData, assumptions: e.target.value})}
                    placeholder="Liste as premissas do projeto..."
                    className="min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.assumptions.length}/1000 caracteres
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interessados (Stakeholders)</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.stakeholders}
                    onChange={(e) => setFormData({...formData, stakeholders: e.target.value})}
                    placeholder="Liste os principais interessados do projeto..."
                    className="min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.stakeholders.length}/1000 caracteres
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interface com Projetos Existentes</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.existingProjectsInterface}
                    onChange={(e) => setFormData({...formData, existingProjectsInterface: e.target.value})}
                    placeholder="Descreva as interfaces com outros projetos..."
                    className="min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.existingProjectsInterface.length}/1000 caracteres
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orçamento Estimado</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Equipe Básica do Projeto
                  <Button type="button" onClick={addTeamMember} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Membro
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.basicTeam.map((member, index) => (
                  <div key={member.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded">
                    <div className="col-span-3">
                      <Label>Nome</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Cargo/Função</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        placeholder="Função no projeto"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Tipo de Contrato</Label>
                      <Select
                        value={member.contractType}
                        onValueChange={(value: 'projeto-fechado' | 'horas-dias' | 'gratuito') => 
                          updateTeamMember(member.id, 'contractType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="projeto-fechado">Projeto Fechado</SelectItem>
                          <SelectItem value="horas-dias">Horas/Dias</SelectItem>
                          <SelectItem value="gratuito">Gratuito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {member.contractType === 'horas-dias' && (
                      <div className="col-span-2">
                        <Label>Valor/Hora (R$)</Label>
                        <Input
                          type="number"
                          value={member.hourlyRate}
                          onChange={(e) => updateTeamMember(member.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                    <div className="col-span-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeTeamMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signatures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Assinaturas dos Patrocinadores
                  <Button type="button" onClick={addSponsorSignature} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Assinatura
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.sponsorSignatures.map((signature) => (
                  <div key={signature.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded">
                    <div className="col-span-5">
                      <Label>Nome do Patrocinador</Label>
                      <Input
                        value={signature.sponsorName}
                        onChange={(e) => updateSponsorSignature(signature.id, 'sponsorName', e.target.value)}
                        placeholder="Nome completo do patrocinador"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label>Data de Assinatura</Label>
                      <Input
                        type="date"
                        value={signature.signatureDate}
                        onChange={(e) => updateSponsorSignature(signature.id, 'signatureDate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeSponsorSignature(signature.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex gap-4 mt-6">
            <Button type="submit">
              {currentCharter ? 'Atualizar TAP' : 'Criar TAP'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            )}
          </div>
        </Tabs>
      </form>
    </div>
  );
};

export default ProjectCharter;
