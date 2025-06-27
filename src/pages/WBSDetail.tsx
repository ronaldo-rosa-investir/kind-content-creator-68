
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const WBSDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    wbsItems,
    phases,
    updateWBSItem,
    addSubTask,
    updateSubTask,
    addTask,
    getSubTasksByWBS,
    getTasksByWBS,
    getWBSProgress
  } = useProject();

  const [item, setItem] = useState(wbsItems.find(i => i.id === id));
  const [subTasks, setSubTasks] = useState(getSubTasksByWBS(id || ""));
  const [tasks, setTasks] = useState(getTasksByWBS(id || ""));
  const [isSubTaskDialogOpen, setIsSubTaskDialogOpen] = useState(false);
  const [newSubTaskDesc, setNewSubTaskDesc] = useState("");
  const [editData, setEditData] = useState({
    notes: item?.notes || "",
    requirements: item?.requirements || "",
    risks: item?.risks || "",
  });

  useEffect(() => {
    if (id) {
      setSubTasks(getSubTasksByWBS(id));
      setTasks(getTasksByWBS(id));
    }
  }, [id, getSubTasksByWBS, getTasksByWBS]);

  const handleSaveNotes = () => {
    if (item) {
      updateWBSItem(item.id, editData);
      setItem({ ...item, ...editData });
      toast({
        title: "Salvo com sucesso",
        description: "As anotações foram atualizadas.",
      });
    }
  };

  const handleAddSubTask = () => {
    if (newSubTaskDesc && id) {
      addSubTask({
        wbsItemId: id,
        description: newSubTaskDesc,
        completed: false,
      });
      setNewSubTaskDesc("");
      setIsSubTaskDialogOpen(false);
      setSubTasks(getSubTasksByWBS(id));
    }
  };

  const handleToggleSubTask = (subTaskId: string, completed: boolean) => {
    updateSubTask(subTaskId, { completed });
    if (id) {
      setSubTasks(getSubTasksByWBS(id));
    }
  };

  const handleGenerateTask = () => {
    if (item) {
      const phase = phases.find(p => p.id === item.phaseId);
      addTask({
        title: item.activity,
        wbsItemId: item.id,
        phaseId: item.phaseId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        responsible: item.responsible,
        description: `Tarefa gerada a partir do Item EAP: ${item.code} - ${item.activity}`,
      });
      
      if (id) {
        setTasks(getTasksByWBS(id));
      }
      
      toast({
        title: "Tarefa gerada com sucesso",
        description: "Uma nova tarefa foi criada a partir deste item EAP.",
      });
    }
  };

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Item EAP não encontrado</p>
        <Link to="/eap">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para EAP
          </Button>
        </Link>
      </div>
    );
  }

  const phase = phases.find(p => p.id === item.phaseId);
  const progress = getWBSProgress(item.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/eap">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {item.code}
            </span>
            {item.activity}
          </h1>
          <p className="text-muted-foreground">
            Fase: {phase?.name} | Responsável: {item.responsible}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Propriedades do Item EAP */}
          <Card>
            <CardHeader>
              <CardTitle>Propriedades do Item EAP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Código EAP</Label>
                  <p className="font-mono">{item.code}</p>
                </div>
                <div>
                  <Label>Dias Após Início</Label>
                  <p>{item.daysAfterStart}</p>
                </div>
              </div>
              <div>
                <Label>Atividade</Label>
                <p>{item.activity}</p>
              </div>
              <div>
                <Label>Progresso</Label>
                <div className="flex items-center gap-4">
                  <Progress value={progress} className="flex-1" />
                  <span className="font-semibold">{progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anotações */}
          <Card>
            <CardHeader>
              <CardTitle>Anotações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notas Gerais</Label>
                <Textarea
                  id="notes"
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  placeholder="Adicione suas anotações aqui..."
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requisitos</Label>
                <Textarea
                  id="requirements"
                  value={editData.requirements}
                  onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
                  placeholder="Descreva os requisitos..."
                />
              </div>
              <div>
                <Label htmlFor="risks">Riscos</Label>
                <Textarea
                  id="risks"
                  value={editData.risks}
                  onChange={(e) => setEditData({ ...editData, risks: e.target.value })}
                  placeholder="Identifique os riscos..."
                />
              </div>
              <Button onClick={handleSaveNotes}>Salvar Anotações</Button>
            </CardContent>
          </Card>

          {/* Sub-Tarefas */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sub-Tarefas (Checklist)</CardTitle>
                <Dialog open={isSubTaskDialogOpen} onOpenChange={setIsSubTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Sub-Tarefa</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subTaskDesc">Descrição</Label>
                        <Input
                          id="subTaskDesc"
                          value={newSubTaskDesc}
                          onChange={(e) => setNewSubTaskDesc(e.target.value)}
                          placeholder="Descreva a sub-tarefa..."
                        />
                      </div>
                      <Button onClick={handleAddSubTask} className="w-full">
                        Adicionar Sub-Tarefa
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subTasks.map((subTask) => (
                  <div key={subTask.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={subTask.completed}
                      onCheckedChange={(checked) => 
                        handleToggleSubTask(subTask.id, checked as boolean)
                      }
                    />
                    <span className={subTask.completed ? "line-through text-muted-foreground" : ""}>
                      {subTask.description}
                    </span>
                  </div>
                ))}
                {subTasks.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma sub-tarefa criada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateTask} className="w-full">
                <Check className="h-4 w-4 mr-2" />
                Gerar Tarefa
              </Button>
            </CardContent>
          </Card>

          {/* Tarefas Geradas */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Geradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="p-2 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.completed 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {task.completed ? "Concluída" : "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma tarefa gerada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WBSDetail;
