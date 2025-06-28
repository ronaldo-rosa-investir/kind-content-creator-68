
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TAPStatusProps {
  currentTAP: any;
  tapCompletenessPercentage: number;
  isTAPComplete: boolean;
  projectBudget: number;
}

export const TAPStatus = ({ currentTAP, tapCompletenessPercentage, isTAPComplete, projectBudget }: TAPStatusProps) => {
  return (
    <Card className={`border-2 ${isTAPComplete ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Termo de Abertura do Projeto (TAP)
          {isTAPComplete ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className={`font-semibold ${isTAPComplete ? 'text-green-700' : 'text-orange-700'}`}>
              {tapCompletenessPercentage}% Completo
            </p>
            <Progress value={tapCompletenessPercentage} className="mt-1" />
          </div>
          {currentTAP && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Nome do Projeto</p>
                <p className="font-semibold">{currentTAP.projectName || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Aprovado</p>
                <p className="font-semibold text-blue-700">
                  R$ {projectBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prazo Final</p>
                <p className="font-semibold">
                  {currentTAP.estimatedEndDate ? 
                    new Date(currentTAP.estimatedEndDate).toLocaleDateString('pt-BR') : 
                    'Não definido'
                  }
                </p>
              </div>
            </>
          )}
        </div>
        <div className="mt-4">
          <Link to="/tap">
            <Button size="sm">
              {currentTAP ? 'Ver TAP' : 'Criar TAP'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
