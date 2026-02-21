import React, { useEffect, useState } from 'react';
import { X, Plus, FolderTree, UserCheck, FileText, Trash2, Layers, Briefcase, Calculator, Check, Minus, ShieldAlert, Activity, TrendingUp, Rocket, Landmark, ChevronRight, FileUp, Link as LinkIcon, AlertTriangle, ShieldCheck, Save, Send, Coins, CheckCircle2 } from 'lucide-react';
import { ProjectRow, BudgetLineItem } from '../Planning';
import { Budget } from '../../types';

interface Props {
  show: boolean;
  onClose: () => void;
  formData: ProjectRow;
  setFormData: React.Dispatch<React.SetStateAction<ProjectRow>>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onItemsChange: (items: BudgetLineItem[]) => void;
  onSave: (e: React.FormEvent) => void;
  onSaveOnly: () => void;
  editingIndex: number | null;
  theme: 'light' | 'dark';
  errors: Record<string, string>;
  vigencia: string;
  budget: Budget;
}


const TIPO_ITEM_OPTIONS = ["Hardware", "Software", "Licencias", "Servicios"];



const GERENTE_INTER_OPTIONS = [
  "DANIELA ORJUELA", "JORGE VARGAS", "SALOMON RAMIREZ"
];


const RISK_MATRIX_SCORES: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [2, 4, 6, 7, 8],
  3: [6, 9, 10, 11, 13],
  4: [12, 14, 15, 16, 17],
  5: [16, 18, 20, 22, 25]
};

const mapProbToScore = (p: number): number => {
  if (p < 1) return 1;
  if (p <= 20) return 2;
  if (p <= 50) return 3;
  if (p <= 80) return 4;
  return 5;
};

const mapImpactToScore = (i: number): number => {
  if (i <= 500000) return 1;
  if (i <= 2000000) return 2;
  if (i <= 10000000) return 3;
  if (i <= 30000000) return 4;
  return 5;
};

const formatCurrency = (val: string | number) => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

const formatUSD = (val: string | number) => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

const isUrlInvalid = (url?: string) => {
  if (!url) return false;
  const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  return !pattern.test(url);
};

const FormSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  theme: string;
  textColor: string;
  fullWidth?: boolean;
  cols?: number;
  error?: string;
  hFull?: boolean;
  headerRight?: React.ReactNode;
}> = ({ title, icon, children, theme, textColor, fullWidth, cols = 4, error, hFull, headerRight }) => (
  <div className={`p-10 rounded-[3rem] border transition-all ${hFull ? 'h-full flex flex-col' : ''} ${theme === 'dark' ? 'bg-[#161b22] border-[#21262d]' : 'bg-white border-gray-100 shadow-sm'} ${error ? 'ring-2 ring-red-50/20 border-red-200' : ''}`}>
    <div className="flex items-center justify-between mb-8 shrink-0">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-[#EF3340]/10 text-[#EF3340]' : 'bg-red-50 text-[#EF3340] border border-red-100'}`}>
          {icon}
        </div>
        <h4 className={`text-[12px] font-black uppercase tracking-[0.2em] ${textColor}`}>{title}</h4>
      </div>
      {headerRight}
    </div>
    <div className={`flex-1 ${fullWidth ? "w-full" : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-x-12 gap-y-10`}`}>
      {children}
    </div>
  </div>
);

const ProjectFormModal: React.FC<Props> = ({ show, onClose, formData, setFormData, onInputChange, onItemsChange, onSave, onSaveOnly, editingIndex, theme, errors, vigencia, budget }) => {

  const [macroproyectoOptions, setMacroproyectoOptions] = useState<string[]>([]);
  const [proyectoOptions, setProyectoOptions] = useState<{ proyecto: string; idMacroproyecto: string }[]>([]);
  const [kpiOptions, setKpiOptions] = useState<string[]>([]);
  const [varsGlobales, setVarsGlobales] = useState<{ ano: string; trm: string }[]>([]);
  const [dirCorpOptions, setDirCorpOptions] = useState<string[]>([]);
  const [dirAreaOptions, setDirAreaOptions] = useState<string[]>([]);
  const [gerenteOptions, setGerenteOptions] = useState<string[]>([]);
  const [rubroOptions, setRubroOptions] = useState<string[]>([]);
  const [subrubroMap, setSubrubroMap] = useState<Record<string, { subrubro: string; charPospre: string; metrica: string }[]>>({});

  useEffect(() => {
    if (!show) return;
    fetch('/api/macroproyectos')
      .then(r => r.json())
      .then(data => setMacroproyectoOptions(Array.isArray(data) ? data : []))
      .catch(() => setMacroproyectoOptions([]));
    fetch('/api/kpis')
      .then(r => r.json())
      .then(data => setKpiOptions(Array.isArray(data) ? data : []))
      .catch(() => setKpiOptions([]));
    fetch('/api/vars-globales')
      .then(r => r.json())
      .then(data => setVarsGlobales(Array.isArray(data) ? data : []))
      .catch(() => setVarsGlobales([]));
    fetch('/api/directores-corp')
      .then(r => r.json())
      .then(data => setDirCorpOptions(Array.isArray(data) ? data : []))
      .catch(() => setDirCorpOptions([]));
    fetch('/api/rubros')
      .then(r => r.json())
      .then(data => setRubroOptions(Array.isArray(data) ? data : []))
      .catch(() => setRubroOptions([]));
  }, [show]);

  useEffect(() => {
    if (!formData.directorCorporativo) {
      setDirAreaOptions([]);
      setGerenteOptions([]);
      return;
    }
    fetch(`/api/directores-area?dirCorp=${encodeURIComponent(formData.directorCorporativo)}`)
      .then(r => r.json())
      .then(data => setDirAreaOptions(Array.isArray(data) ? data : []))
      .catch(() => setDirAreaOptions([]));
  }, [formData.directorCorporativo]);

  useEffect(() => {
    if (!formData.director) {
      setGerenteOptions([]);
      return;
    }
    fetch(`/api/gerentes?dirArea=${encodeURIComponent(formData.director)}&dirCorp=${encodeURIComponent(formData.directorCorporativo || '')}`)
      .then(r => r.json())
      .then(data => setGerenteOptions(Array.isArray(data) ? data : []))
      .catch(() => setGerenteOptions([]));
  }, [formData.director]);

  const handleRubroChange = (itemId: string, rubro: string) => {
    onItemsChange(formData.items.map(it =>
      it.id === itemId ? { ...it, rubro, subrubro: '', posicionPresupuestal: '', metrica: '' } : it
    ));
    setSubrubroMap(prev => ({ ...prev, [itemId]: [] }));
    if (!rubro) return;
    fetch(`/api/pospre?rubro=${encodeURIComponent(rubro)}`)
      .then(r => r.json())
      .then(data => setSubrubroMap(prev => ({ ...prev, [itemId]: Array.isArray(data) ? data : [] })))
      .catch(() => setSubrubroMap(prev => ({ ...prev, [itemId]: [] })));
  };

  const handleSubrubroChange = (itemId: string, subrubro: string) => {
    const opts = subrubroMap[itemId] || [];
    const found = opts.find(o => o.subrubro === subrubro);
    onItemsChange(formData.items.map(it =>
      it.id === itemId
        ? { ...it, subrubro, posicionPresupuestal: found?.charPospre ?? '', metrica: found?.metrica ?? '' }
        : it
    ));
  };

  const handleDirCorpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, directorCorporativo: val, director: '', gerente: '' }));
  };

  const handleDirAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, director: val, gerente: '' }));
  };

  useEffect(() => {
    if (!formData.macroproyecto) {
      setProyectoOptions([]);
      return;
    }
    fetch(`/api/proyectos?macroproyecto=${encodeURIComponent(formData.macroproyecto)}`)
      .then(r => r.json())
      .then(data => setProyectoOptions(Array.isArray(data) ? data : []))
      .catch(() => setProyectoOptions([]));
  }, [formData.macroproyecto]);

  const handleProyectoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProyecto = e.target.value;
    const found = proyectoOptions.find(p => p.proyecto === selectedProyecto);
    setFormData(prev => ({
      ...prev,
      proyecto: selectedProyecto,
      idProyecto: found?.idMacroproyecto ?? prev.idProyecto,
      tieneIdAsignado: found ? true : prev.tieneIdAsignado,
    }));
  };

  const calculatedValorEsperado = (Number(formData.impactoRiesgo) || 0) * ((Number(formData.probabilidadRiesgo) || 0) / 100);

  useEffect(() => {
    const valStr = calculatedValorEsperado.toString();
    if (formData.cuantificacionRiesgoTecnico !== valStr) {
      setFormData(prev => ({
        ...prev,
        cuantificacionRiesgoTecnico: valStr
      }));
    }
  }, [formData.impactoRiesgo, formData.probabilidadRiesgo]);

  if (!show) return null;

  const cardBg = theme === 'dark' ? 'bg-[#0b0e14]' : 'bg-[#FDFDFD]';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  
  const trmRaw = varsGlobales.find(v => v.ano === formData.ano)?.trm || varsGlobales[0]?.trm || '4217';
  const trmProyectada = parseFloat(trmRaw.replace(/\./g, '').replace(',', '.')) || 4217;
  const trmDisplay = new Intl.NumberFormat('es-CO').format(trmProyectada);

  const totalCopCalculated = formData.items.reduce((acc, item) => acc + (parseFloat(item.capexCop) || 0), 0);
  const totalUsdCalculated = totalCopCalculated / trmProyectada;

  const getInputClasses = (fieldName?: string, isReadOnly?: boolean) => {
    const hasError = fieldName ? !!errors[fieldName] : false;
    return `w-full px-4 py-3 text-[11px] font-bold rounded-xl border transition-all duration-200 outline-none appearance-none shadow-sm ${
      theme === 'dark' 
        ? `bg-[#1a1f26] ${hasError ? 'border-red-500 ring-2 border-red-500/10' : 'border-[#2d3748]'} ${isReadOnly ? 'text-gray-400 cursor-not-allowed opacity-70' : 'text-white focus:border-[#EF3340]'}` 
        : `${isReadOnly ? 'bg-gray-100/50 cursor-not-allowed text-gray-600' : 'bg-white focus:ring-8 focus:ring-red-500/5 focus:border-[#EF3340]'} ${hasError ? 'border-red-500 ring-4 ring-red-50' : 'border-gray-200'} text-gray-900`
    }`;
  };

  const getValidationClasses = (value: string | number | undefined, isLink: boolean = false) => {
    if (value === undefined || value === null || value === '' || value === 0 || value === '0') return '';
    
    if (isLink) {
      const invalid = isUrlInvalid(value.toString());
      return invalid 
        ? 'border-red-500 ring-4 ring-red-50 focus:border-red-500' 
        : 'border-emerald-500 ring-4 ring-emerald-50 focus:border-emerald-500';
    } else {
      return 'border-emerald-500 ring-4 ring-emerald-50 focus:border-emerald-500';
    }
  };

  const formatWithSeparators = (val: string | number | undefined) => {
    if (val === undefined || val === null || val === '') return '';
    const numericValue = val.toString().replace(/\D/g, '');
    if (numericValue === '') return '';
    return new Intl.NumberFormat('es-CO').format(parseInt(numericValue) || 0);
  };

  const addItem = () => {
    const newItem: BudgetLineItem = {
      id: Math.random().toString(36).substr(2, 9),
      posicionPresupuestal: '',
      rubro: '',
      subrubro: '',
      metrica: '',
      tipo: 'Hardware',
      proveedor: '',
      cantidad: '1',
      capexCop: '0',
      descripcionLinea: '',
      tipoCapex: 'POR CLASIFICAR'
    };
    onItemsChange([...formData.items, newItem]);
  };

  const updateItem = (id: string, field: keyof BudgetLineItem, value: string) => {
    onItemsChange(formData.items.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const handleIdToggle = (val: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      tieneIdAsignado: val,
      idProyecto: val ? prev.idProyecto : '000.00'
    }));
  };

  const handleInterdependenciesToggle = (val: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      tieneInterdependencias: val,
      gerentesInterdependencia: val ? (prev.gerentesInterdependencia || []) : []
    }));
  };

  const toggleGerenteInterdependencia = (nombre: string) => {
    setFormData(prev => {
      const current = prev.gerentesInterdependencia || [];
      const updated = current.includes(nombre) 
        ? current.filter(n => n !== nombre) 
        : [...current, nombre];
      return { ...prev, gerentesInterdependencia: updated };
    });
  };

  const handleKPIChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      businessCase: {
        ...prev.businessCase,
        contribucionKPIs: val
      }
    }));
  };

  const handleIndicadorChange = (field: string, value: string) => {
    const cleanedValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      businessCase: {
        ...prev.businessCase,
        indicadores: {
          ...prev.businessCase.indicadores,
          [field]: cleanedValue
        }
      }
    }));
  };

  const setBoolean = (field: keyof ProjectRow, value: boolean) => {
    setFormData(prev => {
      let newData = { ...prev, [field]: value };
      
      // Grupo 1: Obligatorio (Q1, Q2)
      if (field === 'esObligatorioLegal' || field === 'generaPenalizaciones') {
        const isLegal = field === 'esObligatorioLegal' ? value : prev.esObligatorioLegal;
        const isPenalty = field === 'generaPenalizaciones' ? value : prev.generaPenalizaciones;
        
        if (isLegal || isPenalty) {
          newData.categoriasEstrategicas = ['OBLIGATORIO'];
          // Resetear todas las demás
          newData.probabilidadFalla = false;
          newData.evitaInterrupciones = false;
          newData.evitaPerdidaIngresos = false;
          newData.reduceChurn = false;
          newData.aumentaIngresosCortoPlazo = false;
          newData.retornoEbitda = false;
          newData.capacidadEstrategica = false;
          newData.alineadoVision = false;
        } else {
          // Si ambos se desmarcan y no hay otro grupo activo
          if (!prev.probabilidadFalla && !prev.evitaInterrupciones && !prev.evitaPerdidaIngresos && !prev.reduceChurn && !prev.aumentaIngresosCortoPlazo && !prev.retornoEbitda && !prev.capacidadEstrategica && !prev.alineadoVision) {
             newData.categoriasEstrategicas = prev.categoriasEstrategicas.filter(c => c !== 'OBLIGATORIO');
          }
        }
      }

      // Grupo 2: Mantenimiento (Q3, Q4)
      if (field === 'probabilidadFalla' || field === 'evitaInterrupciones') {
        const isFailure = field === 'probabilidadFalla' ? value : prev.probabilidadFalla;
        const isInterruption = field === 'evitaInterrupciones' ? value : prev.evitaInterrupciones;

        if (isFailure || isInterruption) {
          newData.categoriasEstrategicas = ['MANTENIMIENTO'];
          // Resetear todas las demás
          newData.esObligatorioLegal = false;
          newData.generaPenalizaciones = false;
          newData.evitaPerdidaIngresos = false;
          newData.reduceChurn = false;
          newData.aumentaIngresosCortoPlazo = false;
          newData.retornoEbitda = false;
          newData.capacidadEstrategica = false;
          newData.alineadoVision = false;
        } else {
          // Si ambos se desmarcan y no hay otro grupo activo
          if (!prev.esObligatorioLegal && !prev.generaPenalizaciones && !prev.evitaPerdidaIngresos && !prev.reduceChurn && !prev.aumentaIngresosCortoPlazo && !prev.retornoEbitda && !prev.capacidadEstrategica && !prev.alineadoVision) {
             newData.categoriasEstrategicas = prev.categoriasEstrategicas.filter(c => c !== 'MANTENIMIENTO');
          }
        }
      }

      // Grupo 3: Protección EBITDA (Q5, Q6)
      if (field === 'evitaPerdidaIngresos' || field === 'reduceChurn') {
        const isLoss = field === 'evitaPerdidaIngresos' ? value : prev.evitaPerdidaIngresos;
        const isChurn = field === 'reduceChurn' ? value : prev.reduceChurn;

        if (isLoss || isChurn) {
          newData.categoriasEstrategicas = ['PROTECCION_EBITDA'];
          // Resetear todas las demás: Q1-Q4, Q7-Q10
          newData.esObligatorioLegal = false;
          newData.generaPenalizaciones = false;
          newData.probabilidadFalla = false;
          newData.evitaInterrupciones = false;
          newData.aumentaIngresosCortoPlazo = false;
          newData.retornoEbitda = false;
          newData.capacidadEstrategica = false;
          newData.alineadoVision = false;
        } else {
          // Si ambos se desmarcan y no hay otro grupo activo
          if (!prev.esObligatorioLegal && !prev.generaPenalizaciones && !prev.probabilidadFalla && !prev.evitaInterrupciones && !prev.aumentaIngresosCortoPlazo && !prev.retornoEbitda && !prev.capacidadEstrategica && !prev.alineadoVision) {
             newData.categoriasEstrategicas = prev.categoriasEstrategicas.filter(c => c !== 'PROTECCION_EBITDA');
          }
        }
      }

      // Grupo 4: Crecimiento EBITDA (Q7, Q8)
      if (field === 'aumentaIngresosCortoPlazo' || field === 'retornoEbitda') {
        const isRevenue = field === 'aumentaIngresosCortoPlazo' ? value : prev.aumentaIngresosCortoPlazo;
        const isEbitda = field === 'retornoEbitda' ? value : prev.retornoEbitda;

        if (isRevenue || isEbitda) {
          newData.categoriasEstrategicas = ['CRECIMIENTO_EBITDA'];
          // Resetear todas las demás: Q1-Q6, Q9-Q10
          newData.esObligatorioLegal = false;
          newData.generaPenalizaciones = false;
          newData.probabilidadFalla = false;
          newData.evitaInterrupciones = false;
          newData.evitaPerdidaIngresos = false;
          newData.reduceChurn = false;
          newData.capacidadEstrategica = false;
          newData.alineadoVision = false;
        } else {
          // Si ambos se desmarcan y no hay otro grupo activo
          if (!prev.esObligatorioLegal && !prev.generaPenalizaciones && !prev.probabilidadFalla && !prev.evitaInterrupciones && !prev.evitaPerdidaIngresos && !prev.reduceChurn && !prev.capacidadEstrategica && !prev.alineadoVision) {
             newData.categoriasEstrategicas = prev.categoriasEstrategicas.filter(c => c !== 'CRECIMIENTO_EBITDA');
          }
        }
      }

      // Grupo 5: Negocios Adyacentes (Q9, Q10)
      if (field === 'capacidadEstrategica' || field === 'alineadoVision') {
        const isCap = field === 'capacidadEstrategica' ? value : prev.capacidadEstrategica;
        const isVis = field === 'alineadoVision' ? value : prev.alineadoVision;

        if (isCap || isVis) {
          newData.categoriasEstrategicas = ['NEGOCIOS_ADYACENTES'];
          // Resetear todas las demás: Q1-Q8
          newData.esObligatorioLegal = false;
          newData.generaPenalizaciones = false;
          newData.probabilidadFalla = false;
          newData.evitaInterrupciones = false;
          newData.evitaPerdidaIngresos = false;
          newData.reduceChurn = false;
          newData.aumentaIngresosCortoPlazo = false;
          newData.retornoEbitda = false;
        } else {
          // Si ambos se desmarcan y no hay otro grupo activo
          if (!prev.esObligatorioLegal && !prev.generaPenalizaciones && !prev.probabilidadFalla && !prev.evitaInterrupciones && !prev.evitaPerdidaIngresos && !prev.reduceChurn && !prev.aumentaIngresosCortoPlazo && !prev.retornoEbitda) {
             newData.categoriasEstrategicas = prev.categoriasEstrategicas.filter(c => c !== 'NEGOCIOS_ADYACENTES');
          }
        }
      }
      
      return newData;
    });
  };

  const QuestionRow = ({ label, field }: { label: string, field: keyof ProjectRow }) => {
    const isActive = formData[field];
    
    // Grupos de bloqueo mutuo
    const isObligatorioGroup = ['esObligatorioLegal', 'generaPenalizaciones'].includes(field);
    const isMantenimientoGroup = ['probabilidadFalla', 'evitaInterrupciones'].includes(field);
    const isProteccionGroup = ['evitaPerdidaIngresos', 'reduceChurn'].includes(field);
    const isCrecimientoGroup = ['aumentaIngresosCortoPlazo', 'retornoEbitda'].includes(field);
    const isAdyacentesGroup = ['capacidadEstrategica', 'alineadoVision'].includes(field);

    const isObligatorioSelected = formData.esObligatorioLegal || formData.generaPenalizaciones;
    const isMantenimientoSelected = formData.probabilidadFalla || formData.evitaInterrupciones;
    const isProteccionSelected = formData.evitaPerdidaIngresos || formData.reduceChurn;
    const isCrecimientoSelected = formData.aumentaIngresosCortoPlazo || formData.retornoEbitda;
    const isAdyacentesSelected = formData.capacidadEstrategica || formData.alineadoVision;

    let isDisabled = false;

    if (isObligatorioSelected) {
        if (!isObligatorioGroup) isDisabled = true;
    } else if (isMantenimientoSelected) {
        if (!isMantenimientoGroup) isDisabled = true;
    } else if (isProteccionSelected) {
        if (!isProteccionGroup) isDisabled = true;
    } else if (isCrecimientoSelected) {
        if (!isCrecimientoGroup) isDisabled = true;
    } else if (isAdyacentesSelected) {
        if (!isAdyacentesGroup) isDisabled = true;
    }

    return (
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setBoolean(field, !isActive)}
        className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all text-left group shadow-sm ${
          isDisabled ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100' :
          isActive 
            ? 'bg-[#EF3340]/5 border-[#EF3340] ring-4 ring-[#EF3340]/5' 
            : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
      >
        <p className={`text-[11px] font-bold leading-tight flex-1 ${isActive && !isDisabled ? 'text-[#EF3340]' : 'text-gray-600'}`}>
          {label}
        </p>
        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ml-4 shrink-0 ${
          isDisabled ? 'bg-gray-100 border-gray-200 text-gray-300' :
          isActive 
            ? 'bg-[#EF3340] border-[#EF3340] text-white shadow-md scale-110' 
            : 'bg-white border-black text-transparent group-hover:bg-gray-50'
        }`}>
          {isDisabled ? <Minus size={16} /> : <Check size={16} strokeWidth={4} className={isActive ? 'opacity-100' : 'opacity-0'} />}
        </div>
      </button>
    );
  };

  const CategoryDescCard = ({ title, id, desc, icon, color }: { title: string, id: string, desc: string, icon: React.ReactNode, color: string }) => {
    const isSelected = formData.categoriasEstrategicas.includes(id);
    
    // Bloqueo:
    const isObligatorioSelected = formData.esObligatorioLegal || formData.generaPenalizaciones;
    const isMantenimientoSelected = formData.probabilidadFalla || formData.evitaInterrupciones;
    const isProteccionSelected = formData.evitaPerdidaIngresos || formData.reduceChurn;
    const isCrecimientoSelected = formData.aumentaIngresosCortoPlazo || formData.retornoEbitda;
    const isAdyacentesSelected = formData.capacidadEstrategica || formData.alineadoVision;

    let isDisabled = false;
    let lockLabel = '';

    if (isObligatorioSelected && id !== 'OBLIGATORIO') {
        isDisabled = true;
        lockLabel = 'BLOQUEADO POR REGULATORIO';
    } else if (isMantenimientoSelected && id !== 'MANTENIMIENTO') {
        isDisabled = true;
        lockLabel = 'BLOQUEADO POR RIESGO TÉCNICO';
    } else if (isProteccionSelected && id !== 'PROTECCION_EBITDA') {
        isDisabled = true;
        lockLabel = 'BLOQUEADO POR PROTECCIÓN';
    } else if (isCrecimientoSelected && id !== 'CRECIMIENTO_EBITDA') {
        isDisabled = true;
        lockLabel = 'BLOQUEADO POR CRECIMIENTO';
    } else if (isAdyacentesSelected && id !== 'NEGOCIOS_ADYACENTES') {
        isDisabled = true;
        lockLabel = 'BLOQUEADO POR ESTRATEGIA';
    }

    const handleToggleCategory = () => {
      if (isDisabled) return;
      setFormData(prev => {
        const current = prev.categoriasEstrategicas || [];
        // Single selection logic
        const updated = current.includes(id) ? [] : [id];
        return { ...prev, categoriasEstrategicas: updated };
      });
    };
    return (
      <button
        type="button"
        onClick={handleToggleCategory}
        disabled={isDisabled}
        className={`p-6 rounded-3xl border transition-all flex flex-col gap-3 group text-left shadow-sm relative 
          ${isDisabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : isSelected ? 'bg-[#EF3340]/5 border-[#EF3340] ring-4 ring-[#EF3340]/5' : 'bg-white border-gray-100 hover:border-gray-200'}`}
      >
        {isSelected && <div className="absolute top-4 right-4 bg-[#EF3340] text-white p-1 rounded-lg animate-in zoom-in"><Check size={10} strokeWidth={4} /></div>}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-[#EF3340] text-white shadow-md' : `${color} bg-opacity-10 text-opacity-100`} flex items-center justify-center`}>{icon}</div>
          <h5 className={`text-[11px] font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-[#EF3340]' : 'text-gray-800'}`}>{title}</h5>
        </div>
        <p className={`text-[10px] font-bold leading-relaxed transition-colors ${isSelected ? 'text-gray-700' : 'text-gray-400'}`}>{desc}</p>
        {isDisabled && <span className="absolute bottom-4 left-6 text-[8px] font-black text-red-400 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">{lockLabel}</span>}
      </button>
    );
  };

  const isObligatorio = formData.categoriasEstrategicas.includes('OBLIGATORIO');
  const isStrategic = formData.categoriasEstrategicas.some(c => ['MANTENIMIENTO', 'PROTECCION_EBITDA', 'CRECIMIENTO_EBITDA', 'NEGOCIOS_ADYACENTES'].includes(c));
  const isBlockAActive = isObligatorio;
  const isBlockBActive = isStrategic;
  const isBlockCActive = isStrategic;

  const currentProbScore = mapProbToScore(formData.probabilidadRiesgo || 0);
  const currentImpactScore = mapImpactToScore(formData.impactoRiesgo || 0);
  const matrixValue = RISK_MATRIX_SCORES[currentImpactScore][currentProbScore - 1];

  const getHeatmapColor = (score: number) => {
    if (score >= 20) return 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,51,64,0.3)]';
    if (score >= 12) return 'bg-orange-500 text-white';
    if (score >= 6) return 'bg-yellow-400 text-gray-900';
    return 'bg-emerald-500 text-white';
  };

  const descLength = formData.descripcionBreve.length;
  const isDescInvalid = descLength > 0 && descLength < 50;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className={`w-full h-full overflow-hidden transition-colors flex flex-col ${cardBg}`}>
        <div className={`px-12 py-10 border-b flex justify-between items-center bg-inherit ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} shrink-0`}>
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#EF3340] to-[#b01e28] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
              <Plus size={32} strokeWidth={3} />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-1">
                <h3 className={`text-4xl font-black tracking-tighter ${textColor}`}>{editingIndex !== null ? 'EDITAR PROYECTO' : 'REGISTRAR INICIATIVA CAPEX'}</h3>
                <span className="text-[10px] font-black text-white bg-[#EF3340] px-4 py-1 rounded-full uppercase tracking-[0.2em]">Vigencia {vigencia}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                <Briefcase size={14} className="text-[#EF3340]" /> Paso 1: Identificación & Planificación de Inversión
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-6 rounded-full transition-all ${theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-red-50 text-gray-400 hover:text-[#EF3340]'}`}>
            <X size={32} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-[#0b0e14]' : 'bg-[#fcfcfc]'}`}>
          <form onSubmit={onSave} className="p-12">
            <div className="max-w-[1700px] mx-auto space-y-16 pb-32">
              
              <FormSection title="Información General & Estructura" icon={<FolderTree size={22} />} theme={theme} textColor={textColor} cols={4}>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Macroproyecto *</label>
                  <select name="macroproyecto" value={formData.macroproyecto} onChange={onInputChange} className={getInputClasses('macroproyecto')}>
                    <option value="">Seleccione...</option>
                    {macroproyectoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre del Proyecto *</label>
                  <select name="proyecto" value={formData.proyecto} onChange={handleProyectoChange} className={getInputClasses('proyecto')} disabled={!formData.macroproyecto}>
                    <option value="">{formData.macroproyecto ? 'Seleccione proyecto...' : 'Primero seleccione un macroproyecto'}</option>
                    {proyectoOptions.map(opt => <option key={opt.proyecto} value={opt.proyecto}>{opt.proyecto}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">KPI Estratégico Asociado *</label>
                  <div className="relative">
                    <select value={formData.businessCase?.contribucionKPIs || ''} onChange={(e) => handleKPIChange(e.target.value)} className={getInputClasses('contribucionKPIs')}>
                      <option value="">Seleccione KPI...</option>
                      {kpiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Responsable del Beneficio *</label>
                  <input name="responsableBeneficio" value={formData.responsableBeneficio} onChange={onInputChange} className={getInputClasses('responsableBeneficio')} placeholder="Nombre del responsable" />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">ID del Proyecto *</label>
                  <input name="idProyecto" value={formData.idProyecto} onChange={onInputChange} className={`${getInputClasses('idProyecto', !!formData.proyecto || !formData.tieneIdAsignado)} font-mono uppercase text-[#EF3340]`} placeholder="CPX-XXXX" readOnly={!!formData.proyecto || !formData.tieneIdAsignado} />
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">¿Tiene ID asignado?</label>
                    <div className="flex gap-2 w-full max-w-[150px]">
                      <button type="button" onClick={() => handleIdToggle(true)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all border ${formData.tieneIdAsignado ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>SÍ</button>
                      <button type="button" onClick={() => handleIdToggle(false)} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all border ${!formData.tieneIdAsignado ? 'bg-[#EF3340] text-white border-[#EF3340] shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:bg-red-50'}`}>NO</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Año *</label>
                  <select name="ano" value={formData.ano || ''} onChange={onInputChange} className={getInputClasses('ano')}>
                    <option value="">Seleccione Año...</option>
                    {varsGlobales.map(v => <option key={v.ano} value={v.ano}>{v.ano}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">TRM Proyectada *</label>
                  <div className="relative">
                    <input value={trmDisplay} readOnly className={getInputClasses('', true)} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-400">TASA FIJA</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">¿Tiene interdependencias?</label>
                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={() => handleInterdependenciesToggle(true)} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all border ${formData.tieneInterdependencias ? 'bg-[#EF3340] text-white border-[#EF3340] shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:bg-red-50'}`}>{formData.tieneInterdependencias ? <Check size={14} className="inline mr-1" strokeWidth={3} /> : null} SÍ</button>
                    <button type="button" onClick={() => handleInterdependenciesToggle(false)} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all border ${!formData.tieneInterdependencias ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>{!formData.tieneInterdependencias ? <Minus size={14} className="inline mr-1" strokeWidth={3} /> : null} NO</button>
                  </div>
                  {formData.tieneInterdependencias && (
                    <div className="mt-4 animate-in slide-in-from-top-2 duration-300 space-y-3">
                      <label className="text-[10px] font-black text-[#EF3340] uppercase tracking-widest ml-1 block">Seleccione Gerentes de Interdependencia *</label>
                      <div className="grid grid-cols-1 gap-2">
                        {GERENTE_INTER_OPTIONS.map(g => {
                          const isSelected = formData.gerentesInterdependencia?.includes(g);
                          return (
                            <button key={g} type="button" onClick={() => toggleGerenteInterdependencia(g)} className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[10px] font-black transition-all ${isSelected ? 'bg-[#EF3340]/5 border-[#EF3340] text-[#EF3340] shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                              {g} {isSelected ? <CheckCircle2 size={14} /> : <div className="w-[14px] h-[14px] rounded-full border border-gray-200"></div>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                  <FormSection title="Gobierno & Responsables" icon={<UserCheck size={22} />} theme={theme} textColor={textColor} cols={1} hFull>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Director Corporativo *</label>
                      <select name="directorCorporativo" value={formData.directorCorporativo} onChange={handleDirCorpChange} className={getInputClasses('directorCorporativo')}>
                        <option value="">Seleccione...</option>
                        {dirCorpOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Director de Área *</label>
                      <select name="director" value={formData.director} onChange={handleDirAreaChange} className={getInputClasses('director')} disabled={!formData.directorCorporativo}>
                        <option value="">{formData.directorCorporativo ? 'Seleccione...' : 'Primero seleccione Director Corporativo'}</option>
                        {dirAreaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Gerente Líder *</label>
                      <select name="gerente" value={formData.gerente} onChange={onInputChange} className={getInputClasses('gerente')} disabled={!formData.director}>
                        <option value="">{formData.director ? 'Seleccione...' : 'Primero seleccione Director de Área'}</option>
                        {gerenteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </FormSection>
                </div>

                <div className="lg:col-span-8">
                  <FormSection title="Descripción Técnica" icon={<FileText size={22} />} theme={theme} textColor={textColor} fullWidth hFull error={errors.descripcionBreve}>
                    <div className="relative flex-1 flex flex-col">
                      <textarea 
                        name="descripcionBreve" 
                        value={formData.descripcionBreve} 
                        onChange={onInputChange} 
                        maxLength={2000}
                        className={`${getInputClasses('descripcionBreve')} flex-1 min-h-[300px] resize-none leading-relaxed p-8 pb-12 ${isDescInvalid ? 'border-amber-400 ring-4 ring-amber-50' : ''}`} 
                        placeholder="Descripción de forma detallada, el objetivo de la iniciativa, la justificación de la necesidad y los hitos principales..." 
                      />
                      <div className="absolute bottom-4 right-6 flex items-center gap-3 pointer-events-none">
                        {isDescInvalid && <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest animate-pulse">Min. 50 requeridos</span>}
                        <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isDescInvalid ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          {descLength} / 2000 CARACTERES
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>
              </div>

              <FormSection 
                title="Planificación de Ítems Presupuestales" 
                icon={<Layers size={22} />} 
                theme={theme} 
                textColor={textColor} 
                fullWidth 
                error={errors.items}
                headerRight={
                  <div className="flex items-center gap-4 bg-gray-50/50 px-6 py-2 rounded-2xl border border-gray-100 shadow-inner">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">TRM Proyectada</span>
                      <span className="text-[12px] font-black text-[#EF3340]">{trmDisplay} <span className="text-[8px] text-gray-400 ml-1">TASA FIJA</span></span>
                    </div>
                  </div>
                }
              >
                <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100 shadow-inner bg-white">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-4 py-6 min-w-[200px]">Rubro</th>
                        <th className="px-4 py-6 min-w-[150px]">Subrubro</th>
                        <th className="px-4 py-6 min-w-[150px]">Pos. Presupuestal</th>
                        <th className="px-4 py-6">Métrica</th>
                        <th className="px-4 py-6 min-w-[120px]">Servicios</th>
                        <th className="px-4 py-6 min-w-[120px]">Proveedor</th>
                        <th className="px-4 py-6 text-center">Cantidad</th>
                        <th className="px-4 py-6 text-right">CAPEX Requerido (COP)</th>
                        <th className="px-4 py-6 text-right">CAPEX Requerido (USD)</th>
                        <th className="px-4 py-6">Descripción Ítem</th>
                        <th className="px-4 py-6 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {formData.items.map((item) => {
                        const usdValue = (parseFloat(item.capexCop) || 0) / trmProyectada;
                        return (
                          <tr key={item.id} className="hover:bg-red-50/10 transition-colors">
                            <td className="px-2 py-4">
                              <select value={item.rubro} onChange={(e) => handleRubroChange(item.id, e.target.value)} className={getInputClasses()}>
                                <option value="">Seleccione...</option>
                                {rubroOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </td>
                            <td className="px-2 py-4">
                              <select value={item.subrubro} onChange={(e) => handleSubrubroChange(item.id, e.target.value)} className={getInputClasses()} disabled={!item.rubro}>
                                <option value="">{item.rubro ? 'Seleccione...' : 'Primero seleccione Rubro'}</option>
                                {(subrubroMap[item.id] || []).map(opt => <option key={opt.subrubro} value={opt.subrubro}>{opt.subrubro}</option>)}
                              </select>
                            </td>
                            <td className="px-2 py-4">
                              <input value={item.posicionPresupuestal} readOnly className={`${getInputClasses('', true)} font-mono uppercase text-[#EF3340]`} placeholder="Auto desde BD" />
                            </td>
                            <td className="px-2 py-4">
                              <input value={item.metrica} readOnly className={getInputClasses('', true)} placeholder="Auto desde BD" />
                            </td>
                            <td className="px-2 py-4">
                              <select value={item.tipo} onChange={(e) => updateItem(item.id, 'tipo', e.target.value)} className={getInputClasses()}>
                                {TIPO_ITEM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </td>
                            <td className="px-2 py-4">
                              <input 
                                value={item.proveedor} 
                                onChange={(e) => updateItem(item.id, 'proveedor', e.target.value)} 
                                className={getInputClasses()} 
                                placeholder="Nombre del proveedor"
                              />
                            </td>
                            <td className="px-2 py-4 text-center">
                              <input 
                                type="text" 
                                value={formatWithSeparators(item.cantidad)} 
                                onChange={(e) => {
                                  const cleanedVal = e.target.value.replace(/\D/g, '');
                                  updateItem(item.id, 'cantidad', cleanedVal);
                                }} 
                                className={`${getInputClasses()} text-center font-black`} 
                                placeholder="0"
                              />
                            </td>
                            <td className="px-2 py-4 text-right">
                              <input type="text" value={formatWithSeparators(item.capexCop)} onChange={(e) => updateItem(item.id, 'capexCop', e.target.value.replace(/\D/g, ''))} className={`${getInputClasses()} text-right font-black text-[#EF3340] pr-4`} placeholder="0" />
                            </td>
                            <td className="px-2 py-4 text-right">
                              <div className="px-4 py-3 text-[11px] font-black text-blue-600 bg-gray-50 rounded-xl border border-gray-100 text-right">
                                {formatUSD(usdValue)}
                              </div>
                            </td>
                            <td className="px-2 py-4">
                              <input value={item.descripcionLinea} onChange={(e) => updateItem(item.id, 'descripcionLinea', e.target.value)} className={getInputClasses()} placeholder="Detalle de la línea" />
                            </td>
                            <td className="px-2 py-4 text-center">
                              <button type="button" onClick={() => onItemsChange(formData.items.filter(i => i.id !== item.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8 flex justify-center">
                  <button type="button" onClick={addItem} className="flex items-center gap-4 px-12 py-4 text-[11px] font-black rounded-2xl border-2 border-dashed border-red-200 text-[#EF3340] hover:bg-red-50 hover:border-red-400 transition-all"><Plus size={18} /> AGREGAR LÍNEA PRESUPUESTAL</button>
                </div>
              </FormSection>

              <FormSection title="Plan Presupuestal" icon={<Calculator size={22} />} theme={theme} textColor={textColor} cols={2}>
                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} ml-1`}>Monto Total COP (Suma Monto COP)</label>
                  <input value={totalCopCalculated.toLocaleString('es-CO')} readOnly className={`${getInputClasses('', true)} font-black text-2xl text-emerald-600`} />
                </div>
                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} ml-1`}>Monto en USD (TRM Proyectada: {trmDisplay})</label>
                  <input value={totalUsdCalculated.toLocaleString('es-CO', { maximumFractionDigits: 2 })} readOnly className={`${getInputClasses('', true)} font-black text-2xl text-blue-600`} />
                </div>
              </FormSection>

              <FormSection title="Clasificación de la Iniciativa" icon={<Landmark size={22} />} theme={theme} textColor={textColor} cols={2}>
                
                <div className="col-span-full space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <QuestionRow label="1. ¿Existe una norma o requisito legal que obliga a ejecutar este proyecto?" field="esObligatorioLegal" />
                    <QuestionRow label="2. ¿Su no ejecución generaría penalizaciones o incumplimientos regulatorios?" field="generaPenalizaciones" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <QuestionRow label="3. ¿Tiene alta probabilidad de falla y severidad en su consecuencia?" field="probabilidadFalla" />
                    <QuestionRow label="4. ¿El proyecto es necesario para evitar interrupciones en operaciones actuales?" field="evitaInterrupciones" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <QuestionRow label="5. ¿Evita una pérdida de ingresos o márgenes existentes?" field="evitaPerdidaIngresos" />
                    <QuestionRow label="6. ¿Reduce un riesgo que podría afectar la retención de los clientes (churn)?" field="reduceChurn" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <QuestionRow label="7. ¿Aumenta ingresos o reduce costos de forma medible en el corto plazo?" field="aumentaIngresosCortoPlazo" />
                    <QuestionRow label="8. ¿Tiene un retorno financiero directo sobre el EBITDA?" field="retornoEbitda" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <QuestionRow label="9. ¿Desarrolla una capacidad estratégica clave para el futuro del negocio?" field="capacidadEstrategica" />
                    <QuestionRow label="10. ¿Está alineado con la visión o prioridades estratégicas de largo plazo?" field="alineadoVision" />
                  </div>
                </div>

                <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12 animate-in fade-in duration-700">
                  <CategoryDescCard id="OBLIGATORIO" title="Obligatorio" desc="Requisitos regulatorios que no deben formar parte del ejercicio de priorización." icon={<ShieldAlert size={16}/>} color="text-red-600 bg-red-600" />
                  <CategoryDescCard id="MANTENIMIENTO" title="Mantenimiento" desc="Actualizaciones y mantenimiento de equipos para mantener la operación." icon={<Activity size={16}/>} color="text-blue-600 bg-blue-600" />
                  <CategoryDescCard id="PROTECCION_EBITDA" title="Protección EBITDA" desc="Proyectos que protegen los niveles de ingreso actuales y evitan riesgos de churn." icon={<ShieldCheck size={16}/>} color="text-emerald-600 bg-emerald-600" />
                  <CategoryDescCard id="CRECIMIENTO_EBITDA" title="Crecimiento EBITDA" desc="Proyectos que generan ingresos adicionales o reducen costos operativos." icon={<TrendingUp size={16}/>} color="text-indigo-600 bg-indigo-600" />
                  <CategoryDescCard id="NEGOCIOS_ADYACENTES" title="Negocios Adyacentes" desc="Proyectos estratégicos a largo plazo de adyacencias o nuevos negocios." icon={<Rocket size={16}/>} color="text-amber-600 bg-amber-600" />
                </div>

                {isBlockAActive && (
                  <div className="col-span-full animate-in fade-in slide-in-from-top-4 duration-500 space-y-6 mt-8">
                    <div className="p-8 rounded-[2rem] border-2 border-dashed border-red-100 bg-red-50/20 flex flex-col md:flex-row items-center gap-8 group hover:border-[#EF3340] transition-all">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#EF3340] shadow-sm border border-red-100 group-hover:scale-110 transition-transform">
                        <FileUp size={32} />
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                        <label className="text-[10px] font-black text-red-600 uppercase tracking-widest block ml-1">Soporte Regulatorio / Legal *</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            name="evidenciaRegulatoria" 
                            value={formData.evidenciaRegulatoria || ''} 
                            onChange={onInputChange} 
                            className={`${getInputClasses('evidenciaRegulatoria')} pl-10 border-red-200 focus:border-[#EF3340] ${getValidationClasses(formData.evidenciaRegulatoria, true)}`} 
                            placeholder="Nombre del archivo o link al repositorio legal..." 
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-80 space-y-3">
                         <label className="text-[10px] font-black text-red-600 uppercase tracking-widest block ml-1">VALOR ESPERADO (USD) *</label>
                         <div className="relative">
                           <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                           <input 
                             type="text" 
                             name="cuantificacionRiesgoRegulatorio" 
                             value={formatWithSeparators(formData.cuantificacionRiesgoRegulatorio)} 
                             onChange={(e) => {
                               const numericValue = e.target.value.replace(/\D/g, '');
                               onInputChange({ target: { name: 'cuantificacionRiesgoRegulatorio', value: numericValue } } as any);
                             }}
                             className={`${getInputClasses('cuantificacionRiesgoRegulatorio')} pl-10 border-red-200 focus:border-[#EF3340] font-black ${getValidationClasses(formData.cuantificacionRiesgoRegulatorio)}`} 
                             placeholder="0" 
                           />
                           <p className="text-[8px] font-black text-gray-400 mt-1 ml-1">Equivale: {formatCurrency(formData.cuantificacionRiesgoRegulatorio || 0)}</p>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {isBlockBActive && (
                  <div className="col-span-full mb-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-10 rounded-[3rem] border-2 border-[#EF3340]/20 bg-gray-50 shadow-inner">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#EF3340] text-white rounded-2xl flex items-center justify-center shadow-lg">
                          <AlertTriangle size={24} />
                        </div>
                        <div>
                          <h5 className="text-[14px] font-black tracking-tight text-gray-900 uppercase">Matriz de Riesgo Técnico</h5>
                          <p className="text-[9px] font-black text-[#EF3340] uppercase tracking-widest">Evaluación por Valores Reales (Probabilidad % e Impacto USD)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5 space-y-4">
                            <div className="grid grid-cols-6 gap-2">
                              <div className="h-6"></div>
                              {[1,2,3,4,5].map(v => <div key={v} className="text-center text-[9px] font-black text-gray-400 uppercase tracking-tighter">{v}</div>)}
                              
                              {[5,4,3,2,1].map(imp => (
                                <React.Fragment key={imp}>
                                  <div className="flex items-center justify-end text-[9px] font-black text-gray-400 pr-2">{imp}</div>
                                  {[1,2,3,4,5].map(prob => {
                                    const score = RISK_MATRIX_SCORES[imp][prob-1];
                                    const isSelected = currentProbScore === prob && currentImpactScore === imp;
                                    return (
                                      <div 
                                      key={`${imp}-${prob}`} 
                                      className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${getHeatmapColor(score)} ${isSelected ? 'ring-4 ring-black/10 scale-110 z-10' : 'opacity-40 grayscale-[50%] scale-95'}`}
                                      >
                                        {score}
                                      </div>
                                    );
                                  })}
                                </React.Fragment>
                              ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Probabilidad (Scores 1-5) →</span>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Impacto (Scores 1-5) ↑</span>
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Probabilidad de Ocurrencia (%)</label>
                                <div className="relative">
                                  <input 
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.probabilidadRiesgo || ''} 
                                    onChange={e => {
                                      const val = parseFloat(e.target.value);
                                      const clamped = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                                      setFormData(prev => ({ ...prev, probabilidadRiesgo: clamped }));
                                    }}
                                    placeholder="0-100"
                                    className={`${getInputClasses()} pr-10 ${getValidationClasses(formData.probabilidadRiesgo)}`}
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Impacto Económico (USD)</label>
                                <div className="relative">
                                  <input 
                                    type="text"
                                    value={formatWithSeparators(formData.impactoRiesgo)} 
                                    onChange={e => {
                                      const numericValue = e.target.value.replace(/\D/g, '');
                                      const val = parseInt(numericValue);
                                      const clamped = isNaN(val) ? 0 : Math.min(350000000, Math.max(0, val));
                                      setFormData(prev => ({ ...prev, impactoRiesgo: clamped }));
                                    }}
                                    placeholder="0 - 350M"
                                    className={`${getInputClasses()} pr-14 ${getValidationClasses(formData.impactoRiesgo)}`}
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-[9px]">USD</span>
                                </div>
                            </div>

                            <div className="col-span-full pt-4">
                              <div className="p-6 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/20 flex flex-col md:flex-row items-center gap-6 group hover:border-amber-400 transition-all">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 group-hover:scale-105 transition-transform">
                                    <FileUp size={24} />
                                  </div>
                                  <div className="flex-1 space-y-2 w-full">
                                    <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest block ml-1">Anexo Soporte de Riesgo (Artefacto) *</label>
                                    <div className="relative">
                                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                      <input 
                                        name="matrizRiesgo" 
                                        value={formData.matrizRiesgo || ''} 
                                        onChange={onInputChange} 
                                        className={`${getInputClasses('matrizRiesgo')} pl-10 border-amber-200 focus:border-amber-500 ${getValidationClasses(formData.matrizRiesgo, true)}`} 
                                        placeholder="Link o nombre del artefacto..." 
                                      />
                                    </div>
                                  </div>
                              </div>
                            </div>

                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest block ml-1">VALOR ESPERADO (USD) *</label>
                                  <div className="relative">
                                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input 
                                      type="text" 
                                      readOnly
                                      name="cuantificacionRiesgoTecnico" 
                                      value={formatUSD(calculatedValorEsperado)} 
                                      className={`${getInputClasses('cuantificacionRiesgoTecnico', true)} pl-10 border-amber-200 focus:border-amber-500 font-black text-[#EF3340] ${getValidationClasses(calculatedValorEsperado)}`} 
                                    />
                                  </div>
                                </div>
                                <div className={`p-6 h-[72px] rounded-2xl flex items-center justify-between border ${getHeatmapColor(matrixValue)}`}>
                                  <div className="flex items-center gap-4">
                                    <ShieldCheck size={28} />
                                    <div>
                                      <h6 className="text-[10px] font-black uppercase">Severidad Matriz</h6>
                                    </div>
                                  </div>
                                  <div className="text-3xl font-black">{matrixValue}</div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isBlockCActive && (
                  <div className="col-span-full mb-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-8 rounded-[2rem] border-2 border-dashed border-emerald-200 bg-emerald-50/20 flex flex-col md:flex-row items-center gap-8 group hover:border-emerald-500 transition-all">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 group-hover:scale-110 transition-transform">
                        <FileUp size={32} />
                      </div>
                      <div className="flex-1 space-y-3 w-full">
                        <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block ml-1">Soporte de Caso de Negocio (Artefacto) *</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            name="casoNegocioArchivo" 
                            value={formData.casoNegocioArchivo || ''} 
                            onChange={onInputChange} 
                            className={`${getInputClasses('casoNegocioArchivo')} pl-10 border-emerald-200 focus:border-emerald-500 ${getValidationClasses(formData.casoNegocioArchivo, true)}`} 
                            placeholder="Anexe link al archivo de soporte financiero (Excel/PDF)..." 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10 rounded-[3rem] bg-emerald-50/10 border border-emerald-100">
                        <div className="col-span-full mb-2">
                          <h6 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={16} /> Diligencie los Indicadores Financieros Clave
                          </h6>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Coins size={10} /> VPN (COP)</label>
                          <input 
                            type="text" 
                            value={formatWithSeparators(formData.businessCase.indicadores.vpn)} 
                            onChange={(e) => handleIndicadorChange('vpn', e.target.value)}
                            className={`${getInputClasses()} ${getValidationClasses(formData.businessCase.indicadores.vpn)}`}
                            placeholder="Separador de miles"
                          />
                          <p className="text-[8px] font-bold text-emerald-600 ml-1">{formatCurrency(formData.businessCase.indicadores.vpn || 0)}</p>
                        </div>
                    </div>
                  </div>
                )}
              </FormSection>

              <div className={`pt-12 mt-12 border-t flex flex-col md:flex-row justify-end gap-6 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <button type="button" onClick={onClose} className={`px-10 py-5 text-[11px] font-black rounded-3xl border transition-all uppercase tracking-widest ${theme === 'dark' ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm'}`}>Descartar Cambios</button>
                <button type="button" onClick={onSaveOnly} className={`px-10 py-5 text-[11px] font-black rounded-3xl border transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${theme === 'dark' ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
                  <Save size={18} /> Guardar
                </button>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;