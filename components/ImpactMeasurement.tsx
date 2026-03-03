
import React, { useState, useMemo } from 'react';
import { 
  Target, 
  BarChart3, 
  Activity, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Search, 
  ChevronRight, 
  Zap, 
  FileText, 
  ShieldCheck,
  Settings2,
  PieChart,
  ArrowRight,
  ClipboardList,
  Flame,
  ArrowUpRight,
  /* Added Calculator icon to solve 'Cannot find name' error */
  Calculator
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface Props {
  theme: 'light' | 'dark';
}

type ImpactStep = 1 | 2 | 3 | 4 | 5;

const ImpactMeasurement: React.FC<Props> = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState<ImpactStep>(1);
  const [selectedMacro, setSelectedMacro] = useState<string>('ENERGÍA 2026');
  const [selectedProject, setSelectedProject] = useState<string>('Baterías Estación Suba');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9';

  const steps = [
    { id: 1, label: 'Identificar Beneficios', icon: <Target size={18} />, color: 'bg-emerald-500' },
    { id: 2, label: 'Cuantificar Beneficios', icon: <Calculator size={18} />, color: 'bg-blue-500' },
    { id: 3, label: 'Supervisión de Impacto', icon: <Activity size={18} />, color: 'bg-red-500' },
    { id: 4, label: 'Mejora Continua', icon: <Zap size={18} />, color: 'bg-purple-500' },
    { id: 5, label: 'Reajuste Estratégico', icon: <Settings2 size={18} />, color: 'bg-amber-500' },
  ];

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val);
  };

  const performanceData = [
    { month: 'ENE', proyectado: 100, real: 95 },
    { month: 'FEB', proyectado: 110, real: 105 },
    { month: 'MAR', proyectado: 130, real: 135 },
    { month: 'ABR', proyectado: 150, real: 142 },
    { month: 'MAY', proyectado: 170, real: 168 },
    { month: 'JUN', proyectado: 200, real: 195 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      {/* HEADER DE CONTROL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">Gobierno de Impacto Activo</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">• Auditoría de Beneficios Comprometidos</span>
          </div>
          <h2 className={`text-5xl font-black tracking-tighter ${textColor}`}>Medición de Impacto CAPEX</h2>
          <p className="text-sm font-medium text-gray-500 max-w-2xl mt-2">
            Asegurar que el capital desplegado entregue los beneficios esperados e informar la futura asignación de capital mediante un ciclo cerrado de retroalimentación.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
           <div className="px-6 py-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Macroproyecto</p>
              <select className="bg-transparent text-[11px] font-black outline-none cursor-pointer" value={selectedMacro} onChange={e => setSelectedMacro(e.target.value)}>
                <option>ENERGÍA 2026</option>
                <option>5G 2026</option>
                <option>FIBRA REGIONAL 2026</option>
              </select>
           </div>
           <div className="w-[1px] h-8 bg-gray-200"></div>
           <div className="px-6 py-2">
              <p className="text-[9px] font-black text-gray-400 uppercase">Proyecto</p>
              <select className="bg-transparent text-[11px] font-black outline-none cursor-pointer" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                <option>Baterías Estación Suba</option>
                <option>Core Network Expansion</option>
                <option>Green Power Initiative</option>
              </select>
           </div>
        </div>
      </div>

      {/* SELECTOR DE FASE DE IMPACTO */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map(step => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id as ImpactStep)}
            className={`p-6 rounded-[2.5rem] border transition-all flex flex-col items-start gap-4 relative overflow-hidden group ${
              currentStep === step.id 
                ? 'bg-white border-[#EF3340] shadow-xl ring-2 ring-red-50' 
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${step.color} transition-transform group-hover:scale-110`}>
              {step.icon}
            </div>
            <div>
              <p className={`text-[9px] font-black uppercase tracking-widest ${currentStep === step.id ? 'text-[#EF3340]' : 'text-gray-400'}`}>FASE {step.id}</p>
              <p className={`text-[12px] font-black leading-tight ${currentStep === step.id ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
            </div>
            {currentStep === step.id && <div className="absolute top-0 right-0 p-4"><CheckCircle2 className="text-[#EF3340]" size={16} /></div>}
          </button>
        ))}
      </div>

      {/* CONTENIDO POR FASE */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        
        {/* FASE 1: IDENTIFICAR BENEFICIOS */}
        {currentStep === 1 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <ImpactFormSection theme={theme} title="Identificación de Beneficios Capex/Metas" icon={<ClipboardList size={20} />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Descripción del Beneficio Principal" placeholder="Ej. Aumento de autonomía de red en 20%..." />
                    <InputField label="Hitos de Evaluación" placeholder="Mes 3, Mes 6, Mes 12..." />
                    <div className="col-span-full">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Alineación Estratégica (PE)</label>
                       <textarea className="w-full p-5 rounded-2xl border border-gray-100 text-xs font-bold h-24 focus:border-emerald-400 outline-none transition-all" placeholder="Verifique la información según la alineación estratégica..." />
                    </div>
                  </div>
                </ImpactFormSection>

                <div className={`p-8 rounded-[3rem] border bg-emerald-50/20 border-emerald-100 flex items-center gap-6`}>
                   <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <ShieldCheck size={24} />
                   </div>
                   <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                     <span className="font-black">Política FIN/PT:</span> Identificar beneficios en términos de CapEx/Metas y definir los hitos para evaluar el progreso del proyecto en Artefacto y Canvas.
                   </p>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                 <div className={`p-10 rounded-[3.5rem] border ${cardBg} h-full`}>
                    <h4 className="text-lg font-black text-gray-900 tracking-tight mb-8">Checklist de Identificación</h4>
                    <div className="space-y-6">
                       <CheckItem label="Beneficios identificados en Artefacto" checked />
                       <CheckItem label="Metas definidas en Canvas" checked />
                       <CheckItem label="Hitos de progreso establecidos" />
                       <CheckItem label="Verificación de alineación PE" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* FASE 2: CUANTIFICAR BENEFICIOS */}
        {currentStep === 2 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <KPIEntryCard label="Reducción OPEX" unit="M COP" projected={1200.5} />
               <KPIEntryCard label="Incremento ARPU" unit="%" projected={2.4} />
               <KPIEntryCard label="Disponibilidad" unit="%" projected={99.98} />
            </div>

            <ImpactFormSection theme={theme} title="Definición de KPIs Cuantificables (AS)" icon={<BarChart3 size={20} />}>
               <div className="overflow-x-auto rounded-[2rem] border border-gray-100">
                  <table className="w-full text-left text-[11px]">
                     <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest">
                        <tr>
                           <th className="px-8 py-6">Métrica de Éxito</th>
                           <th className="px-8 py-6">KPI Específico</th>
                           <th className="px-8 py-6 text-center">Frecuencia</th>
                           <th className="px-8 py-6 text-right">Target Meta</th>
                           <th className="px-8 py-6 text-center">Acciones</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 font-bold">
                        <tr>
                           <td className="px-8 py-6">Reducción de Fallas</td>
                           <td className="px-8 py-6 text-blue-600">Frecuencia MTTR</td>
                           <td className="px-8 py-6 text-center">Mensual</td>
                           <td className="px-8 py-6 text-right"> -15.2% </td>
                           <td className="px-8 py-6 text-center"><button className="text-gray-300 hover:text-red-500"><Settings2 size={16} /></button></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
               <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-[10px] font-bold text-blue-700">
                  <span className="font-black">Política FIN/PET:</span> Verifica la consistencia de los indicadores con objetivos cuantificables del negocio.
               </div>
            </ImpactFormSection>
          </div>
        )}

        {/* FASE 3: SUPERVISIÓN / EVALUACIÓN PERIÓDICA */}
        {currentStep === 3 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 p-10 rounded-[4rem] border bg-white shadow-xl">
                 <div className="flex justify-between items-start mb-12">
                    <div>
                       <h4 className="text-2xl font-black text-gray-900 tracking-tighter">Comparativo Beneficios (Real vs Proyectado)</h4>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Monitoreo de indicadores en el sistema (FIN/PT)</p>
                    </div>
                    <div className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                       <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-[9px] font-black">PROYECTADO</span></div>
                       <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[9px] font-black">REAL</span></div>
                    </div>
                 </div>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                          <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                          <Line type="monotone" dataKey="proyectado" stroke="#3B82F6" strokeWidth={4} dot={{r: 4}} />
                          <Line type="monotone" dataKey="real" stroke="#EF3340" strokeWidth={4} dot={{r: 4}} />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                 <div className={`p-8 rounded-[3rem] border ${cardBg}`}>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8">Análisis de Desviaciones (CC)</h4>
                    <div className="space-y-6">
                       <DeviationRow label="Desvío CAPEX" val={-4.2} type="warning" />
                       <DeviationRow label="Eficiencia Metas" val={+2.8} type="success" />
                       <DeviationRow label="Ahorro OPEX" val={-1.1} type="info" />
                    </div>
                 </div>
                 <div className={`p-8 rounded-[3rem] border bg-[#0b0e14] text-white`}>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Evaluación de Beneficios al Negocio</p>
                    <p className="text-xl font-bold italic leading-relaxed">
                      "Se observa un cumplimiento del 94.2% en los indicadores técnicos, con una ligera demora en la liberación de ahorro energético por trámites externos."
                    </p>
                    <div className="mt-6 flex justify-end">
                       <button className="text-[9px] font-black text-[#EF3340] uppercase tracking-widest flex items-center gap-2">FIRMAR REVISIÓN <ArrowRight size={14} /></button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* FASE 4: MEJORA CONTINUA */}
        {currentStep === 4 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ImpactFormSection theme={theme} title="Mitigación de Riesgos y Aprendizajes (AS)" icon={<Flame size={20} />}>
                 <div className="space-y-6">
                    <div className="p-6 rounded-[2.5rem] bg-purple-50 border border-purple-100 flex flex-col gap-4">
                       <h5 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">Aprendizaje Clave #1</h5>
                       <p className="text-xs font-bold text-gray-600">El dimensionamiento de equipos en estaciones rurales debe considerar el factor de humedad local para evitar sobrecostos de mantenimiento.</p>
                    </div>
                    <textarea className="w-full p-6 rounded-[2rem] border border-gray-100 outline-none text-xs font-bold focus:border-purple-400" placeholder="Ingrese nuevos aprendizajes clave para guiar proyectos futuros..." />
                    <button className="bg-purple-600 text-white text-[10px] font-black px-8 py-3 rounded-xl hover:bg-purple-700 transition-all uppercase tracking-widest">REGISTRAR APRENDIZAJE</button>
                 </div>
              </ImpactFormSection>

              <ImpactFormSection theme={theme} title="Plan de Mejora Continua (PT)" icon={<RefreshCw size={20} />}>
                 <div className="space-y-4">
                    <ImprovementPlanItem title="Optimización de Despliegue v2.0" owner="Daniela Orjuela" date="Q3 2026" status="Planning" />
                    <ImprovementPlanItem title="Reducción Logística Nodos" owner="Jorge Vargas" date="Q4 2026" status="Active" />
                    <div className="pt-6">
                       <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-purple-400 hover:text-purple-600 transition-all">+ Añadir Iniciativa de Mejora</button>
                    </div>
                 </div>
              </ImpactFormSection>
            </div>
          </div>
        )}

        {/* FASE 5: REAJUSTE DE ESTRATEGIA PRESUPUESTAL */}
        {currentStep === 5 && (
          <div className="space-y-10">
             <div className={`p-12 rounded-[4rem] border ${theme === 'dark' ? 'bg-[#0b0e14] border-amber-500/20 shadow-2xl' : 'bg-amber-50/5 border-amber-100 shadow-xl'}`}>
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-16 h-16 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                      <TrendingUp size={32} />
                   </div>
                   <div>
                      <h4 className={`text-2xl font-black tracking-tighter ${textColor}`}>Propuesta de Reajuste (PT)</h4>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Ajuste de CAPEX y Metas según hallazgos con áreas solicitantes</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CAPEX Actual</label>
                      <div className="p-6 bg-white rounded-3xl border border-gray-100 text-xl font-black text-gray-900">$ 4.520.000.000</div>
                   </div>
                   <div className="flex items-center justify-center pt-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><ArrowRight size={24} /></div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">CAPEX Reajustado (Target)</label>
                      <div className="relative group">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                         <input type="text" className="w-full pl-12 pr-6 py-6 bg-white rounded-3xl border border-amber-200 outline-none text-xl font-black text-[#EF3340] focus:ring-8 focus:ring-amber-50" placeholder="0.000.000" />
                      </div>
                   </div>
                </div>

                <div className="mt-12 space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Justificación Técnica del Reajuste</label>
                   <textarea className="w-full p-8 rounded-[3rem] border border-amber-100 bg-white/50 outline-none text-sm font-bold h-40 focus:border-amber-400" placeholder="Extraído de los hallazgos determinados con las áreas solicitantes..." />
                </div>

                <div className="mt-12 flex justify-end gap-6">
                   <button className="px-10 py-5 rounded-2xl text-[11px] font-black border border-gray-200 text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">Descartar</button>
                   <button className="px-16 py-5 rounded-2xl text-[11px] font-black bg-[#0b0e14] text-white shadow-2xl hover:bg-amber-600 transition-all uppercase tracking-widest flex items-center gap-3">
                      APLICAR REAJUSTE ESTRATÉGICO <ArrowUpRight size={18} />
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES INTERNOS
const ImpactFormSection = ({ title, icon, theme, children }: any) => (
  <div className={`p-10 rounded-[4rem] border ${theme === 'dark' ? 'bg-[#161b22] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className="flex items-center gap-4 mb-10 border-b border-inherit pb-6">
      <div className="w-12 h-12 bg-red-50 text-[#EF3340] rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">{icon}</div>
      <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    </div>
    {children}
  </div>
);

const InputField = ({ label, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <input className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-xs font-bold outline-none focus:border-emerald-400 transition-all shadow-inner" placeholder={placeholder} />
  </div>
);

const CheckItem = ({ label, checked }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white group">
     <span className={`text-[11px] font-bold ${checked ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>{label}</span>
     {checked ? <CheckCircle2 className="text-emerald-500" size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-200"></div>}
  </div>
);

const KPIEntryCard = ({ label, unit, projected }: any) => (
  <div className="p-8 rounded-[3rem] border border-gray-100 bg-white shadow-sm flex flex-col justify-between min-h-[160px] group transition-all hover:shadow-xl">
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-blue-600 tracking-tighter">{projected.toLocaleString('es-CO')}</h4>
        <span className="text-[10px] font-bold text-gray-400 uppercase">{unit}</span>
      </div>
    </div>
    <div className="pt-4 border-t border-gray-50">
       <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest"><TrendingUp size={12} /> Target Validado</div>
    </div>
  </div>
);

const DeviationRow = ({ label, val, type }: any) => {
  const colors = {
    success: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    warning: 'text-[#EF3340] bg-red-50 border-red-100',
    info: 'text-blue-600 bg-blue-50 border-blue-100'
  };
  return (
    <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${colors[type as keyof typeof colors]}`}>
       <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
       <span className="text-[14px] font-black">{val > 0 ? '+' : ''}{val}%</span>
    </div>
  );
};

const ImprovementPlanItem = ({ title, owner, date, status }: any) => (
  <div className="p-6 rounded-[2.5rem] border border-gray-100 bg-white flex items-center justify-between group hover:border-purple-200 transition-all shadow-sm">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center transition-all group-hover:bg-purple-600 group-hover:text-white">
           <Zap size={20} />
        </div>
        <div>
           <p className="text-[12px] font-black text-gray-900 tracking-tight">{title}</p>
           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{owner} • {date}</p>
        </div>
     </div>
     <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest">{status}</span>
  </div>
);

export default ImpactMeasurement;
