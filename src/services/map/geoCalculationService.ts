import { MapPosition, LTESite, CoverageArea, TerrainType } from '@/types/map';
import { LTEParameters } from '@/types/lte';

export class GeoCalculationService {
  // Calcul de la distance entre deux points géographiques (formule de Haversine)
  static calculateDistance(pos1: MapPosition, pos2: MapPosition): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRadians(pos2.lat - pos1.lat);
    const dLng = this.toRadians(pos2.lng - pos1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(pos1.lat)) * Math.cos(this.toRadians(pos2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Calcul de la perte de propagation selon le modèle et la géographie
  static calculatePathLoss(
    site: LTESite,
    targetPosition: MapPosition,
    parameters: LTEParameters,
    terrainType: TerrainType
  ): number {
    const distance = this.calculateDistance(site.position, targetPosition);
    
    if (distance === 0) return 0;

    // Facteurs de correction selon le terrain
    const terrainFactors = {
      urban: { a: 46.3, b: 33.9, correction: 3 },
      suburban: { a: 46.3, b: 33.9, correction: 0 },
      rural: { a: 46.3, b: 33.9, correction: -10 },
      water: { a: 46.3, b: 33.9, correction: -5 },
      forest: { a: 46.3, b: 33.9, correction: 8 },
      mountain: { a: 46.3, b: 33.9, correction: 15 }
    };

    const factor = terrainFactors[terrainType.type];
    
    // Modèle Okumura-Hata modifié avec correction géographique
    const pathLoss = factor.a + factor.b * Math.log10(distance) + 
                    20 * Math.log10(parameters.frequency) - 
                    13.82 * Math.log10(site.antennaHeight) +
                    factor.correction +
                    this.getElevationCorrection(terrainType.elevation);

    return Math.max(pathLoss, 0);
  }

  private static getElevationCorrection(elevation: number): number {
    // Correction basée sur l'altitude (approximation)
    return elevation > 500 ? Math.log10(elevation / 100) * 2 : 0;
  }

  // Calcul de la puissance reçue à une position
  static calculateReceivedPower(
    site: LTESite,
    targetPosition: MapPosition,
    parameters: LTEParameters,
    terrainType: TerrainType
  ): number {
    const pathLoss = this.calculatePathLoss(site, targetPosition, parameters, terrainType);
    return site.power - pathLoss;
  }

  // Génération des zones de couverture
  static generateCoverageAreas(
    sites: LTESite[],
    parameters: LTEParameters,
    terrainType: TerrainType,
    minSignalStrength: number = -100 // dBm
  ): CoverageArea[] {
    const coverageAreas: CoverageArea[] = [];

    sites.forEach(site => {
      if (!site.isActive) return;

      // Calcul du rayon de couverture basé sur la puissance minimale requise
      const maxRadius = this.calculateMaxCoverageRadius(
        site,
        parameters,
        terrainType,
        minSignalStrength
      );

      // Génération de cercles concentriques pour représenter l'intensité du signal
      const rings = [
        { radius: maxRadius * 0.3, strength: -60, color: '#00ff00', opacity: 0.7 }, // Excellent
        { radius: maxRadius * 0.6, strength: -80, color: '#ffff00', opacity: 0.5 }, // Bon
        { radius: maxRadius * 0.9, strength: -95, color: '#ff8800', opacity: 0.3 }, // Moyen
        { radius: maxRadius, strength: minSignalStrength, color: '#ff0000', opacity: 0.2 } // Faible
      ];

      rings.forEach((ring, index) => {
        coverageAreas.push({
          siteId: site.id,
          center: site.position,
          radius: ring.radius,
          signalStrength: ring.strength,
          color: ring.color,
          opacity: ring.opacity
        });
      });
    });

    return coverageAreas;
  }

  private static calculateMaxCoverageRadius(
    site: LTESite,
    parameters: LTEParameters,
    terrainType: TerrainType,
    minSignalStrength: number
  ): number {
    // Calcul inverse pour trouver la distance maximale
    const maxPathLoss = site.power - minSignalStrength;
    
    const terrainFactors = {
      urban: { a: 46.3, b: 33.9, correction: 3 },
      suburban: { a: 46.3, b: 33.9, correction: 0 },
      rural: { a: 46.3, b: 33.9, correction: -10 },
      water: { a: 46.3, b: 33.9, correction: -5 },
      forest: { a: 46.3, b: 33.9, correction: 8 },
      mountain: { a: 46.3, b: 33.9, correction: 15 }
    };

    const factor = terrainFactors[terrainType.type];
    
    // Résolution de l'équation pour trouver la distance
    const logDistance = (maxPathLoss - factor.a - 20 * Math.log10(parameters.frequency) + 
                        13.82 * Math.log10(site.antennaHeight) - factor.correction - 
                        this.getElevationCorrection(terrainType.elevation)) / factor.b;
    
    const distance = Math.pow(10, logDistance);
    return Math.min(Math.max(distance, 0.1), 50); // Limité entre 100m et 50km
  }

  // Optimisation automatique du placement des sites
  static optimizeSitePlacement(
    targetArea: { center: MapPosition; radius: number },
    parameters: LTEParameters,
    terrainType: TerrainType,
    maxSites: number = 10
  ): MapPosition[] {
    const sites: MapPosition[] = [];
    const gridSize = 20; // Grille de recherche
    
    // Algorithme simple de placement en grille hexagonale
    const hexRadius = targetArea.radius / Math.sqrt(maxSites);
    
    for (let i = 0; i < maxSites; i++) {
      const angle = (i * 2 * Math.PI) / maxSites;
      const distance = hexRadius * (1 + Math.random() * 0.3); // Variation aléatoire
      
      const position: MapPosition = {
        lat: targetArea.center.lat + (distance / 111) * Math.cos(angle), // 1° ≈ 111km
        lng: targetArea.center.lng + (distance / (111 * Math.cos(this.toRadians(targetArea.center.lat)))) * Math.sin(angle)
      };
      
      sites.push(position);
    }
    
    return sites;
  }

  // Analyse de la qualité de couverture
  static analyzeCoverageQuality(
    sites: LTESite[],
    parameters: LTEParameters,
    terrainType: TerrainType,
    targetArea: { center: MapPosition; radius: number }
  ): {
    coveragePercentage: number;
    averageSignalStrength: number;
    weakSpots: MapPosition[];
    overlapAreas: MapPosition[];
  } {
    const samplePoints = this.generateSamplePoints(targetArea, 100);
    let coveredPoints = 0;
    let totalSignalStrength = 0;
    const weakSpots: MapPosition[] = [];
    const overlapAreas: MapPosition[] = [];

    samplePoints.forEach(point => {
      const signals = sites.map(site => 
        this.calculateReceivedPower(site, point, parameters, terrainType)
      ).filter(signal => signal > -100); // Seuil de réception

      if (signals.length > 0) {
        coveredPoints++;
        const maxSignal = Math.max(...signals);
        totalSignalStrength += maxSignal;

        if (maxSignal < -90) {
          weakSpots.push(point);
        }

        if (signals.length > 2) { // Plus de 2 sites couvrent ce point
          overlapAreas.push(point);
        }
      }
    });

    return {
      coveragePercentage: (coveredPoints / samplePoints.length) * 100,
      averageSignalStrength: totalSignalStrength / Math.max(coveredPoints, 1),
      weakSpots,
      overlapAreas
    };
  }

  private static generateSamplePoints(
    area: { center: MapPosition; radius: number },
    count: number
  ): MapPosition[] {
    const points: MapPosition[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * area.radius;
      
      points.push({
        lat: area.center.lat + (distance / 111) * Math.cos(angle),
        lng: area.center.lng + (distance / (111 * Math.cos(this.toRadians(area.center.lat)))) * Math.sin(angle)
      });
    }
    
    return points;
  }
}