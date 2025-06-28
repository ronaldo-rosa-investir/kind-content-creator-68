
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EVMMetrics, VarianceReport } from '@/types/gantt';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from 'lucide-react';

interface EVMDashboardProps {
  evmMetrics: EVMMetrics;
  varianceReport: VarianceReport[];
  projectCompletion: {
    estimatedCompletionDate: Date;
    probabilityOnTime: number;
    recommendedActions: string[];
  };
}

export const EVMDashboard: React.FC<EVMDashboardProps> = ({
  evmMetrics,
  varianceReport,
  projectCompletion
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPerformanceColor = (index: number) => {
    if (index >= 1.1) return 'text-green-600';
    if (index >= 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (index: number) => {
    if (index >= 1.1) return { variant: 'default' as const, label: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (index >= 0.9) return { variant: 'secondary' as const, label: 'Satisfatório', color: 'bg-yellow-100 text-yellow-800' };
    return { variant: 'destructive' as const, label: 'Crítico', color: 'bg-red-100 text-red-800' };
  };

  const criticalTasks = varianceReport.filter(
    task => task.schedulePerformanceIndex < 0.8 || task.costPerformanceIndex < 0.8
  );

  return (
    <div className="space-y-6">
      {/* Métricas Principais do EVM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Planejado (PV)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(evmMetrics.plannedValue)}</div>
            <p className="text-xs text-muted-foreground">
              Trabalho que deveria estar concluído
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Agregado (EV)</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(evmMetrics.earnedValue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor do trabalho realmente concluído
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Real (AC)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(evmMetrics.actualCost)}</div>
            <p className="text-xs text-muted-foreground">
              Custo real incorrido até o momento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total (BAC)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(evmMetrics.budgetAtCompletion)}</div>
            <p className="text-xs text-muted-foreground">
              Orçamento total aprovado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Índices de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice de Performance de Cronograma</CardTitle>
            {evmMetrics.schedulePerformanceIndex >= 0.9 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(evmMetrics.schedulePerformanceIndex)}`}>
              {evmMetrics.schedulePerformanceIndex.toFixed(2)}
            </div>
            <Badge className={getPerformanceBadge(evmMetrics.schedulePerformanceIndex).color}>
              {getPerformanceBadge(evmMetrics.schedulePerformanceIndex).label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              SPI = EV / PV ({evmMetrics.schedulePerformanceIndex > 1 ? 'Adiantado' : evmMetrics.schedulePerformanceIndex < 1 ? 'Atrasado' : 'No prazo'})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice de Performance de Custo</CardTitle>
            {evmMetrics.costPerformanceIndex >= 0.9 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(evmMetrics.costPerformanceIndex)}`}>
              {evmMetrics.costPerformanceIndex.toFixed(2)}
            </div>
            <Badge className={getPerformanceBadge(evmMetrics.costPerformanceIndex).color}>
              {getPerformanceBadge(evmMetrics.costPerformanceIndex).label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              CPI = EV / AC ({evmMetrics.costPerformanceIndex > 1 ? 'Abaixo do orçamento' : evmMetrics.costPerformanceIndex < 1 ? 'Acima do orçamento' : 'No orçamento'})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimativa no Término (EAC)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(evmMetrics.estimateAtCompletion)}</div>
            <div className={`text-sm ${evmMetrics.varianceAtCompletion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {evmMetrics.varianceAtCompletion >= 0 ? '↓' : '↑'} {formatCurrency(Math.abs(evmMetrics.varianceAtCompletion))}
            </div>
            <p className="text-xs text-muted-foreground">
              Custo total estimado do projeto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TCPI (Para Completar)</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(evmMetrics.toCompletePerformanceIndex)}`}>
              {evmMetrics.toCompletePerformanceIndex.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Performance necessária para atingir BAC
            </p>
            {evmMetrics.toCompletePerformanceIndex > 1.2 && (
              <Badge variant="destructive" className="mt-1">Muito Desafiador</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Variações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variação de Cronograma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${evmMetrics.scheduleVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(evmMetrics.scheduleVariance)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Valor Agregado:</span>
                <span className="font-medium">{formatCurrency(evmMetrics.earnedValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Valor Planejado:</span>
                <span className="font-medium">{formatCurrency(evmMetrics.plannedValue)}</span>
              </div>
              <Progress 
                value={Math.min(100, (evmMetrics.earnedValue / evmMetrics.plannedValue) * 100)} 
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variação de Custo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${evmMetrics.costVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(evmMetrics.costVariance)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Valor Agregado:</span>
                <span className="font-medium">{formatCurrency(evmMetrics.earnedValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Custo Real:</span>
                <span className="font-medium">{formatCurrency(evmMetrics.actualCost)}</span>
              </div>
              <Progress 
                value={Math.min(100, (evmMetrics.earnedValue / evmMetrics.actualCost) * 100)} 
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Previsões do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Previsões do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projectCompletion.estimatedCompletionDate.toLocaleDateString('pt-BR')}
              </div>
              <p className="text-sm text-muted-foreground">Data Estimada de Conclusão</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${projectCompletion.probabilityOnTime >= 70 ? 'text-green-600' : projectCompletion.probabilityOnTime >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {Math.round(projectCompletion.probabilityOnTime)}%
              </div>
              <p className="text-sm text-muted-foreground">Probabilidade de Sucesso</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(evmMetrics.estimateToComplete)}</div>
              <p className="text-sm text-muted-foreground">Custo para Completar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Recomendadas */}
      {projectCompletion.recommendedActions.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Ações Recomendadas:</p>
              <ul className="list-disc list-inside space-y-1">
                {projectCompletion.recommendedActions.map((action, index) => (
                  <li key={index} className="text-sm">{action}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tarefas Críticas */}
      {criticalTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Tarefas com Performance Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalTasks.map((task) => (
                <div key={task.taskId} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-red-900">{task.taskName}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-red-700">SPI: </span>
                          <span className="font-medium">{task.schedulePerformanceIndex.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-red-700">CPI: </span>
                          <span className="font-medium">{task.costPerformanceIndex.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
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
