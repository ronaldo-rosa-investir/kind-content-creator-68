
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectDocumentationProps {
  approvedRequirements: number;
  totalRequirements: number;
  requirementsApprovalRate: number;
  scopeStatement: any[];
  approvedValidations: number;
  totalValidations: number;
}

export const ProjectDocumentation = ({ 
  approvedRequirements, 
  totalRequirements, 
  requirementsApprovalRate,
  scopeStatement,
  approvedValidations,
  totalValidations
}: ProjectDocumentationProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Documentação do Projeto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requisitos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequirements}/{totalRequirements}</div>
            <p className="text-xs text-muted-foreground">
              O que o projeto deve atender • {requirementsApprovalRate.toFixed(1)}% aprovados
            </p>
            <Progress value={requirementsApprovalRate} className="mt-2" />
            <Link to="/requisitos">
              <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declaração de Escopo</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scopeStatement.length > 0 ? '1' : '0'}</div>
            <p className="text-xs text-muted-foreground">
              Definição clara do trabalho • {scopeStatement.length > 0 ? 'Definida' : 'Não definida'}
            </p>
            <Link to="/escopo">
              <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                {scopeStatement.length > 0 ? 'Ver' : 'Definir'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovações</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedValidations}/{totalValidations}</div>
            <p className="text-xs text-muted-foreground">
              Aprovações e entregas validadas
            </p>
            <Link to="/validacao">
              <Button variant="link" size="sm" className="p-0 h-auto mt-2">Gerenciar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
