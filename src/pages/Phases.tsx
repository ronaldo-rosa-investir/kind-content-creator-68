
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
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
import { ProjectPhase } from "@/types/project";

const Phases = () => {
  const { phases, addPhase, addWBSItem } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "planejamento" as ProjectPhase['status'],
    responsible: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPhase(formData);
    setFormData({
      name: "",
      status: "planejamento",
      responsible: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsDialogOpen(false);
  };

  const handleAddWBSItem = (phaseId: string) => {
    const phaseWBSItems = phases.find(p => p.id === phaseId);
    const nextCode = `${phases.findIndex(p => p.id === phaseId) + 1}.1`;
    
    addWBSItem({
      code: nextCode,
      activity: "Nova Atividade EAP",
      phaseId,
      daysAfterStart: 0,
      responsible: "",
    });
  };

  const getStatusBadge = (status: ProjectPhase['status']) => {
    const statusConfig = {
      planejamento: { label: "Planejamento", variant: "secondary" as const },
      "em-andamento": { label: "Em Andamento", variant: "default" as const },
      concluida: { label: "Concluída", variant: "outline" as const },
      cancelada: { label: "Cancelada", variant: "destructive" as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fases do Projeto</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Fase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Fase do Projeto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Fase</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ProjectPhase['status']) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Fase
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {phases.map((phase) => (
          <Card key={phase.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{phase.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Responsável: {phase.responsible}
                  </p>
                </div>
                {getStatusBadge(phase.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleAddWBSItem(phase.id)}
                >
                  Adicionar Item EAP à Fase
                </Button>
              </div>
              {phase.description && (
                <p className="mt-2 text-sm">{phase.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {phases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma fase criada ainda</p>
          <p className="text-sm text-muted-foreground">
            Comece criando as fases do seu projeto baseadas no ciclo PMBOK
          </p>
        </div>
      )}
    </div>
  );
};

export default Phases;
