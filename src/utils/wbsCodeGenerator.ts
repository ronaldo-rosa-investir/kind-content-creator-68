
export class WBSCodeGenerator {
  private static getNextSequentialCode(existingCodes: string[], phaseIndex: number): string {
    const phasePrefix = `${phaseIndex + 1}`;
    const phaseCodes = existingCodes
      .filter(code => code.startsWith(phasePrefix + '.'))
      .map(code => {
        const parts = code.split('.');
        return parts.length > 1 ? parseInt(parts[1]) : 0;
      })
      .filter(num => !isNaN(num));
    
    const maxNumber = phaseCodes.length > 0 ? Math.max(...phaseCodes) : 0;
    return `${phasePrefix}.${maxNumber + 1}`;
  }

  public static generateWBSCode(phaseId: string, phases: any[], existingWBSItems: any[]): string {
    const phaseIndex = phases.findIndex(p => p.id === phaseId);
    if (phaseIndex === -1) return '1.1';
    
    const existingCodes = existingWBSItems.map(item => item.code);
    return this.getNextSequentialCode(existingCodes, phaseIndex);
  }

  public static validateWBSCode(code: string): boolean {
    const regex = /^\d+\.\d+$/;
    return regex.test(code);
  }
}
