
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Eye, Edit, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import WBSItemDialog from "@/components/WBSItemDialog";
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

const WBS = () => {
  const { phases, wbsItems, getWBSItemsByPhase, getWBSProgress, deleteWBSItem, addTask } = useProject();
  const { toast } = useToast();

  const handleDeleteWBSItem = (itemId: string) => {
    deleteWBSItem(itemId);
    toast({
      title: "Item EAP excluído",
      description: "O item foi removido com sucesso.",
    });
  };

  const handleGenerateTask = (wbsItem: any) => {
    const phase = phases.find(p => p.id === wbsItem.phaseId);
    addTask({
      title: wbsItem.activity,
      wbsItemId: wbsItem.id,
      phaseId: wbsItem.phaseId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      responsible: wbsItem.responsible,
      description: `Tarefa gerada a partir do Item EAP: ${wbsItem.code} - ${wbsItem.activity}`,
      status: 'nao-iniciado' as const,
      estimatedHours: wbsItem.estimatedHours,
      actualHours: 0,
      hourlyRate: wbsItem.hourlyRate,
    });
    
    toast({
      title: "Tarefa gerada com sucesso",
      description: "Uma nova tarefa foi criada a partir deste item EAP.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Estrutura Analítica do Projeto (EAP)</h1>
        <WBSItemDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item EAP
            </Button>
          }
        />
      </div>

      {phases.map((phase) => {
        const phaseItems = getWBSItemsByPhase(phase.id);
        
        return (
          <Card key={phase.id} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {phase.name}
                    <Badge variant="outline" className="text-xs">
                      {phaseItems.length} itens
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {phase.description}
                  </p>
                </div>
                <Badge 
                  variant={phase.status === 'em-andamento' ? 'default' : 'secondary'}
                  className={phase.status === 'em-andamento' ? 'bg-green-100 text-green-800' : ''}
                >
                  {phase.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {phaseItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum item EAP criado para esta fase</p>
                  <p className="text-sm mt-2">Comece adicionando o primeiro item</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {phaseItems.map((item) => {
                    const progress = getWBSProgress(item.id);
                    
                    return (
                      <Card key={item.id} className="border border-gray-100">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                  {item.code}
                                </span>
                                <h3 className="font-semibold">{item.activity}</h3>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Responsável: {item.responsible}</span>
                                  <span>Dias após início: {item.daysAfterStart}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Progresso</span>
                                      <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-muted-foreground">
                                    Custo Estimado: R$ {item.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="text-muted-foreground">
                                    Custo Real: R$ {item.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Link to={`/eap/${item.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <WBSItemDialog
                                trigger={
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                                wbsItem={item}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateTask(item)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
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
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {phases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma fase criada ainda</p>
          <p className="text-sm text-muted-foreground mb-4">
            Crie pelo menos uma fase antes de adicionar itens EAP
          </p>
          <Link to="/fases">
            <Button variant="outline">
              Ir para Fases
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WBS;
