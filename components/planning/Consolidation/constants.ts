import type { CategoryKey, Config, Step6Scenario } from './types';

const globalConfig = globalThis as typeof globalThis & { __BACKEND_URL__?: string };

export const BACKEND_URL = globalConfig.__BACKEND_URL__ || 'http://localhost:4000';

export const DEFAULT_CONFIG: Config = {
  metric: 'vpn_i',
  direction: 'all',
  budget: 750,
  maintenanceHigh: 15,
  maintenanceMed: 8,
  protectionHigh: 12,
  protectionMed: 6
};

export const FALLBACK_SCENARIO: Step6Scenario = {
  id: 0,
  name: 'Escenario Base',
  description: 'Local fallback',
  metric: 'vpn_i',
  directionKey: 'all',
  budgetMUsd: 750,
  maintenanceHigh: 15,
  maintenanceMed: 8,
  protectionHigh: 12,
  protectionMed: 6,
  isBaseline: true
};

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  obligatorio: '#b91c1c',
  mantenimiento: '#ef4444',
  proteccion: '#94a3b8',
  crecimiento: '#f59e0b',
  otros: '#3b82f6'
};

export const RISK_MATRIX: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [2, 4, 6, 7, 8],
  3: [6, 9, 10, 11, 13],
  4: [12, 14, 15, 16, 17],
  5: [16, 18, 20, 22, 25]
};
