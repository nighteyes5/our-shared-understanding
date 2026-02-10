import React, { useState, useEffect } from 'react';
import { LTESite } from '@/types/map';
import { PropagationModel } from '@/types/lte';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, Trash2, Zap, ZapOff, Radio, Antenna, MapPin, Calculator, Info } from 'lucide-react';
import { LTECoverageService } from '@/services/map/lteCoverageService';
import { LinkBudgetDetails } from './LinkBudgetDetails';

interface SiteConfigPanelProps {
  site: LTESite | null;
  onSiteUpdate: (siteId: string, updates: Partial<LTESite>) => void;
  onSiteDelete: (siteId: string) => void;
  onClose: () => void;
  propagationModel?: PropagationModel;
}

export const SiteConfigPanel: React.FC<SiteConfigPanelProps> = ({
  site,
  onSiteUpdate,
  onSiteDelete,
  onClose,
  propagationModel = 'cost231-hata'
}) => {
  const [localSite, setLocalSite] = useState<LTESite | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewRadius, setPreviewRadius] = useState<number>(0);

  useEffect(() => {
    if (site) {
      setLocalSite({ ...site });
      setHasChanges(false);
      setPreviewRadius(site.coverageRadius);
    }
  }, [site]);

  // Recalculer le rayon en temps réel quand les paramètres changent
  useEffect(() => {
    if (localSite && hasChanges) {
      // Utiliser le modèle du site ou celui passé en prop
      const modelToUse = localSite.propagationModel || propagationModel;
      const newRadius = LTECoverageService.calculateRealCoverageRadius(localSite, modelToUse);
      setPreviewRadius(newRadius);
    }
  }, [localSite, propagationModel, hasChanges]);

  if (!site || !localSite) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardContent className="flex items-center justify-center flex-1 text-gray-500">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Sélectionnez un site sur la carte pour le configurer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleFieldChange = (field: keyof LTESite, value: any) => {
    setLocalSite(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (localSite && hasChanges) {
      onSiteUpdate(localSite.id, localSite);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (site) {
      setLocalSite({ ...site });
      setHasChanges(false);
    }
  };

  const handleDelete = () => {
    onSiteDelete(localSite.id);
    onClose();
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configuration du Site</span>
            </CardTitle>
            <CardDescription>
              {localSite.name} • {localSite.isActive ? 'Actif' : 'Inactif'}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={localSite.isActive ? "default" : "secondary"}>
              {localSite.isActive ? <Zap className="h-3 w-3 mr-1" /> : <ZapOff className="h-3 w-3 mr-1" />}
              {localSite.isActive ? 'Actif' : 'Inactif'}
            </Badge>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le site</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer le site "{localSite.name}" ?
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-background">
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>Détails Calculs</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-6 mt-6 pb-6">
            {/* Configuration existante */}
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Informations générales</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={localSite.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={localSite.isActive}
                    onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                  />
                  <Label>Site actif</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={localSite.position.lat}
                    onChange={(e) => handleFieldChange('position', {
                      ...localSite.position,
                      lat: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={localSite.position.lng}
                    onChange={(e) => handleFieldChange('position', {
                      ...localSite.position,
                      lng: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Paramètres radio */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <Radio className="h-4 w-4" />
                <span>Paramètres radio</span>
              </h3>
              
              <div>
                <Label htmlFor="propagationModel">Modèle de propagation</Label>
                <Select
                  value={localSite.propagationModel || 'cost231-hata'}
                  onValueChange={(value: PropagationModel) => handleFieldChange('propagationModel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="okumura-hata">
                      <div className="flex flex-col">
                        <span className="font-medium">Okumura-Hata</span>
                        <span className="text-xs text-gray-500">150-1500 MHz</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cost231-hata">
                      <div className="flex flex-col">
                        <span className="font-medium">COST 231-Hata</span>
                        <span className="text-xs text-gray-500">1500-2000 MHz</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="3gpp">
                      <div className="flex flex-col">
                        <span className="font-medium">3GPP TR 36.814</span>
                        <span className="text-xs text-gray-500">Jusqu'à 6000 MHz</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Puissance d'émission: {localSite.power} dBm</Label>
                <Slider
                  value={[localSite.power]}
                  onValueChange={(value) => handleFieldChange('power', value[0])}
                  min={20}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>20 dBm</span>
                  <span>50 dBm</span>
                </div>
              </div>

              <div>
                <Label htmlFor="frequency">Fréquence (MHz)</Label>
                <Select
                  value={localSite.frequency.toString()}
                  onValueChange={(value) => handleFieldChange('frequency', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="700">700 MHz (Band 28)</SelectItem>
                    <SelectItem value="800">800 MHz (Band 20)</SelectItem>
                    <SelectItem value="900">900 MHz (Band 8)</SelectItem>
                    <SelectItem value="1800">1800 MHz (Band 3)</SelectItem>
                    <SelectItem value="2100">2100 MHz (Band 1)</SelectItem>
                    <SelectItem value="2600">2600 MHz (Band 7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Paramètres d'antenne */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <Antenna className="h-4 w-4" />
                <span>Paramètres d'antenne</span>
              </h3>
              
              <div>
                <Label>Hauteur d'antenne: {localSite.antennaHeight} m</Label>
                <Slider
                  value={[localSite.antennaHeight]}
                  onValueChange={(value) => handleFieldChange('antennaHeight', value[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10 m</span>
                  <span>100 m</span>
                </div>
              </div>

              <div>
                <Label htmlFor="environment">Type d'environnement</Label>
                <Select
                  value={localSite.environment}
                  onValueChange={(value) => handleFieldChange('environment', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urbain dense</SelectItem>
                    <SelectItem value="suburban">Suburbain</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Informations calculées */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                <Calculator className="h-4 w-4" />
                <span>Calculs en temps réel</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Rayon calculé:</span>
                  <span className={`ml-2 font-medium ${hasChanges ? 'text-blue-600' : 'text-gray-900'}`}>
                    {previewRadius.toFixed(1)} km
                    {hasChanges && <span className="text-xs text-blue-500 ml-1">(aperçu)</span>}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface couverte:</span>
                  <span className={`ml-2 font-medium ${hasChanges ? 'text-green-600' : 'text-gray-900'}`}>
                    {(Math.PI * Math.pow(previewRadius, 2)).toFixed(1)} km²
                    {hasChanges && <span className="text-xs text-green-500 ml-1">(aperçu)</span>}
                  </span>
                </div>
              </div>
              
              <div className="text-xs bg-tech-cyan/10 p-2 rounded border border-tech-cyan/20">
                <strong className="text-tech-cyan">Modèle utilisé :</strong>{' '}
                <span className="text-lte-text">
                  {LTECoverageService.getAvailableModels().find(m => m.model === (localSite.propagationModel || propagationModel))?.name}
                </span>
              </div>
              
              {hasChanges && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                  <strong>Aperçu des modifications :</strong> Le rayon sera recalculé selon le modèle{' '}
                  {LTECoverageService.getAvailableModels().find(m => m.model === (localSite.propagationModel || propagationModel))?.name}{' '}
                  avec les nouveaux paramètres : puissance {localSite.power} dBm, fréquence {localSite.frequency} MHz, 
                  hauteur {localSite.antennaHeight} m, environnement {localSite.environment}.
                </div>
              )}
              
              {!hasChanges && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Calcul actuel :</strong> Rayon calculé avec le modèle{' '}
                  {LTECoverageService.getAvailableModels().find(m => m.model === (localSite.propagationModel || propagationModel))?.name}, 
                  puissance {localSite.power} dBm, fréquence {localSite.frequency} MHz, 
                  hauteur {localSite.antennaHeight} m, environnement {localSite.environment}.
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
                Annuler
              </Button>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges}>
                  Sauvegarder
                </Button>
              </div>
            </div>

            {hasChanges && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Vous avez des modifications non sauvegardées
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="mt-6 pb-6">
            <LinkBudgetDetails site={localSite} propagationModel={localSite.propagationModel || propagationModel} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};