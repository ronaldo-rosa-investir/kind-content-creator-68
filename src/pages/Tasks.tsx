
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, User } from "lucide-react";
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

const Tasks = () => {
  const { tasks, wbsItems, phases, addTask, updateTask } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    wbsItemId: "",
    phaseId: "",
    dueDate: "",
    responsible: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      ...formData,
      completed: false,
    });
    setFormData({
      title: "",
      wbsItemId: "",
      phaseId: "",
      dueDate: "",
      responsible: "",
      description: "",
    });
    setIsDialogOpen(false);
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
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
          const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

          return (
            <Card key={task.id} className={isOverdue ? "border-red-200" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => 
                        handleToggleTask(task.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div>
                      <CardTitle className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.responsible}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {task.completed ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Concluída
                      </Badge>
                    ) : isOverdue ? (
                      <Badge variant="destructive">
                        Atrasada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {wbsItem && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Origem EAP: </span>
                      <Link 
                        to={`/eap/${wbsItem.id}`}
                        className="font-mono text-primary hover:underline"
                      >
                        {wbsItem.code} - {wbsItem.activity}
                      </Link>
                    </div>
                  )}
                  {phase && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Fase: </span>
                      <span>{phase.name}</span>
                    </div>
                  )}
                  {task.description && (
                    <p className="text-sm mt-2">{task.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
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
