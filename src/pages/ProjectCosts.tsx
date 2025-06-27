
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function ProjectCosts() {
  const { projectId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Custos</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Custos do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Página de gestão de custos específica do projeto em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}
