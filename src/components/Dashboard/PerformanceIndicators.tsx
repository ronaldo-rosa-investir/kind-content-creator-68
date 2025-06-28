
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceIndicatorsProps {
  budgetUsed: number;
  budgetStatus: any;
  remainingBudget: number;
  completionRate: number;
}

export const PerformanceIndicators = ({ budgetUsed, budgetStatus, remainingBudget, completionRate }: PerformanceIndicatorsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Performance do Projeto
          {budgetUsed > 100 ? (
            <TrendingUp className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status Orçamentário</p>
            <p className={`text-lg font-semibold ${budgetStatus.color}`}>
              {budgetStatus.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
            <p className="text-lg font-semibold">
              R$ {remainingBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Eficiência</p>
            <p className={`text-lg font-semibold ${completionRate > budgetUsed ? 'text-green-600' : 'text-orange-600'}`}>
              {completionRate > budgetUsed ? 'Eficiente' : 'Revisar Custos'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
