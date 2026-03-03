import { RISK_MATRIX } from './constants';
import type {
  BlockKey,
  CategoryKey,
  Config,
  MetricKey,
  PortfolioEntry,
  PortfolioProject,
  PortfolioResult,
  ProjectRow,
  Step6ApiRow,
  Step6Scenario
} from './types';

export const normalizeKey = (v: unknown): string =>
  String(v || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export const toNumber = (v: unknown, d = 0): number => {
  const n = Number(String(v ?? '').replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : d;
};

export const formatShort = (v: number): string => `${(Number.isFinite(v) ? v : 0).toFixed(0)} M`;
export const formatMetric = (v: number, m: MetricKey): string => (m === 'vpn' ? `${v.toFixed(2)} M USD` : v.toFixed(2));
export const toMUsd = (v: number): number => (!Number.isFinite(v) ? 0 : Math.abs(v) > 10000 ? v / 1000000 : v);

export const normalizeConfig = (c: Config): Config => {
  const n = { ...c };
  n.budget = Math.max(1, n.budget || 1);
  n.maintenanceHigh = Math.max(0, n.maintenanceHigh || 0);
  n.maintenanceMed = Math.max(0, Math.min(n.maintenanceHigh - 1, n.maintenanceMed || 0));
  n.protectionHigh = Math.max(0, n.protectionHigh || 0);
  n.protectionMed = Math.max(0, Math.min(n.protectionHigh - 1, n.protectionMed || 0));
  return n;
};

const categoryOf = (row: ProjectRow): CategoryKey => {
  const k = normalizeKey(row.categoria || row.tipoProyecto || '');
  if (k.includes('obligatorio') || row.esObligatorioLegal || row.generaPenalizaciones) return 'obligatorio';
  if (k.includes('mantenimiento')) return 'mantenimiento';
  if (k.includes('proteccion')) return 'proteccion';
  if (k.includes('crecimiento')) return 'crecimiento';
  return 'otros';
};

const riskOf = (row: ProjectRow): { score: number; level: string } => {
  const p = toNumber(row.probabilidadRiesgo, 0);
  const i = toNumber(row.impactoRiesgo, 0);
  if (p > 0 || i > 0) {
    const ps = p < 1 ? 1 : p <= 20 ? 2 : p <= 50 ? 3 : p <= 80 ? 4 : 5;
    const is = i <= 500000 ? 1 : i <= 2000000 ? 2 : i <= 10000000 ? 3 : i <= 30000000 ? 4 : 5;
    const score = (RISK_MATRIX[is] || RISK_MATRIX[1])[ps - 1] || 0;
    return { score, level: score >= 15 ? 'Alto' : score >= 8 ? 'Medio' : 'Bajo' };
  }
  const score = toNumber(row.severity, 0);
  return { score, level: score >= 15 ? 'Alto' : score >= 8 ? 'Medio' : 'Bajo' };
};

export const normalizeLocal = (rows: ProjectRow[], trm: number): PortfolioProject[] =>
  rows.map((r, idx) => {
    const risk = riskOf(r);
    const invUsd = toNumber(r.presupuestoUsd, 0);
    const invCop = toNumber(r.presupuestoCop, 0);
    let inversion = toMUsd(invUsd);
    if (!inversion && invCop > 0) inversion = invCop / Math.max(1, trm) / 1000000;

    const vpnRaw = toNumber(r.businessCase?.indicadores?.vpn, 0);
    let vpn = toMUsd(vpnRaw);
    if (!vpn && vpnRaw !== 0) vpn = vpnRaw / Math.max(1, trm) / 1000000;

    let vpn_i = toNumber(r.businessCase?.indicadores?.vpnI, Number.NaN);
    if (!Number.isFinite(vpn_i) || vpn_i === 0) vpn_i = invCop > 0 ? vpnRaw / invCop : 0;

    const direccionLabel = r.directorCorporativo || r.director || r.macroproyecto || 'Sin direccion';
    return {
      id: r.idProyecto || r.id || `P-${idx + 1}`,
      nombre: r.proyecto || r.nombreIniciativa || `Proyecto ${idx + 1}`,
      categoriaKey: categoryOf(r),
      categoriaLabel: r.categoria || r.tipoProyecto || 'Otros',
      direccionLabel,
      direccionKey: normalizeKey(direccionLabel) || 'sin-direccion',
      inversion: Math.max(0, inversion),
      vpn,
      vpn_i,
      riesgo: risk.score,
      nivelRiesgo: risk.level
    };
  });

export const normalizeApi = (rows: Step6ApiRow[]): PortfolioProject[] =>
  rows.map((r, i) => {
    const ck = normalizeKey(r.categoryKey) as CategoryKey;
    const categoriaKey: CategoryKey =
      ck === 'obligatorio' || ck === 'mantenimiento' || ck === 'proteccion' || ck === 'crecimiento' ? ck : 'otros';
    return {
      id: r.projectCode || `DB-${i + 1}`,
      nombre: r.projectName || `Proyecto ${i + 1}`,
      categoriaKey,
      categoriaLabel: r.categoryLabel || 'Otros',
      direccionLabel: r.directionLabel || 'Sin direccion',
      direccionKey: r.directionKey || normalizeKey(r.directionLabel || 'sin-direccion') || 'sin-direccion',
      inversion: toNumber(r.investmentMUsd, 0),
      vpn: toNumber(r.vpnMUsd, 0),
      vpn_i: toNumber(r.vpnI, 0),
      riesgo: toNumber(r.riskScore, 0),
      nivelRiesgo: r.riskLevel || ''
    };
  });

const classify = (p: PortfolioProject, c: Config): BlockKey => {
  const l = normalizeKey(p.nivelRiesgo || '');
  if (p.categoriaKey === 'obligatorio') return 1;
  if (p.categoriaKey === 'mantenimiento') {
    return p.riesgo >= c.maintenanceHigh || l === 'alto' ? 1 : p.riesgo >= c.maintenanceMed || l === 'medio' ? 2 : 3;
  }
  if (p.categoriaKey === 'proteccion') {
    return p.riesgo >= c.protectionHigh || l === 'alto' ? 1 : p.riesgo >= c.protectionMed || l === 'medio' ? 2 : 3;
  }
  if (p.categoriaKey === 'crecimiento') return p.vpn > 0 ? 2 : 3;
  return 3;
};

export const buildPortfolio = (projects: PortfolioProject[], config: Config): PortfolioResult => {
  const blocks: Record<BlockKey, PortfolioEntry[]> = { 1: [], 2: [], 3: [] };
  projects.forEach((p) => {
    const metricValue = config.metric === 'vpn' ? p.vpn : p.vpn_i;
    const block = classify(p, config);
    blocks[block].push({ ...p, metricValue, block, startCapex: 0, endCapex: 0, included: false });
  });
  (Object.values(blocks) as PortfolioEntry[][]).forEach((list) =>
    list.sort((a, b) => b.metricValue - a.metricValue || b.inversion - a.inversion)
  );
  const ordered = [...blocks[1], ...blocks[2], ...blocks[3]];
  let cumulative = 0;
  let included = 0;
  let reached = false;
  ordered.forEach((p) => {
    p.startCapex = cumulative;
    p.endCapex = cumulative + p.inversion;
    cumulative += p.inversion;
    if (!reached && included + p.inversion <= config.budget) {
      p.included = true;
      included += p.inversion;
    } else {
      p.included = false;
      reached = true;
    }
  });
  return {
    ordered,
    blocks,
    blockTotals: {
      1: blocks[1].reduce((a, b) => a + b.inversion, 0),
      2: blocks[2].reduce((a, b) => a + b.inversion, 0),
      3: blocks[3].reduce((a, b) => a + b.inversion, 0)
    },
    totalInvestment: cumulative,
    includedInvestment: included
  };
};

export const scenarioToConfig = (s: Step6Scenario): Config =>
  normalizeConfig({
    metric: s.metric === 'vpn' ? 'vpn' : 'vpn_i',
    direction: s.directionKey || 'all',
    budget: toNumber(s.budgetMUsd, 750),
    maintenanceHigh: toNumber(s.maintenanceHigh, 15),
    maintenanceMed: toNumber(s.maintenanceMed, 8),
    protectionHigh: toNumber(s.protectionHigh, 12),
    protectionMed: toNumber(s.protectionMed, 6)
  });
