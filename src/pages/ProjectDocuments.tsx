
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Search, Download, Eye, FolderOpen, File, Image, Archive } from "lucide-react";

export default function ProjectDocuments() {
  const { projectId } = useParams();

  // Mock data para demonstração
  const documents = [
    {
      id: 1,
      name: "TAP - Termo de Abertura do Projeto.pdf",
      type: "pdf",
      category: "tap",
      size: "2.5 MB",
      uploadDate: "2024-01-15",
      uploadedBy: "João Silva",
      version: "1.0",
      status: "aprovado"
    },
    {
      id: 2,
      name: "Plano de Gerenciamento do Projeto.docx",
      type: "docx",
      category: "planejamento",
      size: "1.8 MB",
      uploadDate: "2024-02-01",
      uploadedBy: "Maria Santos",
      version: "2.1",
      status: "em-revisao"
    },
    {
      id: 3,
      name: "Especificações Técnicas.pdf",
      type: "pdf",
      category: "tecnico",
      size: "3.2 MB",
      uploadDate: "2024-03-10",
      uploadedBy: "Pedro Costa",
      version: "1.5",
      status: "aprovado"
    },
    {
      id: 4,
      name: "Matriz de Riscos.xlsx",
      type: "xlsx",
      category: "riscos",
      size: "485 KB",
      uploadDate: "2024-03-15",
      uploadedBy: "Ana Lima",
      version: "1.2",
      status: "rascunho"
    },
    {
      id: 5,
      name: "Mockups da Interface.zip",
      type: "zip",
      category: "design",
      size: "15.7 MB",
      uploadDate: "2024-03-20",
      uploadedBy: "Carlos Silva",
      version: "1.0",
      status: "aprovado"
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="h-4 w-4 text-red-500" />;
      case "docx": return <File className="h-4 w-4 text-blue-500" />;
      case "xlsx": return <File className="h-4 w-4 text-green-500" />;
      case "zip": return <Archive className="h-4 w-4 text-purple-500" />;
      case "png":
      case "jpg": return <Image className="h-4 w-4 text-orange-500" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tap": return "bg-purple-100 text-purple-800";
      case "planejamento": return "bg-blue-100 text-blue-800";
      case "tecnico": return "bg-green-100 text-green-800";
      case "riscos": return "bg-red-100 text-red-800";
      case "design": return "bg-orange-100 text-orange-800";
      case "financeiro": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado": return "bg-green-100 text-green-800";
      case "em-revisao": return "bg-yellow-100 text-yellow-800";
      case "rascunho": return "bg-gray-100 text-gray-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const documentStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === "aprovado").length,
    inReview: documents.filter(d => d.status === "em-revisao").length,
    totalSize: documents.reduce((acc, doc) => {
      const size = parseFloat(doc.size.replace(/[^\d.]/g, ''));
      const unit = doc.size.includes('MB') ? size : size / 1024;
      return acc + unit;
    }, 0).toFixed(1)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos do Projeto</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Documento
        </Button>
      </div>

      {/* Estatísticas dos Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.total}</div>
            <p className="text-xs text-muted-foreground">Arquivos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <FolderOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{documentStats.approved}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
            <Eye className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{documentStats.inReview}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamanho Total</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.totalSize} MB</div>
            <p className="text-xs text-muted-foreground">Armazenados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar documentos..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="tap">TAP</SelectItem>
                <SelectItem value="planejamento">Planejamento</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="riscos">Riscos</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="em-revisao">Em Revisão</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Central de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.type.toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(doc.category)}>
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">v{doc.version}</Badge>
                  </TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>
                    {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
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
