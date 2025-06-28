
import React, { useState } from 'react';
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  ArrowUpToLine, 
  ArrowDownToLine, 
  FileDown,
  GanttChartSquare,
  Info,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { WBSHierarchyManager } from '@/utils/wbsHierarchyUtils';
import { WBSItemDialog } from "@/components/WBS/WBSItemDialog";
import { WBSTree } from "@/components/WBS/WBSTree";
import { WBSItemDetails } from "@/components/WBS/WBSItemDetails";
import { WBSStatistics } from "@/components/WBS/WBSStatistics";
import { WBSItemHierarchy } from '@/types/wbs';

const EnhancedWBSPage = () => {
  const { wbsItems, deleteWBSItem, projectCharter } = useProject();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<WBSItemHierarchy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WBSItemHierarchy | null>(null);
  const [parentForNewItem, setParentForNewItem] = useState<WBSItemHierarchy | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<WBSItemHierarchy | null>(null);

  // Get project name from charter
  const projectName = projectCharter.length > 0 ? projectCharter[0].projectName : 'Projeto';

  // Build hierarchy
  const hierarchyItems = WBSHierarchyManager.buildHierarchy(wbsItems);

  const handleNewItem = () => {
    console.log('Creating new item');
    setEditingItem(null);
    setParentForNewItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: WBSItemHierarchy) => {
    console.log('Editing item:', item.id);
    setEditingItem(item);
    setParentForNewItem(null);
    setIsDialogOpen(true);
  };

  const handleAddChild = (parentItem: WBSItemHierarchy) => {
    console.log('Adding child to:', parentItem.id);
    setEditingItem(null);
    setParentForNewItem(parentItem);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (item: WBSItemHierarchy) => {
    console.log('Delete requested for:', item.id);
    if (!WBSHierarchyManager.canDelete(item.id, wbsItems)) {
      toast({
        title: "Não é possível excluir",
        description: "Este item possui filhos e não pode ser excluído. Remova os filhos primeiro.",
        variant: "destructive"
      });
      return;
    }
    setDeleteCandidate(item);
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      console.log('Confirming delete for:', deleteCandidate.id);
      deleteWBSItem(deleteCandidate.id);
      toast({
        title: "Item excluído",
        description: `${deleteCandidate.code} - ${deleteCandidate.activity} foi removido.`,
      });
      
      // Clear selection if deleted item was selected
      if (selectedItem?.id === deleteCandidate.id) {
        setSelectedItem(null);
      }
      
      setDeleteCandidate(null);
    }
  };

  const handleSelectItem = (item: WBSItemHierarchy | null) => {
    console.log('Item selected:', item?.id);
    setSelectedItem(item);
  };

  const handleExpandAll = () => {
    console.log('Expand all clicked');
    toast({
      title: "Expandir tudo",
      description: "Funcionalidade será implementada em breve.",
    });
  };

  const handleCollapseAll = () => {
    console.log('Collapse all clicked');
    toast({
      title: "Colapsar tudo",
      description: "Funcionalidade será implementada em breve.",
    });
  };

  const handleExport = () => {
    console.log('Export clicked');
    toast({
      title: "Exportar EAP",
      description: "Funcionalidade de exportação será implementada em breve.",
    });
  };

  const handleGenerateSchedule = () => {
    console.log('Generate schedule clicked');
    toast({
      title: "Gerar Cronograma",
      description: "Funcionalidade será implementada em breve.",
    });
  };

  const handleDialogClose = () => {
    console.log('Dialog closing');
    setIsDialogOpen(false);
    setEditingItem(null);
    setParentForNewItem(null);
  };

  const handleHelp = () => {
    console.log('Help clicked');
    toast({
      title: "Guia Rápido",
      description: "Documentação de ajuda será implementada em breve.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Estrutura Analítica do Projeto (EAP)</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Organize seu projeto "{projectName}" em pacotes de trabalho hierárquicos</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleHelp}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Guia Rápido
          </Button>
          <Button onClick={handleNewItem}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Item EAP
          </Button>
        </div>
      </div>

      {/* Quick Tip */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="font-medium mb-2">💡 Dica de Uso</div>
          <p className="text-sm">
            Clique em um item na árvore para ver seus detalhes na lateral direita. 
            Use os ícones para adicionar filhos, editar ou excluir itens.
          </p>
        </AlertDescription>
      </Alert>

      {/* Statistics */}
      <WBSStatistics wbsItems={wbsItems} />

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={handleExpandAll}>
          <ArrowUpToLine className="h-4 w-4 mr-2" />
          Expandir Tudo
        </Button>
        <Button variant="outline" onClick={handleCollapseAll}>
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Colapsar Tudo
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar EAP
        </Button>
        <Button variant="secondary" onClick={handleGenerateSchedule}>
          <GanttChartSquare className="h-4 w-4 mr-2" />
          Gerar Cronograma
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree Column */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Estrutura Hierárquica
              <span className="text-sm font-normal text-gray-500">
                ({wbsItems.length} {wbsItems.length === 1 ? 'item' : 'itens'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wbsItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Estrutura EAP vazia</h3>
                <p className="text-muted-foreground mb-2">
                  Organize o projeto "{projectName}" em uma hierarquia clara
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Defina os principais componentes, entregas e pacotes de trabalho
                </p>
                <Button onClick={handleNewItem} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Item EAP
                </Button>
              </div>
            ) : (
              <WBSTree
                items={hierarchyItems}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteRequest}
                onAddChild={handleAddChild}
                canDelete={(id) => WBSHierarchyManager.canDelete(id, wbsItems)}
              />
            )}
          </CardContent>
        </Card>

        {/* Details Column */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Detalhes do Item EAP</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <WBSItemDetails
                item={selectedItem}
                onEdit={handleEditItem}
              />
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👆</div>
                <p className="text-muted-foreground mb-2">
                  Selecione um item na árvore
                </p>
                <p className="text-sm text-muted-foreground">
                  Os detalhes completos aparecerão aqui
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <WBSItemDialog
        trigger={<div />}
        wbsItem={editingItem}
        parentItem={parentForNewItem}
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
      />

      <AlertDialog open={!!deleteCandidate} onOpenChange={() => setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o item "{deleteCandidate?.code} - {deleteCandidate?.activity}"?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedWBSPage;
