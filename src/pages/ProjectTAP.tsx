
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, DollarSign, Calendar, CheckCircle, Printer, Mail, Download } from "lucide-react";

export default function ProjectTAP() {
  const { projectId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Termo de Abertura do Projeto (TAP)</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Enviar por Email
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info-basica" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="info-basica">Info Básica</TabsTrigger>
          <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="info-basica" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Básicas do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Nome do Projeto</Label>
                  <Input id="projectName" placeholder="Sistema ERP Corporativo" />
                </div>
                <div>
                  <Label htmlFor="projectManager">Gerente do Projeto</Label>
                  <Input id="projectManager" placeholder="João Silva" />
                </div>
                <div>
                  <Label htmlFor="sponsors">Patrocinadores</Label>
                  <Input id="sponsors" placeholder="Diretoria Executiva" />
                </div>
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">Data de Conclusão Estimada</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="businessDemand">Demanda do Negócio</Label>
                <Textarea 
                  id="businessDemand" 
                  placeholder="Descreva a demanda do negócio que originou este projeto..."
                  maxLength={1000}
                />
                <div className="text-sm text-gray-500 mt-1">0/1000 caracteres</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectScope">Escopo do Projeto</Label>
                  <Textarea 
                    id="projectScope" 
                    placeholder="O que está incluído no projeto..."
                  />
                </div>
                <div>
                  <Label htmlFor="projectNotScope">Não-Escopo do Projeto</Label>
                  <Textarea 
                    id="projectNotScope" 
                    placeholder="O que NÃO está incluído no projeto..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="constraints">Restrições</Label>
                  <Textarea 
                    id="constraints" 
                    placeholder="Limitações do projeto..."
                  />
                </div>
                <div>
                  <Label htmlFor="assumptions">Premissas</Label>
                  <Textarea 
                    id="assumptions" 
                    placeholder="Premissas do projeto..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="existingProjects">Interface com Projetos Existentes</Label>
                <Textarea 
                  id="existingProjects" 
                  placeholder="Descreva a interface com outros projetos..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objetivos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Objetivos do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="objectives">Objetivos do Projeto</Label>
                <Textarea 
                  id="objectives" 
                  placeholder="Descreva os objetivos específicos do projeto..."
                  maxLength={1000}
                  rows={8}
                />
                <div className="text-sm text-gray-500 mt-1">0/1000 caracteres</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Stakeholders do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="stakeholders">Principais Interessados</Label>
                <Textarea 
                  id="stakeholders" 
                  placeholder="Liste os principais stakeholders e seus papéis..."
                  rows={6}
                />
              </div>
              <Button className="mt-4">Adicionar Stakeholder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orcamento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Orçamento Estimado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="estimatedBudget">Orçamento Total Estimado (R$)</Label>
                <Input 
                  id="estimatedBudget" 
                  type="number" 
                  placeholder="120000"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Mão de Obra</Label>
                  <Input type="number" placeholder="80000" />
                </div>
                <div>
                  <Label>Equipamentos</Label>
                  <Input type="number" placeholder="20000" />
                </div>
                <div>
                  <Label>Outros Custos</Label>
                  <Input type="number" placeholder="20000" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipe Básica do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <Input placeholder="Nome do membro" />
                  <Input placeholder="Função/Papel" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="projeto-fechado">Projeto Fechado</SelectItem>
                      <SelectItem value="horas-dias">Horas/Dias</SelectItem>
                      <SelectItem value="gratuito">Gratuito</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Valor por hora (R$)" />
                </div>
                <Button>Adicionar Membro da Equipe</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assinaturas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Assinaturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Nome do Patrocinador</Label>
                    <Input placeholder="Nome completo" />
                  </div>
                  <div>
                    <Label>Data da Assinatura</Label>
                    <Input type="date" />
                  </div>
                  <div className="flex items-end">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Pendente
                    </Badge>
                  </div>
                </div>
                <Button>Adicionar Assinatura</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Salvar Rascunho</Button>
        <Button>Salvar e Aprovar TAP</Button>
      </div>
    </div>
  );
}
