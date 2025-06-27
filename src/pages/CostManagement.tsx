
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CostManagement = () => {
  const { costItems, phases, wbsItems, addCostItem, updateCostItem, deleteCostItem, getTotalProjectCost } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "mao-de-obra" as const,
    category: "",
    estimatedCost: 0,
    actualCost: 0,
    responsible: "",
    phaseId: "",
    wbsItemId: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCost) {
      updateCostItem(editingCost, formData);
    } else {
      addCostItem(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "mao-de-obra",
      category: "",
      estimatedCost: 0,
      actualCost: 0,
      responsible: "",
      phaseId: "",
      wbsItemId: "",
      description: "",
    });
    setEditingCost(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cost: any) => {
    setFormData(cost);
    setEditingCost(cost.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item de custo?")) {
      deleteCostItem(id);
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'mao-de-obra': 'Mão de Obra',
      'equipamento': 'Equipamento',
      'consultoria': 'Consultoria',
      'outros': 'Outros'
    };
    return types[type as keyof typeof types] || type;
  };

  const getPhaseNameById = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase?.name || "";
  };

  const getWBSNameById = (wbsId: string) => {
    const wbs = wbsItems.find(w => w.id === wbsId);
    return wbs ? `${wbs.code} - ${wbs.activity}` : "";
  };

  const totalCosts = getTotalProjectCost();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Custos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item de Custo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCost ? "Editar" : "Novo"} Item de Custo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Item</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Custo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mao-de-obra">Mão de Obra</SelectItem>
                    <SelectItem value="equipamento">Equipamento</SelectItem>
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedCost">Custo Estimado (R$)</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="actualCost">Custo Real (R$)</Label>
                  <Input
                    id="actualCost"
                    type="number"
                    step="0.01"
                    value={formData.actualCost}
                    onChange={(e) => setFormData({ ...formData, actualCost: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phaseId">Fase (Opcional)</Label>
                <Select
                  value={formData.phaseId}
                  onValueChange={(value) => setFormData({ ...formData, phaseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingCost ? "Atualizar" : "Criar"} Item
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Custo Estimado Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalCosts.estimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Custo Real Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              R$ {totalCosts.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              Variação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalCosts.actual > totalCosts.estimated ? 'text-red-600' : 'text-green-600'}`}>
              R$ {(totalCosts.actual - totalCosts.estimated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Items List */}
      <div className="grid gap-4">
        {costItems.map((cost) => (
          <Card key={cost.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{cost.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Responsável: {cost.responsible}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getTypeLabel(cost.type)}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cost)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(cost.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Categoria:</span>
                  <p className="font-medium">{cost.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Custo Estimado:</span>
                  <p className="font-medium text-green-600">
                    R$ {cost.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Custo Real:</span>
                  <p className="font-medium text-blue-600">
                    R$ {cost.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Variação:</span>
                  <p className={`font-medium ${cost.actualCost > cost.estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
                    R$ {(cost.actualCost - cost.estimatedCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              {cost.phaseId && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Fase: </span>
                  <span>{getPhaseNameById(cost.phaseId)}</span>
                </div>
              )}
              {cost.description && (
                <p className="mt-2 text-sm">{cost.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {costItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum item de custo criado ainda</p>
          <p className="text-sm text-muted-foreground">
            Comece adicionando os custos do seu projeto
          </p>
        </div>
      )}
    </div>
  );
};

export default CostManagement;
