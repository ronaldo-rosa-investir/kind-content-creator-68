
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectTask, WBSSubTask } from "@/types/project";
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";

interface TaskWithSubtasksProps {
  task: ProjectTask;
  wbsItem?: any;
  phase?: any;
}

const TaskWithSubtasks = ({ task, wbsItem, phase }: TaskWithSubtasksProps) => {
  const { updateTask, deleteTask, getSubTasksByWBS, addSubTask, updateSubTask, deleteSubTask } = useProject();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<WBSSubTask | null>(null);
  const [newSubTaskDesc, setNewSubTaskDesc] = useState("");
  const [showAddSubTask, setShowAddSubTask] = useState(false);

  const subTasks = getSubTasksByWBS(task.wbsItemId);
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const handleToggleTask = (completed: boolean) => {
    updateTask(task.id, { completed });
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi removida com sucesso.",
    });
  };

  const handleAddSubTask = () => {
    if (newSubTaskDesc.trim()) {
      addSubTask({
        wbsItemId: task.wbsItemId,
        description: newSubTaskDesc,
        completed: false,
        estimatedHours: 0,
        actualHours: 0,
      });
      setNewSubTaskDesc("");
      setShowAddSubTask(false);
      toast({
        title: "Subtarefa adicionada",
        description: "A subtarefa foi criada com sucesso.",
      });
    }
  };

  const handleToggleSubTask = (subTaskId: string, completed: boolean) => {
    updateSubTask(subTaskId, { completed });
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    deleteSubTask(subTaskId);
    toast({
      title: "Subtarefa excluída",
      description: "A subtarefa foi removida com sucesso.",
    });
  };

  const handleEditSubTask = (subTask: WBSSubTask, newDescription: string) => {
    updateSubTask(subTask.id, { description: newDescription });
    setEditingSubTask(null);
    toast({
      title: "Subtarefa atualizada",
      description: "A subtarefa foi editada com sucesso.",
    });
  };

  return (
    <Card className={isOverdue ? "border-red-200" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => handleToggleTask(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.title}
                </CardTitle>
                {subTasks.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 h-6 w-6"
                  >
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {task.responsible}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                {subTasks.length > 0 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {subTasks.filter(st => st.completed).length}/{subTasks.length} subtarefas
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

          {/* Subtarefas */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Subtarefas</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSubTask(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {subTasks.map((subTask) => (
                  <div key={subTask.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Checkbox
                      checked={subTask.completed}
                      onCheckedChange={(checked) => 
                        handleToggleSubTask(subTask.id, checked as boolean)
                      }
                    />
                    {editingSubTask?.id === subTask.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingSubTask.description}
                          onChange={(e) => setEditingSubTask({ ...editingSubTask, description: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditSubTask(subTask, editingSubTask.description);
                            } else if (e.key === 'Escape') {
                              setEditingSubTask(null);
                            }
                          }}
                          className="text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleEditSubTask(subTask, editingSubTask.description)}
                        >
                          Salvar
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className={`flex-1 text-sm cursor-pointer ${
                          subTask.completed ? "line-through text-muted-foreground" : ""
                        }`}
                        onClick={() => setEditingSubTask(subTask)}
                      >
                        {subTask.description}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSubTask(subTask)}
                      className="p-1 h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Subtarefa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta subtarefa?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteSubTask(subTask.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}

                {showAddSubTask && (
                  <div className="flex gap-2 p-2 bg-blue-50 rounded">
                    <Input
                      value={newSubTaskDesc}
                      onChange={(e) => setNewSubTaskDesc(e.target.value)}
                      placeholder="Nova subtarefa..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubTask();
                        } else if (e.key === 'Escape') {
                          setShowAddSubTask(false);
                          setNewSubTaskDesc("");
                        }
                      }}
                      className="text-sm"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleAddSubTask}>
                      Adicionar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowAddSubTask(false);
                        setNewSubTaskDesc("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskWithSubtasks;
