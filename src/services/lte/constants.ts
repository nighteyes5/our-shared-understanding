/**
 * Constantes pour les calculs LTE
 */

export const LTE_CONSTANTS = {
  SECTOR_COUNT: 3,
  OVERLAP_FACTOR: 1.3,
  CELL_RADIUS_FACTOR: 0.65, // Facteur de réduction pour chevauchement
  SPEED_OF_LIGHT: 3e8, // m/s
  MIN_DISTANCE: 0.1, // km
  MAX_DISTANCE: 50, // km
  DISTANCE_PRECISION: 0.01, // km
} as const;

export const FREQUENCY_LIMITS = {
  OKUMURA_HATA_MAX: 1500, // MHz
  COST231_HATA_MIN: 1500, // MHz
  COST231_HATA_MAX: 2000, // MHz
  THREE_GPP_MAX: 6000, // MHz
} as const;

export const ENVIRONMENT_CORRECTIONS = {
  URBAN: {
    CM_COST231: 3,
  },
  SUBURBAN: {
    CM_COST231: 0,
  },
  RURAL: {
    CM_COST231: 0,
  },
} as const;