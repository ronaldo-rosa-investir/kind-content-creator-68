
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VisualAnalysisProps {
  costByWBS: any[];
  progressByWBS: any[];
  budgetData: any[];
  totalActualCost: number;
}

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8834D8', '#82CA9D'];

export const VisualAnalysis = ({ costByWBS, progressByWBS, budgetData, totalActualCost }: VisualAnalysisProps) => {
  const hasData = costByWBS.length > 0 || progressByWBS.length > 0 || totalActualCost > 0;

  if (!hasData) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Análise Visual</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {progressByWBS.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Progresso por Pacote de Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressByWBS}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Progresso']}
                    labelFormatter={(label) => {
                      const item = progressByWBS.find(p => p.name === label);
                      return item ? item.activity : label;
                    }}
                  />
                  <Bar dataKey="progress" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {costByWBS.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Custos por Pacote de Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costByWBS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costByWBS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Status do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                  <Bar dataKey="Orçamento Total" fill="#8884d8" />
                  <Bar dataKey="Custo Real" fill="#82ca9d" />
                  <Bar dataKey="Disponível" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
