import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  Layers, 
  Undo2, 
  CheckCircle2, 
  ShieldAlert,
  Target,
  FileSearch,
  Search,
  ArrowRight,
  TrendingUp,
  Percent,
  Zap,
  User,
  FileText,
  Info,
  ShieldCheck,
  Cpu,
  Coins,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Briefcase,
  ListChecks,
  AlertTriangle
} from 'lucide-react';
import { ProjectRow, ProjectWorkflowP2 } from '../Planning';

interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
  canModify: boolean;
  onUpdateRows: (rows: ProjectRow[]) => void;
  onReturnToP1: (idx: number) => void;
  onNextStep: () => void;
  macroStatus: Record<string, 'PENDIENTE' | 'APROBADO' | 'DEVUELTO'>;
  setMacroStatus: React.Dispatch<React.SetStateAction<Record<string, 'PENDIENTE' | 'APROBADO' | 'DEVUELTO'>>>;
}

interface MacroGroup {
  name: string;
  totalCop: number;
  projectCount: number;
  projects: { data: ProjectRow; originalIdx: number }[];
}

const CATEGORIAS_ESTRATEGICAS = [
  { id: 'OBLIGATORIO', label: 'Obligatorio', desc: 'Requisitos regulatorios.' },
  { id: 'MANTENIMIENTO', label: 'Mantenimiento', desc: 'Actualizaciones operativas.' },
  { id: 'PROTECCION_EBITDA', label: 'Protección EBITDA', desc: 'Protección de ingresos.' },
  { id: 'CRECIMIENTO_EBITDA', label: 'Crecimiento EBITDA', desc: 'Generación de nuevos ingresos.' },
  { id: 'NEGOCIOS_ADYACENTES', label: 'Negocios adyacentes', desc: 'Estrategia a largo plazo.' }
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

const Step2Clasificacion: React.FC<Props> = ({ rows, theme, canModify, onUpdateRows, onReturnToP1, onNextStep, macroStatus, setMacroStatus }) => {
  const [expandedMacros, setExpandedMacros] = useState<Record<string, boolean>>({});
  const [selectedProjectInMacro, setSelectedProjectInMacro] = useState<Record<string, number | null>>({});
  const [showTechnicalSheet, setShowTechnicalSheet] = useState<Record<string, boolean>>({});

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const macroGroups = useMemo(() => {
    const groups: Record<string, MacroGroup> = {};
    rows.forEach((row, idx) => {
      const name = row.macroproyecto || 'SIN MACROPROYECTO';
      if (!groups[name]) {
        groups[name] = { name, totalCop: 0, projectCount: 0, projects: [] };
      }
      groups[name].totalCop += parseFloat(row.presupuestoCop) || 0;
      groups[name].projectCount += 1;
      groups[name].projects.push({ data: row, originalIdx: idx });
    });
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const toggleTechnicalSheet = (projectId: string) => {
    setShowTechnicalSheet(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleUpdateCategory = (originalIdx: number, category: string) => {
    if (!canModify) return;
    const newRows = [...rows];
    newRows[originalIdx].categoria = category;
    onUpdateRows(newRows);
  };

  const handleUpdateVPN = (originalIdx: number, val: string) => {
    if (!canModify) return;
    const newRows = [...rows];
    newRows[originalIdx].businessCase.indicadores.vpn = val;
    onUpdateRows(newRows);
  };

  const handleUpdateWorkflow = (originalIdx: number, stage: keyof ProjectWorkflowP2, newStatus: 'APROBADO' | 'RECHAZADO') => {
    if (!canModify) return;
    const newRows = [...rows];
    const project = newRows[originalIdx];
    
    if (!project.workflowP2) {
      project.workflowP2 = {
        techPlanning: { status: 'PENDIENTE' },
        finance: { status: 'PENDIENTE' },
        risk: { status: 'PENDIENTE' }
      };
    }

    project.workflowP2[stage] = {
      status: newStatus,
      date: new Date().toISOString()
    };

    const techApproved = project.workflowP2.techPlanning.status === 'APROBADO';
    const eitherFinanceOrRiskApproved = project.workflowP2.finance.status === 'APROBADO' || project.workflowP2.risk.status === 'APROBADO';

    if (techApproved && eitherFinanceOrRiskApproved) {
      project.estadoSoporte = 'APROBADO';
    } else {
      project.estadoSoporte = 'PENDIENTE';
    }

    onUpdateRows(newRows);
  };

  const handleReturnProject = (originalIdx: number) => {
    const newRows = [...rows];
    newRows[originalIdx].estadoSoporte = 'DEVUELTO';
    onUpdateRows(newRows);
    onReturnToP1(originalIdx);
  };

  const toggleMacro = (macroName: string) => {
    setExpandedMacros(p => ({ ...p, [macroName]: !p[macroName] }));
  };

  const handleSimulateGovernance = () => {
    if (!canModify) return;
    const newRows = rows.map(row => {
      const budget = parseFloat(row.presupuestoCop) || 0;
      const simulatedVpn = Math.floor(budget * (1.2 + Math.random() * 0.5)); // Simulated VPN > Budget
      
      return {
        ...row,
        categoria: row.categoria || 'CRECIMIENTO_EBITDA',
        businessCase: {
          ...row.businessCase,
          indicadores: {
            ...row.businessCase.indicadores,
            vpn: simulatedVpn.toString()
          }
        },
        workflowP2: {
          techPlanning: { status: 'APROBADO', date: new Date().toISOString() },
          finance: { status: 'APROBADO', date: new Date().toISOString() },
          risk: { status: 'APROBADO', date: new Date().toISOString() }
        },
        estadoSoporte: 'APROBADO'
      } as ProjectRow;
    });
    onUpdateRows(newRows);
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-700 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div className="space-y-2">
          <h3 className={`text-3xl font-black tracking-tighter ${textColor}`}>2. Clasificación & Gobernanza Masiva</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            PREREQUISITO: VALIDACIÓN TECH <span className="mx-2 text-[#EF3340]">→</span> (FINANCIERA <span className="text-[#EF3340] underline">O</span> RIESGO)
          </p>
        </div>
        {canModify && rows.length > 0 && (
          <button 
            onClick={handleSimulateGovernance}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            <Zap size={16} className="text-yellow-300 animate-pulse" /> SIMULAR GOBERNANZA MASIVA
          </button>
        )}
      </div>

      <div className="space-y-6">
        {macroGroups.map((macro) => (
          <div key={macro.name} className={`rounded-[3.5rem] overflow-hidden border ${theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-[#f1f3f6] border-gray-100 shadow-sm'}`}>
            <div className="px-12 py-10 flex flex-col xl:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-10 flex-1">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border shadow-sm ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'}`}>
                  <Layers size={28} className="text-[#EF3340]" />
                </div>
                <div className="space-y-4">
                  <h4 className={`text-2xl font-black tracking-tighter ${textColor}`}>{macro.name}</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-black text-red-500 bg-red-100/50 px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-tighter">
                      <Target size={12} /> {macro.projectCount} INICIATIVAS
                    </span>
                    <span className="text-[9px] font-black text-[#EF3340] bg-red-100/50 px-4 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-tighter font-mono">
                      <Calculator size={12} /> CAPEX: {formatCurrency(macro.totalCop)}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleMacro(macro.name)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ml-2 border-2 ${expandedMacros[macro.name] ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-blue-400 text-blue-500 hover:bg-blue-50'}`}
              >
                {expandedMacros[macro.name] ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
              </button>
            </div>

            {expandedMacros[macro.name] && (
              <div className={`px-12 pb-14 animate-in slide-in-from-top-6 duration-500 ${theme === 'dark' ? 'bg-[#161b22]' : 'bg-white'}`}>
                <div className="pt-12 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Search size={14} className="text-[#EF3340]" /> Seleccionar iniciativa de este macro
                    </label>
                    <div className="relative max-w-2xl">
                      <select 
                        className="w-full appearance-none px-8 py-5 text-sm font-black rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#EF3340] transition-all cursor-pointer pr-12 uppercase"
                        value={selectedProjectInMacro[macro.name] ?? ""}
                        onChange={(e) => setSelectedProjectInMacro(prev => ({ ...prev, [macro.name]: Number(e.target.value) }))}
                      >
                        <option value="">ELIJA UNA INICIATIVA...</option>
                        {macro.projects.map((proj) => (
                          <option key={proj.data.idProyecto} value={proj.originalIdx}>
                            [{proj.data.idProyecto}] {proj.data.proyecto.toUpperCase()} {proj.data.estadoSoporte === 'APROBADO' ? '✓' : ''}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>

                  {selectedProjectInMacro[macro.name] !== undefined && selectedProjectInMacro[macro.name] !== null && (
                    (() => {
                      const projIdx = selectedProjectInMacro[macro.name]!;
                      const project = rows[projIdx];
                      const isSheetOpen = showTechnicalSheet[project.idProyecto];
                      const efficiencyIndex = (parseFloat(project.businessCase.indicadores.vpn) / (parseFloat(project.presupuestoCop) || 1)).toFixed(2);
                      const wf = project.workflowP2 || { techPlanning: { status: 'PENDIENTE' }, finance: { status: 'PENDIENTE' }, risk: { status: 'PENDIENTE' } };
                      const isTechApproved = wf.techPlanning.status === 'APROBADO';

                      return (
                        <div className="animate-in fade-in zoom-in-98 duration-300 space-y-12">
                          {/* FICHA TÉCNICA DETALLADA - PASO 1 CONSOLIDADO */}
                          <div className={`rounded-[3rem] border overflow-hidden transition-all duration-500 ${isSheetOpen ? 'ring-8 ring-blue-500/5 shadow-2xl scale-[1.01]' : 'hover:border-blue-200'}`}>
                            <button 
                              onClick={() => toggleTechnicalSheet(project.idProyecto)}
                              className={`w-full flex items-center justify-between px-10 py-8 transition-all ${isSheetOpen ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'}`}
                            >
                              <div className="flex items-center gap-6">
                                <div className={`p-3 rounded-2xl ${isSheetOpen ? 'bg-white/20' : 'bg-white shadow-sm text-blue-500'}`}>
                                   <FileSearch size={24} />
                                </div>
                                <div className="text-left">
                                  <span className="text-[11px] font-black uppercase tracking-[0.2em] block">Ver Ficha Técnica Detallada (Paso 1)</span>
                                  <span className={`text-[9px] font-bold uppercase opacity-60 ${isSheetOpen ? 'text-white' : 'text-gray-400'}`}>Haga clic para expandir toda la información de registro</span>
                                </div>
                              </div>
                              <div className={`transition-transform duration-500 ${isSheetOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={24} />
                              </div>
                            </button>

                            {isSheetOpen && (
                              <div className="p-12 bg-white space-y-12 animate-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                  {/* Columna 1: Estructura */}
                                  <div className="space-y-8">
                                     <SectionHeader icon={<LayoutDashboard size={16}/>} label="Estructura del Proyecto" />
                                     <div className="space-y-6">
                                        <DataPoint label="ID Proyecto" value={project.idProyecto} icon={<Briefcase size={12}/>} isMono />
                                        <DataPoint label="Macroproyecto" value={project.macroproyecto} />
                                        <DataPoint label="Nombre Iniciativa" value={project.nombreIniciativa} />
                                        <DataPoint label="Vigencia / Año" value={project.ano || '2027'} icon={<Calendar size={12}/>} />
                                     </div>
                                  </div>
                                  
                                  {/* Columna 2: Gobernanza */}
                                  <div className="space-y-8">
                                     <SectionHeader icon={<User size={16}/>} label="Gobernanza & Responsables" />
                                     <div className="space-y-6">
                                        <DataPoint label="Director Corporativo" value={project.directorCorporativo} />
                                        <DataPoint label="Director de Área" value={project.director} />
                                        <DataPoint label="Gerente Líder" value={project.gerente} />
                                        <DataPoint label="Responsable Beneficio" value={project.responsableBeneficio} />
                                     </div>
                                  </div>

                                  {/* Columna 3: Finanzas & Estrategia */}
                                  <div className="space-y-8">
                                     <SectionHeader icon={<TrendingUp size={16}/>} label="Finanzas & Estrategia P1" />
                                     <div className="space-y-6">
                                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                                           <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Presupuesto COP</p>
                                           <p className="text-xl font-black text-red-600 tracking-tighter">{formatCurrency(project.presupuestoCop)}</p>
                                        </div>
                                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                                           <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Presupuesto USD (4.217)</p>
                                           <p className="text-xl font-black text-blue-600 tracking-tighter">{formatUSD(parseFloat(project.presupuestoCop) / 4217)}</p>
                                        </div>
                                        <DataPoint label="KPI Estratégico" value={project.businessCase?.contribucionKPIs || 'POR DEFINIR'} icon={<Target size={12}/>} color="text-emerald-600" />
                                        <div className="flex items-center gap-2">
                                           <ListChecks size={14} className="text-gray-400" />
                                           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{project.items?.length || 0} Ítems Presupuestales registrados</span>
                                        </div>
                                     </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-100 pt-10">
                                   <div className="space-y-4">
                                      <SectionHeader icon={<FileText size={16}/>} label="Descripción Técnica (Alcance)" />
                                      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                         <p className="text-[12px] font-medium text-gray-500 leading-relaxed italic">"{project.descripcionBreve}"</p>
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      <SectionHeader icon={<AlertTriangle size={16}/>} label="Evaluación de Riesgo Técnico (P1)" />
                                      <div className="grid grid-cols-2 gap-6">
                                         <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Probabilidad %</p>
                                            <p className="text-lg font-black text-gray-800">{project.probabilidadRiesgo || 0}%</p>
                                         </div>
                                         <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Impacto USD</p>
                                            <p className="text-lg font-black text-gray-800">{formatUSD(project.impactoRiesgo || 0)}</p>
                                         </div>
                                         <div className="col-span-full p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                            <div className="flex justify-between items-center">
                                              <span className="text-[10px] font-black text-amber-600 uppercase">Valor Esperado Riesgo:</span>
                                              <span className="text-lg font-black text-amber-700">{formatUSD((project.impactoRiesgo || 0) * ((project.probabilidadRiesgo || 0) / 100))}</span>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* PIPELINE DE GOBERNANZA CON PREREQUISITO */}
                          <div className="p-10 rounded-[3.5rem] bg-gray-50 border border-gray-100">
                             <div className="flex flex-col md:flex-row items-center gap-6 justify-between px-8">
                                <GovernanceStep 
                                  icon={<Cpu size={20} />} 
                                  label="Planeación Tech" 
                                  desc="Gatekeeper Inicial"
                                  status={wf.techPlanning.status}
                                  canApprove={true} 
                                  onApprove={() => handleUpdateWorkflow(projIdx, 'techPlanning', 'APROBADO')}
                                />
                                
                                <div className="hidden md:flex flex-col items-center">
                                   <ArrowRight className={`transition-colors ${isTechApproved ? 'text-emerald-500' : 'text-gray-300'}`} size={24} />
                                   <span className="text-[8px] font-black text-gray-400 mt-1 uppercase">PREREQUISITO</span>
                                </div>

                                <div className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-4 p-6 rounded-[2.5rem] border border-dashed transition-all ${isTechApproved ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-50'}`}>
                                  <GovernanceStep 
                                    icon={<Coins size={20} />} 
                                    label="Financiera" 
                                    desc="Revisión VPN"
                                    status={wf.finance.status}
                                    canApprove={isTechApproved}
                                    onApprove={() => handleUpdateWorkflow(projIdx, 'finance', 'APROBADO')}
                                  />
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#EF3340] border border-red-100 flex items-center justify-center text-[11px] font-black">O</div>
                                  </div>
                                  <GovernanceStep 
                                    icon={<ShieldCheck size={20} />} 
                                    label="Riesgo" 
                                    desc="Auditoría Riesgo"
                                    status={wf.risk.status}
                                    canApprove={isTechApproved}
                                    onApprove={() => handleUpdateWorkflow(projIdx, 'risk', 'APROBADO')}
                                  />
                                </div>
                             </div>
                             {!isTechApproved && (
                               <div className="mt-6 text-center animate-pulse">
                                  <p className="text-[10px] font-black text-[#EF3340] uppercase tracking-widest flex items-center justify-center gap-2">
                                     <ShieldAlert size={14} /> Debe aprobar Planeación Tech para habilitar Financiera o Riesgo
                                  </p>
                               </div>
                             )}
                          </div>

                          <div className={`p-12 rounded-[3.5rem] border border-red-100 bg-white shadow-2xl shadow-black/5`}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                              <div className="lg:col-span-5 space-y-6">
                                <h5 className={`text-xl font-black tracking-tight leading-none ${textColor}`}>{project.proyecto}</h5>
                                <p className="text-[12px] text-gray-400 font-bold italic">ESTADO: <span className={project.estadoSoporte === 'APROBADO' ? 'text-emerald-500 font-black' : 'text-orange-500'}>{project.estadoSoporte || 'PENDIENTE'}</span></p>
                                <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                                   <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm"><Info size={20} /></div>
                                   <p className="text-[10px] font-bold text-blue-800 leading-tight">La aprobación global requiere el aval de Tech y al menos uno de los validadores transversales (Financiera o Riesgo).</p>
                                </div>
                              </div>
                              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clasificación Estratégica *</label>
                                  <select disabled={!canModify} value={project.categoria || ''} onChange={(e) => handleUpdateCategory(projIdx, e.target.value)} className="w-full px-6 py-4 text-xs font-black rounded-2xl border border-gray-100 bg-white shadow-sm outline-none">
                                    <option value="">SELECCIONE...</option>
                                    {CATEGORIAS_ESTRATEGICAS.map(cat => (
                                      <option key={cat.id} value={cat.id}>{cat.label.toUpperCase()}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" /> VPN Validación</label>
                                  <input type="number" value={project.businessCase.indicadores.vpn || ''} onChange={(e) => handleUpdateVPN(projIdx, e.target.value)} className="w-full px-6 py-4 text-xs font-black rounded-2xl border border-emerald-100 bg-white shadow-sm outline-none" />
                                </div>
                              </div>
                              <div className="lg:col-span-12 flex justify-end gap-5 pt-8 border-t border-gray-50 mt-4">
                                 <button onClick={() => handleReturnProject(projIdx)} className="flex items-center gap-3 px-10 py-4 rounded-2xl text-[11px] font-black text-orange-500 bg-white border border-orange-100 active:scale-95 transition-all">
                                   <Undo2 size={18} /> DEVOLVER A IDENTIFICACIÓN
                                 </button>
                                 <button 
                                   onClick={() => { if(project.estadoSoporte === 'APROBADO') onNextStep(); }}
                                   disabled={project.estadoSoporte !== 'APROBADO'}
                                   className={`px-10 py-4 rounded-2xl text-[11px] font-black border flex items-center gap-3 transition-all active:scale-95 ${
                                      project.estadoSoporte === 'APROBADO' 
                                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-500/20 hover:bg-emerald-700' 
                                      : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                   }`}
                                 >
                                    {project.estadoSoporte === 'APROBADO' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                                    {project.estadoSoporte === 'APROBADO' ? 'GOBERNANZA COMPLETADA - IR AL PASO 3' : 'ESPERANDO FIRMAS (TECH + O)'}
                                 </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
    <div className="text-blue-500">{icon}</div>
    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const DataPoint = ({ label, value, icon, isMono, color }: { label: string, value: string, icon?: React.ReactNode, isMono?: boolean, color?: string }) => (
  <div className="space-y-1.5">
     <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
       {icon} {label}
     </p>
     <p className={`text-[12px] font-bold ${isMono ? 'font-mono' : ''} ${color || 'text-gray-700'} break-words uppercase`}>
       {value || 'NO SUMINISTRADO'}
     </p>
  </div>
);

const GovernanceStep = ({ icon, label, desc, status, onApprove, canApprove }: any) => {
  const isApproved = status === 'APROBADO';
  return (
    <div className={`flex-1 flex flex-col items-center text-center space-y-3 transition-all duration-500 ${!canApprove && !isApproved ? 'opacity-30' : 'opacity-100'}`}>
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isApproved ? 'bg-emerald-500 text-white shadow-xl rotate-[360deg]' : 'bg-white text-gray-400 border border-gray-200 shadow-sm'}`}>
          {isApproved ? <CheckCircle2 size={24} /> : icon}
       </div>
       <div>
          <p className={`text-[11px] font-black uppercase tracking-tight ${isApproved ? 'text-emerald-600' : 'text-gray-800'}`}>{label}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{desc}</p>
       </div>
       {!isApproved ? (
         <button 
           onClick={onApprove} 
           disabled={!canApprove} 
           className={`mt-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${canApprove ? 'bg-[#0b0e14] text-white hover:bg-emerald-600 hover:scale-105 active:scale-95 shadow-md' : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'}`}
         >
           {canApprove ? 'APROBAR FASE' : 'ESPERANDO TECH'}
         </button>
       ) : (
         <div className="mt-2 text-[9px] font-black text-emerald-500 flex items-center gap-1.5 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
            <ShieldCheck size={12} /> VALIDADO
         </div>
       )}
    </div>
  );
};

export default Step2Clasificacion;