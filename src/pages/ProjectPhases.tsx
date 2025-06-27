
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, PlayCircle, PauseCircle } from "lucide-react";

export default function ProjectPhases() {
  const { projectId } = useParams();

  const phases = [
    {
      name: "Iniciação",
      status: "concluido",
      startDate: "2024-01-15",
      endDate: "2024-01-30",
      progress: 100,
      deliverables: ["TAP Aprovado", "Stakeholders Identificados", "Equipe Definida"],
      gatesCriteria: ["TAP assinado pelos patrocinadores", "Orçamento aprovado"]
    },
    {
      name: "Planejamento",
      status: "em-andamento",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      progress: 85,
      deliverables: ["Plano de Projeto", "EAP Detalhada", "Cronograma Aprovado"],
      gatesCriteria: ["Todos os planos auxiliares aprovados", "Riscos identificados e mitigados"]
    },
    {
      name: "Execução",
      status: "em-andamento",
      startDate: "2024-03-16",
      endDate: "2024-07-30",
      progress: 60,
      deliverables: ["Produto/Serviço Desenvolvido", "Testes Realizados", "Documentação"],
      gatesCriteria: ["Critérios de aceitação atendidos", "Qualidade validada"]
    },
    {
      name: "Monitoramento e Controle",
      status: "em-andamento",
      startDate: "2024-03-16",
      endDate: "2024-07-30",
      progress: 65,
      deliverables: ["Relatórios de Status", "Controle de Mudanças", "Ações Corretivas"],
      gatesCriteria: ["Performance dentro dos parâmetros", "Stakeholders satisfeitos"]
    },
    {
      name: "Encerramento",
      status: "nao-iniciado",
      startDate: "2024-08-01",
      endDate: "2024-08-15",
      progress: 0,
      deliverables: ["Produto Entregue", "Lições Aprendidas", "Arquivos do Projeto"],
      gatesCriteria: ["Aceitação formal do cliente", "Todos os contratos finalizados"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido": return "bg-green-100 text-green-800";
      case "em-andamento": return "bg-blue-100 text-blue-800";
      case "nao-iniciado": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "em-andamento": return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case "nao-iniciado": return <Clock className="h-5 w-5 text-gray-600" />;
      default: return <PauseCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "concluido": return "Concluído";
      case "em-andamento": return "Em Andamento";
      case "nao-iniciado": return "Não Iniciado";
      default: return "Pausado";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fases do Projeto</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
      </div>

      <div className="space-y-6">
        {phases.map((phase, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <span>{phase.name}</span>
                  <Badge className={getStatusColor(phase.status)}>
                    {getStatusText(phase.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={phase.progress} className="w-32" />
                  <span className="text-sm font-medium">{phase.progress}%</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Cronograma
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>Início: {new Date(phase.startDate).toLocaleDateString('pt-BR')}</div>
                    <div>Fim: {new Date(phase.endDate).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Principais Entregas</h4>
                  <ul className="space-y-1 text-sm">
                    {phase.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Critérios de Gates</h4>
                  <ul className="space-y-1 text-sm">
                    {phase.gatesCriteria.map((criteria, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
