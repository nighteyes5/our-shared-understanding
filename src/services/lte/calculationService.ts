import type {
  LTEParameters,
  PropagationModel,
  CalculationResult,
  ComparisonResult,
} from '@/types/lte';
import { LTE_CONSTANTS } from './constants';
import { LinkBudgetService } from './linkBudgetService';
import { CoverageService } from './coverageService';

/**
 * Service principal pour les calculs LTE
 */
export class LTECalculationService {
  /**
   * Obtenir le nom d'affichage d'un modèle
   */
  static getModelName(model: PropagationModel): string {
    switch (model) {
      case 'okumura-hata':
        return 'Okumura-Hata';
      case 'cost231-hata':
        return 'COST 231-Hata';
      case '3gpp':
        return '3GPP TR 36.814';
      default:
        return 'Inconnu';
    }
  }

  /**
   * Recommander le modèle le plus adapté selon la fréquence
   */
  static getRecommendedModel(frequency: number): PropagationModel {
    if (frequency <= 1500) {
      return 'okumura-hata';
    } else if (frequency <= 2000) {
      return 'cost231-hata';
    } else {
      return '3gpp';
    }
  }

  /**
   * Calcul complet pour un modèle donné
   */
  static calculateForModel(
    model: PropagationModel,
    params: LTEParameters
  ): CalculationResult {
    // Calcul du bilan de liaison
    const maxAllowedPathLoss = LinkBudgetService.calculateMaxAllowedPathLoss(params);
    
    // Recherche de la portée maximale
    const maxRange = CoverageService.findMaxRange(model, params, maxAllowedPathLoss);
    
    // Calculs de couverture
    const cellRadius = CoverageService.calculateCellRadius(maxRange);
    const cellArea = CoverageService.calculateCellArea(cellRadius);
    const numberOfSites = CoverageService.calculateNumberOfSites(params.targetArea, cellArea);
    
    // Affaiblissement à la portée maximale
    const pathLoss = CoverageService.calculatePathLoss(model, params, maxRange);
    
    return {
      model,
      modelName: this.getModelName(model),
      pathLoss,
      maxRange,
      cellRadius,
      cellArea,
      numberOfSites,
      sectorCount: LTE_CONSTANTS.SECTOR_COUNT,
      overlapFactor: LTE_CONSTANTS.OVERLAP_FACTOR,
    };
  }

  /**
   * Comparaison de tous les modèles
   */
  static compareModels(params: LTEParameters): ComparisonResult {
    const models: PropagationModel[] = ['okumura-hata', 'cost231-hata', '3gpp'];
    const results = models.map((model) => this.calculateForModel(model, params));
    
    // Calculs de moyennes
    const averageRange = results.reduce((sum, r) => sum + r.maxRange, 0) / results.length;
    const averageSites = results.reduce((sum, r) => sum + r.numberOfSites, 0) / results.length;
    
    // Modèle recommandé
    const recommendedModel = this.getRecommendedModel(params.frequency);
    
    return {
      models: results,
      recommendedModel,
      averageRange,
      averageSites,
    };
  }

  /**
   * Génération des données pour graphique de couverture
   */
  static generateCoverageData(
    params: LTEParameters,
    maxDistance: number = 20
  ): { distance: number; pathLoss: Record<PropagationModel, number> }[] {
    return CoverageService.generateCoverageData(params, maxDistance);
  }
}