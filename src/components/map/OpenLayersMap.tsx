import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { Style, Fill, Stroke, Icon, Text } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import 'ol/ol.css';

import { LTESite, MapPosition } from '@/types/map';
import { PropagationModel } from '@/types/lte';
import { LTECoverageService } from '@/services/map/lteCoverageService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Minus, RotateCcw, Zap, ZapOff, Calculator } from 'lucide-react';

interface OpenLayersMapProps {
  sites: LTESite[];
  onSiteAdd?: (position: MapPosition) => void;
  onSiteSelect?: (site: LTESite) => void;
  selectedSite?: LTESite | null;
  showCoverage?: boolean;
  center?: MapPosition;
  zoom?: number;
  propagationModel?: PropagationModel;
}

export const OpenLayersMap: React.FC<OpenLayersMapProps> = ({
  sites,
  onSiteAdd,
  onSiteSelect,
  selectedSite,
  showCoverage = true,
  center = { lat: 14.6928, lng: -17.4467 }, // Dakar par défaut
  zoom = 10,
  propagationModel = 'cost231-hata'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const coverageSourceRef = useRef<VectorSource>(new VectorSource());
  const sitesLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const coverageLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [coverageStats, setCoverageStats] = useState<{
    totalCoverage: number;
    averageRadius: number;
    activeSites: number;
    modelUsed: string;
  } | null>(null);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current) return;

    // Couche de base OpenStreetMap
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Couche pour les cercles de couverture
    const coverageLayer = new VectorLayer({
      source: coverageSourceRef.current,
      style: (feature) => {
        const isSelected = feature.get('isSelected');
        const quality = feature.get('quality') || 'good';
        
        // Couleurs selon la qualité de couverture
        let color = '#22c55e'; // vert par défaut
        let opacity = 0.2;
        
        if (quality === 'excellent') {
          color = '#059669'; // vert foncé - couverture excellente
          opacity = 0.25;
        } else if (quality === 'good') {
          color = '#22c55e'; // vert - couverture bonne
          opacity = 0.2;
        } else if (quality === 'fair') {
          color = '#f59e0b'; // orange - couverture correcte
          opacity = 0.18;
        } else if (quality === 'poor') {
          color = '#ef4444'; // rouge - couverture faible
          opacity = 0.15;
        }
        
        return new Style({
          fill: new Fill({
            color: isSelected ? 'rgba(59, 130, 246, 0.15)' : `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          }),
          stroke: new Stroke({
            color: isSelected ? '#3b82f6' : color,
            width: isSelected ? 3 : 2,
          }),
        });
      },
    });
    coverageLayerRef.current = coverageLayer;

    // Couche pour les sites
    const sitesLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: (feature) => {
        const isActive = feature.get('isActive');
        const isSelected = feature.get('isSelected');
        const power = feature.get('power') || 40;
        
        // Couleur selon la puissance et l'état du site
        let color = '#6b7280'; // gris par défaut pour sites inactifs
        if (isActive) {
          // Sites actifs : couleur selon la puissance
          if (power >= 45) color = '#059669'; // vert foncé - haute puissance
          else if (power >= 40) color = '#22c55e'; // vert - puissance normale
          else if (power >= 35) color = '#f59e0b'; // orange - puissance réduite
          else color = '#ef4444'; // rouge - très faible puissance
        }
        
        return new Style({
          image: new Icon({
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${color}" stroke="${isSelected ? '#3b82f6' : 'white'}" stroke-width="${isSelected ? '3' : '2'}"/>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" transform="translate(-1, -1) scale(0.6)"/>
              </svg>
            `),
            scale: isSelected ? 1.3 : 1,
          }),
          text: new Text({
            text: feature.get('name'),
            offsetY: 25,
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
            font: isSelected ? 'bold 12px Arial' : '12px Arial',
          }),
        });
      },
    });
    sitesLayerRef.current = sitesLayer;

    // Création de la carte
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, coverageLayer, sitesLayer],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });

    mapInstanceRef.current = map;

    // Gestionnaire de clic sur la carte
    const handleMapClick = (event: any) => {
      if (isAddingMode && onSiteAdd) {
        const coordinate = event.coordinate;
        const lonLat = toLonLat(coordinate);
        const position: MapPosition = {
          lat: lonLat[1],
          lng: lonLat[0],
        };
        onSiteAdd(position);
        setIsAddingMode(false);
        return;
      }

      // Vérifier si on a cliqué sur un site
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature && feature.get('siteId')) {
        const siteId = feature.get('siteId');
        const site = sites.find(s => s.id === siteId);
        if (site && onSiteSelect) {
          onSiteSelect(site);
        }
      } else {
        // Clic à côté d'un site -> désélectionner
        if (onSiteSelect) {
          onSiteSelect(null as any);
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.setTarget(undefined);
    };
  }, [center, zoom, isAddingMode, onSiteAdd, onSiteSelect]);

  // Mise à jour des sites sur la carte avec calculs réels
  useEffect(() => {
    if (!vectorSourceRef.current || !coverageSourceRef.current) return;

    // Nettoyer les features existantes
    vectorSourceRef.current.clear();
    coverageSourceRef.current.clear();

    // Calculer les statistiques de couverture (utilise le modèle de chaque site)
    const stats = LTECoverageService.calculateCoverageStatistics(sites, propagationModel);
    setCoverageStats(stats);

    // Ajouter les sites avec couverture calculée
    sites.forEach((site) => {
      const coordinate = fromLonLat([site.position.lng, site.position.lat]);
      
      // Utiliser le modèle du site ou le modèle global par défaut
      const siteModel = site.propagationModel || propagationModel;
      
      // Calculer le rayon de couverture réel avec le modèle du site
      const realRadius = LTECoverageService.calculateRealCoverageRadius(site, siteModel);
      
      // Feature pour le site
      const siteFeature = new Feature({
        geometry: new Point(coordinate),
        name: site.name,
        siteId: site.id,
        isActive: site.isActive,
        isSelected: selectedSite?.id === site.id,
        power: site.power,
        frequency: site.frequency,
      });

      vectorSourceRef.current.addFeature(siteFeature);

      // Feature pour la couverture (UNIQUEMENT si le site est actif et qu'on affiche la couverture)
      // Les sites inactifs n'affichent que le point, pas de cercle de couverture
      if (site.isActive && showCoverage && realRadius > 0) {
        // Déterminer la qualité de couverture selon la puissance et l'environnement
        let quality = 'good';
        if (site.power >= 45 && site.environment === 'urban') quality = 'excellent';
        else if (site.power >= 40) quality = 'good';
        else if (site.power >= 35) quality = 'fair';
        else quality = 'poor';

        const coverageFeature = new Feature({
          geometry: new Circle(coordinate, realRadius * 1000), // rayon en mètres
          siteId: site.id,
          isSelected: selectedSite?.id === site.id,
          quality: quality,
          radius: realRadius,
        });

        coverageSourceRef.current.addFeature(coverageFeature);
      }
      // Note: Les sites inactifs (isActive = false) n'ont pas de cercle de couverture
    });

    // Forcer le re-render de la carte et des couches
    if (mapInstanceRef.current) {
      // Forcer la mise à jour des styles des couches vectorielles
      if (sitesLayerRef.current) {
        sitesLayerRef.current.getSource()?.changed();
        sitesLayerRef.current.changed();
      }
      if (coverageLayerRef.current) {
        coverageLayerRef.current.getSource()?.changed();
        coverageLayerRef.current.changed();
      }
      mapInstanceRef.current.render();
    }
  }, [sites, selectedSite, showCoverage, propagationModel]);

  // Fonctions de contrôle
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      const currentZoom = view.getZoom() || 10;
      view.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      const currentZoom = view.getZoom() || 10;
      view.setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const handleReset = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.setCenter(fromLonLat([center.lng, center.lat]));
      view.setZoom(zoom);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Carte Géographique LTE</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              <Calculator className="h-3 w-3 mr-1" />
              {coverageStats?.modelUsed || 'Calcul...'}
            </Badge>
            <Badge variant="outline">
              Sites: {sites.filter(s => s.isActive).length}/{sites.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Statistiques de couverture */}
        {coverageStats && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Couverture totale:</span>
                <p className="font-medium">{coverageStats.totalCoverage.toFixed(1)} km²</p>
              </div>
              <div>
                <span className="text-gray-600">Rayon moyen:</span>
                <p className="font-medium">{coverageStats.averageRadius.toFixed(1)} km</p>
              </div>
              <div>
                <span className="text-gray-600">Sites actifs:</span>
                <p className="font-medium">{coverageStats.activeSites}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles de la carte */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button
              variant={isAddingMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAddingMode(!isAddingMode)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isAddingMode ? 'Cliquez sur la carte' : 'Ajouter Site'}
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteneur de la carte */}
        <div
          ref={mapRef}
          className={`w-full h-96 border-2 border-gray-300 rounded-lg ${
            isAddingMode ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{ minHeight: '400px' }}
        />

        {/* Légende simplifiée */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              <span>Site haute puissance (≥45 dBm)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Site puissance normale (40-44 dBm)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Site puissance réduite (35-39 dBm)</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {isAddingMode && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Mode ajout activé :</strong> Cliquez sur la carte à l'endroit où vous souhaitez placer un nouveau site LTE. 
              La couverture sera calculée automatiquement selon le modèle de propagation sélectionné.
            </p>
          </div>
        )}

        {/* Note sur les calculs */}
        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Calculs en temps réel :</strong> Les rayons de couverture sont calculés selon le modèle {coverageStats?.modelUsed} 
          en tenant compte de la puissance, fréquence, hauteur d'antenne et type d'environnement de chaque site.
        </div>
      </CardContent>
    </Card>
  );
};