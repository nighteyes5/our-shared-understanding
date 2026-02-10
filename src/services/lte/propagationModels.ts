import type { EnvironmentType } from '@/types/lte';
import { FREQUENCY_LIMITS, LTE_CONSTANTS } from './constants';

/**
 * Service pour les modèles de propagation radio
 */
export class PropagationModelsService {
  /**
   * Calcul du facteur de correction pour mobile (Okumura-Hata)
   */
  private static getMobileStationCorrectionFactor(
    frequency: number,
    rxHeight: number,
    environment: EnvironmentType
  ): number {
    if (environment === 'urban') {
      if (frequency <= 300) {
        return 8.29 * Math.pow(Math.log10(1.54 * rxHeight), 2) - 1.1;
      }
      return 3.2 * Math.pow(Math.log10(11.75 * rxHeight), 2) - 4.97;
    }
    // Suburban et Rural
    return (1.1 * Math.log10(frequency) - 0.7) * rxHeight - (1.56 * Math.log10(frequency) - 0.8);
  }

  /**
   * Modèle Okumura-Hata (150-1500 MHz)
   */
  static calculateOkumuraHata(
    frequency: number,
    txHeight: number,
    rxHeight: number,
    distance: number,
    environment: EnvironmentType
  ): number {
    // Limiter la fréquence au domaine de validité
    const validFrequency = Math.min(frequency, FREQUENCY_LIMITS.OKUMURA_HATA_MAX);
    
    const a_hm = this.getMobileStationCorrectionFactor(validFrequency, rxHeight, environment);
    
    let pathLoss = 69.55 + 26.16 * Math.log10(validFrequency) 
      - 13.82 * Math.log10(txHeight) 
      - a_hm 
      + (44.9 - 6.55 * Math.log10(txHeight)) * Math.log10(distance);
    
    if (environment === 'suburban') {
      pathLoss -= 2 * Math.pow(Math.log10(validFrequency / 28), 2) + 5.4;
    } else if (environment === 'rural') {
      pathLoss -= 4.78 * Math.pow(Math.log10(validFrequency), 2) + 18.33 * Math.log10(validFrequency) - 40.94;
    }
    
    return pathLoss;
  }

  /**
   * Modèle COST 231-Hata (1500-2000 MHz)
   */
  static calculateCOST231Hata(
    frequency: number,
    txHeight: number,
    rxHeight: number,
    distance: number,
    environment: EnvironmentType
  ): number {
    const a_hm = this.getMobileStationCorrectionFactor(frequency, rxHeight, 'suburban');
    
    const C_m = environment === 'urban' ? 3 : 0;
    
    const pathLoss = 46.3 + 33.9 * Math.log10(frequency) 
      - 13.82 * Math.log10(txHeight) 
      - a_hm 
      + (44.9 - 6.55 * Math.log10(txHeight)) * Math.log10(distance)
      + C_m;
    
    return pathLoss;
  }

  /**
   * Modèle 3GPP TR 36.814 (jusqu'à 6000 MHz)
   */
  static calculate3GPP(
    frequency: number,
    txHeight: number,
    rxHeight: number,
    distance: number,
    environment: EnvironmentType
  ): number {
    const d_3D = Math.sqrt(Math.pow(distance * 1000, 2) + Math.pow(txHeight - rxHeight, 2));
    const d_BP = 4 * txHeight * rxHeight * frequency * 1e6 / LTE_CONSTANTS.SPEED_OF_LIGHT;
    
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
      const d_BP_rural = 2 * Math.PI * txHeight * rxHeight * frequency * 1e6 / LTE_CONSTANTS.SPEED_OF_LIGHT;
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
  }
}