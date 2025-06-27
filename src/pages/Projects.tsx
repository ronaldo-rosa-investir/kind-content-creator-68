
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Mock data para demonstração
  const projects = [
    {
      id: 1,
      name: "Sistema ERP Corporativo",
      client: "Empresa ABC Ltda",
      status: "Em Andamento",
      startDate: "2024-01-15",
      endDate: "2024-08-15",
      budget: 120000,
      progress: 75,
      manager: "João Silva"
    },
    {
      id: 2,
      name: "Aplicativo Mobile E-commerce",
      client: "Tech Solutions Inc",
      status: "Planejamento",
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      budget: 80000,
      progress: 25,
      manager: "Maria Santos"
    },
    {
      id: 3,
      name: "Migração para Cloud AWS",
      client: "StartUp Inovadora",
      status: "Em Andamento",
      startDate: "2024-02-10",
      endDate: "2024-07-20",
      budget: 200000,
      progress: 60,
      manager: "Pedro Costa"
    },
    {
      id: 4,
      name: "Portal do Cliente",
      client: "Empresa ABC Ltda",
      status: "Concluído",
      startDate: "2024-01-01",
      endDate: "2024-06-15",
      budget: 95000,
      progress: 100,
      manager: "Ana Oliveira"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-blue-100 text-blue-800";
      case "Planejamento": return "bg-yellow-100 text-yellow-800";
      case "Concluído": return "bg-green-100 text-green-800";
      case "Pausado": return "bg-gray-100 text-gray-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
        <Button asChild>
          <Link to="/projetos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome do projeto ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Planejamento">Planejamento</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Projetos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Projetos ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gerente</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.manager}</TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>R$ {project.budget.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{project.progress}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
