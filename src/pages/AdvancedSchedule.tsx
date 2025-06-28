import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InteractiveGantt } from '@/components/InteractiveGantt';
import { EVMDashboard } from '@/components/EVMDashboard';
import { GanttTask, GanttSettings, BaselineSnapshot } from '@/types/gantt';
import { EVMCalculator } from '@/utils/evmCalculations';
import { CPMCalculator } from '@/utils/cpmCalculations';
import { BaselineManager } from '@/utils/baselineManager';
import { 
  Calendar, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  Save, 
  History,
  Download,
  TrendingUp,
  Settings,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

const AdvancedSchedule = () => {
  const { phases, wbsItems, teamMembers, activeProject } = useProject();
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [ganttSettings, setGanttSettings] = useState<GanttSettings>({
    scale: 'week',
    showCriticalPath: true,
    showDependencies: true,
    allowDragDrop: true,
    showProgress: true
  });

  // Estados para análises avançadas
  const [cpmResult, setCpmResult] = useState<any>(null);
  const [evmMetrics, setEvmMetrics] = useState<any>(null);
  const [varianceReport, setVarianceReport] = useState<any[]>([]);
  const [projectCompletion, setProjectCompletion] = useState<any>(null);
  const [activeBaseline, setActiveBaseline] = useState<BaselineSnapshot | null>(null);
  const [baselineComparison, setBaselineComparison] = useState<any>(null);
  const [monteCarloResults, setMonteCarloResults] = useState<any>(null);
  const [resourceOptimization, setResourceOptimization] = useState<any>(null);

  useEffect(() => {
    generateAdvancedGanttFromWBS();
  }, [phases, wbsItems]);

  useEffect(() => {
    if (tasks.length > 0) {
      performAdvancedCalculations();
    }
  }, [tasks]);

  const generateAdvancedGanttFromWBS = () => {
    const ganttTasks: GanttTask[] = [];

    phases.forEach((phase, phaseIndex) => {
      const phaseStartDate = new Date(phase.startDate);
      const phaseEndDate = new Date(phase.endDate);
      const phaseDuration = Math.ceil((phaseEndDate.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));

      // Calcular custos e valores agregados
      const phaseCost = phase.estimatedCost || 0;
      const phaseActualCost = phase.actualCost || 0;
      const phaseProgress = getPhaseProgress(phase.id);
      const phaseEarnedValue = (phaseCost * phaseProgress) / 100;
      const phasePlannedValue = calculatePlannedValue(phaseStartDate, phaseEndDate, phaseCost);

      let phaseStatus: 'nao-iniciado' | 'em-andamento' | 'concluido' | 'atrasado' = 'nao-iniciado';
      const today = new Date();
      
      if (phase.status === 'concluido') {
        phaseStatus = 'concluido';
      } else if (phaseEndDate < today && phaseProgress < 100) {
        phaseStatus = 'atrasado';
      } else if (phaseProgress > 0) {
        phaseStatus = 'em-andamento';
      }

      ganttTasks.push({
        id: `phase-${phase.id}`,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        duration: phaseDuration,
        progress: phaseProgress,
        dependencies: phaseIndex > 0 ? [`phase-${phases[phaseIndex - 1].id}`] : [],
        resources: [phase.responsible],
        status: phaseStatus,
        milestone: false,
        critical: false, // Será calculado pelo CPM
        level: 0,
        cost: phaseCost,
        actualCost: phaseActualCost,
        earnedValue: phaseEarnedValue,
        plannedValue: phasePlannedValue
      });

      // Gerar tarefas WBS com cálculos EVM
      const phaseWBSItems = wbsItems.filter(item => item.phaseId === phase.id);
      phaseWBSItems.forEach((item, itemIndex) => {
        const itemStartDate = new Date(phase.startDate);
        itemStartDate.setDate(itemStartDate.getDate() + item.daysAfterStart);
        
        const itemEndDate = new Date(itemStartDate);
        itemEndDate.setDate(itemEndDate.getDate() + Math.ceil(item.estimatedHours / 8));

        const itemProgress = Math.round((item.actualHours / item.estimatedHours) * 100) || 0;
        const itemCost = item.estimatedCost || 0;
        const itemActualCost = item.actualCost || 0;
        const itemEarnedValue = (itemCost * itemProgress) / 100;
        const itemPlannedValue = calculatePlannedValue(itemStartDate, itemEndDate, itemCost);

        let itemStatus: 'nao-iniciado' | 'em-andamento' | 'concluido' | 'atrasado' = 'nao-iniciado';
        
        if (itemProgress >= 100) {
          itemStatus = 'concluido';
        } else if (itemEndDate < today && itemProgress < 100) {
          itemStatus = 'atrasado';
        } else if (item.actualHours > 0) {
          itemStatus = 'em-andamento';
        }

        ganttTasks.push({
          id: `wbs-${item.id}`,
          name: `${item.code} - ${item.activity}`,
          startDate: itemStartDate.toISOString().split('T')[0],
          endDate: itemEndDate.toISOString().split('T')[0],
          duration: Math.ceil(item.estimatedHours / 8),
          progress: itemProgress,
          parentId: `phase-${phase.id}`,
          dependencies: itemIndex > 0 ? [`wbs-${phaseWBSItems[itemIndex - 1].id}`] : [],
          resources: [item.responsible],
          status: itemStatus,
          milestone: false,
          critical: false,
          level: 1,
          cost: itemCost,
          actualCost: itemActualCost,
          earnedValue: itemEarnedValue,
          plannedValue: itemPlannedValue
        });
      });

      // Marco de conclusão da fase
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
        status: phase.status === 'concluido' ? 'concluido' : 'nao-iniciado',
        milestone: true,
        critical: true,
        level: 1,
        cost: 0,
        actualCost: 0,
        earnedValue: phase.status === 'concluido' ? 100 : 0,
        plannedValue: 100
      });
    });

    setTasks(ganttTasks);
  };

  const calculatePlannedValue = (startDate: Date, endDate: Date, totalCost: number): number => {
    const today = new Date();
    if (today < startDate) return 0;
    if (today >= endDate) return totalCost;
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();
    return (totalCost * elapsedDuration) / totalDuration;
  };

  const performAdvancedCalculations = async () => {
    try {
      // Cálculo do Caminho Crítico (CPM)
      const cpmResults = CPMCalculator.calculateCriticalPath(tasks);
      setCpmResult(cpmResults);

      // Atualizar tarefas com informação do caminho crítico
      const updatedTasks = tasks.map(task => ({
        ...task,
        critical: cpmResults.criticalPath.includes(task.id)
      }));
      setTasks(updatedTasks);

      // Cálculos EVM
      const evmResults = EVMCalculator.calculateEVMMetrics(updatedTasks);
      setEvmMetrics(evmResults);

      // Relatório de Variância
      const varianceResults = EVMCalculator.generateVarianceReport(updatedTasks);
      setVarianceReport(varianceResults);

      // Previsões do Projeto
      const completionResults = EVMCalculator.predictProjectCompletion(evmResults);
      setProjectCompletion(completionResults);

      // Simulação Monte Carlo
      const monteCarloResults = CPMCalculator.runMonteCarloSimulation(updatedTasks, 1000);
      setMonteCarloResults(monteCarloResults);

      // Otimização de Recursos
      const resourceResults = CPMCalculator.optimizeResourceLeveling(updatedTasks);
      setResourceOptimization(resourceResults);

      // Verificar baseline ativo
      if (activeProject) {
        const baseline = BaselineManager.getActiveBaseline(activeProject.id.toString());
        setActiveBaseline(baseline);

        if (baseline) {
          const comparison = BaselineManager.compareWithBaseline(updatedTasks, baseline.tasks);
          setBaselineComparison(comparison);
        }
      }

      toast.success('Análises avançadas concluídas!');
    } catch (error) {
      console.error('Erro nos cálculos avançados:', error);
      toast.error('Erro ao realizar análises avançadas');
    }
  };

  const getPhaseProgress = (phaseId: string) => {
    const phaseWBSItems = wbsItems.filter(item => item.phaseId === phaseId);
    if (phaseWBSItems.length === 0) return 0;
    
    const totalProgress = phaseWBSItems.reduce((sum, item) => {
      return sum + (item.actualHours / item.estimatedHours) * 100;
    }, 0);
    
    return Math.round(totalProgress / phaseWBSItems.length);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<GanttTask>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    toast.success('Tarefa atualizada!');
  };

  const handleSaveBaseline = () => {
    if (!activeProject) return;

    const totalBudget = tasks.reduce((sum, task) => sum + (task.cost || 0), 0);
    
    BaselineManager.saveBaseline(
      activeProject.id.toString(),
      `Baseline ${new Date().toLocaleDateString('pt-BR')}`,
      'Baseline criado automaticamente',
      tasks,
      totalBudget,
      activeProject.manager
    );

    toast.success('Baseline salvo com sucesso!');
    
    // Recarregar baseline
    const newBaseline = BaselineManager.getActiveBaseline(activeProject.id.toString());
    setActiveBaseline(newBaseline);
  };

  const criticalPath = cpmResult?.criticalPath || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cronograma Avançado</h1>
        <div className="flex gap-2">
          <Button onClick={handleSaveBaseline} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Salvar Baseline
          </Button>
          <Button variant="outline" onClick={() => performAdvancedCalculations()}>
            <Database className="h-4 w-4 mr-2" />
            Recalcular
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Status do Baseline */}
      {activeBaseline && (
        <Alert>
          <History className="h-4 w-4" />
          <AlertDescription>
            <div className="flex justify-between items-center">
              <div>
                <strong>Baseline Ativo:</strong> {activeBaseline.name} - {activeBaseline.version}
                <br />
                <small>Criado em {new Date(activeBaseline.createdAt).toLocaleDateString('pt-BR')} por {activeBaseline.createdBy}</small>
              </div>
              {baselineComparison && (
                <Badge 
                  className={
                    baselineComparison.overallHealth === 'green' ? 'bg-green-100 text-green-800' :
                    baselineComparison.overallHealth === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  Saúde: {baselineComparison.overallHealth === 'green' ? 'Boa' : baselineComparison.overallHealth === 'yellow' ? 'Atenção' : 'Crítica'}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="gantt" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="gantt" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Gantt
          </TabsTrigger>
          <TabsTrigger value="evm" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            EVM
          </TabsTrigger>
          <TabsTrigger value="critical" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Caminho Crítico
          </TabsTrigger>
          <TabsTrigger value="monte-carlo" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Monte Carlo
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Recursos
          </TabsTrigger>
          <TabsTrigger value="baseline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Baseline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gantt" className="space-y-4">
          <InteractiveGantt
            tasks={tasks}
            settings={ganttSettings}
            onSettingsChange={setGanttSettings}
            onTaskUpdate={handleTaskUpdate}
            criticalPath={criticalPath}
          />
        </TabsContent>

        <TabsContent value="evm" className="space-y-4">
          {evmMetrics && varianceReport && projectCompletion ? (
            <EVMDashboard
              evmMetrics={evmMetrics}
              varianceReport={varianceReport}
              projectCompletion={projectCompletion}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Carregando análises EVM...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          {cpmResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Target className="h-5 w-5" />
                  Análise do Caminho Crítico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{cpmResult.criticalPath.length}</div>
                    <p className="text-sm text-muted-foreground">Tarefas Críticas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{cpmResult.totalProjectDuration}</div>
                    <p className="text-sm text-muted-foreground">Duração Total (dias)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Object.values(cpmResult.float).filter((f: any) => f > 0).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Tarefas com Folga</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.filter(task => cpmResult.criticalPath.includes(task.id)).map((task) => (
                    <div key={task.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-red-900">{task.name}</h4>
                          <p className="text-sm text-red-700">
                            {new Date(task.startDate).toLocaleDateString('pt-BR')} - {new Date(task.endDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-red-800">Folga: {cpmResult.float[task.id] || 0} dias</div>
                          <Badge variant="destructive">Crítico</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Calculando caminho crítico...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monte-carlo" className="space-y-4">
          {monteCarloResults ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Análise de Monte Carlo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(monteCarloResults.meanDuration)}</div>
                    <p className="text-sm text-muted-foreground">Duração Média</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(monteCarloResults.percentiles.P10)}</div>
                    <p className="text-sm text-muted-foreground">P10 (dias)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(monteCarloResults.percentiles.P50)}</div>
                    <p className="text-sm text-muted-foreground">P50 (dias)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(monteCarloResults.percentiles.P90)}</div>
                    <p className="text-sm text-muted-foreground">P90 (dias)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(monteCarloResults.standardDeviation)}</div>
                    <p className="text-sm text-muted-foreground">Desvio Padrão</p>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <p><strong>Interpretação:</strong></p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>P10: 10% de chance do projeto terminar em até {Math.round(monteCarloResults.percentiles.P10)} dias</li>
                      <li>P50: 50% de chance do projeto terminar em até {Math.round(monteCarloResults.percentiles.P50)} dias (mediana)</li>
                      <li>P90: 90% de chance do projeto terminar em até {Math.round(monteCarloResults.percentiles.P90)} dias</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Executando simulação Monte Carlo...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          {resourceOptimization ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Otimização de Recursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resourceOptimization.recommendations.length > 0 && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Recomendações:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {resourceOptimization.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {Object.entries(resourceOptimization.resourceUtilization).map(([resource, utilization]: [string, any]) => (
                    <div key={resource} className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">{resource}</h4>
                      <div className="grid grid-cols-7 gap-1">
                        {Object.entries(utilization).slice(0, 14).map(([date, usage]: [string, any]) => (
                          <div key={date} className="text-center">
                            <div className="text-xs text-gray-500">{new Date(date).getDate()}</div>
                            <div 
                              className={`h-6 rounded ${usage > 100 ? 'bg-red-500' : usage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ opacity: Math.min(usage / 100, 1) }}
                            />
                            <div className="text-xs">{Math.round(usage)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Analisando utilização de recursos...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="baseline" className="space-y-4">
          {baselineComparison ? (
            <div className="space-y-4">
              {/* Métricas de Comparação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Variações de Cronograma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {baselineComparison.scheduleVariances.length}
                    </div>
                    <p className="text-xs text-muted-foreground">tarefas com variação</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Variações de Custo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {baselineComparison.costVariances.length}
                    </div>
                    <p className="text-xs text-muted-foreground">itens com variação</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mudanças de Escopo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {baselineComparison.scopeChanges.length}
                    </div>
                    <p className="text-xs text-muted-foreground">alterações detectadas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detalhes das Variações */}
              {baselineComparison.scheduleVariances.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Variações de Cronograma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {baselineComparison.scheduleVariances.map((variance: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{variance.taskName}</span>
                          <Badge className={variance.variance > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {variance.variance > 0 ? '+' : ''}{variance.variance} dias
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {activeBaseline ? 'Carregando comparação com baseline...' : 'Nenhum baseline ativo. Salve um baseline para começar a comparação.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSchedule;
