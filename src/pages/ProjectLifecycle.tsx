
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, Clock, AlertCircle, Settings } from 'lucide-react';

const ProjectLifecycle = () => {
  const { projectLifecycle, phases, updateProjectLifecycle, addProjectLifecycle } = useProject();
  const [selectedMethodology, setSelectedMethodology] = useState<'tradicional' | 'agil' | 'hibrido'>('tradicional');

  const currentLifecycle = projectLifecycle.length > 0 ? projectLifecycle[0] : null;

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'em-andamento':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateOverallProgress = () => {
    if (!phases.length) return 0;
    const completedPhases = phases.filter(phase => phase.status === 'concluido').length;
    return Math.round((completedPhases / phases.length) * 100);
  };

  const createLifecycleFromPhases = () => {
    const lifecyclePhases = phases.map(phase => ({
      name: phase.name,
      status: phase.status === 'concluido' ? 'concluido' as const : 
              phase.status === 'em-andamento' ? 'em-andamento' as const : 'nao-iniciado' as const,
      startDate: phase.startDate,
      endDate: phase.endDate,
      deliverables: ['Entregas definidas na fase'],
      gatesCriteria: ['Critérios de gate a serem definidos']
    }));

    const currentPhase = phases.find(p => p.status === 'em-andamento')?.name || 
                        phases.find(p => p.status === 'nao-iniciado')?.name || 
                        'Iniciação';

    if (currentLifecycle) {
      updateProjectLifecycle(currentLifecycle.id, {
        currentPhase,
        phases: lifecyclePhases,
        methodology: selectedMethodology,
        updatedAt: new Date().toISOString()
      });
    } else {
      addProjectLifecycle({
        currentPhase,
        phases: lifecyclePhases,
        methodology: selectedMethodology
      });
    }
  };

  const handleMethodologyChange = (value: string) => {
    setSelectedMethodology(value as 'tradicional' | 'agil' | 'hibrido');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ciclo de Vida do Projeto</h1>
        <div className="flex gap-2">
          <Select value={selectedMethodology} onValueChange={handleMethodologyChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tradicional">Tradicional</SelectItem>
              <SelectItem value="agil">Ágil</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createLifecycleFromPhases}>
            <Settings className="h-4 w-4 mr-2" />
            Sincronizar com Fases
          </Button>
        </div>
      </div>

      {/* Progresso Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Progresso Geral do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progresso das Fases</span>
              <span className="text-sm text-muted-foreground">{calculateOverallProgress()}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{phases.filter(p => p.status === 'concluido').length} fases concluídas</span>
              <span>{phases.length} fases totais</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metodologia */}
      <Card>
        <CardHeader>
          <CardTitle>Metodologia do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {selectedMethodology.charAt(0).toUpperCase() + selectedMethodology.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {selectedMethodology === 'tradicional' && 'Abordagem em cascata com fases sequenciais'}
              {selectedMethodology === 'agil' && 'Desenvolvimento iterativo e incremental'}
              {selectedMethodology === 'hibrido' && 'Combinação de práticas tradicionais e ágeis'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fases do Projeto */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fases do Projeto</h2>
        
        {phases.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma fase foi criada ainda</p>
              <p className="text-sm text-muted-foreground">
                Crie fases do projeto para visualizar o ciclo de vida
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {phases.map((phase, index) => (
              <Card key={phase.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">
                          {index + 1}
                        </span>
                        {getPhaseIcon(phase.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{phase.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {phase.description || 'Sem descrição'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('-', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        <div>Início: {new Date(phase.startDate).toLocaleDateString('pt-BR')}</div>
                        <div>Término: {new Date(phase.endDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Responsável:</span>
                        <span className="ml-2 text-muted-foreground">{phase.responsible}</span>
                      </div>
                      <div>
                        <span className="font-medium">Custo:</span>
                        <span className="ml-2 text-muted-foreground">
                          R$ {phase.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Gates de Controle */}
      <Card>
        <CardHeader>
          <CardTitle>Gates de Controle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Os gates de controle são pontos de verificação entre as fases do projeto onde se avalia:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Entregáveis da fase foram concluídos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Critérios de qualidade foram atendidos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Aprovação dos stakeholders
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Recursos disponíveis para próxima fase
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectLifecycle;
