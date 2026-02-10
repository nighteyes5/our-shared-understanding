import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { MapPosition } from '@/types/map';

interface LocationSearchProps {
  onLocationSelect: (location: { name: string; position: MapPosition; zoom: number }) => void;
}

interface SearchResult {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  country?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      // Utiliser l'API Nominatim d'OpenStreetMap pour le géocodage
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `format=json&` +
        `limit=5&` +
        `addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'LTE-Planning-App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('Aucun résultat trouvé. Essayez une autre recherche.');
        return;
      }

      const formattedResults: SearchResult[] = data.map((item: any) => ({
        name: item.name || item.display_name.split(',')[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        country: item.address?.country
      }));

      setResults(formattedResults);
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      console.error('Erreur de recherche:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Déterminer le niveau de zoom selon le type de lieu
    let zoom = 12;
    if (result.type === 'country') zoom = 6;
    else if (result.type === 'state' || result.type === 'region') zoom = 8;
    else if (result.type === 'city' || result.type === 'town') zoom = 12;
    else if (result.type === 'village') zoom = 14;
    else if (result.type === 'suburb' || result.type === 'neighbourhood') zoom = 15;

    onLocationSelect({
      name: result.name,
      position: { lat: result.lat, lng: result.lon },
      zoom: zoom
    });

    setOpen(false);
    setSearchQuery('');
    setResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Rechercher une zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lte-text">Rechercher une zone géographique</DialogTitle>
          <DialogDescription className="text-lte-text-secondary">
            Recherchez n'importe quelle ville, région ou pays dans le monde
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Champ de recherche */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-lte-text">Nom de la zone</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-input"
                disabled={isSearching}
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Résultats */}
          {results.length > 0 && (
            <div className="space-y-2">
              <Label className="text-lte-text">Résultats de recherche</Label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent/10 hover:border-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-tech-cyan flex-shrink-0" />
                          <span className="font-medium text-lte-text">{result.name}</span>
                          {result.country && (
                            <Badge variant="outline" className="text-xs">
                              {result.country}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-lte-text-secondary line-clamp-2">
                          {result.displayName}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-lte-text-secondary">
                          <span>Lat: {result.lat.toFixed(4)}</span>
                          <span>Lng: {result.lon.toFixed(4)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {results.length === 0 && !error && !isSearching && (
            <div className="bg-tech-primary/5 border border-tech-primary/20 p-4 rounded-lg">
              <h4 className="font-medium text-tech-primary mb-2 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Comment rechercher ?
              </h4>
              <ul className="text-sm text-lte-text-secondary space-y-1">
                <li>• Entrez le nom d'une ville, région ou pays</li>
                <li>• Soyez aussi précis que possible</li>
                <li>• Vous pouvez inclure le pays (ex: "Thiès, Sénégal")</li>
                <li>• Appuyez sur Entrée ou cliquez sur Rechercher</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
