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
  Eye, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  FileDown,
  Calendar,
  FileText,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import WBSGuideModal from "@/components/WBSHelpers/WBSGuideModal";
import WBSItemTooltip from "@/components/WBSHelpers/WBSItemTooltip";
import EnhancedWBSDialog from "@/components/WBSHelpers/EnhancedWBSDialog";

const EnhancedWBS = () => {
  const { phases, wbsItems, getWBSItemsByPhase, deleteWBSItem } = useProject();
  const { toast } = useToast();
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const handleDeleteWBSItem = (itemId: string) => {
    deleteWBSItem(itemId);
    toast({
      title: "Item EAP excluído",
      description: "O item foi removido com sucesso.",
    });
  };

  const getItemTypeInfo = (type: string) => {
    switch (type) {
      case 'projeto':
        return { icon: '📁', label: 'Projeto', tooltip: 'Projeto: O trabalho completo' };
      case 'entrega':
        return { icon: '📦', label: 'Entrega', tooltip: 'Entrega: Grande parte do projeto' };
      case 'componente':
        return { icon: '📋', label: 'Componente', tooltip: 'Componente: Grupo de tarefas' };
      default:
        return { icon: '🔧', label: 'Pacote de Trabalho', tooltip: 'Pacote: Tarefa específica' };
    }
  };

  const totalDeliverables = phases.reduce((acc, phase) => acc + getWBSItemsByPhase(phase.id).length, 0);
  const totalWorkPackages = wbsItems.filter(item => item.itemType === 'pacote-trabalho').length;
  const maxLevel = Math.max(...wbsItems.map(item => item.code.split('.').length), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Estrutura Analítica do Projeto (EAP)</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>A EAP organiza seu projeto em pacotes de trabalho hierárquicos para facilitar o gerenciamento</span>
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
          <div className="font-medium mb-2">💡 Tipos de Item EAP</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">📁</span>
              <span><strong>Projeto</strong> = O projeto completo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span><strong>Entrega</strong> = Parte principal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span><strong>Componente</strong> = Grupo de tarefas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔧</span>
              <span><strong>Pacote</strong> = Tarefa específica</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{phases.length}</div>
            <div className="text-sm text-muted-foreground">Entregas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalWorkPackages}</div>
            <div className="text-sm text-muted-foreground">Pacotes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{maxLevel}</div>
            <div className="text-sm text-muted-foreground">Níveis</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalDeliverables}</div>
            <div className="text-sm text-muted-foreground">Total de Itens</div>
          </CardContent>
        </Card>
      </div>

      {/* WBS Structure */}
      {phases.length > 0 ? (
        phases.map((phase) => {
          const phaseItems = getWBSItemsByPhase(phase.id);
          const isExpanded = expandedPhases.includes(phase.id);
          
          return (
            <Card key={phase.id} className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePhase(phase.id)}
                      className="p-1"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">📦</span>
                        {phase.name}
                        <Badge variant="outline" className="text-xs">
                          {phaseItems.length} itens
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={phase.status === 'em-andamento' ? 'default' : 'secondary'}
                    className={phase.status === 'em-andamento' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {phase.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  {phaseItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-4xl mb-2">📋</div>
                      <p>Nenhum item EAP criado para esta entrega</p>
                      <p className="text-sm mt-2">Comece adicionando o primeiro item</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {phaseItems.map((item) => {
                        const typeInfo = getItemTypeInfo(item.itemType || 'pacote-trabalho');
                        
                        return (
                          <Card key={item.id} className="border border-gray-100 bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <WBSItemTooltip content={typeInfo.tooltip}>
                                      <span className="text-lg cursor-help">{typeInfo.icon}</span>
                                    </WBSItemTooltip>
                                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                      {item.code}
                                    </span>
                                    <h3 className="font-semibold">{item.activity}</h3>
                                    <Badge variant="outline" className="text-xs">
                                      {typeInfo.label}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>👤 {item.responsible}</span>
                                    <span>⏱️ {item.estimatedHours}h</span>
                                    <span>💰 R$ {(item.estimatedHours * item.hourlyRate).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
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
                                          Esta ação não pode ser desfeita e pode afetar outros itens dependentes.
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
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })
      ) : (
        /* Empty state when no phases exist */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-muted-foreground mb-4">Nenhum item da EAP criado ainda</p>
          <p className="text-sm text-muted-foreground mb-6">
            Organize seu projeto em pacotes de trabalho hierárquicos
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
              <span className="text-xs text-muted-foreground ml-2">(Baixar organização)</span>
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              📊 Gerar Cronograma
              <span className="text-xs text-muted-foreground ml-2">(Criar calendário)</span>
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              📋 Relatório Resumido
              <span className="text-xs text-muted-foreground ml-2">(Visão geral)</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Educational Footer */}
      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>💡 Você sabia?</strong> A EAP é uma das ferramentas mais importantes 
              do gerenciamento de projetos profissional (PMBOK).
            </div>
            <Button variant="link" className="text-green-700 p-0 h-auto">
              Saiba mais sobre PMBOK
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EnhancedWBS;
