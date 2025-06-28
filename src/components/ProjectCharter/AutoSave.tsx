
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Save, Clock, CheckCircle } from 'lucide-react';

interface AutoSaveProps {
  onSave: () => void;
  isEnabled: boolean;
  interval?: number; // em segundos
}

const AutoSave: React.FC<AutoSaveProps> = ({ 
  onSave, 
  isEnabled, 
  interval = 30 
}) => {
  const [lastSave, setLastSave] = useState<Date | null>(null);
  const [timeToNextSave, setTimeToNextSave] = useState(interval);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const timer = setInterval(() => {
      setTimeToNextSave(prev => {
        if (prev <= 1) {
          handleAutoSave();
          return interval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, interval]);

  const handleAutoSave = async () => {
    if (!isEnabled) return;
    
    setIsSaving(true);
    try {
      await onSave();
      setLastSave(new Date());
    } catch (error) {
      console.error('Erro no salvamento automático:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg p-3 border">
        {isSaving ? (
          <>
            <Save className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm">Salvando...</span>
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              Próximo salvamento em {timeToNextSave}s
            </span>
          </>
        )}
        
        {lastSave && (
          <Badge variant="outline" className="ml-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            {lastSave.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AutoSave;
