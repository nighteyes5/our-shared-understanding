export interface MapPosition {
  lat: number;
  lng: number;
}

export interface LTESite {
  id: string;
  name: string;
  position: MapPosition;
  power: number; // dBm
  frequency: number; // MHz
  antennaHeight: number; // meters
  coverageRadius: number; // km
  environment: 'urban' | 'suburban' | 'rural';
  isActive: boolean;
  createdAt: string;
  propagationModel: 'okumura-hata' | 'cost231-hata' | '3gpp'; // Modèle de propagation spécifique au site
}

export interface CoverageArea {
  siteId: string;
  center: MapPosition;
  radius: number; // km
  signalStrength: number; // dBm
  color: string;
  opacity: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface TerrainType {
  type: 'urban' | 'suburban' | 'rural' | 'water' | 'forest' | 'mountain';
  elevation: number; // meters
  buildingDensity?: number; // percentage
}

export interface MapSettings {
  showCoverage: boolean;
  showSites: boolean;
  showSignalStrength: boolean;
  selectedModel: 'okumura-hata' | 'cost231' | '3gpp';
  opacity: number;
}

export interface PredefinedLocation {
  id: string;
  name: string;
  country: string;
  center: MapPosition;
  bounds: MapBounds;
  zoom: number;
  description: string;
  terrainType: TerrainType['type'];
  population?: number;
}

// Locations prédéfinies pour le Sénégal
export const PREDEFINED_LOCATIONS: PredefinedLocation[] = [
  {
    id: 'dakar',
    name: 'Dakar',
    country: 'Sénégal',
    center: { lat: 14.6928, lng: -17.4467 },
    bounds: { north: 14.8, south: 14.6, east: -17.3, west: -17.6 },
    zoom: 12,
    description: 'Capitale et zone urbaine dense avec de nombreux bâtiments',
    terrainType: 'urban',
    population: 1146053
  },
  {
    id: 'thies',
    name: 'Thiès',
    country: 'Sénégal',
    center: { lat: 14.7886, lng: -16.9246 },
    bounds: { north: 14.9, south: 14.7, east: -16.8, west: -17.0 },
    zoom: 11,
    description: 'Zone urbaine industrielle et commerciale',
    terrainType: 'urban',
    population: 320000
  },
  {
    id: 'saint-louis',
    name: 'Saint-Louis',
    country: 'Sénégal',
    center: { lat: 16.0199, lng: -16.4896 },
    bounds: { north: 16.1, south: 15.9, east: -16.4, west: -16.6 },
    zoom: 11,
    description: 'Zone historique avec architecture coloniale',
    terrainType: 'suburban',
    population: 176000
  },
  {
    id: 'kaolack',
    name: 'Kaolack',
    country: 'Sénégal',
    center: { lat: 14.1512, lng: -16.0728 },
    bounds: { north: 14.2, south: 14.1, east: -16.0, west: -16.2 },
    zoom: 11,
    description: 'Centre commercial et agricole',
    terrainType: 'suburban',
    population: 172305
  },
  {
    id: 'ziguinchor',
    name: 'Ziguinchor',
    country: 'Sénégal',
    center: { lat: 12.5681, lng: -16.2719 },
    bounds: { north: 12.6, south: 12.5, east: -16.2, west: -16.4 },
    zoom: 11,
    description: 'Zone tropicale avec végétation dense',
    terrainType: 'suburban',
    population: 158701
  },
  {
    id: 'rural-senegal',
    name: 'Zone Rurale - Ferlo',
    country: 'Sénégal',
    center: { lat: 15.5, lng: -15.0 },
    bounds: { north: 15.8, south: 15.2, east: -14.7, west: -15.3 },
    zoom: 10,
    description: 'Zone pastorale semi-aride du nord',
    terrainType: 'rural',
    population: 25000
  }
];