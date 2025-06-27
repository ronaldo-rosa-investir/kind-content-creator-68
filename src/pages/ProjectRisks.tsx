
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Plus, Shield, Target, Clock } from "lucide-react";

export default function ProjectRisks() {
  const { projectId } = useParams();

  // Mock data para demonstração
  const risks = [
    {
      id: 1,
      title: "Atraso na entrega de requisitos",
      category: "cronograma",
      probability: "media",
      impact: "alto",
      priority: "alto",
      status: "ativo",
      owner: "João Silva",
      mitigation: "Reuniões semanais de acompanhamento",
      dueDate: "2024-07-30"
    },
    {
      id: 2,
      title: "Mudança de escopo não aprovada",
      category: "escopo",
      probability: "baixa",
      impact: "alto",
      priority: "medio",
      status: "monitorando",
      owner: "Maria Santos",
      mitigation: "Processo formal de controle de mudanças",
      dueDate: "2024-08-15"
    },
    {
      id: 3,
      title: "Indisponibilidade de recursos chave",
      category: "recursos",
      probability: "alta",
      impact: "medio",
      priority: "alto",
      status: "ativo",
      owner: "Pedro Costa",
      mitigation: "Treinamento de backup e cross-training",
      dueDate: "2024-07-25"
    },
    {
      id: 4,
      title: "Falha na integração com sistema legado",
      category: "tecnico",
      probability: "media",
      impact: "alto",
      priority: "alto",
      status: "mitigado",
      owner: "Ana Lima",
      mitigation: "Testes de integração antecipados",
      dueDate: "2024-07-20"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cronograma": return "bg-red-100 text-red-800";
      case "escopo": return "bg-blue-100 text-blue-800";
      case "recursos": return "bg-yellow-100 text-yellow-800";
      case "tecnico": return "bg-purple-100 text-purple-800";
      case "qualidade": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "alto": return "bg-red-100 text-red-800";
      case "medio": return "bg-yellow-100 text-yellow-800";
      case "baixo": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alto": return "bg-red-100 text-red-800";
      case "medio": return "bg-yellow-100 text-yellow-800";
      case "baixo": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-red-100 text-red-800";
      case "monitorando": return "bg-yellow-100 text-yellow-800";
      case "mitigado": return "bg-green-100 text-green-800";
      case "fechado": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "monitorando": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "mitigado": return <Shield className="h-4 w-4 text-green-500" />;
      case "fechado": return <Target className="h-4 w-4 text-gray-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const riskStats = {
    total: risks.length,
    active: risks.filter(r => r.status === "ativo").length,
    high: risks.filter(r => r.priority === "alto").length,
    mitigated: risks.filter(r => r.status === "mitigado").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Riscos</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Risco
        </Button>
      </div>

      {/* Resumo de Riscos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Riscos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskStats.total}</div>
            <p className="text-xs text-muted-foreground">Identificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskStats.active}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            <Target className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{riskStats.high}</div>
            <p className="text-xs text-muted-foreground">Críticos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigados</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{riskStats.mitigated}</div>
            <p className="text-xs text-muted-foreground">Controlados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="cronograma">Cronograma</SelectItem>
                <SelectItem value="escopo">Escopo</SelectItem>
                <SelectItem value="recursos">Recursos</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="qualidade">Qualidade</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="alto">Alta</SelectItem>
                <SelectItem value="medio">Média</SelectItem>
                <SelectItem value="baixo">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="monitorando">Monitorando</SelectItem>
                <SelectItem value="mitigado">Mitigado</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Registro de Riscos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risco</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{risk.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {risk.mitigation}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(risk.category)}>
                      {risk.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getProbabilityColor(risk.probability)}>
                      {risk.probability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getImpactColor(risk.impact)}>
                      {risk.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(risk.priority)}>
                      {risk.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{risk.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(risk.status)}
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(risk.dueDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
