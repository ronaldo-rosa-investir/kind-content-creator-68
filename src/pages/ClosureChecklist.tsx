
import { useEffect, useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClosureChecklist = () => {
  const { closureChecklist, updateClosureChecklist, getProjectDuration, getProjectDurationType } = useProject();
  const [checklist, setChecklist] = useState({
    contractsFinalized: false,
    stakeholderMeeting: false,
    teamReleased: false,
    documentsApproved: false,
    feedbackMeeting: false,
    lessonsLearned: false,
  });

  useEffect(() => {
    if (closureChecklist.length > 0) {
      setChecklist(closureChecklist[0]);
    }
  }, [closureChecklist]);

  const handleCheckboxChange = (field: string, checked: boolean) => {
    const newChecklist = { ...checklist, [field]: checked };
    setChecklist(newChecklist);
    updateClosureChecklist(newChecklist);
  };

  const checklistItems = [
    { key: 'contractsFinalized', label: 'Todos os contratos foram encerrados' },
    { key: 'stakeholderMeeting', label: 'Reunião de Encerramento com os Stakeholders' },
    { key: 'teamReleased', label: 'Liberação dos Membros da Equipe' },
    { key: 'documentsApproved', label: 'Verificar se os documentos do projeto estão assinados' },
    { key: 'feedbackMeeting', label: 'Reunião com os envolvidos no projeto para feedback final' },
    { key: 'lessonsLearned', label: 'Relatório de lições aprendidas foi preenchido?' },
  ];

  const completedItems = Object.values(checklist).filter(Boolean).length;
  const totalItems = checklistItems.length;
  const completionPercentage = (completedItems / totalItems) * 100;

  const duration = getProjectDuration();
  const durationType = getProjectDurationType();

  const getDurationLabel = (type: string) => {
    const labels = {
      'curto': 'Curto (0-15 dias)',
      'medio': 'Médio (16-50 dias)',
      'longo': 'Longo (51-60 dias)',
      'requer-autorizacao': 'Requer Autorização (61+ dias)'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDurationColor = (type: string) => {
    const colors = {
      'curto': 'bg-green-100 text-green-800',
      'medio': 'bg-yellow-100 text-yellow-800',
      'longo': 'bg-orange-100 text-orange-800',
      'requer-autorizacao': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Checklist de Fechamento</h1>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Concluído</span>
                <span>{completedItems}/{totalItems}</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
              <p className="text-2xl font-bold text-green-600">
                {Math.round(completionPercentage)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duração do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{duration} dias</p>
              <Badge className={getDurationColor(durationType)}>
                {getDurationLabel(durationType)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Fechamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completionPercentage === 100 ? (
                <Badge className="bg-green-100 text-green-800">
                  Pronto para Fechamento
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  Pendente ({totalItems - completedItems} itens)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Items */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checklistItems.map((item) => (
              <div key={item.key} className="flex items-start space-x-3 p-3 rounded-lg border">
                <Checkbox
                  checked={checklist[item.key as keyof typeof checklist]}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(item.key, checked as boolean)
                  }
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label className={`text-sm font-medium cursor-pointer ${
                    checklist[item.key as keyof typeof checklist] 
                      ? 'line-through text-muted-foreground' 
                      : ''
                  }`}>
                    {item.label}
                  </label>
                </div>
                {checklist[item.key as keyof typeof checklist] && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Fechamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold">Classificação por Prazo:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>0 a 15 dias = Projeto Curto</li>
                <li>16 a 50 dias = Projeto Médio</li>
                <li>51 a 60 dias = Projeto Longo</li>
                <li>61+ dias = Requer Autorização Especial</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Próximos Passos:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>Complete todos os itens do checklist</li>
                <li>Colete as assinaturas necessárias</li>
                <li>Gere relatórios finais em PDF</li>
                <li>Archive todos os documentos do projeto</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClosureChecklist;
