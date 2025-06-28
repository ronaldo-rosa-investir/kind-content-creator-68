
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Calendar, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MainStatisticsProps {
  overallProgress: number;
  phases: any[];
  getProjectEndDate: () => string;
  budgetUsed: number;
  budgetStatus: any;
  totalActualCost: number;
  projectBudget: number;
  wbsItems: any[];
  eapLevels: number;
}

export const MainStatistics = ({ 
  overallProgress, 
  phases, 
  getProjectEndDate, 
  budgetUsed, 
  budgetStatus, 
  totalActualCost, 
  projectBudget,
  wbsItems,
  eapLevels
}: MainStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallProgress}%</div>
          <p className="text-xs text-muted-foreground">Progresso geral do projeto</p>
          <Progress value={overallProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cronograma</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{phases.length}</div>
          <p className="text-xs text-muted-foreground">
            Planejamento temporal • Fim: {getProjectEndDate()}
          </p>
          <Link to="/cronograma">
            <Button variant="link" size="sm" className="p-0 h-auto mt-2">Ver cronograma</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uso do Orçamento</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{budgetUsed.toFixed(1)}%</div>
            <div className={`px-2 py-1 rounded-full text-xs ${budgetStatus.bgColor} ${budgetStatus.color}`}>
              {budgetStatus.status}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            R$ {totalActualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {projectBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <Progress value={Math.min(budgetUsed, 100)} className="mt-2" />
          <Link to="/custos">
            <Button variant="link" size="sm" className="p-0 h-auto">Ver custos</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pacotes de Trabalho</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wbsItems.length}</div>
          <p className="text-xs text-muted-foreground">
            EAP com {eapLevels} {eapLevels === 1 ? 'nível' : 'níveis'} hierárquicos
          </p>
          <Link to="/eap">
            <Button variant="link" size="sm" className="p-0 h-auto mt-2">Ver EAP</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
