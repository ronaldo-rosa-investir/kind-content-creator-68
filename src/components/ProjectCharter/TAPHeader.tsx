
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TAPStatus } from '@/types/project';
import { CheckCircle, Clock, XCircle, AlertTriangle, Lock, Plus, Edit } from 'lucide-react';

interface TAPHeaderProps {
  projectName: string;
  status: TAPStatus;
  version: string;
  isEditable: boolean;
  completionPercentage: number;
  onCreateNewVersion: () => void;
  onEdit: () => void;
}

const TAPHeader: React.FC<TAPHeaderProps> = ({
  projectName,
  status,
  version,
  isEditable,
  completionPercentage,
  onCreateNewVersion,
  onEdit
}) => {
  const getStatusBadge = (status: TAPStatus) => {
    switch (status) {
      case 'rascunho':
        return <Badge variant="outline" className="text-gray-600"><Edit className="h-3 w-3 mr-1" />Rascunho</Badge>;
      case 'pendente-aprovacao':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /><Lock className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'aprovado-com-ressalva':
        return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Aprovado com Ressalva</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getStatusColor = (status: TAPStatus) => {
    switch (status) {
      case 'rascunho': return 'bg-gray-100';
      case 'pendente-aprovacao': return 'bg-yellow-50';
      case 'aprovado': return 'bg-green-50';
      case 'aprovado-com-ressalva': return 'bg-orange-50';
      case 'rejeitado': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <Card className={`${getStatusColor(status)} border-l-4 ${
      status === 'aprovado' ? 'border-l-green-500' :
      status === 'aprovado-com-ressalva' ? 'border-l-orange-500' :
      status === 'rejeitado' ? 'border-l-red-500' :
      status === 'pendente-aprovacao' ? 'border-l-yellow-500' :
      'border-l-gray-400'
    }`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{projectName}</h1>
              {!isEditable && <Lock className="h-5 w-5 text-gray-500" />}
            </div>
            
            <div className="flex items-center gap-3">
              {getStatusBadge(status)}
              <Badge variant="outline" className="bg-white">
                Versão {version}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{completionPercentage}% completo</span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditable && status === 'aprovado' && (
              <Button onClick={onCreateNewVersion} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Versão
              </Button>
            )}
            {isEditable && (
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar TAP
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TAPHeader;
