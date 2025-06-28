
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Download } from 'lucide-react';

// Importar os novos componentes
import { useDashboardData } from '@/hooks/useDashboardData';
import { UsageGuide } from '@/components/Dashboard/UsageGuide';
import { TAPStatus } from '@/components/Dashboard/TAPStatus';
import { MainStatistics } from '@/components/Dashboard/MainStatistics';
import { NextSteps } from '@/components/Dashboard/NextSteps';
import { ProjectDocumentation } from '@/components/Dashboard/ProjectDocumentation';
import { VisualAnalysis } from '@/components/Dashboard/VisualAnalysis';
import { PerformanceIndicators } from '@/components/Dashboard/PerformanceIndicators';

const Index = () => {
  const dashboardData = useDashboardData();

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard do Projeto</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Guia de Uso */}
      <UsageGuide />

      {/* Status do TAP */}
      <TAPStatus 
        currentTAP={dashboardData.currentTAP}
        tapCompletenessPercentage={dashboardData.tapCompletenessPercentage}
        isTAPComplete={dashboardData.isTAPComplete}
        projectBudget={dashboardData.projectBudget}
      />

      {/* Estatísticas Principais */}
      <MainStatistics
        overallProgress={dashboardData.overallProgress}
        phases={dashboardData.phases}
        getProjectEndDate={dashboardData.getProjectEndDate}
        budgetUsed={dashboardData.budgetUsed}
        budgetStatus={dashboardData.budgetStatus}
        totalActualCost={dashboardData.totalActualCost}
        projectBudget={dashboardData.projectBudget}
        wbsItems={dashboardData.wbsItems}
        eapLevels={dashboardData.eapLevels}
      />

      {/* Próximos Passos */}
      <NextSteps nextSteps={dashboardData.nextSteps} />

      {/* Documentação do Projeto */}
      <ProjectDocumentation
        approvedRequirements={dashboardData.approvedRequirements}
        totalRequirements={dashboardData.totalRequirements}
        requirementsApprovalRate={dashboardData.requirementsApprovalRate}
        scopeStatement={dashboardData.scopeStatement}
        approvedValidations={dashboardData.approvedValidations}
        totalValidations={dashboardData.totalValidations}
      />

      {/* Análise Visual */}
      <VisualAnalysis
        costByWBS={dashboardData.costByWBS}
        progressByWBS={dashboardData.progressByWBS}
        budgetData={dashboardData.budgetData}
        totalActualCost={dashboardData.totalActualCost}
      />

      {/* Indicadores de Performance */}
      <PerformanceIndicators
        budgetUsed={dashboardData.budgetUsed}
        budgetStatus={dashboardData.budgetStatus}
        remainingBudget={dashboardData.remainingBudget}
        completionRate={dashboardData.completionRate}
      />
    </div>
  );
};

export default Index;
