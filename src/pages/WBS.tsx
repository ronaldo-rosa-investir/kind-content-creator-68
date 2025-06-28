
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";
import { WBSItemDialog } from "@/components/WBS/WBSItemDialog";
import { WBSHierarchyTree } from "@/components/WBS/WBSHierarchyTree";
import { WBSStatistics } from "@/components/WBS/WBSStatistics";
import { useToast } from "@/hooks/use-toast";
import { WBSHierarchyManager } from "@/utils/wbsHierarchyUtils";

const WBS = () => {
  const { wbsItems, deleteWBSItem } = useProject();
  const { toast } = useToast();

  const handleDeleteWBSItem = (itemId: string) => {
    if (!WBSHierarchyManager.canDelete(itemId, wbsItems)) {
      toast({
        title: "Não é possível excluir",
        description: "Este item possui filhos e não pode ser excluído.",
        variant: "destructive"
      });
      return;
    }

    deleteWBSItem(itemId);
    toast({
      title: "Item EAP excluído",
      description: "O item foi removido com sucesso.",
    });
  };

  const hierarchyItems = WBSHierarchyManager.buildHierarchy(wbsItems);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Estrutura Analítica do Projeto (EAP)</h1>
          <p className="text-muted-foreground mt-1">
            Organize seu projeto em uma hierarquia de entregas e pacotes de trabalho
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Gerar Cronograma
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <WBSItemDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Item EAP
              </Button>
            }
          />
        </div>
      </div>

      {/* Statistics */}
      <WBSStatistics wbsItems={wbsItems} />

      {/* WBS Hierarchy */}
      {wbsItems.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Estrutura Hierárquica</CardTitle>
          </CardHeader>
          <CardContent>
            <WBSHierarchyTree
              items={hierarchyItems}
              onEdit={(item) => {/* handled by dialog */}}
              onDelete={handleDeleteWBSItem}
              canDelete={(id) => WBSHierarchyManager.canDelete(id, wbsItems)}
            />
          </CardContent>
        </Card>
      ) : (
        /* Empty state */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Estrutura Analítica do Projeto vazia</h3>
          <p className="text-muted-foreground mb-2">
            Organize seu projeto em uma hierarquia clara de entregas
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Defina os principais componentes, entregas e pacotes de trabalho
          </p>
          <WBSItemDialog
            trigger={
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Item EAP
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default WBS;
