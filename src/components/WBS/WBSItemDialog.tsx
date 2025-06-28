
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { WBSHierarchyManager } from '@/utils/wbsHierarchyUtils';
import { WBS_ITEM_TYPES } from '@/types/wbs';
import { HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WBSItemHierarchy } from '@/types/wbs';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WBSItemDialogProps {
  trigger: React.ReactNode;
  wbsItem?: WBSItemHierarchy;
  parentItem?: WBSItemHierarchy | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ItemType = 'projeto' | 'entrega' | 'componente' | 'pacote-trabalho';

interface FormData {
  parentId: string;
  activity: string;
  itemType: ItemType;
  responsible: string;
  estimatedCost: number;
  description: string;
  notes: string;
}

export const WBSItemDialog = ({ 
  trigger, 
  wbsItem, 
  parentItem, 
  isOpen = false, 
  onOpenChange 
}: WBSItemDialogProps) => {
  const { addWBSItem, updateWBSItem, wbsItems, projectCharter } = useProject();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      parentId: wbsItem?.parentId || parentItem?.id || 'root',
      activity: wbsItem?.activity || '',
      itemType: wbsItem?.itemType || 'componente',
      responsible: wbsItem?.responsible || '',
      estimatedCost: wbsItem?.estimatedCost || 0,
      description: wbsItem?.description || '',
      notes: wbsItem?.notes || ''
    }
  });

  // Control dialog state
  const dialogOpen = onOpenChange ? isOpen : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  // Get project name
  const projectName = projectCharter.length > 0 ? projectCharter[0].projectName : 'Projeto';

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        parentId: wbsItem?.parentId || parentItem?.id || 'root',
        activity: wbsItem?.activity || '',
        itemType: wbsItem?.itemType || 'componente',
        responsible: wbsItem?.responsible || '',
        estimatedCost: wbsItem?.estimatedCost || 0,
        description: wbsItem?.description || '',
        notes: wbsItem?.notes || ''
      });
    }
  }, [dialogOpen, wbsItem, parentItem, form]);

  const generateCode = () => {
    const parentId = form.getValues('parentId');
    const actualParentId = parentId === 'root' ? null : parentId;
    return WBSHierarchyManager.generateNextCode(actualParentId, wbsItems);
  };

  const getAvailableParents = () => {
    const parents = [{ id: 'root', label: `🏠 Raiz - ${projectName}` }];
    
    wbsItems
      .filter(item => wbsItem ? item.id !== wbsItem.id : true)
      .filter(item => {
        if (wbsItem && WBSHierarchyManager.hasCircularReference(item.id, wbsItem.id, wbsItems)) {
          return false;
        }
        return true;
      })
      .forEach(item => {
        const typeInfo = WBS_ITEM_TYPES[item.itemType];
        parents.push({
          id: item.id,
          label: `${typeInfo.icon} ${item.code} - ${item.activity}`
        });
      });
    
    return parents;
  };

  const onSubmit = (data: FormData) => {
    // Check circular reference
    const actualParentId = data.parentId === 'root' ? null : data.parentId;
    
    if (actualParentId && wbsItem && 
        WBSHierarchyManager.hasCircularReference(actualParentId, wbsItem.id, wbsItems)) {
      toast({
        title: "Erro de validação",
        description: "Não é possível criar uma referência circular.",
        variant: "destructive"
      });
      return;
    }

    const finalCode = wbsItem ? wbsItem.code : generateCode();
    
    const itemData = {
      code: finalCode,
      activity: data.activity,
      itemType: data.itemType,
      parentId: actualParentId || undefined,
      responsible: data.responsible,
      estimatedCost: data.estimatedCost,
      description: data.description,
      notes: data.notes,
      phaseId: '',
      daysAfterStart: 0,
      estimatedHours: 0,
      actualHours: 0,
      hourlyRate: 0,
      actualCost: wbsItem?.actualCost || 0,
      contractType: 'horas' as const
    };

    if (wbsItem) {
      updateWBSItem(wbsItem.id, itemData);
      toast({
        title: "Item EAP atualizado",
        description: `${finalCode} - ${data.activity} foi atualizado com sucesso.`,
      });
    } else {
      addWBSItem(itemData);
      toast({
        title: "Item EAP criado",
        description: `${finalCode} - ${data.activity} foi criado com sucesso.`,
      });
    }
    
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            📊 {wbsItem ? 'Editar Item EAP' : 'Novo Item EAP'}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>ℹ️ A EAP organiza o trabalho em pacotes hierárquicos:</p>
                  <p>• Nível 1: Projeto completo</p>
                  <p>• Nível 2: Principais entregas</p>
                  <p>• Nível 3+: Componentes e pacotes de trabalho</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription className="text-base">
            {wbsItem 
              ? 'Edite as informações do item da estrutura analítica do projeto' 
              : 'Crie um novo item na estrutura analítica do projeto'
            }
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Dica:</strong> Organize o trabalho hierarquicamente. Comece com entregas principais e depois detalhe em pacotes de trabalho menores.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Code and Parent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel className="text-sm font-semibold">Código EAP</FormLabel>
                <FormControl>
                  <Input
                    value={wbsItem ? wbsItem.code : generateCode()}
                    readOnly={true}
                    disabled={true}
                    className="bg-gray-50 font-mono text-sm border-2"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Código gerado automaticamente
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Item Pai *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2">
                          <SelectValue placeholder="Selecione o item pai" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-2 shadow-lg">
                        {getAvailableParents().map((parent) => (
                          <SelectItem key={parent.id} value={parent.id} className="hover:bg-gray-50">
                            {parent.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Onde este item se encaixa na hierarquia
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Activity Name (Full Width) */}
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Nome da Atividade *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Desenvolvimento do Sistema de Vendas"
                      className="border-2 text-base py-3"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Nome claro e descritivo da atividade ou entrega
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 3: Type and Responsible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Tipo do Item</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-2 shadow-lg">
                        {Object.entries(WBS_ITEM_TYPES).map(([key, type]) => (
                          <SelectItem key={key} value={key} className="hover:bg-gray-50">
                            <span className="flex items-center gap-2">
                              {type.icon} {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Classificação do item na EAP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Responsável *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome do responsável"
                        className="border-2"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Pessoa ou equipe responsável
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Cost (Smaller Width) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Custo Estimado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                        className="border-2"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Valor estimado para execução
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 5: Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Descrição Detalhada</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva detalhadamente o que deve ser entregue, critérios de aceitação, especificações técnicas..."
                      rows={4}
                      className="border-2 resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Informações detalhadas sobre o escopo e critérios
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 6: Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Observações e Riscos</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Riscos identificados, dependências, recursos necessários, observações importantes..."
                      rows={3}
                      className="border-2 resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Informações adicionais, riscos e dependências
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {wbsItem ? '✅ Atualizar Item' : '➕ Criar Item'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
