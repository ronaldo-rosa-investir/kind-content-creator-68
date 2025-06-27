
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
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

const WBS = () => {
  const { wbsItems, phases, addWBSItem, getWBSProgress } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    activity: "",
    phaseId: "",
    daysAfterStart: 0,
    responsible: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWBSItem(formData);
    setFormData({
      code: "",
      activity: "",
      phaseId: "",
      daysAfterStart: 0,
      responsible: "",
    });
    setIsDialogOpen(false);
  };

  const getPhaseNameById = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    return phase?.name || "Fase não encontrada";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Estrutura Analítica do Projeto (EAP)</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item EAP
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Item EAP</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Código EAP</Label>
                <Input
                  id="code"
                  placeholder="ex: 1.1, 2.4"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="activity">Atividade EAP</Label>
                <Input
                  id="activity"
                  placeholder="Descrição do trabalho"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phaseId">Fase de Referência</Label>
                <Select
                  value={formData.phaseId}
                  onValueChange={(value) => setFormData({ ...formData, phaseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma fase" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="daysAfterStart">Dias Após Início</Label>
                <Input
                  id="daysAfterStart"
                  type="number"
                  min="0"
                  value={formData.daysAfterStart}
                  onChange={(e) => setFormData({ ...formData, daysAfterStart: Number(e.target.value) })}
                  required
                />
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
              <Button type="submit" className="w-full">
                Criar Item EAP
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {wbsItems.map((item) => {
          const progress = getWBSProgress(item.id);
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {item.code}
                      </span>
                      <Link
                        to={`/eap/${item.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {item.activity}
                      </Link>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Fase: {getPhaseNameById(item.phaseId)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <p className="text-lg font-semibold">{progress}%</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <span>Responsável: {item.responsible}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {item.daysAfterStart} dias após início
                      </span>
                    </div>
                    <Link to={`/eap/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {wbsItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum item EAP criado ainda</p>
          <p className="text-sm text-muted-foreground">
            Comece criando itens EAP para suas fases do projeto
          </p>
        </div>
      )}
    </div>
  );
};

export default WBS;
