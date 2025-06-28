
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Target, Package, FileText, Wrench } from "lucide-react";

interface WBSGuideModalProps {
  trigger: React.ReactNode;
}

const WBSGuideModal = ({ trigger }: WBSGuideModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Entendendo a EAP
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">O que é EAP?</h3>
            </div>
            <p className="text-muted-foreground">
              É uma forma de organizar seu projeto em partes menores, como uma árvore genealógica.
              Cada parte tem um propósito específico e se conecta com as outras.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">📋 Tipos de Item:</h3>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">📁</div>
                    <div>
                      <h4 className="font-semibold">PROJETO (Nível 1)</h4>
                      <p className="text-sm text-muted-foreground">O projeto completo. Só pode ter 1.</p>
                    </div>
                  </div>
                  <p className="text-sm"><strong>Ex:</strong> "Criar E-commerce"</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">📦</div>
                    <div>
                      <h4 className="font-semibold">ENTREGA (Nível 2)</h4>
                      <p className="text-sm text-muted-foreground">Grandes partes do projeto.</p>
                    </div>
                  </div>
                  <p className="text-sm"><strong>Ex:</strong> "Design", "Programação", "Testes"</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">📋</div>
                    <div>
                      <h4 className="font-semibold">COMPONENTE (Nível 3)</h4>
                      <p className="text-sm text-muted-foreground">Grupos de tarefas relacionadas.</p>
                    </div>
                  </div>
                  <p className="text-sm"><strong>Ex:</strong> "Páginas do Site", "Sistema de Pagamento"</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🔧</div>
                    <div>
                      <h4 className="font-semibold">PACOTE DE TRABALHO (Nível N)</h4>
                      <p className="text-sm text-muted-foreground">Tarefas específicas que alguém vai fazer.</p>
                    </div>
                  </div>
                  <p className="text-sm"><strong>Ex:</strong> "Criar página inicial", "Testar checkout"</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xl">💡</div>
              <strong>Dica Importante:</strong>
            </div>
            <p className="text-sm">
              Comece pelo projeto, depois grandes partes, depois tarefas específicas. 
              Pense como se fosse dividir um bolo em fatias menores.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xl">📚</div>
              <strong>Você sabia?</strong>
            </div>
            <p className="text-sm">
              A EAP é uma das ferramentas mais importantes do gerenciamento de projetos profissional (PMBOK).
              É usada por empresas do mundo todo para organizar projetos complexos.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WBSGuideModal;
