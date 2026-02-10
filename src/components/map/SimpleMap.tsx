import React, { useState, useRef, useEffect } from 'react';
import { MapPosition, LTESite, PREDEFINED_LOCATIONS } from '@/types/map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Minus, RotateCcw, Zap, ZapOff } from 'lucide-react';

interface SimpleMapProps {
  sites: LTESite[];
  onSiteAdd?: (position: MapPosition) => void;
  onSiteSelect?: (site: LTESite) => void;
  selectedSite?: LTESite | null;
  showCoverage?: boolean;
  center?: MapPosition;
  zoom?: number;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  sites,
  onSiteAdd,
  onSiteSelect,
  selectedSite,
  showCoverage = true,
  center = PREDEFINED_LOCATIONS[0].center,
  zoom = 12
}) => {
  const [currentCenter, setCurrentCenter] = useState(center);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Conversion des coordonnées géographiques en pixels
  const geoToPixel = (position: MapPosition): { x: number; y: number } => {
    const mapWidth = 800;
    const mapHeight = 600;
    
    // Calcul simple de projection (Mercator approximée)
    const scale = Math.pow(2, currentZoom - 1);
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;
    
    const deltaLat = position.lat - currentCenter.lat;
    const deltaLng = position.lng - currentCenter.lng;
    
    return {
      x: centerX + (deltaLng * scale * 100),
      y: centerY - (deltaLat * scale * 100)
    };
  };

  // Conversion des pixels en coordonnées géographiques
  const pixelToGeo = (x: number, y: number): MapPosition => {
    const mapWidth = 800;
    const mapHeight = 600;
    const scale = Math.pow(2, currentZoom - 1);
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    
    return {
      lat: currentCenter.lat - (deltaY / (scale * 100)),
      lng: currentCenter.lng + (deltaX / (scale * 100))
    };
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMode || !onSiteAdd) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const position = pixelToGeo(x, y);
    onSiteAdd(position);
    setIsAddingMode(false);
  };

  const handleZoomIn = () => {
    setCurrentZoom(Math.min(currentZoom + 1, 18));
  };

  const handleZoomOut = () => {
    setCurrentZoom(Math.max(currentZoom - 1, 1));
  };

  const handleReset = () => {
    setCurrentCenter(center);
    setCurrentZoom(zoom);
  };

  const renderSite = (site: LTESite) => {
    const pixel = geoToPixel(site.position);
    const isSelected = selectedSite?.id === site.id;
    
    // Vérifier si le site est visible
    if (pixel.x < 0 || pixel.x > 800 || pixel.y < 0 || pixel.y > 600) {
      return null;
    }

    return (
      <div
        key={site.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-125 z-20' : 'z-10'
        }`}
        style={{ left: pixel.x, top: pixel.y }}
        onClick={(e) => {
          e.stopPropagation();
          onSiteSelect?.(site);
        }}
        title={`${site.name} - ${site.power}dBm`}
      >
        {/* Cercle de couverture */}
        {showCoverage && site.isActive && (
          <div
            className={`absolute rounded-full border-2 ${
              isSelected ? 'border-blue-500' : 'border-green-400'
            } bg-green-100 opacity-30`}
            style={{
              width: site.coverageRadius * currentZoom * 10,
              height: site.coverageRadius * currentZoom * 10,
              left: -(site.coverageRadius * currentZoom * 5),
              top: -(site.coverageRadius * currentZoom * 5),
            }}
          />
        )}
        
        {/* Icône du site */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
            site.isActive 
              ? (isSelected ? 'bg-blue-600' : 'bg-green-600')
              : 'bg-gray-400'
          }`}
        >
          {site.isActive ? <Zap className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
        </div>
        
        {/* Label du site */}
        <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium px-1 py-0.5 rounded ${
          isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow'
        }`}>
          {site.name}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Carte de Couverture LTE</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Sites: {sites.filter(s => s.isActive).length}/{sites.length}
            </Badge>
            <Badge variant="outline">
              Zoom: {currentZoom}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
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

        {/* Zone de la carte */}
        <div
          ref={mapRef}
          className={`relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-gray-300 rounded-lg overflow-hidden ${
            isAddingMode ? 'cursor-crosshair' : 'cursor-move'
          }`}
          onClick={handleMapClick}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.1) 0%, transparent 50%)
            `,
          }}
        >
          {/* Grille de fond */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-gray-400"
                style={{ left: `${(i + 1) * 5}%` }}
              />
            ))}
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-gray-400"
                style={{ top: `${(i + 1) * 6.67}%` }}
              />
            ))}
          </div>

          {/* Centre de la carte */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>

          {/* Sites LTE */}
          {sites.map(renderSite)}

          {/* Indicateur de mode ajout */}
          {isAddingMode && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Cliquez pour ajouter un site
            </div>
          )}
        </div>

        {/* Informations sur la position */}
        <div className="mt-4 text-sm text-gray-600 flex justify-between">
          <span>
            Centre: {currentCenter.lat.toFixed(4)}, {currentCenter.lng.toFixed(4)}
          </span>
          <span>
            Échelle: ~{Math.round(10 / currentZoom)} km/cm
          </span>
        </div>
      </CardContent>
    </Card>
  );
};