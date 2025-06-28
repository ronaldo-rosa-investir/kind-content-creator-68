
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TAPApprovalHistory, TAPStatus, ProjectCharter } from '@/types/project';
import { Download, Eye, GitBranch, Clock, User } from 'lucide-react';
import TAPViewModal from './TAPViewModal';
import { printTAP, downloadTAPAsPDF } from '@/utils/tapUtils';

interface VersionHistoryProps {
  history: TAPApprovalHistory[];
  currentVersion: string;
  charter: ProjectCharter;
  onViewVersion: (version: string) => void;
  onDownloadVersion: (version: string) => void;
  onCompareVersions: (v1: string, v2: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  history,
  currentVersion,
  charter,
  onViewVersion,
  onDownloadVersion,
  onCompareVersions
}) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const getStatusBadge = (status: TAPStatus) => {
    const styles = {
      'rascunho': 'bg-gray-100 text-gray-800',
      'pendente-aprovacao': 'bg-yellow-100 text-yellow-800',
      'aprovado': 'bg-green-100 text-green-800',
      'aprovado-com-ressalva': 'bg-orange-100 text-orange-800',
      'rejeitado': 'bg-red-100 text-red-800'
    };

    const labels = {
      'rascunho': 'Rascunho',
      'pendente-aprovacao': 'Pendente',
      'aprovado': 'Aprovado',
      'aprovado-com-ressalva': 'Aprovado c/ Ressalva',
      'rejeitado': 'Rejeitado'
    };

    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const handleViewVersion = (versionId: string) => {
    setSelectedVersion(versionId);
    setViewModalOpen(true);
    onViewVersion(versionId);
  };

  const handleDownloadVersion = (versionId: string) => {
    downloadTAPAsPDF(charter, versionId);
    onDownloadVersion(versionId);
  };

  const handlePrintTAP = () => {
    printTAP(charter, selectedVersion);
  };

  const handleDownloadTAP = () => {
    downloadTAPAsPDF(charter, selectedVersion);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Histórico de Versões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum histórico disponível
              </p>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {history.map((entry, index) => (
                  <div key={entry.id} className="relative flex items-start gap-4 pb-6">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                      entry.status === 'aprovado' ? 'bg-green-500 border-green-500' :
                      entry.status === 'aprovado-com-ressalva' ? 'bg-orange-500 border-orange-500' :
                      entry.status === 'rejeitado' ? 'bg-red-500 border-red-500' :
                      entry.status === 'pendente-aprovacao' ? 'bg-yellow-500 border-yellow-500' :
                      'bg-gray-400 border-gray-400'
                    }`}></div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(entry.status)}
                          {index === 0 && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewVersion(entry.id)}
                            title="Visualizar versão"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadVersion(entry.id)}
                            title="Download versão"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {new Date(entry.date).toLocaleString('pt-BR')}
                        </div>
                        
                        {entry.approver && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {entry.approver}
                          </div>
                        )}
                        
                        {entry.comments && (
                          <div className="mt-2 p-2 bg-white rounded text-xs">
                            <strong>Comentários:</strong> {entry.comments}
                          </div>
                        )}
                        
                        {entry.conditions && (
                          <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                            <strong>Condições:</strong> {entry.conditions}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {history.length > 1 && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (history.length >= 2) {
                      onCompareVersions(history[0].id, history[1].id);
                    }
                  }}
                  className="w-full"
                >
                  Comparar Duas Últimas Versões
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TAPViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        charter={charter}
        version={selectedVersion}
        onPrint={handlePrintTAP}
        onDownload={handleDownloadTAP}
      />
    </>
  );
};

export default VersionHistory;
