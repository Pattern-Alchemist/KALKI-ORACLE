export interface OracleInputData {
  currentLocation: string;
  emotionalState: string;
  lifePattern: string;
  goalOfMovement: string;
  intuitionPulse: string;
}

export interface DestinationScore {
  name: string;
  score: number; // 0-100
  reasoning: string;
}

export interface KarmicWeather {
  planetaryGateStatus: string; // e.g., "Saturn Retrograde - Gate Closing"
  energyDensity: number; // 0-100
  dominantCelestialBody: string;
  auspiciousTimeWindow: string;
}

export interface OracleResponse {
  cosmicReading: string;
  karmicGrid: string;
  destinations: DestinationScore[];
  universalPush: string;
  universalPull: string;
  finalDecree: string;
  nextDestination: string;
  karmicWeather: KarmicWeather;
  synchronicityMeaning: string; // Analysis of the intuition pulse
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface CityData {
  name: string;
  coords: Coordinates;
  region: string;
}

export enum AppState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  REVEALED = 'REVEALED',
  ERROR = 'ERROR'
}