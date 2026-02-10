import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SimpleMap } from '@/components/map/SimpleMap';
import { OpenLayersMap } from '@/components/map/OpenLayersMap';
import { SiteConfigPanel } from '@/components/map/SiteConfigPanel';
import { SimpleCoverageStats } from '@/components/map/SimpleCoverageStats';
import { PropagationModelSelector } from '@/components/map/PropagationModelSelector';
import { QuickModelSelector } from '@/components/map/QuickModelSelector';
import { MapHelp } from '@/components/map/MapHelp';
import { LocationSearch } from '@/components/map/LocationSearch';
import { LTESite, MapPosition, PREDEFINED_LOCATIONS, PredefinedLocation } from '@/types/map';
import { LTEParameters, DEFAULT_LTE_PARAMETERS, PropagationModel } from '@/types/lte';
import { SiteService } from '@/services/map/siteService';
import { LTECoverageService } from '@/services/map/lteCoverageService';
import { toast } from '@/hooks/use-toast';
import { 
  Map, 
  LogOut, 
  Home, 
  Download, 
  Upload, 
  RotateCcw, 
  Settings,
  BarChart3,
  MapPin,
  Zap,
  Calculator
} from 'lucide-react';
import { UserRole } from '@/types/auth';

const MapPlanning: React.FC = () => {
  const { user, logout } = useAuth();
  const [sites, setSites] = useState<LTESite[]>([]);
  const [selectedSite, setSelectedSite] = useState<LTESite | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PredefinedLocation>(PREDEFINED_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState<{ name: string; position: MapPosition; zoom: number } | null>(null);
  const [parameters, setParameters] = useState<LTEParameters>(DEFAULT_LTE_PARAMETERS);
  const [propagationModel, setPropagationModel] = useState<PropagationModel>('cost231-hata');
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => {
    loadSites();
  }, []);

  // Recalculer la couverture quand le modèle change
  useEffect(() => {
    if (sites.length > 0) {
      const updatedSites = LTECoverageService.updateSitesWithRealCoverage(sites, propagationModel);
      setSites(updatedSites);
      SiteService.saveSites(updatedSites);
      
      // Notification du changement de modèle
      const modelName = LTECoverageService.getAvailableModels().find(m => m.model === propagationModel)?.name;
      toast({
        title: "Modèle de propagation changé",
        description: `Calculs mis à jour avec ${modelName}. Rayons de couverture recalculés.`,
      });
    }
  }, [propagationModel]);

  const loadSites = () => {
    const loadedSites = SiteService.getSites();
    setSites(loadedSites);
  };

  const handleLocationChange = (locationId: string) => {
    const location = PREDEFINED_LOCATIONS.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setCustomLocation(null); // Réinitialiser la location personnalisée
      // Recommander un modèle selon la fréquence moyenne des sites
      if (sites.length > 0) {
        const avgFreq = sites.reduce((sum, site) => sum + site.frequency, 0) / sites.length;
        const recommendedModel = LTECoverageService.getRecommendedModel(avgFreq);
        if (recommendedModel !== propagationModel) {
          toast({
            title: "Modèle recommandé",
            description: `Pour cette zone et vos fréquences, le modèle ${LTECoverageService.getAvailableModels().find(m => m.model === recommendedModel)?.name} est recommandé.`,
          });
        }
      }
    }
  };

  const handleCustomLocationSelect = (location: { name: string; position: MapPosition; zoom: number }) => {
    setCustomLocation(location);
    toast({
      title: "Zone personnalisée sélectionnée",
      description: `Carte centrée sur ${location.name}`,
    });
  };

  // Déterminer la location active (personnalisée ou prédéfinie)
  const activeLocation = customLocation || {
    name: selectedLocation.name,
    center: selectedLocation.center,
    zoom: selectedLocation.zoom
  };

  const handleSiteAdd = (position: MapPosition) => {
    try {
      const newSite = SiteService.addSite(position, undefined, propagationModel);
      setSites(prev => [...prev, newSite]);
      setSelectedSite(newSite);
      
      toast({
        title: "Site ajouté",
        description: `${newSite.name} a été ajouté avec une couverture calculée de ${newSite.coverageRadius.toFixed(1)} km`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le site",
        variant: "destructive",
      });
    }
  };

  const handleSiteUpdate = (siteId: string, updates: Partial<LTESite>) => {
    try {
      const updatedSite = SiteService.updateSite(siteId, updates);
      if (updatedSite) {
        setSites(prev => prev.map(site => site.id === siteId ? updatedSite : site));
        setSelectedSite(updatedSite);
        
        const modelName = LTECoverageService.getAvailableModels().find(m => m.model === updatedSite.propagationModel)?.name;
        toast({
          title: "Site modifié",
          description: `${updatedSite.name} a été mis à jour - Nouvelle couverture: ${updatedSite.coverageRadius.toFixed(1)} km (${modelName})`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le site",
        variant: "destructive",
      });
    }
  };

  const handleSiteDelete = (siteId: string) => {
    try {
      const success = SiteService.deleteSite(siteId);
      if (success) {
        setSites(prev => prev.filter(site => site.id !== siteId));
        setSelectedSite(null);
        
        toast({
          title: "Site supprimé",
          description: "Le site a été supprimé avec succès",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le site",
        variant: "destructive",
      });
    }
  };

  const handleGenerateDemoSites = () => {
    try {
      const demoSites = SiteService.generateDemoSites(selectedLocation.center, 5, propagationModel);
      SiteService.importSites([...sites, ...demoSites]);
      setSites(prev => [...prev, ...demoSites]);
      
      toast({
        title: "Sites de démonstration générés",
        description: `${demoSites.length} sites ont été ajoutés avec calculs de couverture réels`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les sites de démonstration",
        variant: "destructive",
      });
    }
  };

  const handleClearAllSites = () => {
    try {
      SiteService.clearAllSites();
      setSites([]);
      setSelectedSite(null);
      
      toast({
        title: "Sites supprimés",
        description: "Tous les sites ont été supprimés",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les sites",
        variant: "destructive",
      });
    }
  };

  const handleExportSites = () => {
    try {
      const sitesData = SiteService.exportSites();
      
      // Export complet avec tous les paramètres
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        sites: sitesData, // Inclut déjà le propagationModel de chaque site
        globalPropagationModel: propagationModel,
        location: customLocation ? {
          type: 'custom',
          name: customLocation.name,
          position: customLocation.position,
          zoom: customLocation.zoom
        } : {
          type: 'predefined',
          id: selectedLocation.id,
          name: selectedLocation.name,
          center: selectedLocation.center,
          zoom: selectedLocation.zoom
        },
        statistics: {
          totalSites: sitesData.length,
          activeSites: sitesData.filter(s => s.isActive).length,
          coverage: LTECoverageService.calculateCoverageStatistics(sitesData, propagationModel),
          modelDistribution: sitesData.reduce((acc, site) => {
            const model = site.propagationModel || 'unknown';
            acc[model] = (acc[model] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      const locationName = customLocation ? customLocation.name : selectedLocation.name;
      link.download = `lte-planning-${locationName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: `${sitesData.length} sites exportés avec tous les paramètres`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les sites",
        variant: "destructive",
      });
    }
  };

  const handleImportSites = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        // Validation du format
        if (!importData.sites || !Array.isArray(importData.sites)) {
          throw new Error('Format de fichier invalide');
        }

        // Importer les sites
        SiteService.importSites(importData.sites);
        setSites(importData.sites);

        // Restaurer le modèle de propagation global si disponible
        if (importData.globalPropagationModel) {
          setPropagationModel(importData.globalPropagationModel);
        }

        // Restaurer la location si disponible
        if (importData.location) {
          if (importData.location.type === 'custom') {
            setCustomLocation({
              name: importData.location.name,
              position: importData.location.position,
              zoom: importData.location.zoom
            });
          } else if (importData.location.type === 'predefined' && importData.location.id) {
            const location = PREDEFINED_LOCATIONS.find(loc => loc.id === importData.location.id);
            if (location) {
              setSelectedLocation(location);
              setCustomLocation(null);
            }
          }
        }

        toast({
          title: "Import réussi",
          description: `${importData.sites.length} sites importés avec tous leurs paramètres`,
        });
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Le fichier est invalide ou corrompu",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    // Réinitialiser l'input pour permettre de réimporter le même fichier
    event.target.value = '';
  };

  // Calculer la fréquence moyenne pour les recommandations
  const averageFrequency = sites.length > 0 ? 
    sites.reduce((sum, site) => sum + site.frequency, 0) / sites.length : undefined;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Map className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Planification LTE - Sénégal
                </h1>
                <p className="text-sm text-gray-500">
                  Dimensionnement géographique avec calculs réels
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Calculator className="h-3 w-3 mr-1" />
                {LTECoverageService.getAvailableModels().find(m => m.model === propagationModel)?.name}
              </Badge>
              <Badge variant="outline">
                {customLocation ? customLocation.name : selectedLocation.name}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = user.role === UserRole.ADMIN ? '/admin' : '/dashboard'}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Contrôles principaux */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Zone géographique</label>
              <Select value={customLocation ? 'custom' : selectedLocation.id} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customLocation && (
                    <SelectItem value="custom">
                      {customLocation.name} (Personnalisée)
                    </SelectItem>
                  )}
                  {PREDEFINED_LOCATIONS.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} ({location.country})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">
              <LocationSearch onLocationSelect={handleCustomLocationSelect} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Modèle de propagation</label>
              <Select value={propagationModel} onValueChange={(value: PropagationModel) => setPropagationModel(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LTECoverageService.getAvailableModels().map(model => (
                    <SelectItem key={model.model} value={model.model}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-gray-500">{model.frequencyRange}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <MapPin className="h-3 w-3 mr-1" />
                {sites.length} sites
              </Badge>
              <Badge variant="secondary">
                <Zap className="h-3 w-3 mr-1" />
                {sites.filter(s => s.isActive).length} actifs
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapHelp />
            <Button variant="outline" size="sm" onClick={handleGenerateDemoSites}>
              <Settings className="h-4 w-4 mr-2" />
              Sites démo
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSites}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </label>
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImportSites}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={handleClearAllSites}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Effacer sites
            </Button>
          </div>
        </div>

        {/* Interface principale */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="h-4 w-4" />
              <span>Carte</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Statistiques</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            {/* Sélecteur rapide de modèle */}
            <QuickModelSelector
              selectedModel={propagationModel}
              onModelChange={setPropagationModel}
              sitesCount={sites.length}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <OpenLayersMap
                  sites={sites}
                  onSiteAdd={handleSiteAdd}
                  onSiteSelect={setSelectedSite}
                  selectedSite={selectedSite}
                  center={customLocation ? customLocation.position : selectedLocation.center}
                  zoom={customLocation ? customLocation.zoom : selectedLocation.zoom}
                  showCoverage={true}
                  propagationModel={propagationModel}
                />
              </div>
              
              <div className="h-full">
                <SiteConfigPanel
                  site={selectedSite}
                  onSiteUpdate={handleSiteUpdate}
                  onSiteDelete={handleSiteDelete}
                  onClose={() => setSelectedSite(null)}
                  propagationModel={propagationModel}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropagationModelSelector
                selectedModel={propagationModel}
                onModelChange={setPropagationModel}
                averageFrequency={averageFrequency}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de Simulation</CardTitle>
                  <CardDescription>
                    Configuration avancée des calculs de couverture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Calculs Automatiques</h4>
                      <p className="text-sm text-blue-800">
                        Les rayons de couverture sont calculés automatiquement selon :
                      </p>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• Modèle de propagation sélectionné</li>
                        <li>• Puissance d'émission du site</li>
                        <li>• Fréquence de fonctionnement</li>
                        <li>• Hauteur d'antenne</li>
                        <li>• Type d'environnement</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Spécificités Sénégal</h4>
                      <p className="text-sm text-green-800">
                        Les calculs tiennent compte des conditions locales :
                        climat tropical, zones côtières, relief varié.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <SimpleCoverageStats
              sites={sites}
              parameters={parameters}
              selectedArea={{
                name: selectedLocation.name,
                area: Math.PI * Math.pow(10, 2) // Approximation 10km de rayon
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MapPlanning;