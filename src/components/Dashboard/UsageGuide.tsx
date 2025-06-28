
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export const UsageGuide = () => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Lightbulb className="h-5 w-5" />
          💡 Como usar este sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
            <span>Comece criando o TAP (Termo de Abertura)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
            <span>Defina o escopo detalhado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
            <span>Organize o trabalho na EAP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
            <span>Acompanhe o progresso aqui</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
