
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GanttTask, GanttSettings } from '@/types/gantt';
import { Calendar, ZoomIn, ZoomOut, Download, Settings, Target, AlertTriangle } from 'lucide-react';

interface InteractiveGanttProps {
  tasks: GanttTask[];
  settings: GanttSettings;
  onSettingsChange: (settings: GanttSettings) => void;
  onTaskUpdate: (taskId: string, updates: Partial<GanttTask>) => void;
  criticalPath: string[];
}

export const InteractiveGantt: React.FC<InteractiveGanttProps> = ({
  tasks,
  settings,
  onSettingsChange,
  onTaskUpdate,
  criticalPath
}) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    taskId: string;
    startX: number;
    startDate: Date;
  } | null>(null);
  const ganttRef = useRef<HTMLDivElement>(null);

  // Calcular escala de tempo
  const getTimeScale = () => {
    if (tasks.length === 0) return { start: new Date(), end: new Date(), days: 0 };
    
    const startDates = tasks.map(t => new Date(t.startDate));
    const endDates = tasks.map(t => new Date(t.endDate));
    const start = new Date(Math.min(...startDates.map(d => d.getTime())));
    const end = new Date(Math.max(...endDates.map(d => d.getTime())));
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return { start, end, days };
  };

  const { start: projectStart, end: projectEnd, days: totalDays } = getTimeScale();

  // Gerar cabeçalho da timeline
  const generateTimelineHeader = () => {
    const headers: JSX.Element[] = [];
    const current = new Date(projectStart);
    let dayWidth = 40;

    if (settings.scale === 'week') {
      dayWidth = 200;
    } else if (settings.scale === 'month') {
      dayWidth = 600;
    }

    while (current <= projectEnd) {
      let label = '';
      let width = dayWidth;

      switch (settings.scale) {
        case 'day':
          label = current.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          label = `Semana ${Math.ceil(current.getDate() / 7)}`;
          width = dayWidth;
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          label = current.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
          width = dayWidth;
          current.setMonth(current.getMonth() + 1);
          break;
      }

      headers.push(
        <div
          key={current.getTime()}
          className="border-r border-gray-200 text-xs font-medium p-2 text-center bg-gray-50"
          style={{ minWidth: `${width}px`, width: `${width}px` }}
        >
          {label}
        </div>
      );
    }

    return headers;
  };

  // Calcular posição da barra da tarefa
  const getTaskBarStyle = (task: GanttTask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const dayWidth = settings.scale === 'day' ? 40 : settings.scale === 'week' ? 200 : 600;
    
    const daysFromStart = Math.floor((taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskDurationDays = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = daysFromStart * (settings.scale === 'day' ? dayWidth : dayWidth / 7);
    const width = taskDurationDays * (settings.scale === 'day' ? dayWidth : dayWidth / 7);

    return {
      left: `${left}px`,
      width: `${Math.max(width, 20)}px`,
      marginLeft: `${task.level * 20}px`
    };
  };

  // Determinar cor da barra baseada no status
  const getTaskBarColor = (task: GanttTask) => {
    if (task.milestone) return 'bg-yellow-500';
    if (criticalPath.includes(task.id)) return 'bg-red-500';
    if (task.status === 'concluido') return 'bg-green-500';
    if (task.status === 'atrasado') return 'bg-red-400';
    if (task.status === 'em-andamento') return 'bg-blue-500';
    return 'bg-gray-400';
  };

  // Handlers para drag and drop
  const handleMouseDown = (e: React.MouseEvent, task: GanttTask) => {
    if (!settings.allowDragDrop) return;
    
    setDragState({
      taskId: task.id,
      startX: e.clientX,
      startDate: new Date(task.startDate)
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    
    const deltaX = e.clientX - dragState.startX;
    const dayWidth = settings.scale === 'day' ? 40 : settings.scale === 'week' ? 200 : 600;
    const daysDelta = Math.round(deltaX / dayWidth);
    
    if (daysDelta !== 0) {
      const newStartDate = new Date(dragState.startDate);
      newStartDate.setDate(newStartDate.getDate() + daysDelta);
      
      const task = tasks.find(t => t.id === dragState.taskId);
      if (task) {
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + task.duration);
        
        onTaskUpdate(dragState.taskId, {
          startDate: newStartDate.toISOString().split('T')[0],
          endDate: newEndDate.toISOString().split('T')[0]
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  // Exportar para diferentes formatos
  const handleExport = (format: 'pdf' | 'excel' | 'image') => {
    // Implementação simplificada - em produção, usar bibliotecas especializadas
    const data = {
      tasks,
      projectStart: projectStart.toISOString(),
      projectEnd: projectEnd.toISOString(),
      criticalPath,
      format
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gantt-chart.${format === 'excel' ? 'json' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Gráfico de Gantt Interativo
            </CardTitle>
            
            <div className="flex gap-2">
              <Select
                value={settings.scale}
                onValueChange={(value) => onSettingsChange({ ...settings, scale: value as any })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Diário</SelectItem>
                  <SelectItem value="week">Semanal</SelectItem>
                  <SelectItem value="month">Mensal</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({ ...settings, showCriticalPath: !settings.showCriticalPath })}
                className={settings.showCriticalPath ? 'bg-red-50 text-red-700' : ''}
              >
                <Target className="h-4 w-4 mr-1" />
                Caminho Crítico
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({ ...settings, allowDragDrop: !settings.allowDragDrop })}
              >
                <Settings className="h-4 w-4 mr-1" />
                {settings.allowDragDrop ? 'Bloquear' : 'Permitir'} Edição
              </Button>

              <Select onValueChange={(value) => handleExport(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Exportar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Timeline Header */}
              <div className="flex border-b border-gray-200">
                <div className="w-80 p-2 bg-gray-50 border-r border-gray-200 font-medium">
                  Tarefa
                </div>
                <div className="flex">{generateTimelineHeader()}</div>
              </div>

              {/* Task Rows */}
              <div
                ref={ganttRef}
                className="relative"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {tasks.map((task) => (
                  <div key={task.id} className="flex border-b border-gray-100 hover:bg-gray-50">
                    {/* Task Info Column */}
                    <div className="w-80 p-3 border-r border-gray-200">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${task.level * 16}px` }}>
                        {task.milestone ? (
                          <Target className="h-4 w-4 text-yellow-500" />
                        ) : task.level > 0 ? (
                          <div className="w-4 h-4 border-l border-b border-gray-300"></div>
                        ) : null}
                        
                        <Tooltip>
                          <TooltipTrigger>
                            <span className={`text-sm font-medium ${criticalPath.includes(task.id) ? 'text-red-700' : ''}`}>
                              {task.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p><strong>Duração:</strong> {task.duration} dias</p>
                              <p><strong>Progresso:</strong> {task.progress}%</p>
                              <p><strong>Recursos:</strong> {task.resources.join(', ')}</p>
                              {criticalPath.includes(task.id) && (
                                <p className="text-red-600"><strong>CAMINHO CRÍTICO</strong></p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>

                        {criticalPath.includes(task.id) && settings.showCriticalPath && (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.status.replace('-', ' ')}
                        </Badge>
                        {settings.showProgress && (
                          <div className="flex items-center gap-1">
                            <Progress value={task.progress} className="w-16 h-2" />
                            <span className="text-xs text-gray-500">{task.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gantt Bar */}
                    <div className="flex-1 relative h-16 bg-white">
                      <div
                        className={`absolute top-2 h-8 rounded ${getTaskBarColor(task)} cursor-pointer transition-all hover:opacity-80`}
                        style={getTaskBarStyle(task)}
                        onMouseDown={(e) => handleMouseDown(e, task)}
                        onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                      >
                        {/* Progress Bar Overlay */}
                        {task.progress > 0 && (
                          <div
                            className="h-full bg-green-600 rounded-l opacity-70"
                            style={{ width: `${task.progress}%` }}
                          />
                        )}
                        
                        {/* Task Label */}
                        <div className="text-white text-xs font-medium px-2 py-1 truncate">
                          {task.milestone ? '♦' : task.name}
                        </div>
                      </div>

                      {/* Dependencies Lines */}
                      {settings.showDependencies && task.dependencies.length > 0 && (
                        <svg className="absolute inset-0 pointer-events-none">
                          {task.dependencies.map(depId => {
                            const depTask = tasks.find(t => t.id === depId);
                            if (!depTask) return null;
                            
                            const depStyle = getTaskBarStyle(depTask);
                            const taskStyle = getTaskBarStyle(task);
                            
                            return (
                              <line
                                key={depId}
                                x1={parseInt(depStyle.left) + parseInt(depStyle.width)}
                                y1="16"
                                x2={parseInt(taskStyle.left)}
                                y2="16"
                                stroke="#666"
                                strokeWidth="1"
                                markerEnd="url(#arrow)"
                              />
                            );
                          })}
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* SVG Definitions for Arrows */}
              <svg width="0" height="0">
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="3"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill="#666" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs">Em Andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs">Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs">Caminho Crítico</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-xs">Marco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-xs">Não Iniciado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
