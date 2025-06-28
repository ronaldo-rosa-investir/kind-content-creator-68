
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectCharter } from '@/types/project';
import { Printer, Download, X } from 'lucide-react';
import TAPDocument from './TAPDocument';

interface TAPViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  charter: ProjectCharter;
  version?: string;
  onPrint: () => void;
  onDownload: () => void;
}

const TAPViewModal: React.FC<TAPViewModalProps> = ({
  isOpen,
  onClose,
  charter,
  version = '1.0',
  onPrint,
  onDownload
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle>
              Visualização do TAP - {charter.projectName} (v{version})
            </DialogTitle>
            <div className="tap-actions no-print flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onPrint}
                className="btn-print"
                title="Imprimir TAP"
              >
                <Printer className="h-4 w-4 mr-2" />
                🖨️ Imprimir
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onDownload}
                className="btn-pdf"
                title="Download PDF"
              >
                <Download className="h-4 w-4 mr-2" />
                📄 Download PDF
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <TAPDocument 
            charter={charter} 
            version={version}
            className="print:shadow-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TAPViewModal;
