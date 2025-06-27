
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, TrendingUp, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function Reports() {
  const reportTypes = [
    {
      title: "Relatório Geral de Portfólio",
      description: "Visão consolidada de todos os projetos, status e performance",
      icon: BarChart3,
      url: "/relatorios/geral"
    },
    {
      title: "Relatórios Customizados",
      description: "Crie relatórios personalizados com filtros específicos",
      icon: FileText,
      url: "/relatorios/customizados"
    },
    {
      title: "Performance da Equipe",
      description: "Análise de produtividade e alocação de recursos",
      icon: Users,
      url: "/relatorios/equipe"
    },
    {
      title: "Timeline de Projetos",
      description: "Cronograma consolidado de todos os projetos",
      icon: Calendar,
      url: "/relatorios/timeline"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <report.icon className="h-6 w-6 text-blue-600" />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <Button asChild className="w-full">
                <Link to={report.url}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Acessar Relatório
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
