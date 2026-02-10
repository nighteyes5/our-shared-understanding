import { useCallback } from 'react';
import type {
  LTEParameters,
  PropagationModel,
  CalculationResult,
  ComparisonResult,
} from '@/types/lte';
import { LTECalculationService } from '@/services/lte';

/**
 * Hook pour les calculs LTE - Interface avec les services métier
 */
export const useLTECalculations = () => {
  const getModelName = useCallback((model: PropagationModel): string => {
    return LTECalculationService.getModelName(model);
  }, []);

  const calculateForModel = useCallback(
    (model: PropagationModel, params: LTEParameters): CalculationResult => {
      return LTECalculationService.calculateForModel(model, params);
    },
    []
  );

  const compareModels = useCallback(
    (params: LTEParameters): ComparisonResult => {
      return LTECalculationService.compareModels(params);
    },
    []
  );

  const generateCoverageData = useCallback(
    (params: LTEParameters, maxDistance: number = 20): { distance: number; pathLoss: Record<PropagationModel, number> }[] => {
      return LTECalculationService.generateCoverageData(params, maxDistance);
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
