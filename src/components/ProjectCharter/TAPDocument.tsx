
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCharter, TAPStatus } from '@/types/project';
import { Calendar, User, DollarSign, FileText, Users, Target, CheckCircle } from 'lucide-react';

interface TAPDocumentProps {
  charter: ProjectCharter;
  version?: string;
  className?: string;
}

const TAPDocument: React.FC<TAPDocumentProps> = ({ 
  charter, 
  version = '1.0',
  className = ''
}) => {
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
      'pendente-aprovacao': 'Pendente de Aprovação',
      'aprovado': 'Aprovado',
      'aprovado-com-ressalva': 'Aprovado com Ressalva',
      'rejeitado': 'Rejeitado'
    };

    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto bg-white ${className}`}>
      {/* Cabeçalho do Documento */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          TERMO DE ABERTURA DO PROJETO (TAP)
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {charter.projectName}
        </h2>
        <div className="flex justify-center gap-4 items-center">
          {getStatusBadge(charter.approval?.status || 'rascunho')}
          <Badge variant="outline">Versão {version}</Badge>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Informações Básicas */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">1. INFORMAÇÕES BÁSICAS</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Nome do Projeto:</p>
              <p className="text-gray-900">{charter.projectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Patrocinadores:</p>
              <p className="text-gray-900">{charter.sponsors}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Gerente do Projeto:</p>
              <p className="text-gray-900">{charter.projectManager}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Data de Início:</p>
              <p className="text-gray-900">
                {new Date(charter.startDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Data Estimada de Conclusão:</p>
              <p className="text-gray-900">
                {new Date(charter.estimatedEndDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Demanda do Negócio */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">2. DEMANDA DO NEGÓCIO</h3>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {charter.businessDemand}
          </p>
        </section>

        {/* 3. Objetivos do Projeto */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">3. OBJETIVOS DO PROJETO</h3>
          </div>
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {charter.projectObjectives}
          </p>
        </section>

        {/* 4. Escopo do Projeto */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">4. ESCOPO DO PROJETO</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">4.1 O que está incluído:</h4>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {charter.projectScope}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">4.2 O que não está incluído:</h4>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {charter.projectNotScope}
              </p>
            </div>
          </div>
        </section>

        {/* 5. Restrições e Premissas */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">5. RESTRIÇÕES E PREMISSAS</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">5.1 Restrições:</h4>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {charter.constraints}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">5.2 Premissas:</h4>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {charter.assumptions}
              </p>
            </div>
          </div>
        </section>

        {/* 6. Stakeholders */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">6. STAKEHOLDERS</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">6.1 Principais Interessados:</h4>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {charter.stakeholders}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">6.2 Interface com Projetos Existentes:</h4>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                {charter.existingProjectsInterface}
              </p>
            </div>
          </div>
        </section>

        {/* 7. Orçamento */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">7. ORÇAMENTO ESTIMADO</h3>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600 mb-2">
              R$ {charter.estimatedBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600">Orçamento total estimado para conclusão do projeto</p>
          </div>
        </section>

        {/* 8. Equipe Básica */}
        {charter.basicTeam && charter.basicTeam.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">8. EQUIPE BÁSICA DO PROJETO</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Função</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tipo de Contrato</th>
                  </tr>
                </thead>
                <tbody>
                  {charter.basicTeam.map((member, index) => (
                    <tr key={member.id}>
                      <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{member.role}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {member.contractType === 'projeto-fechado' ? 'Projeto Fechado' :
                         member.contractType === 'horas-dias' ? `R$ ${member.hourlyRate}/hora` : 'Gratuito'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 9. Assinaturas */}
        {charter.sponsorSignatures && charter.sponsorSignatures.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">9. ASSINATURAS</h3>
            </div>
            <div className="space-y-4">
              {charter.sponsorSignatures.map((signature, index) => (
                <div key={signature.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{signature.sponsorName}</p>
                      <p className="text-sm text-gray-600">Patrocinador do Projeto</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Data:</p>
                      <p className="font-medium">
                        {new Date(signature.signatureDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-300 pt-2">
                    <p className="text-xs text-gray-500 text-center">Assinatura</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. Aprovação */}
        {charter.approval && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">10. APROVAÇÃO</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Status:</p>
                  {getStatusBadge(charter.approval.status)}
                </div>
                {charter.approval.approver && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Aprovador:</p>
                    <p className="text-gray-900">{charter.approval.approver}</p>
                  </div>
                )}
                {charter.approval.approvalDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Data de Aprovação:</p>
                    <p className="text-gray-900">
                      {new Date(charter.approval.approvalDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              {charter.approval.conditions && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
                  <p className="font-medium text-orange-800 mb-2">Condições e Ressalvas:</p>
                  <p className="text-orange-700 whitespace-pre-wrap">{charter.approval.conditions}</p>
                </div>
              )}

              {charter.approval.approverComments && (
                <div className="p-3 bg-white border border-gray-200 rounded">
                  <p className="font-medium text-gray-800 mb-2">Comentários do Aprovador:</p>
                  <p className="text-gray-600 whitespace-pre-wrap">{charter.approval.approverComments}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TAPDocument;
