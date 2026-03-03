import type { ProjectRow } from '../../Planning';

export type { ProjectRow };

export interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
  onFinalize: () => void;
  canModify: boolean;
  trm: number;
  showLauncher?: boolean;
}

export type MetricKey = 'vpn_i' | 'vpn';
export type CategoryKey = 'obligatorio' | 'mantenimiento' | 'proteccion' | 'crecimiento' | 'otros';
export type BlockKey = 1 | 2 | 3;

export interface Config {
  metric: MetricKey;
  direction: string;
  budget: number;
  maintenanceHigh: number;
  maintenanceMed: number;
  protectionHigh: number;
  protectionMed: number;
}

export interface PortfolioProject {
  id: string;
  nombre: string;
  categoriaKey: CategoryKey;
  categoriaLabel: string;
  direccionLabel: string;
  direccionKey: string;
  inversion: number;
  vpn: number;
  vpn_i: number;
  riesgo: number;
  nivelRiesgo: string;
}

export interface PortfolioEntry extends PortfolioProject {
  metricValue: number;
  block: BlockKey;
  startCapex: number;
  endCapex: number;
  included: boolean;
}

export interface PortfolioResult {
  ordered: PortfolioEntry[];
  blocks: Record<BlockKey, PortfolioEntry[]>;
  blockTotals: Record<BlockKey, number>;
  totalInvestment: number;
  includedInvestment: number;
}

export interface Step6ApiRow {
  projectCode: string;
  projectName: string;
  categoryLabel: string;
  categoryKey: string;
  directionLabel: string;
  directionKey: string;
  investmentMUsd: number;
  vpnMUsd: number;
  vpnI: number;
  riskScore: number;
  riskLevel: string;
}

export interface Step6Scenario {
  id: number;
  name: string;
  description: string;
  metric: MetricKey;
  directionKey: string;
  budgetMUsd: number;
  maintenanceHigh: number;
  maintenanceMed: number;
  protectionHigh: number;
  protectionMed: number;
  isBaseline: boolean;
}

export interface ManualSequence {
  ids: string[];
  blocks: Record<string, BlockKey>;
}
