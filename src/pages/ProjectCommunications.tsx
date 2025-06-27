import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Plus, Calendar, Users, Bell, Mail, Phone, Video, BarChart3 } from "lucide-react";

export default function ProjectCommunications() {
  const { projectId } = useParams();

  // Mock data para demonstração
  const meetings = [
    {
      id: 1,
      title: "Reunião de Status Semanal",
      date: "2024-07-22",
      time: "14:00",
      duration: "60 min",
      organizer: "João Silva",
      attendees: ["Maria Santos", "Pedro Costa", "Ana Lima"],
      status: "agendada",
      type: "recorrente"
    },
    {
      id: 2,
      title: "Revisão de Arquitetura",
      date: "2024-07-25",
      time: "10:00",
      duration: "120 min",
      organizer: "Pedro Costa",
      attendees: ["João Silva", "Carlos Silva"],
      status: "concluida",
      type: "unica"
    },
    {
      id: 3,
      title: "Apresentação para Stakeholders",
      date: "2024-07-30",
      time: "16:00",
      duration: "90 min",
      organizer: "Maria Santos",
      attendees: ["Diretoria", "Patrocinadores"],
      status: "agendada",
      type: "apresentacao"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "João Silva",
      message: "Pessoal, conseguimos finalizar o módulo de vendas. Está disponível para testes.",
      timestamp: "2024-07-20 15:30",
      type: "update"
    },
    {
      id: 2,
      sender: "Maria Santos",
      message: "Atenção: Reunião de amanhã foi adiada para 16h devido a conflito na agenda do cliente.",
      timestamp: "2024-07-20 10:15",
      type: "alert"
    },
    {
      id: 3,
      sender: "Pedro Costa",
      message: "Identifiquei um risco na integração. Vou documentar e discutir na próxima reunião.",
      timestamp: "2024-07-19 14:45",
      type: "risk"
    },
    {
      id: 4,
      sender: "Ana Lima",
      message: "Orçamento atualizado com os novos custos de infraestrutura. Ainda dentro do limite aprovado.",
      timestamp: "2024-07-19 09:20",
      type: "finance"
    }
  ];

  const statusReports = [
    {
      id: 1,
      week: "Semana 29/2024",
      date: "2024-07-22",
      progress: 75,
      status: "verde",
      achievements: "Finalização do módulo de vendas",
      issues: "Pequeno atraso na integração",
      nextWeek: "Início dos testes de integração"
    },
    {
      id: 2,
      week: "Semana 28/2024",
      date: "2024-07-15",
      progress: 70,
      status: "amarelo",
      achievements: "Desenvolvimento de 80% do backend",
      issues: "Dependência externa atrasada",
      nextWeek: "Finalizar módulo de vendas"
    }
  ];

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "update": return "bg-blue-100 text-blue-800";
      case "alert": return "bg-red-100 text-red-800";
      case "risk": return "bg-yellow-100 text-yellow-800";
      case "finance": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada": return "bg-blue-100 text-blue-800";
      case "concluida": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case "apresentacao": return <Video className="h-4 w-4" />;
      case "recorrente": return <Calendar className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getReportStatusColor = (status: string) => {
    switch (status) {
      case "verde": return "bg-green-100 text-green-800";
      case "amarelo": return "bg-yellow-100 text-yellow-800";
      case "vermelho": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comunicações do Projeto</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Reunião
          </Button>
        </div>
      </div>

      <Tabs defaultValue="meetings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meetings">Reuniões</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="reports">Status Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda de Reuniões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getMeetingTypeIcon(meeting.type)}
                        <div>
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(meeting.date).toLocaleDateString('pt-BR')} às {meeting.time} ({meeting.duration})
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">Organizador: {meeting.organizer}</p>
                        <p className="text-xs text-gray-500">
                          {meeting.attendees.length} participante(s)
                        </p>
                      </div>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Mural de Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {msg.sender.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{msg.sender}</span>
                        <Badge className={getMessageTypeColor(msg.type)}>
                          {msg.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Nova Mensagem</h4>
                <div className="space-y-3">
                  <Textarea placeholder="Digite sua mensagem..." />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-1" />
                        Notificar Todos
                      </Button>
                    </div>
                    <Button>Enviar Mensagem</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatórios de Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{report.week}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getReportStatusColor(report.status)}>
                          Status: {report.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Progresso:</span>
                        <p className="text-gray-600">{report.progress}% concluído</p>
                      </div>
                      <div>
                        <span className="font-medium">Conquistas:</span>
                        <p className="text-gray-600">{report.achievements}</p>
                      </div>
                      <div>
                        <span className="font-medium">Próximos Passos:</span>
                        <p className="text-gray-600">{report.nextWeek}</p>
                      </div>
                    </div>
                    {report.issues && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded border">
                        <span className="font-medium text-yellow-800">Questões:</span>
                        <p className="text-yellow-700 text-sm">{report.issues}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Mudanças no Cronograma</h4>
                    <p className="text-sm text-gray-500">Notificar quando datas de tarefas forem alteradas</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Novos Riscos</h4>
                    <p className="text-sm text-gray-500">Alertas para riscos identificados</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Reuniões Agendadas</h4>
                    <p className="text-sm text-gray-500">Lembrete 1 hora antes das reuniões</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Relatórios Semanais</h4>
                    <p className="text-sm text-gray-500">Resumo semanal do progresso do projeto</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
