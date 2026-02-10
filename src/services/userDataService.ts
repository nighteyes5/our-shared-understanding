import { LTEParameters, LTEResults } from '@/types/lte';

interface UserCalculation {
  id: string;
  userId: string;
  parameters: LTEParameters;
  results: LTEResults;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'lte_user_calculations';

class UserDataService {
  private getStoredCalculations(userId: string): UserCalculation[] {
    const allCalculations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return allCalculations.filter((calc: UserCalculation) => calc.userId === userId);
  }

  private saveCalculation(calculation: UserCalculation): void {
    const allCalculations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const existingIndex = allCalculations.findIndex((calc: UserCalculation) => calc.id === calculation.id);
    
    if (existingIndex >= 0) {
      allCalculations[existingIndex] = calculation;
    } else {
      allCalculations.push(calculation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCalculations));
  }

  async saveUserCalculation(
    userId: string,
    name: string,
    parameters: LTEParameters,
    results: LTEResults
  ): Promise<UserCalculation> {
    const calculation: UserCalculation = {
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      parameters,
      results,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveCalculation(calculation);
    return calculation;
  }

  async getUserCalculations(userId: string): Promise<UserCalculation[]> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.getStoredCalculations(userId);
  }

  async deleteUserCalculation(userId: string, calculationId: string): Promise<void> {
    const allCalculations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filteredCalculations = allCalculations.filter(
      (calc: UserCalculation) => !(calc.id === calculationId && calc.userId === userId)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCalculations));
  }

  async updateCalculationName(userId: string, calculationId: string, newName: string): Promise<void> {
    const allCalculations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const calculationIndex = allCalculations.findIndex(
      (calc: UserCalculation) => calc.id === calculationId && calc.userId === userId
    );
    
    if (calculationIndex >= 0) {
      allCalculations[calculationIndex].name = newName;
      allCalculations[calculationIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCalculations));
    }
  }

  // Méthodes pour l'administration (accès à toutes les données)
  async getAllCalculations(): Promise<UserCalculation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  async getCalculationsByClass(classId: string): Promise<UserCalculation[]> {
    // Cette méthode nécessiterait une jointure avec les données utilisateur
    // Pour simplifier, on retourne toutes les calculations (à améliorer en production)
    const allCalculations = await this.getAllCalculations();
    return allCalculations; // En production, filtrer par classId via les données utilisateur
  }

  async getCalculationStats(): Promise<{
    totalCalculations: number;
    calculationsThisMonth: number;
    activeUsers: number;
    averageCalculationsPerUser: number;
  }> {
    const allCalculations = await this.getAllCalculations();
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const calculationsThisMonth = allCalculations.filter(
      calc => new Date(calc.createdAt) >= thisMonth
    ).length;

    const uniqueUsers = new Set(allCalculations.map(calc => calc.userId)).size;

    return {
      totalCalculations: allCalculations.length,
      calculationsThisMonth,
      activeUsers: uniqueUsers,
      averageCalculationsPerUser: uniqueUsers > 0 ? Math.round(allCalculations.length / uniqueUsers) : 0
    };
  }
}

export const userDataService = new UserDataService();
export type { UserCalculation };