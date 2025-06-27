
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, ChevronDown, List } from "lucide-react";

export default function ProjectWBS() {
  const { projectId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estrutura Analítica do Projeto (EAP)</h1>
          <p className="text-gray-500">Projeto ID: {projectId}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item EAP
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Estrutura Hierárquica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-gray-500 mb-4">
              Visualização em árvore da decomposição do trabalho do projeto
            </div>
            
            {/* Estrutura EAP simulada */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <ChevronDown className="h-4 w-4" />
                <span className="font-semibold">1.0 Sistema ERP Corporativo</span>
                <Badge variant="outline">Projeto</Badge>
              </div>
              
              <div className="ml-6 space-y-1">
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <ChevronDown className="h-4 w-4" />
                  <span className="font-medium">1.1 Análise e Design</span>
                  <Badge variant="secondary">Fase</Badge>
                </div>
                
                <div className="ml-6 space-y-1">
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <ChevronRight className="h-4 w-4" />
                    <span>1.1.1 Levantamento de Requisitos</span>
                    <Badge>Pacote de Trabalho</Badge>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <ChevronRight className="h-4 w-4" />
                    <span>1.1.2 Modelagem de Dados</span>
                    <Badge>Pacote de Trabalho</Badge>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <ChevronRight className="h-4 w-4" />
                    <span>1.1.3 Arquitetura do Sistema</span>
                    <Badge>Pacote de Trabalho</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <ChevronDown className="h-4 w-4" />
                  <span className="font-medium">1.2 Desenvolvimento</span>
                  <Badge variant="secondary">Fase</Badge>
                </div>
                
                <div className="ml-6 space-y-1">
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <ChevronRight className="h-4 w-4" />
                    <span>1.2.1 Módulo de Vendas</span>
                    <Badge>Pacote de Trabalho</Badge>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <ChevronRight className="h-4 w-4" />
                    <span>1.2.2 Módulo Financeiro</span>
                    <Badge>Pacote de Trabalho</Badge>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <ChevronRight className="h-4 w-4" />
                    <span>1.2.3 Módulo de Estoque</span>
                    <Badge>Pacote de Trabalho</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <ChevronRight className="h-4 w-4" />
                  <span className="font-medium">1.3 Testes e Implantação</span>
                  <Badge variant="secondary">Fase</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
