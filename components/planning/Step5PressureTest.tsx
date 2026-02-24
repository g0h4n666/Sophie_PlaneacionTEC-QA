import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  Save, 
  XCircle,
  HelpCircle,
  Ghost,
  RefreshCw,
  Skull,
  Calculator,
  ArrowRight,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  Inbox,
  Filter,
  User,
  Activity,
  Coins,
  Link as LinkIcon,
  MessageSquare,
  Clock,
  CircleDot,
  FileText,
  List,
  CheckSquare,
  ChevronUp,
  LayoutDashboard
} from 'lucide-react';
import { ProjectRow, BudgetLineItem } from '../Planning';
import { getInvestmentCommitteeVeredict } from '../../services/gemini';

interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
  onUpdateRows: (rows: ProjectRow[]) => void;
  canModify?: boolean;
}

const KPI_OPTIONS = [
  "REDUCCIÓN DE CHURN",
  "INCREMENTO ARPU",
  "MEJORA NPS",
  "EFICIENCIA OPERATIVA (COST-OUT)",
  "COBERTURA POBLACIONAL 5G",
  "DISPONIBILIDAD DE RED (SLA)",
  "TIME TO MARKET (TTM)",
  "EXPERIENCIA DE CLIENTE (CX)",
  "REDUCCIÓN DE MTTR",
  "MONETIZACIÓN DE DATOS"
];

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

const ScoreRow: React.FC<{ 
  label: string; 
  desc: string; 
  value: number; 
  onChange: (val: number) => void; 
}> = ({ label, desc, value, onChange }) => {
  return (
    <div className="group flex flex-col items-center text-center space-y-6 p-6 rounded-[2.5rem] bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-500 min-h-[220px]">
      <div className="space-y-1">
        <p className="text-[12px] font-black text-gray-900 tracking-tight uppercase">{label}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{desc}</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`w-9 h-9 rounded-full text-[11px] font-black transition-all border flex items-center justify-center ${
              value === num 
              ? 'bg-[#EF3340] text-white border-[#EF3340] shadow-lg scale-110' 
              : 'bg-white text-gray-300 border-gray-100 hover:bg-red-50 hover:text-[#EF3340]'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

const DecisionButton: React.FC<{ 
  label: string; 
  sub: string; 
  active: boolean; 
  color: 'emerald' | 'red' | 'amber'; 
  onClick: () => void; 
}> = ({ label, sub, active, color, onClick }) => {
  const colorMap = {
    emerald: active ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/20' : 'bg-white text-gray-400 border-gray-100 hover:bg-emerald-50',
    red: active ? 'bg-red-600 text-white border-red-600 shadow-red-500/20' : 'bg-white text-gray-400 border-gray-100 hover:bg-red-50',
    amber: active ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20' : 'bg-white text-gray-400 border-gray-100 hover:bg-amber-50'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active:scale-95 ${colorMap[color]}`}
    >
      <span className="text-sm font-black tracking-widest">{label}</span>
      <span className="text-[9px] font-bold opacity-80 uppercase mt-0.5">{sub}</span>
    </button>
  );
};

const ExpandableSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-[2.5rem] border transition-all duration-500 ${isOpen ? 'bg-white border-gray-200 shadow-lg' : 'bg-white border-gray-100'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-[#EF3340] text-white' : 'bg-gray-50 text-gray-400'}`}>
            {icon}
          </div>
          <h5 className={`text-[11px] font-black uppercase tracking-widest ${isOpen ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h5>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} className="text-gray-300" />
        </div>
      </button>
      {isOpen && (
        <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-[11px] font-bold text-gray-800 break-words">{value || 'N/A'}</span>
  </div>
);

const BooleanCheck = ({ label, value }: { label: string, value: boolean }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border ${value ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
    <span className={`text-[10px] font-bold ${value ? 'text-emerald-800' : 'text-gray-400'}`}>{label}</span>
    {value ? <CheckCircle2 size={14} className="text-emerald-600" /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
  </div>
);

const Step5PressureTest: React.FC<Props> = ({ rows, theme, onUpdateRows, canModify = true }) => {
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [savingScorecard, setSavingScorecard] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GO' | 'NO-GO' | 'PIVOT' | 'SIN DECISIÓN'>('ALL');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';

  const approvedRows = useMemo(() => rows.filter(r => r.estadoSoporte === 'APROBADO'), [rows]);

  const counts = useMemo(() => {
    return {
      ALL: approvedRows.length,
      GO: approvedRows.filter(r => r.scorecard?.decisionComite === 'GO').length,
      'NO-GO': approvedRows.filter(r => r.scorecard?.decisionComite === 'NO-GO').length,
      PIVOT: approvedRows.filter(r => r.scorecard?.decisionComite === 'PIVOT').length,
      'SIN DECISIÓN': approvedRows.filter(r => !r.scorecard?.decisionComite || r.scorecard?.decisionComite === 'SIN DECISIÓN').length,
    };
  }, [approvedRows]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'ALL') return approvedRows;
    if (statusFilter === 'SIN DECISIÓN') return approvedRows.filter(r => !r.scorecard?.decisionComite || r.scorecard?.decisionComite === 'SIN DECISIÓN');
    return approvedRows.filter(r => r.scorecard?.decisionComite === statusFilter);
  }, [approvedRows, statusFilter]);

  const macroGroups = useMemo(() => {
    const groups: Record<string, ProjectRow[]> = {};
    filteredProjects.forEach(row => {
      const name = row.macroproyecto || 'SIN MACROPROYECTO';
      if (!groups[name]) groups[name] = [];
      groups[name].push(row);
    });
    return groups;
  }, [filteredProjects]);

  const selectedProject = useMemo(() => 
    approvedRows.find(r => r.idProyecto === selectedProjectId), 
    [approvedRows, selectedProjectId]
  );

  const efficiencyIndex = useMemo(() => {
    if (!selectedProject) return "0.00";
    const vpn = parseFloat(selectedProject.businessCase.indicadores.vpn) || 0;
    const capex = parseFloat(selectedProject.presupuestoCop) || 1;
    return (vpn / capex).toFixed(2);
  }, [selectedProject]);

  const handleSimulatePressureTest = () => {
    const newRows = rows.map(r => {
      if (r.estadoSoporte !== 'APROBADO') return r;
      const randomScore = () => Math.floor(Math.random() * 3) + 3; 
      const kpi = KPI_OPTIONS[Math.floor(Math.random() * KPI_OPTIONS.length)];
      return {
        ...r,
        businessCase: { ...r.businessCase, contribucionKPIs: kpi },
        scorecard: {
          pilarEstrategico: randomScore(), pilarFinanciero: randomScore(), pilarRiesgo: randomScore(),
          pilarEquipo: randomScore(), pilarUrgencia: randomScore(), decisionComite: 'GO' as const,
          condicionObligatoria: 'Validación técnica por simulación exitosa Sophie AI.',
          aiAnalysis: {
            veredicto: 'APROBADO' as const,
            preguntaAsesina: "¿Cómo asegura que esta inversión no sea canibalizada por tecnologías legacy?",
            razonesCriticas: {
              estrategia: "Alineación total con el roadmap 5G.", roi: "VPN positivo superior al promedio del portafolio.",
              riesgo: "Mitigación mediante partners locales.", equipo: "Seniority alto demostrado.",
              urgencia: "Vencimiento inminente de soporte actual."
            }
          }
        }
      };
    });
    onUpdateRows(newRows);
  };

  const totalScore = useMemo(() => {
    if (!selectedProject?.scorecard) return 0; 
    const s = selectedProject.scorecard;
    return (s.pilarEstrategico || 0) + (s.pilarFinanciero || 0) + (s.pilarRiesgo || 0) + (s.pilarEquipo || 0) + (s.pilarUrgencia || 0);
  }, [selectedProject]);

  const verdictData = useMemo(() => {
    if (totalScore >= 21) {
      return { status: 'APROBADO (VERDE)', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50', icon: <CheckCircle2 size={48} className="text-emerald-500" /> };
    } else if (totalScore >= 16) {
      return { status: 'CONDICIONADO (AMARILLO)', colorClass: 'text-amber-500', bgClass: 'bg-amber-50', icon: <AlertTriangle size={48} className="text-amber-500" /> };
    } else {
      return { status: 'RECHAZADO (ROJO)', colorClass: 'text-[#EF3340]', bgClass: 'bg-red-50', icon: <XCircle size={48} className="text-[#EF3340]" /> };
    }
  }, [totalScore]);

  const handleScoreChange = (field: string, val: number) => {
    if (!selectedProjectId) return;
    const newRows = rows.map(r => {
      if (r.idProyecto === selectedProjectId) {
        const currentScorecard = r.scorecard || {
          pilarEstrategico: 0, pilarFinanciero: 0, pilarRiesgo: 0, pilarEquipo: 0, pilarUrgencia: 0,
          decisionComite: 'SIN DECISIÓN', condicionObligatoria: ''
        };
        return { ...r, scorecard: { ...currentScorecard, [field]: val } };
      }
      return r;
    });
    onUpdateRows(newRows);
  };

  const handleKPIChange = (val: string) => {
    if (!selectedProjectId) return;
    const newRows = rows.map(r => {
      if (r.idProyecto === selectedProjectId) {
        return { ...r, businessCase: { ...r.businessCase, contribucionKPIs: val } };
      }
      return r;
    });
    onUpdateRows(newRows);
  };

  const handleDecisionChange = (val: 'GO' | 'NO-GO' | 'PIVOT' | 'SIN DECISIÓN') => {
    if (!selectedProjectId) return;
    const newRows = rows.map(r => {
      if (r.idProyecto === selectedProjectId) {
        const currentScorecard = r.scorecard || {
          pilarEstrategico: 3, pilarFinanciero: 3, pilarRiesgo: 3, pilarEquipo: 3, pilarUrgencia: 3,
          decisionComite: 'SIN DECISIÓN', condicionObligatoria: ''
        };
        return { ...r, scorecard: { ...currentScorecard, decisionComite: val } };
      }
      return r;
    });
    onUpdateRows(newRows);
  };

  const handlePersistirActa = async () => {
    if (!selectedProject?.dbId) return;
    setSavingScorecard(true);
    try {
      await fetch('/api/guardar-paso3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbId:     selectedProject.dbId,
          scorecard: selectedProject.scorecard
        })
      });
    } catch (err) {
      console.error('❌ Error guardando acta:', err);
    } finally {
      setSavingScorecard(false);
    }
  };

  const handleCallAI = async () => {
    if (!selectedProject) return;
    setLoadingAI(true);
    try {
      const result = await getInvestmentCommitteeVeredict(selectedProject);
      const newRows: ProjectRow[] = rows.map(r => {
        if (r.idProyecto === selectedProjectId) {
          return {
            ...r,
            scorecard: {
              ...r.scorecard!,
              pilarEstrategico: result.puntuaciones.estrategia,
              pilarFinanciero: result.puntuaciones.finanzas,
              pilarRiesgo: result.puntuaciones.riesgo,
              pilarEquipo: result.puntuaciones.ejecucion,
              pilarUrgencia: result.puntuaciones.urgencia,
              decisionComite: (result.estado === 'APROBADO' ? 'GO' : result.estado === 'RECHAZADO' ? 'NO-GO' : 'PIVOT') as 'GO' | 'NO-GO' | 'PIVOT',
              aiAnalysis: {
                veredicto: result.estado as 'APROBADO' | 'RECHAZADO' | 'CONDICIONADO',
                preguntaAsesina: result.pregunta_de_cierre,
                razonesCriticas: {
                  estrategia: result.justificaciones.estrategia,
                  roi: result.justificaciones.finanzas,
                  riesgo: result.justificaciones.riesgo,
                  equipo: result.justificaciones.ejecucion,
                  urgencia: result.justificaciones.urgencia
                }
              }
            }
          };
        }
        return r;
      });
      onUpdateRows(newRows);
    } catch (err) {
      alert("Error en el algoritmo de inversión. Por favor reintente.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-700 space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className={`text-3xl font-black tracking-tighter ${textColor}`}>3. Pressure Test</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
            AUDITORÍA DE CAPITAL & FILTRADO ESTRATÉGICO SOPHIE
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* SIMULAR AUDITORÍA DESHABILITADO
          {canModify && approvedRows.length > 0 && (
            <button
              type="button"
              onClick={handleSimulatePressureTest}
              className="px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:scale-105 transition-all shadow-xl active:scale-95 border border-white/10"
            >
              <Zap size={18} className="text-yellow-300 animate-pulse" />
              SIMULAR AUDITORÍA
            </button>
          )}
          */}

          {/* GEMINI REAL-TIME AUDIT DESHABILITADO
          {selectedProject && (
            <button
              type="button"
              onClick={handleCallAI}
              disabled={loadingAI}
              className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-4 transition-all shadow-xl active:scale-95 ${
                loadingAI ? 'bg-indigo-50 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              {loadingAI ? <RefreshCw size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
              {loadingAI ? 'ANALIZANDO DATA...' : 'GEMINI REAL-TIME AUDIT'}
            </button>
          )}
          */}
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* PANEL IZQUIERDO: WORKSPACE AMPLIADO (5/12) */}
          <div className={`lg:col-span-5 p-8 rounded-[4rem] border ${cardBg} shadow-2xl flex flex-col min-h-[600px]`}>
            <div className="flex items-center justify-between mb-10 px-4">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-red-50 rounded-2xl text-[#EF3340]">
                    <Layers size={22} />
                 </div>
                 <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest leading-none">Workspace de Auditoría</h4>
              </div>
              <button className="px-5 py-2.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-colors">
                 <Filter size={12} /> Filtros
              </button>
            </div>

            {/* FILTROS DE ESTADO */}
            <div className="bg-[#f8f9fb] p-6 rounded-[3.5rem] mb-10 border border-gray-100 flex flex-col gap-5">
               <div className="flex items-center justify-between px-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vista de Portafolio</span>
                  <span className="text-[9px] font-bold text-gray-300 italic">Sophie Engine v2</span>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  <FilterTab 
                    label="Todas las Iniciativas" 
                    icon={<Layers size={10} />}
                    count={counts.ALL} 
                    active={statusFilter === 'ALL'} 
                    onClick={() => setStatusFilter('ALL')} 
                    color="gray" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FilterTab 
                      label="Pendientes" 
                      icon={<Clock size={10} />}
                      count={counts['SIN DECISIÓN']} 
                      active={statusFilter === 'SIN DECISIÓN'} 
                      onClick={() => setStatusFilter('SIN DECISIÓN')} 
                      color="gray" 
                    />
                    <FilterTab 
                      label="Aprobados GO" 
                      icon={<CheckCircle2 size={10} />}
                      count={counts.GO} 
                      active={statusFilter === 'GO'} 
                      onClick={() => setStatusFilter('GO')} 
                      color="emerald" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FilterTab 
                      label="Rechazados" 
                      icon={<XCircle size={10} />}
                      count={counts['NO-GO']} 
                      active={statusFilter === 'NO-GO'} 
                      onClick={() => setStatusFilter('NO-GO')} 
                      color="red" 
                    />
                    <FilterTab 
                      label="En Pivot" 
                      icon={<CircleDot size={10} />}
                      count={counts.PIVOT} 
                      active={statusFilter === 'PIVOT'} 
                      onClick={() => setStatusFilter('PIVOT')} 
                      color="amber" 
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2 max-h-[450px] px-2">
              {Object.keys(macroGroups).length > 0 ? Object.keys(macroGroups).map(macro => (
                <div key={macro} className="space-y-2 animate-in slide-in-from-bottom-2">
                   <button 
                     type="button"
                     onClick={() => setSelectedMacro(selectedMacro === macro ? null : macro)}
                     className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                       selectedMacro === macro 
                       ? 'bg-red-50 border-red-200 text-[#EF3340] shadow-md scale-[1.02]' 
                       : 'bg-white border-gray-100 text-gray-500 hover:border-red-100 shadow-sm'
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMacro === macro ? 'bg-red-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                           <Calculator size={14} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight">{macro}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${selectedMacro === macro ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400'}`}>{macroGroups[macro].length}</span>
                        <ChevronDown size={16} className={`transition-transform duration-500 ${selectedMacro === macro ? 'rotate-180' : ''}`} />
                     </div>
                   </button>
                   
                   {selectedMacro === macro && (
                     <div className="px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-4">
                        <div className="p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
                          <select 
                            className="w-full p-5 rounded-[1.5rem] border-none bg-white text-[12px] font-black outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors uppercase tracking-tight"
                            value={selectedProjectId || ''}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                          >
                            <option value="">— SELECCIONE INICIATIVA —</option>
                            {macroGroups[macro].map(p => (
                              <option key={p.idProyecto} value={p.idProyecto}>[{p.idProyecto}] {p.proyecto.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                     </div>
                   )}
                </div>
              )) : (
                <div className="p-16 text-center border-3 border-dashed border-gray-100 rounded-[3.5rem] flex flex-col items-center justify-center bg-gray-50/50">
                  <div className="p-6 bg-white rounded-full shadow-sm mb-6">
                    <Inbox size={48} className="text-gray-200" />
                  </div>
                  <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest max-w-[250px] leading-relaxed">No hay proyectos en este estado bajo los criterios actuales.</p>
                </div>
              )}
            </div>
          </div>

          {/* PANEL DERECHO: DETALLE INTEGRADO (7/12) */}
          <div className={`lg:col-span-7 p-10 rounded-[4rem] border ${cardBg} shadow-2xl flex flex-col`}>
            {selectedProject ? (
              <div className="animate-in zoom-in-98 duration-500 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-100 pb-10 mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-red-50 text-[#EF3340] rounded-[2rem] flex items-center justify-center border-2 border-red-100 shadow-xl shadow-red-500/5">
                      <Activity size={40} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-4">
                        <h4 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">{selectedProject.proyecto}</h4>
                        <span className="text-[11px] font-black text-[#EF3340] bg-white px-4 py-1.5 rounded-xl border border-red-200 font-mono tracking-tighter shadow-sm">{selectedProject.idProyecto}</span>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> Ficha Técnica Maestra (Pasos 1 & 2 Consolidados)
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Presupuesto CAPEX COP</p>
                     <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{formatCurrency(selectedProject.presupuestoCop)}</p>
                  </div>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[600px] scrollbar-hide">
                  <ExpandableSection title="1. ADN del Proyecto (Identificación)" icon={<LayoutDashboard size={18} />} defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <DetailRow label="Macroproyecto" value={selectedProject.macroproyecto} />
                      <DetailRow label="Año / Vigencia" value={selectedProject.ano || 'N/A'} />
                      <DetailRow label="Nombre Iniciativa" value={selectedProject.nombreIniciativa} />
                      <DetailRow label="Director Corporativo" value={selectedProject.directorCorporativo} />
                      <DetailRow label="Director de Área" value={selectedProject.director} />
                      <DetailRow label="Gerente Líder" value={selectedProject.gerente} />
                      <DetailRow label="Responsable Beneficio" value={selectedProject.responsableBeneficio} />
                      <DetailRow label="ID Proyecto" value={selectedProject.tieneIdAsignado ? selectedProject.idProyecto : 'PENDIENTE'} />
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Descripción Técnica</p>
                      <p className="text-[11px] font-medium text-gray-600 leading-relaxed italic">"{selectedProject.descripcionBreve}"</p>
                    </div>
                    {selectedProject.gerentesInterdependencia && selectedProject.gerentesInterdependencia.length > 0 && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2">Interdependencias</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.gerentesInterdependencia.map((g, i) => (
                            <span key={i} className="px-3 py-1 bg-white rounded-lg border border-amber-200 text-[10px] font-bold text-amber-700">{g}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </ExpandableSection>

                  <ExpandableSection title="2. Cuestionario Estratégico (Clasificación)" icon={<CheckSquare size={18} />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <BooleanCheck label="Es Obligatorio / Legal" value={selectedProject.esObligatorioLegal} />
                      <BooleanCheck label="Genera Penalizaciones" value={selectedProject.generaPenalizaciones} />
                      <BooleanCheck label="Probabilidad de Falla Alta" value={selectedProject.probabilidadFalla} />
                      <BooleanCheck label="Evita Interrupciones" value={selectedProject.evitaInterrupciones} />
                      <BooleanCheck label="Evita Pérdida Ingresos" value={selectedProject.evitaPerdidaIngresos} />
                      <BooleanCheck label="Reduce Churn" value={selectedProject.reduceChurn} />
                      <BooleanCheck label="Aumenta Ingresos Corto Plazo" value={selectedProject.aumentaIngresosCortoPlazo} />
                      <BooleanCheck label="Retorno EBITDA Directo" value={selectedProject.retornoEbitda} />
                      <BooleanCheck label="Capacidad Estratégica" value={selectedProject.capacidadEstrategica} />
                      <BooleanCheck label="Alineado Visión LP" value={selectedProject.alineadoVision} />
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="3. Perfil de Riesgo Técnico" icon={<AlertTriangle size={18} />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Probabilidad</p>
                        <p className="text-xl font-black text-gray-900">{selectedProject.probabilidadRiesgo || 0}%</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Impacto</p>
                        <p className="text-xl font-black text-gray-900">{formatUSD(selectedProject.impactoRiesgo || 0)}</p>
                      </div>
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Valor Esperado</p>
                        <p className="text-xl font-black text-red-600">{formatUSD(parseInt(selectedProject.cuantificacionRiesgoTecnico || '0'))}</p>
                      </div>
                    </div>
                    {selectedProject.matrizRiesgo && (
                      <div className="flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 p-3 rounded-xl">
                        <LinkIcon size={12} /> Soporte Anexo: <span className="font-bold underline">{selectedProject.matrizRiesgo}</span>
                      </div>
                    )}
                  </ExpandableSection>

                  <ExpandableSection title={`4. Desglose Presupuestal (${selectedProject.items.length} ítems)`} icon={<Coins size={18} />}>
                    <div className="overflow-x-auto rounded-2xl border border-gray-100">
                      <table className="w-full text-left text-[10px]">
                        <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest">
                          <tr>
                            <th className="px-4 py-3">Rubro</th>
                            <th className="px-4 py-3">Subrubro</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3 text-right">Monto COP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedProject.items.map((item, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 font-bold text-gray-700">{item.rubro}</td>
                              <td className="px-4 py-2 text-gray-600">{item.subrubro}</td>
                              <td className="px-4 py-2 text-gray-500">{item.tipo}</td>
                              <td className="px-4 py-2 text-right font-mono text-gray-900">{formatCurrency(item.capexCop)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection title="5. Estado de Gobernanza P2" icon={<ShieldCheck size={18} />}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-500 uppercase">Categoría Asignada</span>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase shadow-md">{selectedProject.categoria || 'PENDIENTE'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className={`p-3 rounded-xl border text-center ${selectedProject.workflowP2?.techPlanning.status === 'APROBADO' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                          <p className="text-[9px] font-black uppercase">Tech</p>
                          <p className="text-[10px] font-bold mt-1">{selectedProject.workflowP2?.techPlanning.status || 'PENDIENTE'}</p>
                        </div>
                        <div className={`p-3 rounded-xl border text-center ${selectedProject.workflowP2?.finance.status === 'APROBADO' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                          <p className="text-[9px] font-black uppercase">Financiera</p>
                          <p className="text-[10px] font-bold mt-1">{selectedProject.workflowP2?.finance.status || 'PENDIENTE'}</p>
                        </div>
                        <div className={`p-3 rounded-xl border text-center ${selectedProject.workflowP2?.risk.status === 'APROBADO' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                          <p className="text-[9px] font-black uppercase">Riesgo</p>
                          <p className="text-[10px] font-bold mt-1">{selectedProject.workflowP2?.risk.status || 'PENDIENTE'}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                         <span className="text-[10px] font-black text-gray-500 uppercase">VPN Validación</span>
                         <span className="text-[12px] font-black text-emerald-600">{formatCurrency(selectedProject.businessCase.indicadores.vpn)}</span>
                      </div>
                    </div>
                  </ExpandableSection>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
                <div className="p-10 bg-gray-50 rounded-full border-4 border-dashed border-gray-100 mb-10 animate-pulse">
                  <FileText size={80} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Registro Maestro Sophie</h3>
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest max-w-sm">Seleccione una iniciativa para iniciar la auditoría estratégica de capital.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECCIONES INFERIORES: SCORING Y VEREDICTO */}
        <div className="space-y-12">
          {selectedProject ? (
            <>
              {/* PANEL DE EVALUACIÓN OMITIDO POR SOLICITUD DE USUARIO */}
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* SCORE CARD VISUAL OMITIDO */}
                
                {/* AI INSIGHTS & FORMALIZACIÓN */}
                <div className="lg:col-span-12 space-y-10">
                  {selectedProject.scorecard?.aiAnalysis && (
                    <div className="animate-in slide-in-from-right-10 duration-1000">
                      <div className="p-12 rounded-[4rem] border-2 border-indigo-600/30 bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden group shadow-2xl">
                        <Zap className="absolute -bottom-20 -right-20 text-indigo-600/5 group-hover:scale-125 transition-transform duration-1000" size={350} />
                        
                        <div className="relative z-10 space-y-10">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                              <BrainCircuit size={32} />
                            </div>
                            <div>
                               <h5 className="text-[16px] font-black text-indigo-950 uppercase tracking-tight">IA AUDIT: LA PREGUNTA CRÍTICA</h5>
                               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] italic mt-1">Análisis profundo por modelo Gemini 3.0</p>
                            </div>
                          </div>

                          <div className="relative p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-inner group-hover:shadow-xl transition-all">
                            <p className="text-3xl font-black text-indigo-950 leading-[1.3] tracking-tight italic">
                              "{selectedProject.scorecard.aiAnalysis.preguntaAsesina}"
                            </p>
                            <Skull className="absolute -top-6 -right-6 text-indigo-100 opacity-50" size={50} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`p-12 rounded-[5rem] border shadow-2xl space-y-10 ${cardBg}`}>
                    <div className="flex items-center gap-5 px-4">
                      <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                         <ShieldCheck size={28} />
                      </div>
                      <div>
                        <h4 className={`text-2xl font-black tracking-tighter ${textColor}`}>Veredicto Formal del Comité</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Defina el estatus de inversión para el cierre de ciclo</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <DecisionButton label="GO" sub="LIBERAR CAPITAL" active={selectedProject.scorecard?.decisionComite === 'GO'} color="emerald" onClick={() => handleDecisionChange('GO')} />
                      <DecisionButton label="NO-GO" sub="DESESTIMAR" active={selectedProject.scorecard?.decisionComite === 'NO-GO'} color="red" onClick={() => handleDecisionChange('NO-GO')} />
                      <DecisionButton label="PIVOT" sub="SOLICITAR AJUSTE" active={selectedProject.scorecard?.decisionComite === 'PIVOT'} color="amber" onClick={() => handleDecisionChange('PIVOT')} />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Condiciones Obligatorias / Acta de Comité</label>
                      <textarea 
                        className="w-full h-40 p-10 rounded-[3.5rem] border border-gray-100 bg-gray-50/50 outline-none text-sm font-bold focus:border-[#EF3340] focus:ring-8 focus:ring-red-50/10 transition-all shadow-inner placeholder:italic leading-relaxed"
                        placeholder="Especifique los hitos técnicos que deben cumplirse antes de la liberación en SAP..."
                        value={selectedProject.scorecard?.condicionObligatoria || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newRows = rows.map(r => {
                            if (r.idProyecto === selectedProjectId) {
                              return { ...r, scorecard: { ...r.scorecard!, condicionObligatoria: val } };
                            }
                            return r;
                          });
                          onUpdateRows(newRows);
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handlePersistirActa}
                      disabled={savingScorecard}
                      className="w-full flex items-center justify-center gap-5 bg-[#0b0e14] text-white py-8 rounded-[3rem] text-[13px] font-black uppercase tracking-[0.4em] hover:bg-[#EF3340] hover:scale-[1.01] transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-95 group border-b-6 border-black/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {savingScorecard
                        ? <><RefreshCw size={22} className="animate-spin" /> GUARDANDO...</>
                        : <><Save size={22} className="group-hover:animate-bounce" /> PERSISTIR ACTA DE AUDITORÍA</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FilterTab: React.FC<{ 
  label: string, 
  count: number, 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode,
  color: 'emerald' | 'red' | 'amber' | 'gray' 
}> = ({ label, count, active, onClick, icon, color }) => {
  const colors = {
    emerald: active ? 'bg-[#10B981] text-white border-[#10B981] shadow-[0_15px_30px_rgba(16,185,129,0.2)] scale-[1.02]' : 'bg-white text-emerald-600 border-gray-100 hover:border-emerald-100 shadow-sm',
    red: active ? 'bg-[#EF3340] text-white border-[#EF3340] shadow-[0_15px_30px_rgba(239,51,64,0.2)] scale-[1.02]' : 'bg-white text-red-600 border-gray-100 hover:border-red-100 shadow-sm',
    amber: active ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-[0_15px_30px_rgba(245,158,11,0.2)] scale-[1.02]' : 'bg-white text-amber-600 border-gray-100 hover:border-amber-100 shadow-sm',
    gray: active ? 'bg-[#1a1f26] text-white border-[#1a1f26] shadow-[0_15px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 shadow-sm',
  };

  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all duration-500 group active:scale-95 ${colors[color]}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-white/20 scale-110 shadow-inner' : 'bg-gray-50 group-hover:scale-105'}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
         <p className={`text-[12px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>{label}</p>
      </div>
      <div className={`px-4 py-1.5 rounded-xl text-[12px] font-black transition-all ${active ? 'bg-white text-gray-900 shadow-inner' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
        {count}
      </div>
    </button>
  );
};

export default Step5PressureTest;