import { LTESite, MapPosition } from '@/types/map';
import { LTEParameters, PropagationModel } from '@/types/lte';
import { LTECalculationService } from '@/services/lte/calculationService';
import { CoverageService } from '@/services/lte/coverageService';
import { LinkBudgetService } from '@/services/lte/linkBudgetService';

/**
 * Service pour calculer la couverture réelle des sites LTE sur la carte
 */
export class LTECoverageService {
  /**
   * Convertir un site LTE en paramètres LTE pour les calculs
   */
  static siteToLTEParameters(site: LTESite, targetArea: number = 100): LTEParameters {
    // Paramètres adaptatifs selon la fréquence et l'environnement
    const getAdaptiveGain = (freq: number, env: string): number => {
      if (env === 'urban') return freq > 2000 ? 18 : 15;
      if (env === 'suburban') return freq > 2000 ? 16 : 14;
      return freq > 2000 ? 14 : 12; // rural
    };

    const getAdaptiveSensitivity = (freq: number): number => {
      // Sensibilité adaptée à la fréquence (plus haute fréquence = moins bonne sensibilité)
      if (freq <= 900) return -105;
      if (freq <= 1800) return -102;
      if (freq <= 2100) return -100;
      return -98; // 2600 MHz et plus
    };

    const getAdaptiveMargins = (env: string): { shadowing: number; interference: number } => {
      if (env === 'urban') return { shadowing: 10, interference: 4 };
      if (env === 'suburban') return { shadowing: 8, interference: 3 };
      return { shadowing: 6, interference: 2 }; // rural
    };

    const margins = getAdaptiveMargins(site.environment);

    return {
      frequency: site.frequency,
      txPower: site.power,
      txAntennaHeight: site.antennaHeight,
      rxAntennaHeight: 1.5, // Hauteur mobile standard
      txAntennaGain: getAdaptiveGain(site.frequency, site.environment),
      rxAntennaGain: 0, // Gain antenne mobile
      txCableLoss: 2, // Pertes câbles standard
      rxCableLoss: 0, // Pas de pertes côté mobile
      rxSensitivity: getAdaptiveSensitivity(site.frequency),
      shadowingMargin: margins.shadowing,
      interferenceMargin: margins.interference,
      environment: site.environment,
      targetArea: targetArea
    };
  }

  /**
   * Calculer le rayon de couverture réel d'un site selon le modèle de propagation
   * Les sites inactifs retournent toujours 0
   */
  static calculateRealCoverageRadius(
    site: LTESite, 
    propagationModel: PropagationModel = 'cost231-hata'
  ): number {
    // Les sites inactifs n'ont pas de couverture
    if (!site.isActive) return 0;

    try {
      const lteParams = this.siteToLTEParameters(site);
      
      // Calcul du bilan de liaison maximum autorisé
      const maxAllowedPathLoss = LinkBudgetService.calculateMaxAllowedPathLoss(lteParams);
      
      // Recherche de la portée maximale avec le modèle sélectionné
      const maxRange = CoverageService.findMaxRange(propagationModel, lteParams, maxAllowedPathLoss);
      
      // Calcul du rayon de cellule effectif
      const cellRadius = CoverageService.calculateCellRadius(maxRange);
      
      return Math.max(0.1, Math.min(cellRadius, 20)); // Limiter entre 0.1 et 20 km
    } catch (error) {
      console.warn(`Erreur calcul couverture site ${site.name}:`, error);
      return 2; // Valeur par défaut en cas d'erreur
    }
  }

  /**
   * Calculer la surface de couverture réelle d'un site
   */
  static calculateRealCoverageArea(
    site: LTESite, 
    propagationModel: PropagationModel = 'cost231-hata'
  ): number {
    const radius = this.calculateRealCoverageRadius(site, propagationModel);
    return CoverageService.calculateCellArea(radius);
  }

  /**
   * Mettre à jour tous les sites avec les rayons de couverture calculés
   */
  static updateSitesWithRealCoverage(
    sites: LTESite[], 
    propagationModel: PropagationModel = 'cost231-hata'
  ): LTESite[] {
    return sites.map(site => ({
      ...site,
      coverageRadius: this.calculateRealCoverageRadius(site, propagationModel)
    }));
  }

  /**
   * Calculer les statistiques de couverture pour une zone
   */
  static calculateCoverageStatistics(
    sites: LTESite[], 
    propagationModel: PropagationModel = 'cost231-hata'
  ): {
    totalCoverage: number;
    averageRadius: number;
    activeSites: number;
    modelUsed: string;
  } {
    const activeSites = sites.filter(site => site.isActive);
    
    if (activeSites.length === 0) {
      return {
        totalCoverage: 0,
        averageRadius: 0,
        activeSites: 0,
        modelUsed: LTECalculationService.getModelName(propagationModel)
      };
    }

    const totalCoverage = activeSites.reduce((sum, site) => {
      return sum + this.calculateRealCoverageArea(site, propagationModel);
    }, 0);

    const averageRadius = activeSites.reduce((sum, site) => {
      return sum + this.calculateRealCoverageRadius(site, propagationModel);
    }, 0) / activeSites.length;

    return {
      totalCoverage,
      averageRadius,
      activeSites: activeSites.length,
      modelUsed: LTECalculationService.getModelName(propagationModel)
    };
  }

  /**
   * Obtenir les modèles de propagation recommandés selon la fréquence
   */
  static getRecommendedModel(frequency: number): PropagationModel {
    return LTECalculationService.getRecommendedModel(frequency);
  }

  /**
   * Obtenir tous les modèles disponibles avec leurs domaines de validité
   */
  static getAvailableModels(): Array<{
    model: PropagationModel;
    name: string;
    frequencyRange: string;
    description: string;
  }> {
    return [
      {
        model: 'okumura-hata',
        name: 'Okumura-Hata',
        frequencyRange: '150-1500 MHz',
        description: 'Modèle classique pour les basses fréquences'
      },
      {
        model: 'cost231-hata',
        name: 'COST 231-Hata',
        frequencyRange: '1500-2000 MHz',
        description: 'Extension pour les fréquences moyennes'
      },
      {
        model: '3gpp',
        name: '3GPP TR 36.814',
        frequencyRange: '2000-6000 MHz',
        description: 'Modèle moderne pour les hautes fréquences'
      }
    ];
  }

  /**
   * Calculer l'affaiblissement à une distance donnée
   */
  static calculatePathLossAtDistance(
    site: LTESite,
    distance: number,
    propagationModel: PropagationModel = 'cost231-hata'
  ): number {
    const lteParams = this.siteToLTEParameters(site);
    return CoverageService.calculatePathLoss(propagationModel, lteParams, distance);
  }

  /**
   * Calculer la qualité du signal à une position donnée
   */
  static calculateSignalQualityAtPosition(
    site: LTESite,
    position: MapPosition,
    propagationModel: PropagationModel = 'cost231-hata'
  ): {
    distance: number;
    pathLoss: number;
    receivedPower: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor' | 'no-signal';
  } {
    // Calcul de la distance (approximation simple)
    const distance = this.calculateDistance(site.position, position);
    
    if (distance === 0) {
      return {
        distance: 0,
        pathLoss: 0,
        receivedPower: site.power,
        quality: 'excellent'
      };
    }

    const pathLoss = this.calculatePathLossAtDistance(site, distance, propagationModel);
    const receivedPower = site.power - pathLoss;

    let quality: 'excellent' | 'good' | 'fair' | 'poor' | 'no-signal';
    if (receivedPower > -70) quality = 'excellent';
    else if (receivedPower > -85) quality = 'good';
    else if (receivedPower > -100) quality = 'fair';
    else if (receivedPower > -110) quality = 'poor';
    else quality = 'no-signal';

    return {
      distance,
      pathLoss,
      receivedPower,
      quality
    };
  }

  /**
   * Calculer la distance entre deux positions (approximation simple)
   */
  private static calculateDistance(pos1: MapPosition, pos2: MapPosition): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}