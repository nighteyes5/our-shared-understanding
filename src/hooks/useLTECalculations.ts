import { useMemo, useCallback } from 'react';
import type {
  LTEParameters,
  PropagationModel,
  CalculationResult,
  ComparisonResult,
  EnvironmentType,
} from '@/types/lte';

// Constantes
const SECTOR_COUNT = 3;
const OVERLAP_FACTOR = 1.3;

/**
 * Calcul du facteur de correction pour mobile (Okumura-Hata)
 */
const getMobileStationCorrectionFactor = (
  frequency: number,
  rxHeight: number,
  environment: EnvironmentType
): number => {
  if (environment === 'urban') {
    if (frequency <= 300) {
      return 8.29 * Math.pow(Math.log10(1.54 * rxHeight), 2) - 1.1;
    }
    return 3.2 * Math.pow(Math.log10(11.75 * rxHeight), 2) - 4.97;
  }
  // Suburban et Rural
  return (1.1 * Math.log10(frequency) - 0.7) * rxHeight - (1.56 * Math.log10(frequency) - 0.8);
};

/**
 * Modèle Okumura-Hata (150-1500 MHz)
 */
const calculateOkumuraHata = (
  frequency: number,
  txHeight: number,
  rxHeight: number,
  distance: number,
  environment: EnvironmentType
): number => {
  const a_hm = getMobileStationCorrectionFactor(frequency, rxHeight, environment);
  
  let pathLoss = 69.55 + 26.16 * Math.log10(frequency) 
    - 13.82 * Math.log10(txHeight) 
    - a_hm 
    + (44.9 - 6.55 * Math.log10(txHeight)) * Math.log10(distance);
  
  if (environment === 'suburban') {
    pathLoss -= 2 * Math.pow(Math.log10(frequency / 28), 2) + 5.4;
  } else if (environment === 'rural') {
    pathLoss -= 4.78 * Math.pow(Math.log10(frequency), 2) + 18.33 * Math.log10(frequency) - 40.94;
  }
  
  return pathLoss;
};

/**
 * Modèle COST 231-Hata (1500-2000 MHz)
 */
const calculateCOST231Hata = (
  frequency: number,
  txHeight: number,
  rxHeight: number,
  distance: number,
  environment: EnvironmentType
): number => {
  const a_hm = getMobileStationCorrectionFactor(frequency, rxHeight, 'suburban');
  
  const C_m = environment === 'urban' ? 3 : 0;
  
  const pathLoss = 46.3 + 33.9 * Math.log10(frequency) 
    - 13.82 * Math.log10(txHeight) 
    - a_hm 
    + (44.9 - 6.55 * Math.log10(txHeight)) * Math.log10(distance)
    + C_m;
  
  return pathLoss;
};

/**
 * Modèle 3GPP TR 36.814 (jusqu'à 6000 MHz)
 */
const calculate3GPP = (
  frequency: number,
  txHeight: number,
  rxHeight: number,
  distance: number,
  environment: EnvironmentType
): number => {
  const d_3D = Math.sqrt(Math.pow(distance * 1000, 2) + Math.pow(txHeight - rxHeight, 2));
  const d_BP = 4 * txHeight * rxHeight * frequency * 1e6 / (3e8);
  
  let pathLoss: number;
  
  if (environment === 'urban') {
    // UMa (Urban Macro)
    if (d_3D < d_BP) {
      pathLoss = 22 * Math.log10(d_3D) + 28 + 20 * Math.log10(frequency / 1000);
    } else {
      pathLoss = 40 * Math.log10(d_3D) + 7.8 - 18 * Math.log10(txHeight) 
        - 18 * Math.log10(rxHeight) + 2 * Math.log10(frequency / 1000);
    }
  } else if (environment === 'suburban') {
    // SMa (Suburban Macro)
    pathLoss = 20 * Math.log10(40 * Math.PI * d_3D * frequency / 3e3) 
      + Math.min(0.03 * Math.pow(15, 1.72), 10) * Math.log10(d_3D)
      - Math.min(0.044 * Math.pow(15, 1.72), 14.77) + 0.002 * Math.log10(15) * d_3D;
  } else {
    // RMa (Rural Macro)
    const d_BP_rural = 2 * Math.PI * txHeight * rxHeight * frequency * 1e6 / (3e8);
    if (d_3D < d_BP_rural) {
      pathLoss = 20 * Math.log10(40 * Math.PI * d_3D * frequency / 3e3) 
        + Math.min(0.03 * Math.pow(5, 1.72), 10) * Math.log10(d_3D)
        - Math.min(0.044 * Math.pow(5, 1.72), 14.77) + 0.002 * Math.log10(5) * d_3D;
    } else {
      pathLoss = 20 * Math.log10(40 * Math.PI * d_BP_rural * frequency / 3e3) 
        + 40 * Math.log10(d_3D / d_BP_rural);
    }
  }
  
  return pathLoss;
};

/**
 * Calcul de l'affaiblissement de parcours selon le modèle
 */
const calculatePathLoss = (
  model: PropagationModel,
  params: LTEParameters,
  distance: number
): number => {
  const { frequency, txAntennaHeight, rxAntennaHeight, environment } = params;
  
  switch (model) {
    case 'okumura-hata':
      return calculateOkumuraHata(
        Math.min(frequency, 1500), // Limité à 1500 MHz
        txAntennaHeight,
        rxAntennaHeight,
        distance,
        environment
      );
    case 'cost231-hata':
      return calculateCOST231Hata(
        frequency,
        txAntennaHeight,
        rxAntennaHeight,
        distance,
        environment
      );
    case '3gpp':
      return calculate3GPP(
        frequency,
        txAntennaHeight,
        rxAntennaHeight,
        distance,
        environment
      );
    default:
      return 0;
  }
};

/**
 * Calcul du bilan de liaison
 */
const calculateLinkBudget = (params: LTEParameters): number => {
  const EIRP = params.txPower + params.txAntennaGain - params.txCableLoss;
  const rxGain = params.rxAntennaGain - params.rxCableLoss;
  const margins = params.shadowingMargin + params.interferenceMargin;
  
  return EIRP + rxGain - params.rxSensitivity - margins;
};

/**
 * Recherche dichotomique de la distance maximale
 */
const findMaxRange = (
  model: PropagationModel,
  params: LTEParameters,
  maxAllowedPathLoss: number
): number => {
  let minDist = 0.1; // km
  let maxDist = 50; // km
  
  while (maxDist - minDist > 0.01) {
    const midDist = (minDist + maxDist) / 2;
    const pathLoss = calculatePathLoss(model, params, midDist);
    
    if (pathLoss < maxAllowedPathLoss) {
      minDist = midDist;
    } else {
      maxDist = midDist;
    }
  }
  
  return (minDist + maxDist) / 2;
};

/**
 * Hook principal pour les calculs LTE
 */
export const useLTECalculations = () => {
  const getModelName = useCallback((model: PropagationModel): string => {
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
  }, []);

  const calculateForModel = useCallback(
    (model: PropagationModel, params: LTEParameters): CalculationResult => {
      const maxAllowedPathLoss = calculateLinkBudget(params);
      const maxRange = findMaxRange(model, params, maxAllowedPathLoss);
      
      // Surface d'une cellule hexagonale avec 3 secteurs
      const cellRadius = maxRange * 0.65; // Facteur de réduction pour chevauchement
      const cellArea = (3 * Math.sqrt(3) / 2) * Math.pow(cellRadius, 2);
      
      // Nombre de sites nécessaires
      const effectiveArea = params.targetArea * OVERLAP_FACTOR;
      const numberOfSites = Math.ceil(effectiveArea / cellArea);
      
      const pathLoss = calculatePathLoss(model, params, maxRange);
      
      return {
        model,
        modelName: getModelName(model),
        pathLoss,
        maxRange,
        cellRadius,
        cellArea,
        numberOfSites,
        sectorCount: SECTOR_COUNT,
        overlapFactor: OVERLAP_FACTOR,
      };
    },
    [getModelName]
  );

  const compareModels = useCallback(
    (params: LTEParameters): ComparisonResult => {
      const models: PropagationModel[] = ['okumura-hata', 'cost231-hata', '3gpp'];
      const results = models.map((model) => calculateForModel(model, params));
      
      const averageRange = results.reduce((sum, r) => sum + r.maxRange, 0) / results.length;
      const averageSites = results.reduce((sum, r) => sum + r.numberOfSites, 0) / results.length;
      
      // Recommander le modèle le plus adapté selon la fréquence
      let recommendedModel: PropagationModel;
      if (params.frequency <= 1500) {
        recommendedModel = 'okumura-hata';
      } else if (params.frequency <= 2000) {
        recommendedModel = 'cost231-hata';
      } else {
        recommendedModel = '3gpp';
      }
      
      return {
        models: results,
        recommendedModel,
        averageRange,
        averageSites,
      };
    },
    [calculateForModel]
  );

  const generateCoverageData = useCallback(
    (params: LTEParameters, maxDistance: number = 20): { distance: number; pathLoss: Record<PropagationModel, number> }[] => {
      const data: { distance: number; pathLoss: Record<PropagationModel, number> }[] = [];
      const models: PropagationModel[] = ['okumura-hata', 'cost231-hata', '3gpp'];
      
      for (let d = 0.5; d <= maxDistance; d += 0.5) {
        const point: { distance: number; pathLoss: Record<PropagationModel, number> } = {
          distance: d,
          pathLoss: {} as Record<PropagationModel, number>,
        };
        
        models.forEach((model) => {
          point.pathLoss[model] = calculatePathLoss(model, params, d);
        });
        
        data.push(point);
      }
      
      return data;
    },
    []
  );

  return {
    calculateForModel,
    compareModels,
    generateCoverageData,
    getModelName,
  };
};

export default useLTECalculations;
