
import React, { useState } from 'react';
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Info, 
  HelpCircle, 
  Edit, 
  Trash2, 
  FileDown,
  Calendar,
  FileText,
  Lightbulb,
  FolderOpen
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import WBSGuideModal from "@/components/WBSHelpers/WBSGuideModal";
import EnhancedWBSDialog from "@/components/WBSHelpers/EnhancedWBSDialog";

const EnhancedWBS = () => {
  const { wbsItems, deleteWBSItem } = useProject();
  const { toast } = useToast();

  const handleDeleteWBSItem = (itemId: string) => {
    deleteWBSItem(itemId);
    toast({
      title: "Item EAP excluído",
      description: "O item foi removido com sucesso.",
    });
  };

  const totalCost = wbsItems.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Estrutura Analítica do Projeto (EAP)</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>ℹ️ A EAP organiza seu projeto em pacotes de trabalho hierárquicos</span>
          </div>
        </div>
        <div className="flex gap-2">
          <WBSGuideModal
            trigger={
              <Button variant="outline">
                <HelpCircle className="h-4 w-4 mr-2" />
                Guia Rápido
              </Button>
            }
          />
          <EnhancedWBSDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Item EAP
              </Button>
            }
          />
        </div>
      </div>

      {/* Quick Info */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="font-medium mb-2">💡 Dica Importante</div>
          <p className="text-sm">
            A EAP divide seu projeto em partes menores e mais gerenciáveis. 
            Cada item representa uma entrega ou componente específico do projeto.
          </p>
        </AlertDescription>
      </Alert>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{wbsItems.length}</div>
            <div className="text-sm text-muted-foreground">Total de Itens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Custo Total</div>
          </CardContent>
        </Card>
      </div>

      {/* WBS Items List */}
      {wbsItems.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Itens da EAP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wbsItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {item.code}
                        </span>
                        <span className="font-semibold">{item.activity}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>👤 {item.responsible}</span>
                        <span>💰 R$ {(item.estimatedCost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnhancedWBSDialog
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                      wbsItem={item}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Item EAP</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o item "{item.code} - {item.activity}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteWBSItem(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Empty state when no items exist */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum item criado ainda</h3>
          <p className="text-muted-foreground mb-2">
            Organize seu projeto em partes menores para facilitar o gerenciamento
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Comece criando o primeiro item do projeto
          </p>
        </div>
      )}

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações da EAP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <FileDown className="h-4 w-4 mr-2" />
              📄 Exportar EAP
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              📊 Gerar Cronograma
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              📋 Relatório Resumido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedWBS;
