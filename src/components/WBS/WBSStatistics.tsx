
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WBSHierarchyManager } from '@/utils/wbsHierarchyUtils';
import { WBSItem } from '@/types/project';

interface WBSStatisticsProps {
  wbsItems: WBSItem[];
}

export const WBSStatistics = ({ wbsItems }: WBSStatisticsProps) => {
  const stats = WBSHierarchyManager.calculateStatistics(wbsItems);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
          <div className="text-sm text-muted-foreground">Total de Itens</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            R$ {stats.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-muted-foreground">Custo Total</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.uniqueResponsibles.length}</div>
          <div className="text-sm text-muted-foreground">Responsáveis</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.itemsByLevel).length}</div>
          <div className="text-sm text-muted-foreground">Níveis</div>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm">Distribuição por Nível</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.itemsByLevel).map(([level, count]) => (
              <Badge key={level} variant="outline">
                Nível {level}: {count} itens
              </Badge>
            ))}
          </div>
          
          {stats.uniqueResponsibles.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Responsáveis:</div>
              <div className="flex flex-wrap gap-1">
                {stats.uniqueResponsibles.map((responsible) => (
                  <Badge key={responsible} variant="secondary" className="text-xs">
                    {responsible}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
