
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar, DollarSign, User, FileText, CheckCircle, StickyNote } from 'lucide-react';
import { WBSItemHierarchy, WBS_ITEM_TYPES } from '@/types/wbs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WBSItemDetailsProps {
  item: WBSItemHierarchy;
  onEdit: (item: WBSItemHierarchy) => void;
}

export const WBSItemDetails: React.FC<WBSItemDetailsProps> = ({ item, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const itemTypeInfo = WBS_ITEM_TYPES[item.itemType];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{itemTypeInfo.icon}</span>
            <h3 className="text-lg font-semibold">{item.activity}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {item.code}
            </Badge>
            <Badge variant="secondary">
              {itemTypeInfo.label}
            </Badge>
          </div>
        </div>
        <Button size="sm" onClick={() => onEdit(item)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Custo Estimado</p>
              <p className="font-semibold">
                R$ {item.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Responsável</p>
              <p className="font-semibold">{item.responsible || 'Não definido'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      {item.description && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Descrição
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {item.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <StickyNote className="h-4 w-4" />
              Notas e Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Creation Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Nível na EAP: {item.level}</span>
            <span>
              Criado em {format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Expand/Collapse for additional details */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full"
      >
        {isExpanded ? 'Mostrar menos detalhes' : 'Mostrar mais detalhes'}
      </Button>

      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">ID:</span>
              <p className="font-mono text-xs text-gray-500 break-all">{item.id}</p>
            </div>
            {item.parentId && (
              <div>
                <span className="font-medium text-gray-700">Item Pai:</span>
                <p className="font-mono text-xs text-gray-500">{item.parentId}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
