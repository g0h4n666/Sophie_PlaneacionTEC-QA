import React, { useState, useEffect } from 'react';
/* Added UserRole to imports */
import { Budget, User, RolePermissions, InvestmentScorecard, UserRole } from '../types';
import { 
  ShieldCheck,
  Lock,
  AlertCircle,
  Target,
  Calculator,
  Activity,
  Zap,
  Layers,
  BarChart3,
  FileSearch
} from 'lucide-react';

import ProjectFormModal from './planning/ProjectFormModal';

import Step1Identificacion from './planning/Step1Identificacion';
import Step2Clasificacion from './planning/Step2Clasificacion';
import Step5PressureTest from './planning/Step5PressureTest';
import Step6Consolidacion from './planning/Step6Consolidacion';

export interface BudgetLineItem {
  id: string;
  posicionPresupuestal: string;
  rubro: string;
  subrubro: string;
  metrica: string;
  tipo: string;
  proveedor?: string;
  cantidad: string;
  capexCop: string;
  descripcionLinea?: string;
  tipoCapex?: 'FIJO' | 'VARIABLE' | 'POR CLASIFICAR';
}

export interface FinancialYearData {
  ano0: string;
  ano1: string;
  ano2: string;
  anon: string;
}

export interface FinancialRisk {
  id: string;
  riesgo: string;
  probabilidad: string;
  impacto: string;
  monto: string;
  mitigacion: string;
}

export interface BusinessCaseData {
  activo: boolean;
  casoNegocioFinanciero: string;
  areaSolicitante: string;
  alineacionEstrategica: string;
  interdependencias: string;
  objetivo: string;
  contribucionKPIs: string;
  capex: FinancialYearData;
  ingresos: FinancialYearData;
  ahorros: FinancialYearData;
  avoidance: FinancialYearData;
  opex: FinancialYearData;
  wacc: string;
  indicadores: {
    vpn: string;
    tir: string;
    payback: string;
    roi: string;
    valorResidual: string;
  };
  riesgosFinancieros: FinancialRisk[];
  ahorroOpexResumen?: string;
  otroKPINombre?: string;
  otroKPIValor?: string;
}

export interface ProjectWorkflowP2 {
  techPlanning: { status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO', date?: string };
  finance: { status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO', date?: string };
  risk: { status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO', date?: string };
}

export interface ProjectRow {
  macroproyecto: string;
  proyecto: string;
  idProyecto: string;
  ano?: string;
  tieneIdAsignado: boolean;
  tieneInterdependencias: boolean;
  gerentesInterdependencia?: string[];
  nombreIniciativa: string;
  descripcionBreve: string;
  director: string;
  directorCorporativo: string;
  gerente: string;
  responsableBeneficio: string;
  items: BudgetLineItem[];
  presupuestoCop: string;
  presupuestoUsd: string;
  esObligatorioLegal: boolean;
  generaPenalizaciones: boolean;
  probabilidadFalla: boolean;
  evitaInterrupciones: boolean;
  evitaPerdidaIngresos: boolean;
  reduceChurn: boolean;
  aumentaIngresosCortoPlazo: boolean;
  retornoEbitda: boolean;
  capacidadEstrategica: boolean;
  alineadoVision: boolean;
  evidenciaRegulatoria?: string;
  cuantificacionRiesgoRegulatorio?: string;
  matrizRiesgo?: string;
  cuantificacionRiesgoTecnico?: string;
  casoNegocioArchivo?: string;
  impactoRiesgo?: number;
  probabilidadRiesgo?: number;
  causaRaiz?: string;
  impactoOperativo?: string;
  estadoActivo?: string;
  tipoProyecto?: string;
  grupoCapex?: string;
  id?: string;
  metodologia?: string;
  severity?: string;
  kpiPrincipal?: string;
  businessCase: BusinessCaseData;
  modeloSoporte?: string;
  estadoSoporte?: 'PENDIENTE' | 'APROBADO' | 'DEVUELTO';
  commentariosSoporte?: string;
  categoria?: string;
  categoriasEstrategicas: string[];
  decisionComite?: string;
  archivoSustento?: string;
  scorecard?: InvestmentScorecard;
  workflowP2?: ProjectWorkflowP2;
  dbId?: number;
}

export const MACRO_OPTIONS = [
  "ENERGÍA 2027", "DATA 2027", "FIBRA REGIONAL 2027", "TRANSPORTE 2027", 
  "5G 2027", "COBERTURA RURAL", "MODERNIZACIÓN CORE", "B2B SOLUTIONS"
];

const initialFormState: ProjectRow = {
  macroproyecto: '',
  proyecto: '',
  idProyecto: '',
  ano: '2027',
  tieneIdAsignado: true,
  tieneInterdependencias: false,
  gerentesInterdependencia: [],
  nombreIniciativa: '',
  descripcionBreve: '',
  director: 'RICARDO ACOSTA',
  directorCorporativo: 'FRANCISCO GOMEZ',
  gerente: '',
  responsableBeneficio: '',
  items: [],
  presupuestoCop: '0',
  presupuestoUsd: '0',
  esObligatorioLegal: false,
  generaPenalizaciones: false,
  probabilidadFalla: false,
  evitaInterrupciones: false,
  evitaPerdidaIngresos: false,
  reduceChurn: false,
  aumentaIngresosCortoPlazo: false,
  retornoEbitda: false,
  capacidadEstrategica: false,
  alineadoVision: false,
  estadoSoporte: 'PENDIENTE',
  categoria: '',
  categoriasEstrategicas: [],
  decisionComite: 'SIN DECISIÓN',
  archivoSustento: '',
  cuantificacionRiesgoRegulatorio: '0',
  cuantificacionRiesgoTecnico: '0',
  workflowP2: {
    techPlanning: { status: 'PENDIENTE' },
    finance: { status: 'PENDIENTE' },
    risk: { status: 'PENDIENTE' }
  },
  scorecard: {
    pilarEstrategico: 3,
    pilarFinanciero: 3,
    pilarRiesgo: 3,
    pilarEquipo: 3,
    pilarUrgencia: 3,
    decisionComite: 'SIN DECISIÓN',
    condicionObligatoria: ''
  },
  businessCase: {
    activo: false,
    casoNegocioFinanciero: '',
    areaSolicitante: '',
    alineacionEstrategica: '',
    interdependencias: '',
    objetivo: '',
    contribucionKPIs: '',
    capex: { ano0: '0', ano1: '0', ano2: '0', anon: '0' },
    ingresos: { ano0: '0', ano1: '0', ano2: '0', anon: '0' },
    ahorros: { ano0: '0', ano1: '0', ano2: '0', anon: '0' },
    avoidance: { ano0: '0', ano1: '0', ano2: '0', anon: '0' },
    opex: { ano0: '0', ano1: '0', ano2: '0', anon: '0' },
    wacc: '12.5',
    indicadores: { vpn: '0.00', tir: '0.00', payback: '0', roi: '0', valorResidual: '0.00' },
    riesgosFinancieros: [],
    ahorroOpexResumen: '0',
    otroKPINombre: '',
    otroKPIValor: '0'
  }
};

/* Defined missing Props interface to fix line 217 error */
interface Props {
  user: User;
  budget: Budget;
  onSave: () => void;
  theme: 'light' | 'dark';
  rolePermissions: Record<UserRole, RolePermissions>;
  vigencia: string;
}

const Planning: React.FC<Props> = ({ user, budget, onSave, theme, rolePermissions, vigencia }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [macroStatus, setMacroStatus] = useState<Record<string, 'PENDIENTE' | 'APROBADO' | 'DEVUELTO'>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const perms = rolePermissions[user.role];
  const [formData, setFormData] = useState<ProjectRow>(initialFormState);

  const steps = [
    { id: 1, label: 'Identificación de Demanda', key: 'step1' as const, icon: <Target size={20} />, color: 'bg-emerald-500' },
    { id: 2, label: 'Gestión & Clasificación', key: 'step2' as const, icon: <Calculator size={20} />, color: 'bg-blue-500' },
    { id: 3, label: 'Pressure Test', key: 'step5' as const, icon: <Activity size={20} />, color: 'bg-red-500' },
    { id: 4, label: 'Resumen & Consolidación', key: 'step6' as const, icon: <Zap size={20} />, color: 'bg-purple-500' }
  ];

  const handleExecuteSimulator = () => {
    const newRows: ProjectRow[] = [];
    MACRO_OPTIONS.forEach(macro => {
      for (let i = 1; i <= 3; i++) {
        const montoCop = (Math.floor(Math.random() * 9000) + 1000) * 1000000;
        newRows.push({
          ...initialFormState,
          macroproyecto: macro,
          proyecto: `${macro} - Proyecto Prototipo ${i}`,
          idProyecto: `SIM-${macro.substring(0,3)}-${i.toString().padStart(3, '0')}`,
          ano: '2027',
          nombreIniciativa: `Iniciativa de Despliegue ${i}`,
          descripcionBreve: `Proyecto simulado para la vertical ${macro}. Enfocado en expansión de cobertura y optimización de red core. Esta es una descripción larga para cumplir con el mínimo de cincuenta caracteres requeridos por el sistema.`,
          presupuestoCop: montoCop.toString(),
          presupuestoUsd: (montoCop / budget.trm).toFixed(2),
          gerente: 'Sophie Simulator AI',
          responsableBeneficio: 'Analista de Negocio AI',
          estadoSoporte: 'PENDIENTE', 
          workflowP2: {
            techPlanning: { status: 'PENDIENTE' },
            finance: { status: 'PENDIENTE' },
            risk: { status: 'PENDIENTE' }
          },
          items: [{ id: Math.random().toString(36).substr(2, 9), posicionPresupuestal: `PP-${i}`, rubro: 'IT', subrubro: 'Hardware', metrica: 'UNIDADES', tipo: 'Hardware', proveedor: 'Huawei', cantidad: '1', capexCop: montoCop.toString() }]
        });
      }
    });
    setRows(newRows);
  };

  const handleUpdateRows = (newRows: ProjectRow[]) => setRows(newRows);

  const handleReturnToIdentificacion = (projectIdx: number) => {
    setCurrentStep(1);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.macroproyecto) errors.macroproyecto = 'El macroproyecto es obligatorio';
    if (!formData.proyecto) errors.proyecto = 'El nombre del proyecto es obligatorio';
    if (!formData.descripcionBreve || formData.descripcionBreve.length < 50) {
      errors.descripcionBreve = 'La descripción técnica debe tener al menos 50 caracteres';
    }
    if (formData.tieneInterdependencias && (!formData.gerentesInterdependencia || formData.gerentesInterdependencia.length === 0)) {
      errors.gerenteInterdependencia = 'Debe seleccionar al menos un gerente si existen interdependencias';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleItemsChange = (items: BudgetLineItem[]) => {
    const totalCop = items.reduce((acc, item) => acc + (parseFloat(item.capexCop) || 0), 0);
    setFormData(prev => ({
      ...prev,
      items,
      presupuestoCop: totalCop.toString(),
      presupuestoUsd: (totalCop / budget.trm).toFixed(2)
    }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveOnly = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/guardar-paso1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, userEmail: user.email, dbId: formData.dbId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error desconocido al guardar');

      const savedRow = { ...formData, dbId: data.dbId };
      if (editingIndex !== null) {
        const newRows = [...rows];
        newRows[editingIndex] = savedRow;
        setRows(newRows);
      } else {
        setRows(prev => [...prev, savedRow]);
      }
      closeModal();
    } catch (err: any) {
      console.error('❌ Error guardando en BD:', err);
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendProject = (index: number) => {
    setCurrentStep(2);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingIndex(null);
    setFormErrors({});
    setFormData(initialFormState);
  };

  const cardBg = theme === 'dark' ? 'bg-[#0b0e14] border-[#1a1f26]' : 'bg-white border-gray-100 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-8 pb-24 relative animate-in fade-in duration-500">
      <ProjectFormModal
        show={showForm}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        onInputChange={handleInputChange}
        onItemsChange={handleItemsChange}
        onSave={handleSaveOnly}
        onSaveOnly={handleSaveOnly}
        editingIndex={editingIndex}
        theme={theme}
        errors={formErrors}
        vigencia={vigencia}
        budget={budget}
        isSaving={isSaving}
      />

      <div className={`p-10 border rounded-[3rem] transition-all ${cardBg}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-red-50 rounded-2xl text-[#EF3340] border border-red-100">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h2 className={`text-3xl font-black tracking-tighter mb-1 ${textColor}`}>Planeación Capex {vigencia}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Gobernanza de Inversión Tecnológica
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100">
            <AlertCircle size={14} /> SOPHIE v2.0 - TORRE DE CONTROL
          </div>
        </div>

        <div className="space-y-12">
           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
              {steps.map(step => {
                const isStepLocked = step.id > 1 && rows.length === 0;
                const isActive = currentStep === step.id;
                return (
                  <button 
                    key={step.id} 
                    disabled={isStepLocked}
                    onClick={() => setCurrentStep(step.id)} 
                    className={`py-8 px-4 border-b-4 text-center transition-all rounded-t-[2.5rem] flex flex-col items-center gap-4 ${isStepLocked ? 'opacity-30 cursor-not-allowed' : isActive ? 'bg-red-50/5 border-[#EF3340]' : 'bg-gray-50/5 border-transparent text-gray-400 hover:bg-gray-50/10'}`}
                  >
                    <div className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 transform ${isActive ? `${step.color} scale-110` : 'bg-gray-200'}`}>
                      {step.icon}
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        PASO {step.id}
                      </p>
                      <p className={`text-[11px] font-black leading-tight mt-1 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                    </div>
                  </button>
                );
              })}
           </div>

           <div className="min-h-[400px]">
              {currentStep === 1 && <Step1Identificacion rows={rows} onAdd={() => setShowForm(true)} onEdit={(idx) => {setEditingIndex(idx); setFormData(rows[idx]); setShowForm(true);}} onDelete={(idx) => setRows(rows.filter((_, i) => i !== idx))} onSend={handleSendProject} onExecuteSimulator={handleExecuteSimulator} theme={theme} canModify={perms.steps.step1} vigencia={vigencia} />}
              {currentStep === 2 && <Step2Clasificacion rows={rows} theme={theme} canModify={perms.steps.step2} onUpdateRows={handleUpdateRows} onReturnToP1={handleReturnToIdentificacion} onNextStep={() => setCurrentStep(3)} macroStatus={macroStatus} setMacroStatus={setMacroStatus} />}
              {currentStep === 3 && <Step5PressureTest rows={rows} theme={theme} onUpdateRows={handleUpdateRows} canModify={perms.steps.step5} />}
              {currentStep === 4 && <Step6Consolidacion rows={rows} theme={theme} onFinalize={onSave} canModify={perms.steps.step6} />}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;