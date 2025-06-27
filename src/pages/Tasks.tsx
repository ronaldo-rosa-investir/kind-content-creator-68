
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import TaskWithSubtasks from "@/components/TaskWithSubtasks";
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

const Tasks = () => {
  const { tasks, wbsItems, phases, addTask } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    wbsItemId: "",
    phaseId: "",
    dueDate: "",
    responsible: "",
    description: "",
    estimatedHours: 0,
    actualHours: 0,
    hourlyRate: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...formData,
      completed: false,
      status: 'nao-iniciado' as const,
    });
    setFormData({
      title: "",
      wbsItemId: "",
      phaseId: "",
      dueDate: "",
      responsible: "",
      description: "",
      estimatedHours: 0,
      actualHours: 0,
      hourlyRate: 0,
    });
    setIsDialogOpen(false);
  };

  const getWBSItemById = (wbsItemId: string) => {
    return wbsItems.find(item => item.id === wbsItemId);
  };

  const getPhaseById = (phaseId: string) => {
    return phases.find(phase => phase.id === phaseId);
  };

  const availableWBSItems = wbsItems.filter(item => item.phaseId === formData.phaseId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tarefas do Projeto</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Tarefa</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phaseId">Fase do Projeto</Label>
                <Select
                  value={formData.phaseId}
                  onValueChange={(value) => setFormData({ ...formData, phaseId: value, wbsItemId: "" })}
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
                <Label htmlFor="wbsItemId">Item EAP de Origem</Label>
                <Select
                  value={formData.wbsItemId}
                  onValueChange={(value) => setFormData({ ...formData, wbsItemId: value })}
                  disabled={!formData.phaseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um item EAP" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWBSItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.code} - {item.activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Valor/Hora (R$)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Criar Tarefa
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const wbsItem = getWBSItemById(task.wbsItemId);
          const phase = getPhaseById(task.phaseId);

          return (
            <TaskWithSubtasks
              key={task.id}
              task={task}
              wbsItem={wbsItem}
              phase={phase}
            />
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma tarefa criada ainda</p>
          <p className="text-sm text-muted-foreground">
            Comece criando tarefas manualmente ou gerando a partir dos itens EAP
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
