import React, { useState, useEffect, useCallback } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, FileText, Edit, Users, Calendar, CheckCircle, Printer, Mail, Download, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamMemberBasic, SponsorSignature, TAPStatus, TAPApproval, TAPApprovalHistory } from '@/types/project';

// Import new components
import TAPHeader from '@/components/ProjectCharter/TAPHeader';
import BudgetTab from '@/components/ProjectCharter/BudgetTab';
import AutoSave from '@/components/ProjectCharter/AutoSave';
import VersionHistory from '@/components/ProjectCharter/VersionHistory';
import CharacterCounter from '@/components/ProjectCharter/CharacterCounter';

const ProjectCharter = () => {
  const { projectCharter, addProjectCharter, updateProjectCharter } = useProject();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [acceptedConditions, setAcceptedConditions] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('1.0');
  
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
    sponsorSignatures: [] as SponsorSignature[],
    approval: null as TAPApproval | null
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

  // Orçamento breakdown state
  const [budgetCategories, setBudgetCategories] = useState([]);

  // Mock approval history - in real app this would come from backend
  const [approvalHistory] = useState<TAPApprovalHistory[]>([
    {
      id: '1',
      status: 'rascunho',
      date: new Date().toISOString(),
      approver: 'Sistema',
      comments: 'TAP criado'
    }
  ]);

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (Object.values(completionStatus).filter(Boolean).length / Object.keys(completionStatus).length) * 100
  );

  // Check if TAP is editable
  const isEditable = !formData.approval?.status || 
    formData.approval.status === 'rascunho' || 
    formData.approval.status === 'rejeitado';

  // Auto-save function
  const handleAutoSave = useCallback(() => {
    if (!isEditable || !formData.projectName) return;
    
    console.log('Auto-salvamento executado', new Date().toLocaleTimeString());
    // In real app, this would save to backend
    toast({
      title: "Salvamento automático",
      description: "TAP salvo automaticamente",
    });
  }, [formData, isEditable, toast]);

  useEffect(() => {
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
        sponsorSignatures: charter.sponsorSignatures || [],
        approval: charter.approval || null
      });

      // Update completion status
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

  const getStatusBadge = (status: TAPStatus) => {
    switch (status) {
      case 'rascunho':
        return <Badge variant="outline" className="text-gray-600">Rascunho</Badge>;
      case 'pendente-aprovacao':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'aprovado-com-ressalva':
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Aprovado com Ressalva</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const handleStatusChange = (newStatus: TAPStatus) => {
    const now = new Date().toISOString();
    
    if (!formData.approval) {
      // Create new approval object
      const newApproval: TAPApproval = {
        id: Date.now().toString(),
        status: newStatus,
        submissionDate: newStatus === 'pendente-aprovacao' ? now : '',
        approvalDate: (newStatus === 'aprovado' || newStatus === 'aprovado-com-ressalva') ? now : '',
        approver: '',
        approverComments: '',
        conditions: '',
        createdAt: now,
        updatedAt: now
      };
      setFormData(prev => ({ ...prev, approval: newApproval }));
    } else {
      // Update existing approval
      const updatedApproval: TAPApproval = {
        ...formData.approval,
        status: newStatus,
        submissionDate: newStatus === 'pendente-aprovacao' && !formData.approval.submissionDate ? now : formData.approval.submissionDate,
        approvalDate: (newStatus === 'aprovado' || newStatus === 'aprovado-com-ressalva') && !formData.approval.approvalDate ? now : formData.approval.approvalDate,
        updatedAt: now
      };
      setFormData(prev => ({ ...prev, approval: updatedApproval }));
    }
  };

  const validateApprovalForm = () => {
    const { approval } = formData;
    
    if (!approval || approval.status === 'rascunho') return true;

    if (!approval.approver) {
      toast({
        title: "Erro de validação",
        description: "Aprovador responsável é obrigatório.",
        variant: "destructive"
      });
      return false;
    }

    if (approval.status === 'rejeitado' && !approval.approverComments) {
      toast({
        title: "Erro de validação", 
        description: "Comentários do aprovador são obrigatórios para rejeição.",
        variant: "destructive"
      });
      return false;
    }

    if (approval.status === 'aprovado-com-ressalva' && !approval.conditions) {
      toast({
        title: "Erro de validação",
        description: "Ressalvas/Condições são obrigatórias para aprovação com ressalva.",
        variant: "destructive"
      });
      return false;
    }

    if ((approval.status === 'aprovado' || approval.status === 'aprovado-com-ressalva') && !approval.approvalDate) {
      toast({
        title: "Erro de validação",
        description: "Data de aprovação é obrigatória.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateApprovalForm()) return;
    
    // Ensure approval object exists with all required fields
    const finalApproval: TAPApproval = formData.approval || {
      id: Date.now().toString(),
      status: 'rascunho',
      submissionDate: '',
      approvalDate: '',
      approver: '',
      approverComments: '',
      conditions: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (projectCharter.length > 0) {
      updateProjectCharter(projectCharter[0].id, {
        ...formData,
        approval: {
          ...finalApproval,
          updatedAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "TAP atualizado com sucesso!",
        description: "O Termo de Abertura do Projeto foi atualizado.",
      });
    } else {
      addProjectCharter({
        ...formData,
        approval: finalApproval
      });
      toast({
        title: "TAP criado com sucesso!",
        description: "O Termo de Abertura do Projeto foi criado.",
      });
    }
    
    setIsEditing(false);
  };

  // New handler functions
  const handleCreateNewVersion = () => {
    const newVersion = `${parseFloat(currentVersion) + 0.1}`;
    setCurrentVersion(newVersion);
    setIsEditing(true);
    toast({
      title: "Nova versão criada",
      description: `Versão ${newVersion} do TAP criada para edição.`,
    });
  };

  const handleViewVersion = (versionId: string) => {
    // A visualização será feita através do modal no VersionHistory
    toast({
      title: "Abrindo visualização",
      description: `Carregando versão ${versionId}`,
    });
  };

  const handleDownloadVersion = (versionId: string) => {
    if (currentCharter) {
      const { downloadTAPAsPDF } = require('@/utils/tapUtils');
      downloadTAPAsPDF(currentCharter, versionId);
      toast({
        title: "Download iniciado",
        description: `Baixando versão ${versionId} do TAP`,
      });
    }
  };

  const handleCompareVersions = (v1: string, v2: string) => {
    toast({
      title: "Comparação de versões",
      description: `Comparando versões ${v1} e ${v2} - Funcionalidade em desenvolvimento`,
    });
  };

  const handleSendForApproval = () => {
    handleStatusChange('pendente-aprovacao');
    toast({
      title: "TAP enviado para aprovação",
      description: "O TAP foi enviado para análise do aprovador.",
    });
  };

  const handleStartProject = () => {
    if (formData.approval?.status === 'aprovado-com-ressalva' && !acceptedConditions) {
      toast({
        title: "Condições não aceitas",
        description: "Você deve aceitar as condições antes de iniciar o projeto.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Projeto iniciado!",
      description: "O projeto foi iniciado com base no TAP aprovado.",
    });
  };

  const handlePrint = () => {
    if (currentCharter) {
      const { printTAP } = require('@/utils/tapUtils');
      printTAP(currentCharter, currentVersion);
    }
  };

  const handleExportPDF = () => {
    if (currentCharter) {
      const { downloadTAPAsPDF } = require('@/utils/tapUtils');
      downloadTAPAsPDF(currentCharter, currentVersion);
      toast({
        title: "Download iniciado",
        description: "TAP será baixado como arquivo HTML (compatível para conversão em PDF)",
      });
    }
  };

  const handleSendEmail = () => {
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "O envio por e-mail será implementado em breve.",
    });
  };

  const currentCharter = projectCharter.length > 0 ? projectCharter[0] : null;
  const isComplete = Object.values(completionStatus).every(status => status);
  const canEdit = !formData.approval?.status || formData.approval.status === 'rascunho' || formData.approval.status === 'rejeitado';

  // If not editing and has charter, show view mode
  if (!isEditing && currentCharter) {
    return (
      <div className="space-y-6">
        <TAPHeader
          projectName={currentCharter.projectName}
          status={currentCharter.approval?.status || 'rascunho'}
          version={currentVersion}
          isEditable={isEditable}
          completionPercentage={completionPercentage}
          onCreateNewVersion={handleCreateNewVersion}
          onEdit={() => setIsEditing(true)}
        />

        <AutoSave
          onSave={handleAutoSave}
          isEnabled={isEditable}
          interval={30}
        />

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
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
        </div>

        {/* Status alerts */}
        {currentCharter.approval?.status === 'aprovado-com-ressalva' && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Projeto aprovado com condições.</strong> Veja as ressalvas antes de iniciar o projeto.
            </AlertDescription>
          </Alert>
        )}

        {currentCharter.approval?.status === 'rejeitado' && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>TAP rejeitado.</strong> Veja os comentários do aprovador e faça as correções necessárias.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs for viewing charter content */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="info">Info Básica</TabsTrigger>
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="scope">Escopo</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="budget">Orçamento</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="signatures">Assinaturas</TabsTrigger>
            <TabsTrigger value="approval">Aprovação</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
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
                  <CardTitle>Objetivos do Projeto</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
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
                  <CardTitle>O que é o Escopo do Projeto</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
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
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.constraints}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premissas</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
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
                  <CardTitle>Interessados (Stakeholders)</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCharter.stakeholders}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interface com Projetos Existentes</CardTitle>
                  <p className="text-sm text-muted-foreground">Máximo 1000 caracteres. Seja sucinto.</p>
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

          <TabsContent value="approval" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Status de Aprovação do TAP
                  {getStatusBadge(currentCharter.approval?.status || 'rascunho')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Status</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentCharter.approval?.status === 'rascunho' ? 'Rascunho' :
                       currentCharter.approval?.status === 'pendente-aprovacao' ? 'Pendente de Aprovação' :
                       currentCharter.approval?.status === 'aprovado' ? 'Aprovado' :
                       currentCharter.approval?.status === 'aprovado-com-ressalva' ? 'Aprovado com Ressalva' :
                       currentCharter.approval?.status === 'rejeitado' ? 'Rejeitado' : 'Não definido'}
                    </p>
                  </div>
                  {currentCharter.approval?.submissionDate && (
                    <div>
                      <Label className="font-semibold">Data de Envio</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(currentCharter.approval.submissionDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  {currentCharter.approval?.approvalDate && (
                    <div>
                      <Label className="font-semibold">Data de Aprovação</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(currentCharter.approval.approvalDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  {currentCharter.approval?.approver && (
                    <div>
                      <Label className="font-semibold">Aprovador</Label>
                      <p className="text-sm text-muted-foreground mt-1">{currentCharter.approval.approver}</p>
                    </div>
                  )}
                </div>

                {currentCharter.approval?.conditions && (
                  <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <Label className="font-semibold text-orange-800">Condições e Ressalvas</Label>
                    <p className="text-sm text-orange-700 mt-2 whitespace-pre-wrap">{currentCharter.approval.conditions}</p>
                    
                    {currentCharter.approval.status === 'aprovado-com-ressalva' && (
                      <div className="mt-4 flex items-center space-x-2">
                        <Checkbox 
                          id="accept-conditions" 
                          checked={acceptedConditions}
                          onCheckedChange={(checked) => setAcceptedConditions(checked as boolean)}
                        />
                        <Label htmlFor="accept-conditions" className="text-sm text-orange-800">
                          Li e compreendi as ressalvas, e aceito as condições para iniciar o projeto
                        </Label>
                      </div>
                    )}
                  </div>
                )}

                {currentCharter.approval?.approverComments && (
                  <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                    <Label className="font-semibold">Comentários do Aprovador</Label>
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{currentCharter.approval.approverComments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <VersionHistory
              history={approvalHistory}
              currentVersion={currentVersion}
              charter={currentCharter}
              onViewVersion={handleViewVersion}
              onDownloadVersion={handleDownloadVersion}
              onCompareVersions={handleCompareVersions}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-6">
      <TAPHeader
        projectName={formData.projectName || 'Novo TAP'}
        status={formData.approval?.status || 'rascunho'}
        version={currentVersion}
        isEditable={true}
        completionPercentage={completionPercentage}
        onCreateNewVersion={handleCreateNewVersion}
        onEdit={() => {}}
      />

      <AutoSave
        onSave={handleAutoSave}
        isEnabled={true}
        interval={30}
      />

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="info">Info Básica *</TabsTrigger>
            <TabsTrigger value="objectives">Objetivos *</TabsTrigger>
            <TabsTrigger value="scope">Escopo *</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders *</TabsTrigger>
            <TabsTrigger value="budget">Orçamento *</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="signatures">Assinaturas</TabsTrigger>
            <TabsTrigger value="approval">Aprovação</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">Nome do Projeto *</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsors">Patrocinadores *</Label>
                    <Input
                      id="sponsors"
                      value={formData.sponsors}
                      onChange={(e) => setFormData({...formData, sponsors: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectManager">Gerente do Projeto *</Label>
                    <Input
                      id="projectManager"
                      value={formData.projectManager}
                      onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Data de Início *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedEndDate">Data Estimada de Conclusão *</Label>
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
                  <CardTitle>Objetivos do Projeto *</CardTitle>
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
                  <CharacterCounter 
                    current={formData.projectObjectives.length} 
                    max={1000} 
                    className="mt-1" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demanda do Negócio *</CardTitle>
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
                  <CharacterCounter 
                    current={formData.businessDemand.length} 
                    max={1000} 
                    className="mt-1" 
                  />
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
            <BudgetTab
              totalBudget={formData.estimatedBudget}
              onTotalBudgetChange={(value) => setFormData({...formData, estimatedBudget: value})}
              categories={budgetCategories}
              onCategoriesChange={setBudgetCategories}
            />
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

          <TabsContent value="approval" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aprovação do TAP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status do TAP</Label>
                    <Select
                      value={formData.approval?.status || 'rascunho'}
                      onValueChange={(value: TAPStatus) => handleStatusChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">Rascunho</SelectItem>
                        <SelectItem value="pendente-aprovacao">Pendente de Aprovação</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="aprovado-com-ressalva">Aprovado com Ressalva</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.approval?.status && formData.approval.status !== 'rascunho' && (
                    <div>
                      <Label htmlFor="approver">Aprovador Responsável</Label>
                      <Input
                        id="approver"
                        value={formData.approval?.approver || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          approval: { ...prev.approval!, approver: e.target.value }
                        }))}
                        placeholder="Nome do aprovador"
                        required
                      />
                    </div>
                  )}

                  {formData.approval?.submissionDate && (
                    <div>
                      <Label htmlFor="submissionDate">Data de Envio</Label>
                      <Input
                        id="submissionDate"
                        type="date"
                        value={formData.approval.submissionDate.split('T')[0]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          approval: { ...prev.approval!, submissionDate: e.target.value }
                        }))}
                        readOnly
                      />
                    </div>
                  )}

                  {(formData.approval?.status === 'aprovado' || formData.approval?.status === 'aprovado-com-ressalva') && (
                    <div>
                      <Label htmlFor="approvalDate">Data de Aprovação</Label>
                      <Input
                        id="approvalDate"
                        type="date"
                        value={formData.approval?.approvalDate ? formData.approval.approvalDate.split('T')[0] : ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          approval: { ...prev.approval!, approvalDate: e.target.value }
                        }))}
                        required
                      />
                    </div>
                  )}
                </div>

                {formData.approval?.status === 'aprovado-com-ressalva' && (
                  <div>
                    <Label htmlFor="conditions">Condições e Ressalvas para Aprovação</Label>
                    <Textarea
                      id="conditions"
                      value={formData.approval?.conditions || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        approval: { ...prev.approval!, conditions: e.target.value }
                      }))}
                      placeholder="Descreva as condições que devem ser atendidas..."
                      className="min-h-[120px] border-orange-200 focus:border-orange-400"
                      maxLength={2000}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {(formData.approval?.conditions || '').length}/2000 caracteres
                    </p>
                  </div>
                )}

                {(formData.approval?.status === 'rejeitado' || formData.approval?.status === 'aprovado-com-ressalva') && (
                  <div>
                    <Label htmlFor="approverComments">
                      {formData.approval?.status === 'rejeitado' ? 'Comentários do Aprovador (Obrigatório)' : 'Comentários do Aprovador'}
                    </Label>
                    <Textarea
                      id="approverComments"
                      value={formData.approval?.approverComments || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        approval: { ...prev.approval!, approverComments: e.target.value }
                      }))}
                      placeholder={formData.approval?.status === 'rejeitado' 
                        ? "Descreva os motivos da rejeição e as correções necessárias..." 
                        : "Comentários adicionais do aprovador..."}
                      className="min-h-[100px]"
                      required={formData.approval?.status === 'rejeitado'}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex gap-4 mt-6">
            <Button type="submit">
              {currentCharter ? 'Atualizar TAP' : 'Criar TAP'}
            </Button>
            
            {formData.approval?.status === 'rascunho' && (
              <Button type="button" variant="outline" onClick={handleSendForApproval}>
                Enviar para Aprovação
              </Button>
            )}
            
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
