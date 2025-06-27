
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const Schedule = () => {
  const { phases, wbsItems, tasks, scheduleItems, addScheduleItem } = useProject();

  const generateScheduleFromWBS = () => {
    wbsItems.forEach(item => {
      const phase = phases.find(p => p.id === item.phaseId);
      if (phase) {
        const startDate = new Date(phase.startDate);
        startDate.setDate(startDate.getDate() + item.daysAfterStart);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.ceil(item.estimatedHours / 8));

        addScheduleItem({
          wbsCode: item.code,
          taskName: item.activity,
          duration: Math.ceil(item.estimatedHours / 8),
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          predecessors: [],
          resources: [item.responsible],
          progress: Math.round((item.actualHours / item.estimatedHours) * 100) || 0,
          status: item.actualHours > 0 ? 'em-andamento' : 'nao-iniciado'
        });
      }
    });
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

  const calculateProjectDuration = () => {
    if (phases.length === 0) return 0;
    
    const startDates = phases.map(p => new Date(p.startDate));
    const endDates = phases.map(p => new Date(p.endDate));
    
    const projectStart = new Date(Math.min(...startDates.map(d => d.getTime())));
    const projectEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    return Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateOverallProgress = () => {
    if (scheduleItems.length === 0) return 0;
    const totalProgress = scheduleItems.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / scheduleItems.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cronograma do Projeto</h1>
        <Button onClick={generateScheduleFromWBS}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Gerar Cronograma da EAP
        </Button>
      </div>

      {/* Métricas do Cronograma */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateProjectDuration()}</div>
            <p className="text-xs text-muted-foreground">dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallProgress()}%</div>
            <Progress value={calculateOverallProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduleItems.length}</div>
            <p className="text-xs text-muted-foreground">no cronograma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {scheduleItems.filter(item => item.status === 'atrasado').length}
            </div>
            <p className="text-xs text-muted-foreground">atividades</p>
          </CardContent>
        </Card>
      </div>

      {/* Cronograma por Fases */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cronograma por Fases</h2>
        
        {phases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma fase foi criada ainda</p>
              <p className="text-sm text-muted-foreground">
                Crie fases e itens EAP para gerar o cronograma
              </p>
            </CardContent>
          </Card>
        ) : (
          phases.map(phase => {
            const phaseWBSItems = wbsItems.filter(item => item.phaseId === phase.id);
            const phaseScheduleItems = scheduleItems.filter(item => 
              phaseWBSItems.some(wbs => wbs.code === item.wbsCode)
            );
            
            return (
              <Card key={phase.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {phase.name}
                    </div>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status.replace('-', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Início:</span>
                        <span className="ml-2 text-muted-foreground">
                          {new Date(phase.startDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Término:</span>
                        <span className="ml-2 text-muted-foreground">
                          {new Date(phase.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Responsável:</span>
                        <span className="ml-2 text-muted-foreground">{phase.responsible}</span>
                      </div>
                    </div>

                    {phaseScheduleItems.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Atividades:</h4>
                        <div className="space-y-2">
                          {phaseScheduleItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(item.status)}
                                <div>
                                  <div className="font-medium text-sm">{item.wbsCode} - {item.taskName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.duration} dias • {item.resources.join(', ')}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <Badge variant="outline" className={getStatusColor(item.status)}>
                                  {item.status.replace('-', ' ')}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {item.progress}% concluído
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Caminho Crítico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Caminho Crítico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            O caminho crítico representa a sequência de atividades que determina a duração mínima do projeto.
          </p>
          <div className="space-y-2">
            {scheduleItems
              .filter(item => item.status === 'atrasado' || item.progress < 50)
              .map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">{item.wbsCode} - {item.taskName}</span>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    Crítico
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
