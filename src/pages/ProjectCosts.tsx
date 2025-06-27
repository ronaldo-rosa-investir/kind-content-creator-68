
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function ProjectCosts() {
  const { projectId } = useParams();

  // Mock data para demonstração
  const costSummary = {
    totalBudget: 120000,
    totalSpent: 85000,
    remaining: 35000,
    progress: 71
  };

  const costItems = [
    {
      id: 1,
      name: "Desenvolvimento Frontend",
      category: "mao-de-obra",
      estimated: 30000,
      actual: 28500,
      responsible: "João Silva",
      phase: "Execução",
      status: "em-andamento"
    },
    {
      id: 2,
      name: "Infraestrutura Cloud",
      category: "equipamento",
      estimated: 15000,
      actual: 16200,
      responsible: "Pedro Costa",
      phase: "Execução",
      status: "acima-orcamento"
    },
    {
      id: 3,
      name: "Consultoria Externa",
      category: "consultoria",
      estimated: 25000,
      actual: 22000,
      responsible: "Maria Santos",
      phase: "Planejamento",
      status: "concluido"
    },
    {
      id: 4,
      name: "Licenças de Software",
      category: "outros",
      estimated: 8000,
      actual: 7800,
      responsible: "Ana Lima",
      phase: "Iniciação",
      status: "concluido"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mao-de-obra": return "bg-blue-100 text-blue-800";
      case "equipamento": return "bg-purple-100 text-purple-800";
      case "consultoria": return "bg-orange-100 text-orange-800";
      case "outros": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido": return "bg-green-100 text-green-800";
      case "em-andamento": return "bg-blue-100 text-blue-800";
      case "acima-orcamento": return "bg-red-100 text-red-800";
      case "planejado": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "acima-orcamento": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Custos</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {costSummary.totalBudget.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Valor aprovado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Realizado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {costSummary.totalSpent.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {costSummary.progress}% do orçamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {costSummary.remaining.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {100 - costSummary.progress}% restante
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{costSummary.progress}%</div>
            <Progress value={costSummary.progress} className="mt-2" />
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
                <SelectItem value="mao-de-obra">Mão de Obra</SelectItem>
                <SelectItem value="equipamento">Equipamentos</SelectItem>
                <SelectItem value="consultoria">Consultoria</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="iniciacao">Iniciação</SelectItem>
                <SelectItem value="planejamento">Planejamento</SelectItem>
                <SelectItem value="execucao">Execução</SelectItem>
                <SelectItem value="encerramento">Encerramento</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="planejado">Planejado</SelectItem>
                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="acima-orcamento">Acima do Orçamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Detalhamento de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item de Custo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Fase</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Orçado</TableHead>
                <TableHead>Realizado</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costItems.map((item) => {
                const variation = item.actual - item.estimated;
                const variationPercent = ((variation / item.estimated) * 100).toFixed(1);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.phase}</TableCell>
                    <TableCell>{item.responsible}</TableCell>
                    <TableCell>R$ {item.estimated.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>R$ {item.actual.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <span className={variation > 0 ? "text-red-600" : "text-green-600"}>
                        {variation > 0 ? '+' : ''}R$ {variation.toLocaleString('pt-BR')}
                        <br />
                        <span className="text-xs">({variationPercent}%)</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
