import type { LTEParameters, PropagationModel } from '@/types/lte';
import { LTE_CONSTANTS } from './constants';
import { PropagationModelsService } from './propagationModels';

/**
 * Service pour les calculs de couverture
 */
export class CoverageService {
  /**
   * Calcul de l'affaiblissement de parcours selon le modèle
   */
  static calculatePathLoss(
    model: PropagationModel,
    params: LTEParameters,
    distance: number
  ): number {
    const { frequency, txAntennaHeight, rxAntennaHeight, environment } = params;
    
    switch (model) {
      case 'okumura-hata':
        return PropagationModelsService.calculateOkumuraHata(
          frequency,
          txAntennaHeight,
          rxAntennaHeight,
          distance,
          environment
        );
      case 'cost231-hata':
        return PropagationModelsService.calculateCOST231Hata(
          frequency,
          txAntennaHeight,
          rxAntennaHeight,
          distance,
          environment
        );
      case '3gpp':
        return PropagationModelsService.calculate3GPP(
          frequency,
          txAntennaHeight,
          rxAntennaHeight,
          distance,
          environment
        );
      default:
        throw new Error(`Modèle de propagation non supporté: ${model}`);
    }
  }

  /**
   * Recherche dichotomique de la distance maximale
   */
  static findMaxRange(
    model: PropagationModel,
    params: LTEParameters,
    maxAllowedPathLoss: number
  ): number {
    let minDist = LTE_CONSTANTS.MIN_DISTANCE;
    let maxDist = LTE_CONSTANTS.MAX_DISTANCE;
    
    while (maxDist - minDist > LTE_CONSTANTS.DISTANCE_PRECISION) {
      const midDist = (minDist + maxDist) / 2;
      const pathLoss = this.calculatePathLoss(model, params, midDist);
      
      if (pathLoss < maxAllowedPathLoss) {
        minDist = midDist;
      } else {
        maxDist = midDist;
      }
    }
    
    return (minDist + maxDist) / 2;
  }

  /**
   * Calcul du rayon de cellule effectif
   */
  static calculateCellRadius(maxRange: number): number {
    return maxRange * LTE_CONSTANTS.CELL_RADIUS_FACTOR;
  }

  /**
   * Calcul de la surface d'une cellule hexagonale
   */
  static calculateCellArea(cellRadius: number): number {
    return (3 * Math.sqrt(3) / 2) * Math.pow(cellRadius, 2);
  }

  /**
   * Calcul du nombre de sites nécessaires
   */
  static calculateNumberOfSites(targetArea: number, cellArea: number): number {
    const effectiveArea = targetArea * LTE_CONSTANTS.OVERLAP_FACTOR;
    return Math.ceil(effectiveArea / cellArea);
  }

  /**
   * Génération des données de couverture pour graphique
   */
  static generateCoverageData(
    params: LTEParameters,
    maxDistance: number = 20,
    step: number = 0.5
  ): { distance: number; pathLoss: Record<PropagationModel, number> }[] {
    const data: { distance: number; pathLoss: Record<PropagationModel, number> }[] = [];
    const models: PropagationModel[] = ['okumura-hata', 'cost231-hata', '3gpp'];
    
    for (let d = step; d <= maxDistance; d += step) {
      const point: { distance: number; pathLoss: Record<PropagationModel, number> } = {
        distance: d,
        pathLoss: {} as Record<PropagationModel, number>,
      };
      
      models.forEach((model) => {
        try {
          point.pathLoss[model] = this.calculatePathLoss(model, params, d);
        } catch (error) {
          console.warn(`Erreur calcul ${model} à ${d}km:`, error);
          point.pathLoss[model] = 0;
        }
      });
      
      data.push(point);
    }
    
    return data;
  }
}