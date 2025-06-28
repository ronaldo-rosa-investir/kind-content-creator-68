
import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Download, Upload, Target, Calendar, Clock, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  parentId?: string;
  dependencies: string[];
  resources: string[];
  status: 'nao-iniciado' | 'em-andamento' | 'concluido' | 'atrasado';
  milestone: boolean;
  critical: boolean;
  level: number;
}

const AdvancedSchedule = () => {
  const { phases, wbsItems, teamMembers } = useProject();
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    startDate: '',
    endDate: '',
    dependencies: [] as string[],
    resources: [] as string[],
    milestone: false,
    parentId: ''
  });

  useEffect(() => {
    generateGanttFromWBS();
  }, [phases, wbsItems]);

  const generateGanttFromWBS = () => {
    const ganttTasks: GanttTask[] = [];
    let taskId = 1;

    // Gerar tarefas das fases
    phases.forEach((phase, phaseIndex) => {
      const phaseStartDate = new Date(phase.startDate);
      const phaseEndDate = new Date(phase.endDate);
      const phaseDuration = Math.ceil((phaseEndDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));

      ganttTasks.push({
        id: `phase-${phase.id}`,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        duration: phaseDuration,
        progress: getPhaseProgress(phase.id),
        dependencies: phaseIndex > 0 ? [`phase-${phases[phaseIndex - 1].id}`] : [],
        resources: [phase.responsible],
        status: phase.status as any,
        milestone: false,
        critical: isOnCriticalPath(phase.id),
        level: 0
      });

      // Gerar tarefas dos itens WBS
      const phaseWBSItems = wbsItems.filter(item => item.phaseId === phase.id);
      phaseWBSItems.forEach((item, itemIndex) => {
        const itemStartDate = new Date(phase.startDate);
        itemStartDate.setDate(itemStartDate.getDate() + item.daysAfterStart);
        
        const itemEndDate = new Date(itemStartDate);
        itemEndDate.setDate(itemEndDate.getDate() + Math.ceil(item.estimatedHours / 8));

        ganttTasks.push({
          id: `wbs-${item.id}`,
          name: `${item.code} - ${item.activity}`,
          startDate: itemStartDate.toISOString().split('T')[0],
          endDate: itemEndDate.toISOString().split('T')[0],
          duration: Math.ceil(item.estimatedHours / 8),
          progress: Math.round((item.actualHours / item.estimatedHours) * 100) || 0,
          parentId: `phase-${phase.id}`,
          dependencies: itemIndex > 0 ? [`wbs-${phaseWBSItems[itemIndex - 1].id}`] : [],
          resources: [item.responsible],
          status: item.actualHours > 0 ? 'em-andamento' : 'nao-iniciado',
          milestone: false,
          critical: isOnCriticalPath(item.id),
          level: 1
        });
      });

      // Adicionar marco de fim da fase
      ganttTasks.push({
        id: `milestone-${phase.id}`,
        name: `✓ Conclusão - ${phase.name}`,
        startDate: phase.endDate,
        endDate: phase.endDate,
        duration: 0,
        progress: phase.status === 'concluido' ? 100 : 0,
        parentId: `phase-${phase.id}`,
        dependencies: phaseWBSItems.map(item => `wbs-${item.id}`),
        resources: [],
        status: phase.status as any,
        milestone: true,
        critical: true,
        level: 1
      });
    });

    setTasks(ganttTasks);
  };

  const getPhaseProgress = (phaseId: string) => {
    const phaseWBSItems = wbsItems.filter(item => item.phaseId === phaseId);
    if (phaseWBSItems.length === 0) return 0;
    
    const totalProgress = phaseWBSItems.reduce((sum, item) => {
      return sum + (item.actualHours / item.estimatedHours) * 100;
    }, 0);
    
    return Math.round(totalProgress / phaseWBSItems.length);
  };

  const isOnCriticalPath = (id: string) => {
    // Lógica simplificada para identificar caminho crítico
    // Em uma implementação real, seria necessário um algoritmo mais complexo
    const phase = phases.find(p => p.id === id);
    const wbsItem = wbsItems.find(item => item.id === id);
    
    if (phase) {
      return phase.status === 'atrasado' || new Date(phase.endDate) < new Date();
    }
    
    if (wbsItem) {
      return wbsItem.actualHours > wbsItem.estimatedHours * 1.2;
    }
    
    return false;
  };

  const addNewTask = () => {
    const task: GanttTask = {
      id: `custom-${Date.now()}`,
      name: newTask.name,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      duration: Math.ceil((new Date(newTask.endDate).getTime() - new Date(newTask.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      progress: 0,
      parentId: newTask.parentId || undefined,
      dependencies: newTask.dependencies,
      resources: newTask.resources,
      status: 'nao-iniciado',
      milestone: newTask.milestone,
      critical: false,
      level: newTask.parentId ? 1 : 0
    };

    setTasks([...tasks, task]);
    setIsDialogOpen(false);
    setNewTask({
      name: '',
      startDate: '',
      endDate: '',
      dependencies: [],
      resources: [],
      milestone: false,
      parentId: ''
    });
    toast.success('Tarefa adicionada ao cronograma!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'em-andamento':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'atrasado':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      case 'atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateProjectMetrics = () => {
    const totalTasks = tasks.filter(t => !t.milestone).length;
    const completedTasks = tasks.filter(t => !t.milestone && t.progress === 100).length;
    const criticalTasks = tasks.filter(t => t.critical).length;
    const overallProgress = tasks.length > 0 ? 
      Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length) : 0;

    return { totalTasks, completedTasks, criticalTasks, overallProgress };
  };

  const metrics = calculateProjectMetrics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cronograma do Projeto</h1>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="taskName">Nome da Tarefa</Label>
                  <Input
                    id="taskName"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="Nome da tarefa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newTask.startDate}
                      onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newTask.endDate}
                      onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="parentTask">Tarefa Pai</Label>
                  <Select
                    value={newTask.parentId}
                    onValueChange={(value) => setNewTask({ ...newTask, parentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tarefa pai (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma (Tarefa raiz)</SelectItem>
                      {tasks.filter(t => t.level === 0).map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addNewTask} className="w-full">
                  Adicionar Tarefa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Baseline
          </Button>
        </div>
      </div>

      {/* Métricas do Projeto */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overallProgress}%</div>
            <Progress value={metrics.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedTasks}/{metrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((metrics.completedTasks / metrics.totalTasks) * 100) || 0}% completo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caminho Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalTasks}</div>
            <p className="text-xs text-muted-foreground">tarefas críticas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.milestone).length}</div>
            <p className="text-xs text-muted-foreground">marcos definidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma Detalhado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-80">Tarefa</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recursos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className={task.critical ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${task.level * 20}px` }}>
                        {task.milestone ? (
                          <Target className="h-4 w-4 text-yellow-500" />
                        ) : task.level > 0 ? (
                          <div className="w-4 h-4 border-l border-b border-gray-300"></div>
                        ) : null}
                        <span className={task.critical ? 'font-bold text-red-800' : ''}>{task.name}</span>
                        {task.critical && <Badge variant="destructive" className="text-xs">Crítico</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(task.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(task.endDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{task.milestone ? '0d' : `${task.duration}d`}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="w-16" />
                        <span className="text-sm">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {task.resources.map((resource, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Gantt Simplificado */}
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Gantt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Visualização Gráfica do Cronograma</p>
            <p className="text-sm text-gray-500">
              Esta é uma versão simplificada. Para o gráfico de Gantt completo,<br />
              considere integrar uma biblioteca especializada como Dhtmlx Gantt ou Bryntum Gantt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Caminho Crítico */}
      {metrics.criticalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Caminho Crítico - Atenção Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.filter(task => task.critical).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div>
                    <h4 className="font-medium text-red-900">{task.name}</h4>
                    <p className="text-sm text-red-700">
                      {new Date(task.startDate).toLocaleDateString('pt-BR')} - {new Date(task.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-800">{task.progress}% concluído</div>
                    <Badge variant="destructive">Crítico</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSchedule;
