
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, AlertTriangle, Shield, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Risk {
  id: string;
  code: string;
  description: string;
  category: 'tecnico' | 'gerencial' | 'externo' | 'organizacional';
  probability: 'muito-baixa' | 'baixa' | 'media' | 'alta' | 'muito-alta';
  impact: 'muito-baixo' | 'baixo' | 'medio' | 'alto' | 'muito-alto';
  riskScore: number;
  status: 'identificado' | 'analisado' | 'planejado' | 'monitorado' | 'fechado';
  owner: string;
  triggers: string;
  response: 'aceitar' | 'evitar' | 'mitigar' | 'transferir';
  actionPlan: string;
  contingencyPlan: string;
  cost: number;
  dueDate: string;
  createdAt: string;
}

const RiskPlan = () => {
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: '1',
      code: 'R001',
      description: 'Atraso na entrega de requisitos pelo cliente',
      category: 'externo',
      probability: 'media',
      impact: 'alto',
      riskScore: 12,
      status: 'monitorado',
      owner: 'Gerente do Projeto',
      triggers: 'Cliente não responde em 48h',
      response: 'mitigar',
      actionPlan: 'Agendar reuniões semanais de follow-up',
      contingencyPlan: 'Usar requisitos do projeto similar anterior',
      cost: 5000,
      dueDate: '2024-12-31',
      createdAt: '2024-01-15'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [newRisk, setNewRisk] = useState({
    code: '',
    description: '',
    category: 'tecnico' as Risk['category'],
    probability: 'media' as Risk['probability'],
    impact: 'medio' as Risk['impact'],
    owner: '',
    triggers: '',
    response: 'mitigar' as Risk['response'],
    actionPlan: '',
    contingencyPlan: '',
    cost: 0,
    dueDate: ''
  });

  const probabilityValues = {
    'muito-baixa': 1,
    'baixa': 2,
    'media': 3,
    'alta': 4,
    'muito-alta': 5
  };

  const impactValues = {
    'muito-baixo': 1,
    'baixo': 2,
    'medio': 3,
    'alto': 4,
    'muito-alto': 5
  };

  const calculateRiskScore = (probability: Risk['probability'], impact: Risk['impact']) => {
    return probabilityValues[probability] * impactValues[impact];
  };

  const getRiskLevel = (score: number) => {
    if (score <= 6) return { level: 'Baixo', color: 'bg-green-100 text-green-800' };
    if (score <= 12) return { level: 'Médio', color: 'bg-yellow-100 text-yellow-800' };
    if (score <= 20) return { level: 'Alto', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Muito Alto', color: 'bg-red-100 text-red-800' };
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'tecnico': 'bg-blue-100 text-blue-800',
      'gerencial': 'bg-purple-100 text-purple-800',
      'externo': 'bg-orange-100 text-orange-800',
      'organizacional': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'identificado': 'bg-gray-100 text-gray-800',
      'analisado': 'bg-blue-100 text-blue-800',
      'planejado': 'bg-yellow-100 text-yellow-800',
      'monitorado': 'bg-green-100 text-green-800',
      'fechado': 'bg-gray-100 text-gray-600'
    };
    return colors[status as keyof typeof colors];
  };

  const getResponseColor = (response: string) => {
    const colors = {
      'aceitar': 'bg-blue-100 text-blue-800',
      'evitar': 'bg-red-100 text-red-800',
      'mitigar': 'bg-yellow-100 text-yellow-800',
      'transferir': 'bg-purple-100 text-purple-800'
    };
    return colors[response as keyof typeof colors];
  };

  const addOrUpdateRisk = () => {
    const riskScore = calculateRiskScore(newRisk.probability, newRisk.impact);
    
    if (editingRisk) {
      const updatedRisk = {
        ...editingRisk,
        ...newRisk,
        riskScore,
        status: 'analisado' as Risk['status']
      };
      setRisks(risks.map(r => r.id === editingRisk.id ? updatedRisk : r));
      toast.success('Risco atualizado com sucesso!');
    } else {
      const risk: Risk = {
        id: `risk-${Date.now()}`,
        ...newRisk,
        riskScore,
        status: 'identificado',
        createdAt: new Date().toISOString()
      };
      setRisks([...risks, risk]);
      toast.success('Risco adicionado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewRisk({
      code: '',
      description: '',
      category: 'tecnico',
      probability: 'media',
      impact: 'medio',
      owner: '',
      triggers: '',
      response: 'mitigar',
      actionPlan: '',
      contingencyPlan: '',
      cost: 0,
      dueDate: ''
    });
    setEditingRisk(null);
  };

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setNewRisk({
      code: risk.code,
      description: risk.description,
      category: risk.category,
      probability: risk.probability,
      impact: risk.impact,
      owner: risk.owner,
      triggers: risk.triggers,
      response: risk.response,
      actionPlan: risk.actionPlan,
      contingencyPlan: risk.contingencyPlan,
      cost: risk.cost,
      dueDate: risk.dueDate
    });
    setIsDialogOpen(true);
  };

  const deleteRisk = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este risco?')) {
      setRisks(risks.filter(r => r.id !== id));
      toast.success('Risco removido!');
    }
  };

  const getRiskStatistics = () => {
    const total = risks.length;
    const high = risks.filter(r => r.riskScore > 12).length;
    const medium = risks.filter(r => r.riskScore >= 6 && r.riskScore <= 12).length;
    const low = risks.filter(r => r.riskScore < 6).length;
    const active = risks.filter(r => r.status !== 'fechado').length;

    return { total, high, medium, low, active };
  };

  const stats = getRiskStatistics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Plano de Gestão de Riscos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Identificar Risco
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRisk ? 'Editar Risco' : 'Identificar Novo Risco'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código do Risco</Label>
                  <Input
                    id="code"
                    value={newRisk.code}
                    onChange={(e) => setNewRisk({ ...newRisk, code: e.target.value })}
                    placeholder="R001"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={newRisk.category}
                    onValueChange={(value: Risk['category']) => setNewRisk({ ...newRisk, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="gerencial">Gerencial</SelectItem>
                      <SelectItem value="externo">Externo</SelectItem>
                      <SelectItem value="organizacional">Organizacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição do Risco</Label>
                <Textarea
                  id="description"
                  value={newRisk.description}
                  onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                  placeholder="Descreva o risco identificado..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="probability">Probabilidade</Label>
                  <Select
                    value={newRisk.probability}
                    onValueChange={(value: Risk['probability']) => setNewRisk({ ...newRisk, probability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muito-baixa">Muito Baixa (10%)</SelectItem>
                      <SelectItem value="baixa">Baixa (30%)</SelectItem>
                      <SelectItem value="media">Média (50%)</SelectItem>
                      <SelectItem value="alta">Alta (70%)</SelectItem>
                      <SelectItem value="muito-alta">Muito Alta (90%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="impact">Impacto</Label>
                  <Select
                    value={newRisk.impact}
                    onValueChange={(value: Risk['impact']) => setNewRisk({ ...newRisk, impact: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muito-baixo">Muito Baixo</SelectItem>
                      <SelectItem value="baixo">Baixo</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="muito-alto">Muito Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Score do Risco</Label>
                  <div className="h-10 flex items-center">
                    <Badge className={getRiskLevel(calculateRiskScore(newRisk.probability, newRisk.impact)).color}>
                      {calculateRiskScore(newRisk.probability, newRisk.impact)} - {getRiskLevel(calculateRiskScore(newRisk.probability, newRisk.impact)).level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner">Responsável</Label>
                  <Input
                    id="owner"
                    value={newRisk.owner}
                    onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div>
                  <Label htmlFor="response">Estratégia de Resposta</Label>
                  <Select
                    value={newRisk.response}
                    onValueChange={(value: Risk['response']) => setNewRisk({ ...newRisk, response: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aceitar">Aceitar</SelectItem>
                      <SelectItem value="evitar">Evitar</SelectItem>
                      <SelectItem value="mitigar">Mitigar</SelectItem>
                      <SelectItem value="transferir">Transferir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="triggers">Gatilhos/Sinais de Alerta</Label>
                <Textarea
                  id="triggers"
                  value={newRisk.triggers}
                  onChange={(e) => setNewRisk({ ...newRisk, triggers: e.target.value })}
                  placeholder="Quais sinais indicam que o risco está se materializando?"
                />
              </div>

              <div>
                <Label htmlFor="actionPlan">Plano de Ação</Label>
                <Textarea
                  id="actionPlan"
                  value={newRisk.actionPlan}
                  onChange={(e) => setNewRisk({ ...newRisk, actionPlan: e.target.value })}
                  placeholder="Ações para responder ao risco..."
                />
              </div>

              <div>
                <Label htmlFor="contingencyPlan">Plano de Contingência</Label>
                <Textarea
                  id="contingencyPlan"
                  value={newRisk.contingencyPlan}
                  onChange={(e) => setNewRisk({ ...newRisk, contingencyPlan: e.target.value })}
                  placeholder="O que fazer se o risco se materializar?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Custo da Resposta (R$)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newRisk.cost}
                    onChange={(e) => setNewRisk({ ...newRisk, cost: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Data Limite</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newRisk.dueDate}
                    onChange={(e) => setNewRisk({ ...newRisk, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={addOrUpdateRisk} className="w-full">
                {editingRisk ? 'Atualizar Risco' : 'Registrar Risco'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Riscos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Altos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Médios</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Baixos</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riscos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Matriz de Riscos */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Riscos do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Resposta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.riskScore);
                  return (
                    <TableRow key={risk.id}>
                      <TableCell className="font-mono">{risk.code}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={risk.description}>
                          {risk.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(risk.category)}>
                          {risk.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">{risk.riskScore}</TableCell>
                      <TableCell>
                        <Badge className={riskLevel.color}>
                          {riskLevel.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{risk.owner}</TableCell>
                      <TableCell>
                        <Badge className={getResponseColor(risk.response)}>
                          {risk.response}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(risk)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRisk(risk.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Riscos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700">🚨 Riscos de Alta Prioridade</CardTitle>
        </CardHeader>
        <CardContent>
          {risks.filter(r => r.riskScore > 12).length > 0 ? (
            <div className="space-y-4">
              {risks
                .filter(r => r.riskScore > 12)
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((risk) => (
                  <div key={risk.id} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-red-900">
                        {risk.code} - {risk.description}
                      </h4>
                      <Badge className="bg-red-100 text-red-800">
                        Score: {risk.riskScore}
                      </Badge>
                    </div>
                    <div className="text-sm text-red-700 space-y-1">
                      <p><strong>Responsável:</strong> {risk.owner}</p>
                      <p><strong>Gatilhos:</strong> {risk.triggers}</p>
                      <p><strong>Plano de Ação:</strong> {risk.actionPlan}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-green-600">✅ Nenhum risco de alta prioridade identificado!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskPlan;
