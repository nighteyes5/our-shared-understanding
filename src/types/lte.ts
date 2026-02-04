// Types pour le dimensionnement LTE

export type PropagationModel = 'okumura-hata' | 'cost231-hata' | '3gpp';

export type EnvironmentType = 'urban' | 'suburban' | 'rural';

export interface LTEParameters {
  // Paramètres de transmission
  frequency: number; // MHz
  txPower: number; // dBm
  txAntennaGain: number; // dBi
  txCableLoss: number; // dB
  
  // Paramètres de réception
  rxAntennaGain: number; // dBi
  rxCableLoss: number; // dB
  rxSensitivity: number; // dBm
  
  // Paramètres d'antenne
  txAntennaHeight: number; // m
  rxAntennaHeight: number; // m
  
  // Paramètres environnementaux
  environment: EnvironmentType;
  shadowingMargin: number; // dB
  interferenceMargin: number; // dB
  
  // Zone de couverture
  targetArea: number; // km²
}

export interface CalculationResult {
  model: PropagationModel;
  modelName: string;
  pathLoss: number; // dB
  maxRange: number; // km
  cellRadius: number; // km
  cellArea: number; // km²
  numberOfSites: number;
  sectorCount: number;
  overlapFactor: number;
}

export interface ComparisonResult {
  models: CalculationResult[];
  recommendedModel: PropagationModel;
  averageRange: number;
  averageSites: number;
}

export const DEFAULT_LTE_PARAMETERS: LTEParameters = {
  frequency: 1800,
  txPower: 43,
  txAntennaGain: 18,
  txCableLoss: 2,
  rxAntennaGain: 0,
  rxCableLoss: 0,
  rxSensitivity: -100,
  txAntennaHeight: 30,
  rxAntennaHeight: 1.5,
  environment: 'urban',
  shadowingMargin: 8,
  interferenceMargin: 3,
  targetArea: 100,
};

export const FREQUENCY_BANDS = [
  { value: 700, label: '700 MHz (Bande 28)' },
  { value: 800, label: '800 MHz (Bande 20)' },
  { value: 900, label: '900 MHz (Bande 8)' },
  { value: 1800, label: '1800 MHz (Bande 3)' },
  { value: 2100, label: '2100 MHz (Bande 1)' },
  { value: 2600, label: '2600 MHz (Bande 7)' },
];

export const ENVIRONMENTS = [
  { value: 'urban' as EnvironmentType, label: 'Urbain dense' },
  { value: 'suburban' as EnvironmentType, label: 'Suburbain' },
  { value: 'rural' as EnvironmentType, label: 'Rural' },
];
