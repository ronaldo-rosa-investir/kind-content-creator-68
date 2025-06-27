import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Plus, Check, Clock, User, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const WBSDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wbsItems, phases, getSubTasksByWBS, addSubTask, updateSubTask, deleteSubTask, addTask, getTasksByWBS, getWBSProgress } = useProject();
  
  const [isSubTaskDialogOpen, setIsSubTaskDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState(null);
  const [subTaskForm, setSubTaskForm] = useState({
    description: '',
    estimatedHours: 0,
    actualHours: 0
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    dueDate: '',
    responsible: '',
    description: ''
  });

  const wbsItem = wbsItems.find(item => item.id === id);
  const phase = phases.find(p => p.id === wbsItem?.phaseId);
  const subTasks = getSubTasksByWBS(id);
  const tasks = getTasksByWBS(id);
  const progress = getWBSProgress(id);

  if (!wbsItem) {
    return (
      <div className="p-6">
        <p>Item EAP não encontrado.</p>
        <Link to="/eap">
          <Button variant="outline">Voltar para EAP</Button>
        </Link>
      </div>
    );
  }

  const handleSubTaskSubmit = (e) => {
    e.preventDefault();
    if (editingSubTask) {
      updateSubTask(editingSubTask.id, {
        description: subTaskForm.description,
        estimatedHours: subTaskForm.estimatedHours,
        actualHours: subTaskForm.actualHours
      });
      toast.success('Sub-tarefa atualizada!');
    } else {
      addSubTask({
        wbsItemId: id,
        description: subTaskForm.description,
        completed: false,
        estimatedHours: subTaskForm.estimatedHours,
        actualHours: subTaskForm.actualHours
      });
      toast.success('Sub-tarefa criada!');
    }
    setIsSubTaskDialogOpen(false);
    resetSubTaskForm();
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    addTask({
      title: taskForm.title,
      wbsItemId: id,
      phaseId: wbsItem.phaseId,
      dueDate: taskForm.dueDate,
      completed: false,
      responsible: taskForm.responsible,
      description: taskForm.description,
      status: 'nao-iniciado',
      estimatedHours: 8,
      actualHours: 0,
      hourlyRate: 100
    });
    toast.success('Tarefa criada!');
    setIsTaskDialogOpen(false);
    resetTaskForm();
  };

  const resetSubTaskForm = () => {
    setSubTaskForm({
      description: '',
      estimatedHours: 0,
      actualHours: 0
    });
    setEditingSubTask(null);
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      dueDate: '',
      responsible: '',
      description: ''
    });
  };

  const handleEditSubTask = (subTask) => {
    setEditingSubTask(subTask);
    setSubTaskForm({
      description: subTask.description,
      estimatedHours: subTask.estimatedHours,
      actualHours: subTask.actualHours
    });
    setIsSubTaskDialogOpen(true);
  };

  const handleDeleteSubTask = (id) => {
    if (confirm('Tem certeza que deseja deletar esta sub-tarefa?')) {
      deleteSubTask(id);
      toast.success('Sub-tarefa deletada!');
    }
  };

  const toggleSubTaskCompletion = (subTask) => {
    updateSubTask(subTask.id, { completed: !subTask.completed });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h2 className="text-2xl font-semibold">Detalhes do Item EAP</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Item EAP</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Código</Label>
            <Input type="text" value={wbsItem.code} readOnly />
          </div>
          <div>
            <Label>Atividade</Label>
            <Input type="text" value={wbsItem.activity} readOnly />
          </div>
          <div>
            <Label>Fase</Label>
            <Input type="text" value={phase?.name} readOnly />
          </div>
          <div>
            <Label>Responsável</Label>
            <Input type="text" value={wbsItem.responsible} readOnly />
          </div>
          <div>
            <Label>Progresso</Label>
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">{progress}% Completo</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Sub-tarefas</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Adicionar Sub-tarefa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSubTask ? 'Editar Sub-tarefa' : 'Adicionar Sub-tarefa'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubTaskSubmit} className="grid gap-4">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={subTaskForm.description}
                    onChange={(e) => setSubTaskForm({ ...subTaskForm, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                  <Input
                    type="number"
                    id="estimatedHours"
                    value={subTaskForm.estimatedHours}
                    onChange={(e) => setSubTaskForm({ ...subTaskForm, estimatedHours: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="actualHours">Horas Reais</Label>
                  <Input
                    type="number"
                    id="actualHours"
                    value={subTaskForm.actualHours}
                    onChange={(e) => setSubTaskForm({ ...subTaskForm, actualHours: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit">{editingSubTask ? 'Atualizar' : 'Salvar'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {subTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {subTasks.map(subTask => (
                <li key={subTask.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Check
                      className={`h-5 w-5 cursor-pointer ${subTask.completed ? 'text-green-500' : 'text-gray-400'}`}
                      onClick={() => toggleSubTaskCompletion(subTask)}
                    />
                    <span>{subTask.description}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditSubTask(subTask)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSubTask(subTask.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma sub-tarefa adicionada.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Tarefas</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Adicionar Tarefa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Tarefa</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTaskSubmit} className="grid gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    type="text"
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Data de Entrega</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    type="text"
                    id="responsible"
                    value={taskForm.responsible}
                    onChange={(e) => setTaskForm({ ...taskForm, responsible: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </div>
                <Button type="submit">Salvar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tasks.map(task => (
                <li key={task.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span>{task.title}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entrega: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma tarefa adicionada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WBSDetail;
