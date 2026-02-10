import { LTESite, MapPosition } from '@/types/map';
import { PropagationModel } from '@/types/lte';
import { LTECoverageService } from './lteCoverageService';

const STORAGE_KEY = 'lte_sites';

export class SiteService {
  static getSites(): LTESite[] {
    const sites = localStorage.getItem(STORAGE_KEY);
    const loadedSites = sites ? JSON.parse(sites) : [];
    
    // Migration : ajouter propagationModel aux sites existants qui n'en ont pas
    const migratedSites = loadedSites.map((site: any) => {
      if (!site.propagationModel) {
        // Assigner un modèle par défaut basé sur la fréquence
        let defaultModel: PropagationModel = 'cost231-hata';
        
        if (site.frequency <= 1500) {
          defaultModel = 'okumura-hata';
        } else if (site.frequency >= 2100) {
          defaultModel = '3gpp';
        }
        
        return { ...site, propagationModel: defaultModel };
      }
      return site;
    });
    
    // Sauvegarder les sites migrés si nécessaire
    if (migratedSites.some((site: LTESite, index: number) => 
      !loadedSites[index]?.propagationModel && site.propagationModel
    )) {
      this.saveSites(migratedSites);
    }
    
    return migratedSites;
  }

  static saveSites(sites: LTESite[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  }

  static addSite(position: MapPosition, name?: string, propagationModel: PropagationModel = 'cost231-hata'): LTESite {
    const sites = this.getSites();
    
    const newSite: LTESite = {
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || `Site ${sites.length + 1}`,
      position,
      power: 43, // dBm par défaut
      frequency: 1800, // MHz par défaut (adapté au Sénégal)
      antennaHeight: 30, // mètres par défaut
      coverageRadius: 5, // sera recalculé
      environment: 'urban',
      isActive: true,
      createdAt: new Date().toISOString(),
      propagationModel: propagationModel // Stocker le modèle dans le site
    };

    // Calculer le rayon de couverture réel avec le modèle du site
    newSite.coverageRadius = LTECoverageService.calculateRealCoverageRadius(newSite, newSite.propagationModel);

    sites.push(newSite);
    this.saveSites(sites);
    
    return newSite;
  }

  static updateSite(siteId: string, updates: Partial<LTESite>): LTESite | null {
    const sites = this.getSites();
    const siteIndex = sites.findIndex(s => s.id === siteId);
    
    if (siteIndex === -1) return null;

    const updatedSite = { ...sites[siteIndex], ...updates };
    
    // Recalculer le rayon de couverture si les paramètres ont changé
    if (updates.power !== undefined || updates.frequency !== undefined || 
        updates.antennaHeight !== undefined || updates.environment !== undefined ||
        updates.propagationModel !== undefined) {
      // Utiliser le modèle du site (nouveau ou existant)
      const modelToUse = updatedSite.propagationModel || 'cost231-hata';
      updatedSite.coverageRadius = LTECoverageService.calculateRealCoverageRadius(updatedSite, modelToUse);
    }

    sites[siteIndex] = updatedSite;
    this.saveSites(sites);
    
    return updatedSite;
  }

  static deleteSite(siteId: string): boolean {
    const sites = this.getSites();
    const filteredSites = sites.filter(s => s.id !== siteId);
    
    if (filteredSites.length === sites.length) return false;

    this.saveSites(filteredSites);
    return true;
  }

  static toggleSiteStatus(siteId: string): boolean {
    const sites = this.getSites();
    const site = sites.find(s => s.id === siteId);
    
    if (!site) return false;

    site.isActive = !site.isActive;
    this.saveSites(sites);
    
    return true;
  }

  static clearAllSites(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static importSites(sites: LTESite[]): void {
    this.saveSites(sites);
  }

  static exportSites(): LTESite[] {
    return this.getSites();
  }

  // Génération de sites de démonstration avec calculs réels
  static generateDemoSites(center: MapPosition, count: number = 5, propagationModel: PropagationModel = 'cost231-hata'): LTESite[] {
    const demoSites: LTESite[] = [];
    
    // Fréquences LTE courantes au Sénégal
    const frequencies = [800, 1800, 2100, 2600];
    const environments: Array<'urban' | 'suburban' | 'rural'> = ['urban', 'suburban', 'rural'];
    const models: PropagationModel[] = ['okumura-hata', 'cost231-hata', '3gpp'];
    
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      const distance = 0.02 + Math.random() * 0.03; // Distance en degrés (≈ 2-5 km)
      
      // Chaque site peut avoir un modèle différent
      const siteModel = models[Math.floor(Math.random() * models.length)];
      
      const site: LTESite = {
        id: `demo-site-${i + 1}`,
        name: `Site Demo ${i + 1}`,
        position: {
          lat: center.lat + distance * Math.cos(angle),
          lng: center.lng + distance * Math.sin(angle)
        },
        power: 40 + Math.random() * 6, // 40-46 dBm
        frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
        antennaHeight: 25 + Math.random() * 20, // 25-45 mètres
        coverageRadius: 3, // sera recalculé
        environment: environments[Math.floor(Math.random() * environments.length)],
        isActive: true,
        createdAt: new Date().toISOString(),
        propagationModel: siteModel // Chaque site a son propre modèle
      };
      
      // Calculer le rayon de couverture réel avec le modèle du site
      site.coverageRadius = LTECoverageService.calculateRealCoverageRadius(site, site.propagationModel);
      
      demoSites.push(site);
    }
    
    return demoSites;
  }

  // Mettre à jour tous les sites avec les nouveaux calculs de couverture
  static recalculateAllCoverage(propagationModel: PropagationModel = 'cost231-hata'): void {
    const sites = this.getSites();
    const updatedSites = LTECoverageService.updateSitesWithRealCoverage(sites, propagationModel);
    this.saveSites(updatedSites);
  }

  // Validation des paramètres d'un site
  static validateSite(site: Partial<LTESite>): string[] {
    const errors: string[] = [];

    if (!site.name || site.name.trim().length === 0) {
      errors.push('Le nom du site est requis');
    }

    if (!site.position || !site.position.lat || !site.position.lng) {
      errors.push('La position du site est requise');
    }

    if (site.power !== undefined && (site.power < 20 || site.power > 50)) {
      errors.push('La puissance doit être entre 20 et 50 dBm');
    }

    if (site.frequency !== undefined && (site.frequency < 700 || site.frequency > 3800)) {
      errors.push('La fréquence doit être entre 700 et 3800 MHz');
    }

    if (site.antennaHeight !== undefined && (site.antennaHeight < 10 || site.antennaHeight > 100)) {
      errors.push('La hauteur d\'antenne doit être entre 10 et 100 mètres');
    }

    return errors;
  }

  // Statistiques des sites avec calculs réels
  static getSiteStatistics(propagationModel: PropagationModel = 'cost231-hata'): {
    totalSites: number;
    activeSites: number;
    averagePower: number;
    totalCoverage: number;
    averageRadius: number;
    frequencyDistribution: Record<number, number>;
    environmentDistribution: Record<string, number>;
    modelUsed: string;
  } {
    const sites = this.getSites();
    const coverageStats = LTECoverageService.calculateCoverageStatistics(sites, propagationModel);
    
    const stats = {
      totalSites: sites.length,
      activeSites: sites.filter(s => s.isActive).length,
      averagePower: 0,
      totalCoverage: coverageStats.totalCoverage,
      averageRadius: coverageStats.averageRadius,
      frequencyDistribution: {} as Record<number, number>,
      environmentDistribution: {} as Record<string, number>,
      modelUsed: coverageStats.modelUsed
    };

    if (sites.length > 0) {
      stats.averagePower = sites.reduce((sum, site) => sum + site.power, 0) / sites.length;

      sites.forEach(site => {
        // Distribution des fréquences
        stats.frequencyDistribution[site.frequency] = 
          (stats.frequencyDistribution[site.frequency] || 0) + 1;

        // Distribution des environnements
        stats.environmentDistribution[site.environment] = 
          (stats.environmentDistribution[site.environment] || 0) + 1;
      });
    }

    return stats;
  }
}