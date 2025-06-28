
import React, { useState, useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, DollarSign, TrendingUp, AlertTriangle, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CostCategory {
  id: string;
  name: string;
  type: 'mao-de-obra' | 'equipamento' | 'material' | 'consultoria' | 'outros';
  plannedCost: number;
  actualCost: number;
  phaseId?: string;
  wbsItemId?: string;
  description: string;
  responsible: string;
  status: 'planejado' | 'aprovado' | 'em-execucao' | 'concluido';
}

interface CostBaseline {
  id: string;
  version: string;
  date: string;
  totalPlanned: number;
  categories: CostCategory[];
  approvedBy: string;
}

const CostPlan = () => {
  const { phases, wbsItems, costItems } = useProject();
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [baseline, setBaseline] = useState<CostBaseline | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'mao-de-obra' as CostCategory['type'],
    plannedCost: 0,
    description: '',
    responsible: '',
    phaseId: '',
    wbsItemId: ''
  });

  useEffect(() => {
    generateCostPlanFromData();
  }, [phases, wbsItems, costItems]);

  const generateCostPlanFromData = () => {
    const categories: CostCategory[] = [];

    // Gerar categorias baseadas nos itens de custo existentes
    const groupedCosts = costItems.reduce((acc, item) => {
      const key = `${item.type}-${item.category}`;
      if (!acc[key]) {
        acc[key] = {
          name: item.category || item.type,
          type: item.type,
          items: []
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {} as any);

    Object.entries(groupedCosts).forEach(([key, group]: [string, any]) => {
      const totalPlanned = group.items.reduce((sum: number, item: any) => sum + item.estimatedCost, 0);
      const totalActual = group.items.reduce((sum: number, item: any) => sum + item.actualCost, 0);

      categories.push({
        id: key,
        name: group.name,
        type: group.type,
        plannedCost: totalPlanned,
        actualCost: totalActual,
        description: `Categoria agregada de ${group.items.length} itens`,
        responsible: group.items[0]?.responsible || 'Não definido',
        status: totalActual > 0 ? 'em-execucao' : 'planejado'
      });
    });

    // Adicionar categorias padrão se não existirem
    const defaultCategories = [
      { name: 'Mão de Obra', type: 'mao-de-obra' as const },
      { name: 'Equipamentos', type: 'equipamento' as const },
      { name: 'Materiais', type: 'material' as const },
      { name: 'Consultoria Externa', type: 'consultoria' as const },
      { name: 'Contingência', type: 'outros' as const }
    ];

    defaultCategories.forEach(cat => {
      if (!categories.find(c => c.type === cat.type)) {
        categories.push({
          id: `default-${cat.type}`,
          name: cat.name,
          type: cat.type,
          plannedCost: 0,
          actualCost: 0,
          description: `Categoria ${cat.name}`,
          responsible: 'Gerente do Projeto',
          status: 'planejado'
        });
      }
    });

    setCostCategories(categories);
  };

  const addNewCategory = () => {
    const category: CostCategory = {
      id: `category-${Date.now()}`,
      ...newCategory,
      actualCost: 0,
      status: 'planejado'
    };

    setCostCategories([...costCategories, category]);
    setIsDialogOpen(false);
    setNewCategory({
      name: '',
      type: 'mao-de-obra',
      plannedCost: 0,
      description: '',
      responsible: '',
      phaseId: '',
      wbsItemId: ''
    });
    toast.success('Categoria de custo adicionada!');
  };

  const createBaseline = () => {
    const newBaseline: CostBaseline = {
      id: `baseline-${Date.now()}`,
      version: '1.0',
      date: new Date().toISOString(),
      totalPlanned: getTotalPlannedCost(),
      categories: [...costCategories],
      approvedBy: 'Gerente do Projeto'
    };

    setBaseline(newBaseline);
    toast.success('Baseline de custos criada!');
  };

  const getTotalPlannedCost = () => {
    return costCategories.reduce((sum, cat) => sum + cat.plannedCost, 0);
  };

  const getTotalActualCost = () => {
    return costCategories.reduce((sum, cat) => sum + cat.actualCost, 0);
  };

  const getCostVariance = () => {
    return getTotalPlannedCost() - getTotalActualCost();
  };

  const getCostPerformanceIndex = () => {
    const actualCost = getTotalActualCost();
    return actualCost > 0 ? getTotalPlannedCost() / actualCost : 1;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'mao-de-obra': 'bg-blue-100 text-blue-800',
      'equipamento': 'bg-green-100 text-green-800',
      'material': 'bg-yellow-100 text-yellow-800',
      'consultoria': 'bg-purple-100 text-purple-800',
      'outros': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planejado': 'bg-gray-100 text-gray-800',
      'aprovado': 'bg-green-100 text-green-800',
      'em-execucao': 'bg-blue-100 text-blue-800',
      'concluido': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const monthlyFlow = [
    { month: 'Jan', planned: 15000, actual: 12000 },
    { month: 'Fev', planned: 25000, actual: 22000 },
    { month: 'Mar', planned: 20000, actual: 18000 },
    { month: 'Abr', planned: 18000, actual: 20000 },
    { month: 'Mai', planned: 15000, actual: 8000 },
    { month: 'Jun', planned: 12000, actual: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plano de Custos Detalhado</h1>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Categoria de Custo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Ex: Desenvolvimento Frontend"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryType">Tipo</Label>
                    <Select
                      value={newCategory.type}
                      onValueChange={(value: CostCategory['type']) => setNewCategory({ ...newCategory, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mao-de-obra">Mão de Obra</SelectItem>
                        <SelectItem value="equipamento">Equipamento</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                        <SelectItem value="consultoria">Consultoria</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="plannedCost">Custo Planejado (R$)</Label>
                    <Input
                      id="plannedCost"
                      type="number"
                      value={newCategory.plannedCost}
                      onChange={(e) => setNewCategory({ ...newCategory, plannedCost: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    value={newCategory.responsible}
                    onChange={(e) => setNewCategory({ ...newCategory, responsible: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Descrição da categoria de custo"
                  />
                </div>
                <Button onClick={addNewCategory} className="w-full">
                  Adicionar Categoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={createBaseline}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Criar Baseline
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar EAP
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {getTotalPlannedCost().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">planejado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Real</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {getTotalActualCost().toLocaleString()}</div>
            <Progress value={(getTotalActualCost() / getTotalPlannedCost()) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCostVariance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {Math.abs(getCostVariance()).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {getCostVariance() >= 0 ? 'economia' : 'excesso'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCostPerformanceIndex() >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {getCostPerformanceIndex().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">índice de performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Orçamento por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Orçamento por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Planejado</TableHead>
                  <TableHead>Realizado</TableHead>
                  <TableHead>Variação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costCategories.map((category) => {
                  const variance = category.plannedCost - category.actualCost;
                  const percentExecuted = category.plannedCost > 0 ? 
                    Math.round((category.actualCost / category.plannedCost) * 100) : 0;

                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(category.type)}>
                          {category.type.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>R$ {category.plannedCost.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          R$ {category.actualCost.toLocaleString()}
                          <div className="text-xs text-muted-foreground">
                            {percentExecuted}% executado
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {variance >= 0 ? '+' : ''}R$ {variance.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(category.status)}>
                          {category.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.responsible}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Fluxo de Desembolso */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Desembolso Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyFlow.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-medium w-12">{month.month}</span>
                  <div className="flex gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Planejado: </span>
                      <span className="font-medium">R$ {month.planned.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Real: </span>
                      <span className="font-medium">R$ {month.actual.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={month.planned > 0 ? (month.actual / month.planned) * 100 : 0} 
                    className="w-24" 
                  />
                  <span className={`text-sm ${month.actual <= month.planned ? 'text-green-600' : 'text-red-600'}`}>
                    {month.planned > 0 ? Math.round((month.actual / month.planned) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${getCostVariance() >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            Status do Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            {getCostVariance() >= 0 ? (
              <span className="text-green-600">🟢 Dentro do orçamento</span>
            ) : (
              <span className="text-red-600">🔴 Acima do orçamento</span>
            )}
            <span className="ml-2 text-muted-foreground">
              ({Math.round((getTotalActualCost() / getTotalPlannedCost()) * 100)}% executado)
            </span>
          </div>
          
          {baseline && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Baseline Ativo</h4>
              <p className="text-sm text-blue-700">
                Versão {baseline.version} - Criado em {new Date(baseline.date).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-blue-700">
                Aprovado por: {baseline.approvedBy}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CostPlan;
