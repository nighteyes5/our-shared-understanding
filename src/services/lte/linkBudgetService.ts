import type { LTEParameters } from '@/types/lte';

/**
 * Service pour les calculs de bilan de liaison
 */
export class LinkBudgetService {
  /**
   * Calcul de la puissance isotrope rayonnée équivalente (EIRP)
   */
  static calculateEIRP(txPower: number, txAntennaGain: number, txCableLoss: number): number {
    return txPower + txAntennaGain - txCableLoss;
  }

  /**
   * Calcul du gain total en réception
   */
  static calculateRxGain(rxAntennaGain: number, rxCableLoss: number): number {
    return rxAntennaGain - rxCableLoss;
  }

  /**
   * Calcul des marges totales
   */
  static calculateTotalMargins(shadowingMargin: number, interferenceMargin: number): number {
    return shadowingMargin + interferenceMargin;
  }

  /**
   * Calcul du bilan de liaison complet
   */
  static calculateLinkBudget(params: LTEParameters): number {
    const EIRP = this.calculateEIRP(params.txPower, params.txAntennaGain, params.txCableLoss);
    const rxGain = this.calculateRxGain(params.rxAntennaGain, params.rxCableLoss);
    const margins = this.calculateTotalMargins(params.shadowingMargin, params.interferenceMargin);
    
    return EIRP + rxGain - params.rxSensitivity - margins;
  }

  /**
   * Calcul de l'affaiblissement de parcours maximal autorisé
   */
  static calculateMaxAllowedPathLoss(params: LTEParameters): number {
    return this.calculateLinkBudget(params);
  }

  /**
   * Calcul détaillé du bilan de liaison avec tous les éléments
   */
  static calculateDetailedLinkBudget(params: LTEParameters): {
    eirp: number;
    rxGain: number;
    rxSensitivity: number;
    shadowingMargin: number;
    interferenceMargin: number;
    totalMargins: number;
    maxPathLoss: number;
    linkBudget: number;
  } {
    const eirp = this.calculateEIRP(params.txPower, params.txAntennaGain, params.txCableLoss);
    const rxGain = this.calculateRxGain(params.rxAntennaGain, params.rxCableLoss);
    const totalMargins = this.calculateTotalMargins(params.shadowingMargin, params.interferenceMargin);
    const maxPathLoss = this.calculateMaxAllowedPathLoss(params);
    const linkBudget = this.calculateLinkBudget(params);

    return {
      eirp,
      rxGain,
      rxSensitivity: params.rxSensitivity,
      shadowingMargin: params.shadowingMargin,
      interferenceMargin: params.interferenceMargin,
      totalMargins,
      maxPathLoss,
      linkBudget
    };
  }
}