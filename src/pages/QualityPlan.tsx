
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Shield, CheckCircle, Target, BarChart3, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface QualityMetric {
  id: string;
  name: string;
  description: string;
  category: 'funcional' | 'performance' | 'usabilidade' | 'confiabilidade' | 'seguranca';
  target: string;
  measurement: string;
  frequency: 'diaria' | 'semanal' | 'mensal' | 'por-entrega';
  responsible: string;
  tool: string;
  status: 'definido' | 'em-medicao' | 'atendido' | 'nao-atendido';
  currentValue?: string;
  lastMeasurement?: string;
}

interface QualityProcess {
  id: string;
  name: string;
  type: 'preventivo' | 'detectivo' | 'corretivo';
  description: string;
  steps: string[];
  deliverables: string[];
  roles: string[];
  tools: string[];
  frequency: string;
}

const QualityPlan = () => {
  const [metrics, setMetrics] = useState<QualityMetric[]>([
    {
      id: '1',
      name: 'Tempo de Resposta',
      description: 'Tempo médio de resposta das páginas web',
      category: 'performance',
      target: '< 2 segundos',
      measurement: 'Tempo médio em milissegundos',
      frequency: 'diaria',
      responsible: 'Desenvolvedor Senior',
      tool: 'Google PageSpeed Insights',
      status: 'em-medicao',
      currentValue: '1.8s',
      lastMeasurement: '2024-01-15'
    }
  ]);

  const [processes, setProcesses] = useState<QualityProcess[]>([
    {
      id: '1',
      name: 'Revisão de Código',
      type: 'preventivo',
      description: 'Processo de revisão de código antes do merge',
      steps: [
        'Desenvolvedor cria Pull Request',
        'Revisor analisa código',
        'Executa testes automatizados',
        'Aprova ou solicita alterações'
      ],
      deliverables: ['Pull Request aprovado', 'Checklist de revisão'],
      roles: ['Desenvolvedor', 'Revisor Técnico'],
      tools: ['GitHub', 'SonarQube', 'ESLint'],
      frequency: 'Para cada Pull Request'
    }
  ]);

  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<QualityMetric | null>(null);
  const [editingProcess, setEditingProcess] = useState<QualityProcess | null>(null);

  const [newMetric, setNewMetric] = useState({
    name: '',
    description: '',
    category: 'funcional' as QualityMetric['category'],
    target: '',
    measurement: '',
    frequency: 'semanal' as QualityMetric['frequency'],
    responsible: '',
    tool: ''
  });

  const [newProcess, setNewProcess] = useState({
    name: '',
    type: 'preventivo' as QualityProcess['type'],
    description: '',
    steps: [] as string[],
    deliverables: [] as string[],
    roles: [] as string[],
    tools: [] as string[],
    frequency: ''
  });

  const [newStep, setNewStep] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newTool, setNewTool] = useState('');

  const addMetric = () => {
    const metric: QualityMetric = {
      id: `metric-${Date.now()}`,
      ...newMetric,
      status: 'definido'
    };

    if (editingMetric) {
      setMetrics(metrics.map(m => m.id === editingMetric.id ? { ...editingMetric, ...newMetric } : m));
      toast.success('Métrica atualizada!');
    } else {
      setMetrics([...metrics, metric]);
      toast.success('Métrica de qualidade adicionada!');
    }

    setIsMetricDialogOpen(false);
    resetMetricForm();
  };

  const addProcess = () => {
    const process: QualityProcess = {
      id: `process-${Date.now()}`,
      ...newProcess
    };

    if (editingProcess) {
      setProcesses(processes.map(p => p.id === editingProcess.id ? { ...editingProcess, ...newProcess } : p));
      toast.success('Processo atualizado!');
    } else {
      setProcesses([...processes, process]);
      toast.success('Processo de qualidade adicionado!');
    }

    setIsProcessDialogOpen(false);
    resetProcessForm();
  };

  const resetMetricForm = () => {
    setNewMetric({
      name: '',
      description: '',
      category: 'funcional',
      target: '',
      measurement: '',
      frequency: 'semanal',
      responsible: '',
      tool: ''
    });
    setEditingMetric(null);
  };

  const resetProcessForm = () => {
    setNewProcess({
      name: '',
      type: 'preventivo',
      description: '',
      steps: [],
      deliverables: [],
      roles: [],
      tools: [],
      frequency: ''
    });
    setEditingProcess(null);
    setNewStep('');
    setNewDeliverable('');
    setNewRole('');
    setNewTool('');
  };

  const handleEditMetric = (metric: QualityMetric) => {
    setEditingMetric(metric);
    setNewMetric({
      name: metric.name,
      description: metric.description,
      category: metric.category,
      target: metric.target,
      measurement: metric.measurement,
      frequency: metric.frequency,
      responsible: metric.responsible,
      tool: metric.tool
    });
    setIsMetricDialogOpen(true);
  };

  const handleEditProcess = (process: QualityProcess) => {
    setEditingProcess(process);
    setNewProcess({
      name: process.name,
      type: process.type,
      description: process.description,
      steps: [...process.steps],
      deliverables: [...process.deliverables],
      roles: [...process.roles],
      tools: [...process.tools],
      frequency: process.frequency
    });
    setIsProcessDialogOpen(true);
  };

  const deleteMetric = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta métrica?')) {
      setMetrics(metrics.filter(m => m.id !== id));
      toast.success('Métrica removida!');
    }
  };

  const deleteProcess = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este processo?')) {
      setProcesses(processes.filter(p => p.id !== id));
      toast.success('Processo removido!');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'funcional': 'bg-blue-100 text-blue-800',
      'performance': 'bg-green-100 text-green-800',
      'usabilidade': 'bg-purple-100 text-purple-800',
      'confiabilidade': 'bg-orange-100 text-orange-800',
      'seguranca': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'definido': 'bg-gray-100 text-gray-800',
      'em-medicao': 'bg-blue-100 text-blue-800',
      'atendido': 'bg-green-100 text-green-800',
      'nao-atendido': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'preventivo': 'bg-green-100 text-green-800',
      'detectivo': 'bg-yellow-100 text-yellow-800',
      'corretivo': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors];
  };

  const addToList = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<any>>, field: string) => {
    if (item.trim()) {
      setter((prev: any) => ({
        ...prev,
        [field]: [...prev[field], item.trim()]
      }));
    }
  };

  const removeFromList = (index: number, setter: React.Dispatch<React.SetStateAction<any>>, field: string) => {
    setter((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const getQualityStatistics = () => {
    const totalMetrics = metrics.length;
    const metricsOk = metrics.filter(m => m.status === 'atendido').length;
    const metricsNotOk = metrics.filter(m => m.status === 'nao-atendido').length;
    const totalProcesses = processes.length;

    return { totalMetrics, metricsOk, metricsNotOk, totalProcesses };
  };

  const stats = getQualityStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plano de Gestão da Qualidade</h1>
        <div className="flex gap-2">
          <Dialog open={isMetricDialogOpen} onOpenChange={setIsMetricDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetMetricForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Métrica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMetric ? 'Editar Métrica' : 'Adicionar Nova Métrica de Qualidade'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="metricName">Nome da Métrica</Label>
                  <Input
                    id="metricName"
                    value={newMetric.name}
                    onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                    placeholder="Ex: Tempo de Resposta"
                  />
                </div>

                <div>
                  <Label htmlFor="metricDescription">Descrição</Label>
                  <Textarea
                    id="metricDescription"
                    value={newMetric.description}
                    onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
                    placeholder="Descreva a métrica de qualidade..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={newMetric.category}
                      onValueChange={(value: QualityMetric['category']) => setNewMetric({ ...newMetric, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="funcional">Funcional</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="usabilidade">Usabilidade</SelectItem>
                        <SelectItem value="confiabilidade">Confiabilidade</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select
                      value={newMetric.frequency}
                      onValueChange={(value: QualityMetric['frequency']) => setNewMetric({ ...newMetric, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diaria">Diária</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="por-entrega">Por Entrega</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target">Meta/Objetivo</Label>
                    <Input
                      id="target"
                      value={newMetric.target}
                      onChange={(e) => setNewMetric({ ...newMetric, target: e.target.value })}
                      placeholder="Ex: < 2 segundos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="measurement">Forma de Medição</Label>
                    <Input
                      id="measurement"
                      value={newMetric.measurement}
                      onChange={(e) => setNewMetric({ ...newMetric, measurement: e.target.value })}
                      placeholder="Ex: Tempo médio em ms"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsible">Responsável</Label>
                    <Input
                      id="responsible"
                      value={newMetric.responsible}
                      onChange={(e) => setNewMetric({ ...newMetric, responsible: e.target.value })}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tool">Ferramenta de Medição</Label>
                    <Input
                      id="tool"
                      value={newMetric.tool}
                      onChange={(e) => setNewMetric({ ...newMetric, tool: e.target.value })}
                      placeholder="Ex: Google Analytics"
                    />
                  </div>
                </div>

                <Button onClick={addMetric} className="w-full">
                  {editingMetric ? 'Atualizar Métrica' : 'Adicionar Métrica'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetProcessForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProcess ? 'Editar Processo' : 'Adicionar Novo Processo de Qualidade'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="processName">Nome do Processo</Label>
                    <Input
                      id="processName"
                      value={newProcess.name}
                      onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                      placeholder="Ex: Revisão de Código"
                    />
                  </div>
                  <div>
                    <Label htmlFor="processType">Tipo</Label>
                    <Select
                      value={newProcess.type}
                      onValueChange={(value: QualityProcess['type']) => setNewProcess({ ...newProcess, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventivo">Preventivo</SelectItem>
                        <SelectItem value="detectivo">Detectivo</SelectItem>
                        <SelectItem value="corretivo">Corretivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="processDescription">Descrição</Label>
                  <Textarea
                    id="processDescription"
                    value={newProcess.description}
                    onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
                    placeholder="Descreva o processo de qualidade..."
                  />
                </div>

                {/* Steps */}
                <div>
                  <Label>Passos do Processo</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      placeholder="Adicionar passo..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToList(newStep, newProcess.steps, setNewProcess, 'steps');
                          setNewStep('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addToList(newStep, newProcess.steps, setNewProcess, 'steps');
                        setNewStep('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {newProcess.steps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{index + 1}. {step}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromList(index, setNewProcess, 'steps')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={addProcess} className="w-full">
                  {editingProcess ? 'Atualizar Processo' : 'Adicionar Processo'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métricas Definidas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMetrics}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métricas OK</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.metricsOk}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fora do Target</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.metricsNotOk}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcesses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Qualidade */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Valor Atual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{metric.name}</div>
                        <div className="text-sm text-muted-foreground">{metric.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(metric.category)}>
                        {metric.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{metric.target}</TableCell>
                    <TableCell>
                      {metric.currentValue || '-'}
                      {metric.lastMeasurement && (
                        <div className="text-xs text-muted-foreground">
                          Última medição: {new Date(metric.lastMeasurement).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{metric.responsible}</TableCell>
                    <TableCell>{metric.frequency}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditMetric(metric)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMetric(metric.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Processos de Qualidade */}
      <Card>
        <CardHeader>
          <CardTitle>Processos de Qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processes.map((process) => (
              <div key={process.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{process.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{process.description}</p>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(process.type)}>
                        {process.type}
                      </Badge>
                      <Badge variant="outline">
                        {process.frequency}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProcess(process)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProcess(process.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Passos do Processo:</h4>
                    <ol className="text-sm space-y-1">
                      {process.steps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Entregas:</h4>
                    <ul className="text-sm space-y-1">
                      {process.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-green-500">•</span>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(process.roles.length > 0 || process.tools.length > 0) && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-4">
                      {process.roles.length > 0 && (
                        <div>
                          <span className="text-sm font-medium mr-2">Papéis:</span>
                          {process.roles.map((role, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {process.tools.length > 0 && (
                        <div>
                          <span className="text-sm font-medium mr-2">Ferramentas:</span>
                          {process.tools.map((tool, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityPlan;
