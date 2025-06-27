
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Users, Database, FileTemplate } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const settingsSections = [
    {
      title: "Perfil do Usuário",
      description: "Gerencie suas informações pessoais e preferências",
      icon: User,
      url: "/config/perfil"
    },
    {
      title: "Gerenciamento de Usuários",
      description: "Administre usuários e permissões do sistema",
      icon: Users,
      url: "/config/usuarios"
    },
    {
      title: "Configurações do Sistema",
      description: "Configurações gerais e parâmetros do sistema",
      icon: Database,
      url: "/config/sistema"
    },
    {
      title: "Modelos e Templates",
      description: "Gerencie modelos de TAP, EAP e outros documentos",
      icon: FileTemplate,
      url: "/config/modelos"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-green-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <Button asChild className="w-full">
                <Link to={section.url}>
                  <Settings className="h-4 w-4 mr-2" />
                  Acessar Configurações
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
