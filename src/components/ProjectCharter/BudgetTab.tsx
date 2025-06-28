
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetCategory {
  id: string;
  name: string;
  value: number;
  percentage: number;
}

interface BudgetTabProps {
  totalBudget: number;
  onTotalBudgetChange: (value: number) => void;
  categories: BudgetCategory[];
  onCategoriesChange: (categories: BudgetCategory[]) => void;
}

const BudgetTab: React.FC<BudgetTabProps> = ({
  totalBudget,
  onTotalBudgetChange,
  categories,
  onCategoriesChange
}) => {
  const [customCategories, setCustomCategories] = useState<BudgetCategory[]>([]);
  
  // Categorias padrão do TAP
  const defaultCategories = [
    { id: 'mao-obra', name: 'Mão de Obra', value: 0, percentage: 0 },
    { id: 'material', name: 'Material/Equipamentos', value: 0, percentage: 0 },
    { id: 'servicos', name: 'Serviços Terceirizados', value: 0, percentage: 0 },
    { id: 'contingencia', name: 'Contingência', value: 0, percentage: 0 }
  ];

  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetCategory[]>(defaultCategories);

  useEffect(() => {
    // Calcular contingência sugerida automaticamente (10% do total)
    const contingenciaSugerida = Math.round(totalBudget * 0.1);
    
    setBudgetBreakdown(prev => 
      prev.map(cat => 
        cat.id === 'contingencia' 
          ? { ...cat, value: contingenciaSugerida }
          : cat
      )
    );
  }, [totalBudget]);

  useEffect(() => {
    // Calcular percentuais
    const allCategories = [...budgetBreakdown, ...customCategories];
    const updatedCategories = allCategories.map(cat => ({
      ...cat,
      percentage: totalBudget > 0 ? Math.round((cat.value / totalBudget) * 100) : 0
    }));
    
    setBudgetBreakdown(prev => 
      prev.map(cat => {
        const updated = updatedCategories.find(u => u.id === cat.id);
        return updated || cat;
      })
    );
    
    setCustomCategories(prev => 
      prev.map(cat => {
        const updated = updatedCategories.find(u => u.id === cat.id);
        return updated || cat;
      })
    );
  }, [budgetBreakdown, customCategories, totalBudget]);

  const updateCategoryValue = (id: string, value: number) => {
    setBudgetBreakdown(prev => 
      prev.map(cat => cat.id === id ? { ...cat, value } : cat)
    );
    
    setCustomCategories(prev => 
      prev.map(cat => cat.id === id ? { ...cat, value } : cat)
    );
  };

  const addCustomCategory = () => {
    if (customCategories.length >= 6) return; // Máximo 10 total (4 padrão + 6 custom)
    
    const newCategory: BudgetCategory = {
      id: `custom-${Date.now()}`,
      name: '',
      value: 0,
      percentage: 0
    };
    
    setCustomCategories(prev => [...prev, newCategory]);
  };

  const removeCustomCategory = (id: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const updateCustomCategoryName = (id: string, name: string) => {
    setCustomCategories(prev => 
      prev.map(cat => cat.id === id ? { ...cat, name } : cat)
    );
  };

  // Cálculos
  const totalBreakdown = [...budgetBreakdown, ...customCategories].reduce((sum, cat) => sum + cat.value, 0);
  const difference = totalBudget - totalBreakdown;
  const contingenciaMinima = Math.round(totalBudget * 0.05);
  const contingenciaAtual = budgetBreakdown.find(cat => cat.id === 'contingencia')?.value || 0;
  const contingenciaOK = contingenciaAtual >= contingenciaMinima;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Orçamento Estimado do Projeto (TAP)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Orçamento Total */}
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <Label htmlFor="totalBudget" className="text-lg font-semibold">
            💰 Orçamento Total do Projeto (R$) *
          </Label>
          <Input
            id="totalBudget"
            type="number"
            value={totalBudget}
            onChange={(e) => onTotalBudgetChange(parseFloat(e.target.value) || 0)}
            className="text-2xl font-bold mt-2 bg-white"
            placeholder="120000"
            min="0"
            step="0.01"
            required
          />
          {totalBudget > 0 && (
            <p className="text-sm text-blue-700 mt-1">
              R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Breakdown Preliminar */}
        <div>
          <h3 className="font-semibold mb-3">Breakdown Preliminar:</h3>
          <div className="space-y-3">
            {budgetBreakdown.map((category) => (
              <div key={category.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <Label className="text-sm">{category.name}</Label>
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    value={category.value}
                    onChange={(e) => updateCategoryValue(category.id, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <Badge variant="outline" className="text-xs">
                    {category.percentage}%
                  </Badge>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  R$ {category.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categorias Customizáveis */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Categorias Adicionais:</h3>
            <Button 
              type="button" 
              onClick={addCustomCategory} 
              size="sm" 
              variant="outline"
              disabled={customCategories.length >= 6}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
          </div>
          
          {customCategories.map((category) => (
            <div key={category.id} className="grid grid-cols-12 gap-3 items-center mb-3">
              <div className="col-span-4">
                <Input
                  value={category.name}
                  onChange={(e) => updateCustomCategoryName(category.id, e.target.value)}
                  placeholder="Nome da categoria"
                  className="text-sm"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  value={category.value}
                  onChange={(e) => updateCategoryValue(category.id, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs">
                  {category.percentage}%
                </Badge>
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                R$ {category.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  onClick={() => removeCustomCategory(category.id)}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {customCategories.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Nenhuma categoria adicional. Máximo 6 categorias customizáveis.
            </p>
          )}
          
          {customCategories.length >= 6 && (
            <p className="text-sm text-orange-600">
              Limite máximo de categorias atingido (10 total).
            </p>
          )}
        </div>

        {/* Status e Validações */}
        <div className="space-y-3">
          {/* Validação da Soma */}
          {difference === 0 ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Status:</strong> ✅ Breakdown confere com o total
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Diferença de R$ {Math.abs(difference).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.</strong> 
                {difference > 0 ? ' Faltam categorias ou valores.' : ' Soma maior que o total.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Validação da Contingência */}
          {!contingenciaOK && totalBudget > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Contingência:</strong> ⚠️ Sugerido mínimo R$ {contingenciaMinima.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (5%)
              </AlertDescription>
            </Alert>
          )}

          {/* Resumo Total */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total do Breakdown:</span>
              <span className="font-bold">
                R$ {totalBreakdown.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-sm text-gray-600">
            <strong>Nível TAP:</strong> Estimativas de alto nível (±25% de precisão). 
            Orçamento detalhado será desenvolvido nas fases seguintes do projeto.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default BudgetTab;
