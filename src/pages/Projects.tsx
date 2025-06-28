
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { projects, openProject, deleteProject, setCurrentView } = useProject();
  const { toast } = useToast();

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

  const handleProjectClick = (project: any) => {
    console.log('Opening project:', project.name);
    openProject(project);
    setCurrentView('project-dashboard');
  };

  const handleNewProject = () => {
    console.log('New project button clicked');
    toast({
      title: "Novo Projeto",
      description: "Funcionalidade de criar novo projeto será implementada em breve.",
    });
  };

  const handleEditProject = (project: any) => {
    console.log('Edit project:', project.name);
    toast({
      title: "Editar Projeto",
      description: `Funcionalidade de editar "${project.name}" será implementada em breve.`,
    });
  };

  const handleDeleteProject = (project: any) => {
    console.log('Delete project:', project.name);
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      if (deleteProject) {
        deleteProject(project.id);
        toast({
          title: "Projeto Excluído",
          description: `O projeto "${project.name}" foi excluído com sucesso.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Função de exclusão não está disponível.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
        <Button onClick={handleNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
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
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">
                {projects.length === 0 ? 'Nenhum projeto encontrado' : 'Nenhum projeto corresponde aos filtros'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {projects.length === 0 
                  ? 'Comece criando seu primeiro projeto para organizar seu trabalho'
                  : 'Tente ajustar os filtros para encontrar o projeto desejado'
                }
              </p>
              {projects.length === 0 && (
                <Button onClick={handleNewProject} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </div>
          ) : (
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
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-left"
                        onClick={() => handleProjectClick(project)}
                      >
                        {project.name}
                      </Button>
                    </TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          title="Editar projeto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteProject(project)}
                          title="Excluir projeto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
