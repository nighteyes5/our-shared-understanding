import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Circle as CircleGeom, Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2, Layers, Radio, Target } from 'lucide-react';
import type { LTEParameters, PropagationModel, CalculationResult } from '@/types/lte';
import 'ol/ol.css';

interface Site {
  id: string;
  coordinates: [number, number];
  name: string;
}

interface CoverageMapProps {
  parameters: LTEParameters;
  results: CalculationResult[];
  selectedModel: PropagationModel;
}

const MODEL_COLORS: Record<PropagationModel, { fill: string; stroke: string }> = {
  'okumura-hata': { fill: 'rgba(59, 130, 246, 0.15)', stroke: 'rgba(59, 130, 246, 0.8)' },
  'cost231-hata': { fill: 'rgba(34, 197, 94, 0.15)', stroke: 'rgba(34, 197, 94, 0.8)' },
  '3gpp': { fill: 'rgba(249, 115, 22, 0.15)', stroke: 'rgba(249, 115, 22, 0.8)' },
};

export function CoverageMap({ parameters, results, selectedModel }: CoverageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  
  const [sites, setSites] = useState<Site[]>([
    { id: '1', coordinates: [2.3522, 48.8566], name: 'Site Paris Centre' },
  ]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [coverageOpacity, setCoverageOpacity] = useState([0.3]);

  const currentResult = results.find((r) => r.model === selectedModel);
  const coverageRadius = currentResult?.maxRange || 2;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const overlay = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      offset: [0, -10],
      autoPan: true,
    });
    overlayRef.current = overlay;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSourceRef.current,
          style: (feature) => {
            const type = feature.get('type');
            if (type === 'coverage') {
              const colors = MODEL_COLORS[selectedModel];
              return new Style({
                fill: new Fill({
                  color: colors.fill.replace('0.15', String(coverageOpacity[0])),
                }),
                stroke: new Stroke({
                  color: colors.stroke,
                  width: 2,
                }),
              });
            }
            if (type === 'site') {
              return new Style({
                image: new CircleStyle({
                  radius: 10,
                  fill: new Fill({ color: '#1e40af' }),
                  stroke: new Stroke({ color: '#ffffff', width: 2 }),
                }),
                text: new Text({
                  text: feature.get('name'),
                  offsetY: -20,
                  fill: new Fill({ color: '#1e293b' }),
                  stroke: new Stroke({ color: '#ffffff', width: 3 }),
                  font: 'bold 12px sans-serif',
                }),
              });
            }
            return new Style({});
          },
        }),
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([2.3522, 48.8566]),
        zoom: 11,
      }),
    });

    map.on('click', (evt) => {
      if (isAddingMode) {
        const coords = toLonLat(evt.coordinate) as [number, number];
        const newSite: Site = {
          id: Date.now().toString(),
          coordinates: coords,
          name: `Site ${sites.length + 1}`,
        };
        setSites((prev) => [...prev, newSite]);
        setIsAddingMode(false);
      } else {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        if (feature && feature.get('type') === 'site') {
          const siteId = feature.get('siteId');
          const site = sites.find((s) => s.id === siteId);
          if (site) {
            setSelectedSite(site);
            overlay.setPosition(evt.coordinate);
          }
        } else {
          overlay.setPosition(undefined);
          setSelectedSite(null);
        }
      }
    });

    map.on('pointermove', (evt) => {
      const hit = map.forEachFeatureAtPixel(evt.pixel, () => true);
      map.getTargetElement().style.cursor = isAddingMode ? 'crosshair' : hit ? 'pointer' : '';
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // Update features when sites or coverage changes
  useEffect(() => {
    const source = vectorSourceRef.current;
    source.clear();

    sites.forEach((site) => {
      // Coverage circle
      const coverageCircle = new Feature({
        geometry: new CircleGeom(fromLonLat(site.coordinates), coverageRadius * 1000),
        type: 'coverage',
        siteId: site.id,
      });

      // Site marker
      const siteMarker = new Feature({
        geometry: new Point(fromLonLat(site.coordinates)),
        type: 'site',
        siteId: site.id,
        name: site.name,
      });

      source.addFeatures([coverageCircle, siteMarker]);
    });

    // Force style refresh
    mapInstanceRef.current?.getLayers().forEach((layer) => {
      if (layer instanceof VectorLayer) {
        layer.changed();
      }
    });
  }, [sites, coverageRadius, selectedModel, coverageOpacity]);

  const handleRemoveSite = (siteId: string) => {
    setSites((prev) => prev.filter((s) => s.id !== siteId));
    setSelectedSite(null);
    overlayRef.current?.setPosition(undefined);
  };

  const handleCenterOnSite = (site: Site) => {
    mapInstanceRef.current?.getView().animate({
      center: fromLonLat(site.coordinates),
      zoom: 13,
      duration: 500,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Carte de couverture
              </CardTitle>
              <CardDescription>
                Visualisez la couverture des sites sur la carte geographique
              </CardDescription>
            </div>
            <Badge variant={isAddingMode ? 'default' : 'outline'} className="gap-1">
              <Radio className="h-3 w-3" />
              {sites.length} site{sites.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => setIsAddingMode(!isAddingMode)}
              variant={isAddingMode ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              {isAddingMode ? (
                <>
                  <Target className="h-4 w-4 animate-pulse" />
                  Cliquez sur la carte
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Ajouter un site
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 min-w-[200px]">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs whitespace-nowrap">Opacite:</Label>
              <Slider
                value={coverageOpacity}
                onValueChange={setCoverageOpacity}
                min={0.1}
                max={0.5}
                step={0.05}
                className="w-24"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Rayon: <span className="font-medium text-foreground">{coverageRadius.toFixed(2)} km</span>
            </div>
          </div>

          {/* Map */}
          <div className="relative rounded-lg border overflow-hidden">
            <div ref={mapRef} className="h-[500px] w-full" />
            
            {/* Popup */}
            <div ref={popupRef} className="absolute z-10">
              {selectedSite && (
                <Card className="w-56 shadow-lg">
                  <CardContent className="p-3 space-y-2">
                    <div className="font-semibold">{selectedSite.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedSite.coordinates[1].toFixed(4)}, {selectedSite.coordinates[0].toFixed(4)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleCenterOnSite(selectedSite)}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Centrer
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveSite(selectedSite.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {isAddingMode && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium shadow">
                Cliquez pour placer un site
              </div>
            )}
          </div>

          {/* Sites list */}
          {sites.length > 0 && (
            <div className="rounded-lg border divide-y">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Radio className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{site.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {site.coordinates[1].toFixed(4)}, {site.coordinates[0].toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCenterOnSite(site)}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveSite(site.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CoverageMap;
