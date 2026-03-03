
export enum AppPhase {
  LOGIN = 'LOGIN',
  PORTAL_HOME = 'PORTAL_HOME',
  CAPEX_DASHBOARD = 'CAPEX_DASHBOARD',
  CAPEX_PLANNING = 'CAPEX_PLANNING',
  CAPEX_FOLLOWUP = 'CAPEX_FOLLOWUP',
  IMPACT_MEASUREMENT = 'MEDICION_IMPACTO',
  ADVANCED_MODELS = 'MODELOS_AVANZADOS',
  TECH_ROADMAP = 'TECH_ROADMAP',
  TECH_ARCHITECTURE = 'TECH_ARCHITECTURE',
  TECH_INVENTORY = 'TECH_INVENTORY',
  TECH_WATCH = 'TECH_WATCH', 
  USER_MGMT = 'ADMIN_USUARIOS',
  BUDGET_PARAMETERS = 'PARAMETROS_PRESUPUESTO',
  DATABASE_CONFIG = 'CONFIGURACION_DB',
  HELP_CENTER = 'CENTRO_AYUDA'
}

export type UserRole = 'ADMINISTRADOR' | 'GERENTE_RESPONSABLE' | 'RESPONSABLE_PLANEACION' | 'CONTROLLER_PRESUPUESTAL';

export interface RolePermissions {
  modules: {
    dashboard: boolean;
    planning: boolean;
    followup: boolean;
    impactMeasurement: boolean;
    advancedModels: boolean;
    techWatch: boolean;
    userMgmt: boolean;
    params: boolean;
    dbConfig: boolean;
  };
  steps: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
    step5: boolean;
    step6: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  area: string;
  status?: 'ACTIVO' | 'INACTIVO';
}

export interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  pass: string;
  ssl: boolean;
}

export type TechDecision = 'ACCIONAR' | 'MONITOREAR' | 'DESCARTAR';
export type BusinessCaseStatus = 'BORRADOR' | 'REVISION_TECNICA' | 'EVALUACION_FINANCIERA' | 'COMITE_DIRECTIVO' | 'APROBADO' | 'RECHAZADO';

export interface TechTrend {
  id: string;
  name: string; 
  description: string;
  quarter: string;
  category: string;
  impact: 'ALTO' | 'MEDIO' | 'BAJO';
  decision: TechDecision;
  leader: string;
  categorization: string; 
  probability: 'Alta' | 'Media' | 'Baja' | '';
  contextTrigger: string;
  strategicRecommendation: {
    roadmap: string;
    criticalConsiderations: string;
    kpis: string;
    vendors: string;
    technicalDetails: string;
  };
  businessImpact: {
    quantifiable: string;
    strategic: string;
  };
  supportData: {
    internal: string;
    external: string;
  };
  status: BusinessCaseStatus;
}

export interface Budget {
  totalIncome: number;
  fixedCosts: FixedCost[];
  savingsTarget: number;
  currency: string;
  trm: number;
  vat: number;
  ceilings: Record<string, number>;
}

export interface FixedCost {
  id: string;
  category: string;
  amount: number;
  description: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export interface AIInsight {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

export interface InvestmentScorecard {
  pilarEstrategico: number;
  pilarFinanciero: number;
  pilarRiesgo: number;
  pilarEquipo: number;
  pilarUrgencia: number;
  decisionComite: 'GO' | 'NO-GO' | 'PIVOT' | 'SIN DECISIÓN';
  condicionObligatoria: string;
  aiAnalysis?: {
    veredicto: 'APROBADO' | 'RECHAZADO' | 'CONDICIONADO';
    preguntaAsesina: string;
    razonesCriticas: {
      estrategia: string;
      roi: string;
      riesgo: string;
      equipo: string;
      urgencia: string;
    };
  };
}
