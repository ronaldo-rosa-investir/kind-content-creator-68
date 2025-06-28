
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProjectCharter } from '@/types/project';

export const printTAP = (charter: ProjectCharter, version: string = '1.0') => {
  // Usar window.print() nativo do navegador
  window.print();
};

export const downloadTAPAsPDF = async (charter: ProjectCharter, version: string = '1.0') => {
  try {
    // Mostrar loading
    const loadingElement = document.createElement('div');
    loadingElement.id = 'pdf-loading';
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; color: white; font-size: 18px;">
        <div style="text-align: center;">
          <div style="margin-bottom: 20px;">📄 Gerando PDF...</div>
          <div style="width: 200px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
            <div style="width: 0%; height: 100%; background: #4CAF50; animation: progress 3s ease-in-out infinite;" id="progress-bar"></div>
          </div>
        </div>
      </div>
      <style>
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      </style>
    `;
    document.body.appendChild(loadingElement);

    // Encontrar ou criar o elemento TAP
    let element = document.getElementById('tap-content');
    if (!element) {
      // Criar elemento temporário com o conteúdo do TAP
      element = document.createElement('div');
      element.id = 'tap-content';
      element.innerHTML = generateTAPContentForPDF(charter, version);
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.width = '210mm';
      element.style.background = 'white';
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(element);
    }

    // Gerar canvas da imagem
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123 // A4 height in pixels at 96 DPI
    });

    // Criar PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Primeira página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Páginas adicionais se necessário
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Fazer download do PDF
    const filename = `TAP-${charter.projectName.replace(/[^a-zA-Z0-9]/g, '_')}-v${version}.pdf`;
    pdf.save(filename);

    // Remover elemento temporário se foi criado
    if (element.style.position === 'absolute') {
      document.body.removeChild(element);
    }

    // Mostrar sucesso
    showFeedback('✅ PDF baixado com sucesso!', 'success');

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    showFeedback('❌ Falha ao gerar PDF. Tente novamente.', 'error');
  } finally {
    // Remover loading
    const loadingElement = document.getElementById('pdf-loading');
    if (loadingElement) {
      document.body.removeChild(loadingElement);
    }
  }
};

const showFeedback = (message: string, type: 'success' | 'error') => {
  const feedback = document.createElement('div');
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
  `;
  feedback.innerHTML = `
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
    ${message}
  `;
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    if (feedback.parentNode) {
      document.body.removeChild(feedback);
    }
  }, 3000);
};

const generateTAPContentForPDF = (charter: ProjectCharter, version: string) => {
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

  const getStatusColor = (status: string) => {
    const colors = {
      'rascunho': '#6b7280',
      'pendente-aprovacao': '#d97706',
      'aprovado': '#059669',
      'aprovado-com-ressalva': '#ea580c',
      'rejeitado': '#dc2626'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: white; padding: 20px;">
      <!-- Cabeçalho -->
      <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: bold; color: #1f2937;">
          TERMO DE ABERTURA DO PROJETO (TAP)
        </h1>
        <h2 style="font-size: 22px; margin: 0 0 15px 0; color: #4b5563;">
          ${charter.projectName}
        </h2>
        <div style="display: flex; justify-content: center; gap: 20px; align-items: center; flex-wrap: wrap;">
          <span style="padding: 6px 16px; border-radius: 6px; font-size: 14px; font-weight: bold; color: white; background: ${getStatusColor(charter.approval?.status || 'rascunho')};">
            ${getStatusText(charter.approval?.status || 'rascunho')}
          </span>
          <span style="padding: 6px 16px; border-radius: 6px; font-size: 14px; font-weight: bold; background: #e5e7eb; color: #374151;">
            Versão ${version}
          </span>
          <span style="font-size: 14px; color: #6b7280;">
            ${new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <!-- 1. Informações Básicas -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
          📋 1. INFORMAÇÕES BÁSICAS
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Nome do Projeto:</strong>
            <span>${charter.projectName}</span>
          </div>
          <div>
            <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Patrocinadores:</strong>
            <span>${charter.sponsors}</span>
          </div>
          <div>
            <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Gerente do Projeto:</strong>
            <span>${charter.projectManager}</span>
          </div>
          <div>
            <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Data de Início:</strong>
            <span>${new Date(charter.startDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div>
            <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Data Estimada de Conclusão:</strong>
            <span>${new Date(charter.estimatedEndDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      <!-- 2. Demanda do Negócio -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          🎯 2. DEMANDA DO NEGÓCIO
        </h3>
        <div style="white-space: pre-wrap; line-height: 1.6;">
          ${charter.businessDemand}
        </div>
      </div>

      <!-- 3. Objetivos do Projeto -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          ✅ 3. OBJETIVOS DO PROJETO
        </h3>
        <div style="white-space: pre-wrap; line-height: 1.6;">
          ${charter.projectObjectives}
        </div>
      </div>

      <!-- 4. Escopo do Projeto -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          📋 4. ESCOPO DO PROJETO
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4 style="font-weight: bold; color: #374151; margin-bottom: 10px;">4.1 O que está incluído:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${charter.projectScope}
            </div>
          </div>
          <div>
            <h4 style="font-weight: bold; color: #374151; margin-bottom: 10px;">4.2 O que não está incluído:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${charter.projectNotScope}
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Restrições e Premissas -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          ⚠️ 5. RESTRIÇÕES E PREMISSAS
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4 style="font-weight: bold; color: #374151; margin-bottom: 10px;">5.1 Restrições:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${charter.constraints}
            </div>
          </div>
          <div>
            <h4 style="font-weight: bold; color: #374151; margin-bottom: 10px;">5.2 Premissas:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${charter.assumptions}
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Stakeholders -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          👥 6. STAKEHOLDERS
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h4 style="font-weight: bold; color: #374151; margin-bottom: 10px;">6.1 Principais Interessados:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${charter.stakeholders}
            </div>
          </div>
          <div>
            <h4 style="font-weight: bold; color: #374151; margin-bottom: 10px;">6.2 Interface com Projetos Existentes:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${charter.existingProjectsInterface}
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Orçamento -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          💰 7. ORÇAMENTO ESTIMADO
        </h3>
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <div style="font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 8px;">
            R$ ${charter.estimatedBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div style="color: #4b5563; font-size: 14px;">
            Orçamento total estimado para conclusão do projeto
          </div>
        </div>
      </div>

      ${charter.basicTeam && charter.basicTeam.length > 0 ? `
      <!-- 8. Equipe Básica -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          👨‍💼 8. EQUIPE BÁSICA DO PROJETO
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold;">Nome</th>
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold;">Função</th>
              <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold;">Tipo de Contrato</th>
            </tr>
          </thead>
          <tbody>
            ${charter.basicTeam.map(member => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 12px;">${member.name}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px;">${member.role}</td>
                <td style="border: 1px solid #d1d5db; padding: 12px;">
                  ${member.contractType === 'projeto-fechado' ? 'Projeto Fechado' :
                    member.contractType === 'horas-dias' ? `R$ ${member.hourlyRate}/hora` : 'Gratuito'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${charter.sponsorSignatures && charter.sponsorSignatures.length > 0 ? `
      <!-- 9. Assinaturas -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          ✍️ 9. ASSINATURAS
        </h3>
        ${charter.sponsorSignatures.map(signature => `
          <div style="margin-bottom: 40px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <div>
                <div style="font-weight: bold; font-size: 16px;">${signature.sponsorName}</div>
                <div style="color: #6b7280; font-size: 14px;">Patrocinador do Projeto</div>
              </div>
              <div style="text-align: right;">
                <div style="color: #6b7280; font-size: 14px;">Data:</div>
                <div style="font-weight: bold;">${new Date(signature.signatureDate).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
            <div style="border-top: 2px solid #374151; margin-top: 30px; padding-top: 10px; text-align: center; color: #6b7280; font-size: 12px;">
              Assinatura
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${charter.approval ? `
      <!-- 10. Aprovação -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
          ✅ 10. APROVAÇÃO
        </h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Status:</strong>
              <span style="padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; background: ${getStatusColor(charter.approval.status)};">
                ${getStatusText(charter.approval.status)}
              </span>
            </div>
            ${charter.approval.approver ? `
            <div>
              <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Aprovador:</strong>
              <span>${charter.approval.approver}</span>
            </div>
            ` : ''}
            ${charter.approval.approvalDate ? `
            <div>
              <strong style="color: #4b5563; display: block; margin-bottom: 5px;">Data de Aprovação:</strong>
              <span>${new Date(charter.approval.approvalDate).toLocaleDateString('pt-BR')}</span>
            </div>
            ` : ''}
          </div>

          ${charter.approval.conditions ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <div style="font-weight: bold; color: #92400e; margin-bottom: 10px;">Condições e Ressalvas:</div>
            <div style="color: #92400e; white-space: pre-wrap;">${charter.approval.conditions}</div>
          </div>
          ` : ''}

          ${charter.approval.approverComments ? `
          <div style="background: white; border: 1px solid #d1d5db; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 10px;">Comentários do Aprovador:</div>
            <div style="color: #6b7280; white-space: pre-wrap;">${charter.approval.approverComments}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <!-- Rodapé -->
      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; page-break-inside: avoid;">
        <p style="margin: 5px 0;">Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <p style="margin: 5px 0;">Sistema de Gestão de Projetos</p>
        <p style="margin: 5px 0;">Versão ${version} - ${charter.projectName}</p>
      </div>
    </div>
  `;
};
