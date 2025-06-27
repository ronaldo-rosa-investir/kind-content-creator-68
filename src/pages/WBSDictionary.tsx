
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, FileText, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WBSDictionary } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

const WBSDictionaryPage = () => {
  const { wbsDictionary, addWBSDictionary, updateWBSDictionary, deleteWBSDictionary } = useProject();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDict, setEditingDict] = useState<WBSDictionary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    wbsCode: "",
    workPackage: "",
    description: "",
    deliverables: "",
    acceptance: "",
    assumptions: "",
    constraints: "",
  });

  const resetForm = () => {
    setFormData({
      wbsCode: "",
      workPackage: "",
      description: "",
      deliverables: "",
      acceptance: "",
      assumptions: "",
      constraints: "",
    });
    setEditingDict(null);
  };

  const handleOpenDialog = (dict?: WBSDictionary) => {
    if (dict) {
      setEditingDict(dict);
      setFormData({
        wbsCode: dict.wbsCode,
        workPackage: dict.workPackage,
        description: dict.description,
        deliverables: dict.deliverables,
        acceptance: dict.acceptance,
        assumptions: dict.assumptions,
        constraints: dict.constraints,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDict) {
      updateWBSDictionary(editingDict.id, formData);
      toast({
        title: "Dicionário atualizado",
        description: "As informações do dicionário EAP foram atualizadas com sucesso.",
      });
    } else {
      addWBSDictionary(formData);
      toast({
        title: "Dicionário criado",
        description: "O novo item do dicionário EAP foi criado com sucesso.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteDict = (dictId: string) => {
    deleteWBSDictionary(dictId);
    toast({
      title: "Item removido",
      description: "O item do dicionário foi removido com sucesso.",
    });
  };

  const filteredDictionary = wbsDictionary.filter(dict =>
    dict.wbsCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dict.workPackage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dict.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dicionário EAP</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDict ? "Editar Item do Dicionário" : "Novo Item do Dicionário EAP"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wbsCode">Código EAP *</Label>
                  <Input
                    id="wbsCode"
                    value={formData.wbsCode}
                    onChange={(e) => setFormData({ ...formData, wbsCode: e.target.value })}
                    placeholder="Ex: 1.1.1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="workPackage">Pacote de Trabalho *</Label>
                  <Input
                    id="workPackage"
                    value={formData.workPackage}
                    onChange={(e) => setFormData({ ...formData, workPackage: e.target.value })}
                    placeholder="Nome do pacote de trabalho"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada do pacote de trabalho"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deliverables">Entregáveis</Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Liste os entregáveis deste pacote de trabalho"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="acceptance">Critérios de Aceitação</Label>
                <Textarea
                  id="acceptance"
                  value={formData.acceptance}
                  onChange={(e) => setFormData({ ...formData, acceptance: e.target.value })}
                  placeholder="Defina os critérios de aceitação"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="assumptions">Premissas</Label>
                <Textarea
                  id="assumptions"
                  value={formData.assumptions}
                  onChange={(e) => setFormData({ ...formData, assumptions: e.target.value })}
                  placeholder="Liste as premissas relacionadas"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="constraints">Restrições</Label>
                <Textarea
                  id="constraints"
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  placeholder="Descreva as restrições conhecidas"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingDict ? "Atualizar" : "Criar"} Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por código, pacote de trabalho ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6">
        {filteredDictionary.map((dict) => (
          <Card key={dict.id} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {dict.wbsCode}
                    </span>
                    <CardTitle className="text-xl">{dict.workPackage}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{dict.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(dict)}
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-2 text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover o item "{dict.wbsCode} - {dict.workPackage}" do dicionário? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteDict(dict.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Entregáveis</h4>
                    <p className="text-sm text-muted-foreground">
                      {dict.deliverables || "Não especificado"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Critérios de Aceitação</h4>
                    <p className="text-sm text-muted-foreground">
                      {dict.acceptance || "Não especificado"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Premissas</h4>
                    <p className="text-sm text-muted-foreground">
                      {dict.assumptions || "Não especificado"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Restrições</h4>
                    <p className="text-sm text-muted-foreground">
                      {dict.constraints || "Não especificado"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDictionary.length === 0 && wbsDictionary.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum item encontrado</p>
          <p className="text-sm text-muted-foreground">
            Tente usar termos diferentes na busca
          </p>
        </div>
      )}

      {wbsDictionary.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum item no dicionário EAP</p>
          <p className="text-sm text-muted-foreground mb-6">
            O dicionário EAP documenta todos os pacotes de trabalho do projeto
          </p>
        </div>
      )}
    </div>
  );
};

export default WBSDictionaryPage;
