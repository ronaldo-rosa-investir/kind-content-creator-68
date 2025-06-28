
import { ProjectCharter } from '@/types/project';

export const printTAP = (charter: ProjectCharter, version: string = '1.0') => {
  // Criar uma nova janela para impressão
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const printContent = generateTAPHTML(charter, version);
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Aguardar o carregamento e imprimir
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};

export const downloadTAPAsPDF = async (charter: ProjectCharter, version: string = '1.0') => {
  // Para uma implementação completa, seria necessário usar uma biblioteca como jsPDF ou Puppeteer
  // Por enquanto, vamos simular o download criando um HTML e permitindo salvar como PDF
  
  const printContent = generateTAPHTML(charter, version, true);
  
  const blob = new Blob([printContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `TAP_${charter.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_v${version}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
};

const generateTAPHTML = (charter: ProjectCharter, version: string, forDownload: boolean = false) => {
  const getStatusText = (status: string) => {
    const labels = {
      'rascunho': 'Rascunho',
      'pendente-aprovacao': 'Pendente de Aprovação',
      'aprovado': 'Aprovado',
      'aprovado-com-ressalva': 'Aprovado com Ressalva',
      'rejeitado': 'Rejeitado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TAP - ${charter.projectName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 24px;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        
        .header h2 {
            font-size: 18px;
            margin: 0 0 15px 0;
            color: #666;
        }
        
        .status-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .badge-approved { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .badge-draft { background: #f3f4f6; color: #374151; }
        .badge-conditional { background: #fed7aa; color: #9a3412; }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section h3 {
            font-size: 16px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-content {
            margin-left: 0;
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 20px;
        }
        
        .field {
            margin-bottom: 15px;
        }
        
        .field-label {
            font-weight: bold;
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .field-value {
            color: #333;
            white-space: pre-wrap;
        }
        
        .budget-highlight {
            background: #dcfce7;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        
        .budget-amount {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 5px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #f9fafb;
            font-weight: bold;
        }
        
        .approval-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }
        
        .conditions {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        
        .comments {
            background: white;
            border: 1px solid #d1d5db;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        
        .signature-area {
            border-top: 1px solid #666;
            padding-top: 10px;
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
            .header { page-break-after: avoid; }
        }
        
        @page {
            margin: 2cm;
            size: A4;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>TERMO DE ABERTURA DO PROJETO (TAP)</h1>
        <h2>${charter.projectName}</h2>
        <div class="status-info">
            <span class="badge badge-${charter.approval?.status === 'aprovado' ? 'approved' : 
                                      charter.approval?.status === 'pendente-aprovacao' ? 'pending' :
                                      charter.approval?.status === 'rejeitado' ? 'rejected' :
                                      charter.approval?.status === 'aprovado-com-ressalva' ? 'conditional' : 'draft'}">
                ${getStatusText(charter.approval?.status || 'rascunho')}
            </span>
            <span class="badge" style="background: #e5e7eb; color: #374151;">Versão ${version}</span>
            <span style="font-size: 14px; color: #666;">${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
    </div>

    <div class="section">
        <h3>1. INFORMAÇÕES BÁSICAS</h3>
        <div class="section-content">
            <div class="grid-2">
                <div class="field">
                    <div class="field-label">Nome do Projeto:</div>
                    <div class="field-value">${charter.projectName}</div>
                </div>
                <div class="field">
                    <div class="field-label">Patrocinadores:</div>
                    <div class="field-value">${charter.sponsors}</div>
                </div>
                <div class="field">
                    <div class="field-label">Gerente do Projeto:</div>
                    <div class="field-value">${charter.projectManager}</div>
                </div>
                <div class="field">
                    <div class="field-label">Data de Início:</div>
                    <div class="field-value">${new Date(charter.startDate).toLocaleDateString('pt-BR')}</div>
                </div>
                <div class="field">
                    <div class="field-label">Data Estimada de Conclusão:</div>
                    <div class="field-value">${new Date(charter.estimatedEndDate).toLocaleDateString('pt-BR')}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>2. DEMANDA DO NEGÓCIO</h3>
        <div class="section-content">
            <div class="field-value">${charter.businessDemand}</div>
        </div>
    </div>

    <div class="section">
        <h3>3. OBJETIVOS DO PROJETO</h3>
        <div class="section-content">
            <div class="field-value">${charter.projectObjectives}</div>
        </div>
    </div>

    <div class="section">
        <h3>4. ESCOPO DO PROJETO</h3>
        <div class="section-content">
            <div class="grid-2">
                <div>
                    <h4 style="margin-bottom: 10px;">4.1 O que está incluído:</h4>
                    <div class="field-value">${charter.projectScope}</div>
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">4.2 O que não está incluído:</h4>
                    <div class="field-value">${charter.projectNotScope}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>5. RESTRIÇÕES E PREMISSAS</h3>
        <div class="section-content">
            <div class="grid-2">
                <div>
                    <h4 style="margin-bottom: 10px;">5.1 Restrições:</h4>
                    <div class="field-value">${charter.constraints}</div>
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">5.2 Premissas:</h4>
                    <div class="field-value">${charter.assumptions}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>6. STAKEHOLDERS</h3>
        <div class="section-content">
            <div class="grid-2">
                <div>
                    <h4 style="margin-bottom: 10px;">6.1 Principais Interessados:</h4>
                    <div class="field-value">${charter.stakeholders}</div>
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">6.2 Interface com Projetos Existentes:</h4>
                    <div class="field-value">${charter.existingProjectsInterface}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>7. ORÇAMENTO ESTIMADO</h3>
        <div class="section-content">
            <div class="budget-highlight">
                <div class="budget-amount">R$ ${charter.estimatedBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div style="color: #666; font-size: 14px;">Orçamento total estimado para conclusão do projeto</div>
            </div>
        </div>
    </div>

    ${charter.basicTeam && charter.basicTeam.length > 0 ? `
    <div class="section">
        <h3>8. EQUIPE BÁSICA DO PROJETO</h3>
        <div class="section-content">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Função</th>
                        <th>Tipo de Contrato</th>
                    </tr>
                </thead>
                <tbody>
                    ${charter.basicTeam.map(member => `
                        <tr>
                            <td>${member.name}</td>
                            <td>${member.role}</td>
                            <td>${member.contractType === 'projeto-fechado' ? 'Projeto Fechado' :
                                  member.contractType === 'horas-dias' ? `R$ ${member.hourlyRate}/hora` : 'Gratuito'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    ` : ''}

    ${charter.sponsorSignatures && charter.sponsorSignatures.length > 0 ? `
    <div class="section">
        <h3>9. ASSINATURAS</h3>
        <div class="section-content">
            ${charter.sponsorSignatures.map(signature => `
                <div style="margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <div>
                            <div style="font-weight: bold;">${signature.sponsorName}</div>
                            <div style="font-size: 14px; color: #666;">Patrocinador do Projeto</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 14px; color: #666;">Data:</div>
                            <div style="font-weight: bold;">${new Date(signature.signatureDate).toLocaleDateString('pt-BR')}</div>
                        </div>
                    </div>
                    <div class="signature-area">Assinatura</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${charter.approval ? `
    <div class="section">
        <h3>10. APROVAÇÃO</h3>
        <div class="section-content">
            <div class="approval-section">
                <div class="grid-2" style="margin-bottom: 20px;">
                    <div class="field">
                        <div class="field-label">Status:</div>
                        <span class="badge badge-${charter.approval.status === 'aprovado' ? 'approved' : 
                                                    charter.approval.status === 'pendente-aprovacao' ? 'pending' :
                                                    charter.approval.status === 'rejeitado' ? 'rejected' :
                                                    charter.approval.status === 'aprovado-com-ressalva' ? 'conditional' : 'draft'}">
                            ${getStatusText(charter.approval.status)}
                        </span>
                    </div>
                    ${charter.approval.approver ? `
                    <div class="field">
                        <div class="field-label">Aprovador:</div>
                        <div class="field-value">${charter.approval.approver}</div>
                    </div>
                    ` : ''}
                    ${charter.approval.approvalDate ? `
                    <div class="field">
                        <div class="field-label">Data de Aprovação:</div>
                        <div class="field-value">${new Date(charter.approval.approvalDate).toLocaleDateString('pt-BR')}</div>
                    </div>
                    ` : ''}
                </div>

                ${charter.approval.conditions ? `
                <div class="conditions">
                    <div style="font-weight: bold; color: #92400e; margin-bottom: 10px;">Condições e Ressalvas:</div>
                    <div style="color: #92400e;">${charter.approval.conditions}</div>
                </div>
                ` : ''}

                ${charter.approval.approverComments ? `
                <div class="comments">
                    <div style="font-weight: bold; color: #374151; margin-bottom: 10px;">Comentários do Aprovador:</div>
                    <div style="color: #6b7280;">${charter.approval.approverComments}</div>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
    ` : ''}

    ${forDownload ? `
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        <p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <p>Sistema de Gestão de Projetos</p>
    </div>
    ` : ''}
</body>
</html>
  `;
};
