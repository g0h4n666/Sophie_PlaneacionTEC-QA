
import React, { useState, useMemo } from 'react';
import { TechTrend, BusinessCaseStatus } from '../types';
import { 
  Eye, Plus, Search, TrendingUp, Zap, CheckCircle2, XCircle, Activity,
  AlertCircle, ChevronRight, ShieldCheck, Brain, Wifi, X, Save,
  Trash2, Cpu, Database, Pencil, Lightbulb, BarChart3, SearchCode,
  ArrowRight, History, MessageSquare, Send, Check, AlertTriangle
} from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
}

const TechWatch: React.FC<Props> = ({ theme }) => {
  const [trends, setTrends] = useState<TechTrend[]>([
    { 
      id: '1', 
      name: 'Automatización SOC con IA', 
      description: 'Optimización de respuesta ante incidentes de ciberseguridad mediante modelos predictivos.', 
      quarter: 'Q1-2026', 
      category: 'CIBERSEGURIDAD', 
      impact: 'ALTO', 
      decision: 'ACCIONAR',
      status: 'REVISION_TECNICA',
      leader: 'Roberto Gómez',
      categorization: 'Convertir Amenaza en Oportunidad',
      probability: 'Alta',
      contextTrigger: 'La organización dedica personas para atender incidentes de seguridad, lo que implica tiempo y análisis humano. Se pueden lograr mejoras en los tiempos de respuesta mediante IA.',
      businessImpact: {
        quantifiable: 'Reducción MTTD 70%; Reducción MTTR 60%; Automatización 90% alertas N1.',
        strategic: 'Continuidad de negocio y ventaja competitiva.'
      },
      strategicRecommendation: {
        roadmap: 'Roadmap en 3 fases (18 meses).',
        criticalConsiderations: 'Gobernanza y cambio cultural.',
        kpis: 'Ahorro operativo y mejora en SLA.',
        vendors: 'Microsoft Sentinel, Splunk.',
        technicalDetails: 'Uso de IaC, GitOps y FinOps.'
      },
      supportData: {
        internal: 'Histórico de incidentes, Operacionales SOC.',
        external: 'Threat Intelligence, Casos de éxito.'
      }
    }
  ]);

  const [activeQuarter, setActiveQuarter] = useState('Q1-2026');
  const [showModal, setShowModal] = useState(false);
  const [editingTrend, setEditingTrend] = useState<TechTrend | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Horizonte temporal extendido desde 2026
  const quarters = [
    'Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026',
    'Q1-2027', 'Q2-2027', 'Q3-2027', 'Q4-2027'
  ];

  const filteredTrends = useMemo(() => {
    return trends.filter(t => 
      t.quarter === activeQuarter && 
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [trends, activeQuarter, searchQuery]);

  const handleOpenModal = (trend?: TechTrend) => {
    if (trend) {
      setEditingTrend(trend);
    } else {
      setEditingTrend({
        id: Math.random().toString(36).substr(2, 9),
        name: '', description: '', quarter: activeQuarter, category: 'IA', impact: 'MEDIO', decision: 'MONITOREAR', status: 'BORRADOR',
        contextTrigger: '', probability: '', leader: '', categorization: '',
        businessImpact: { quantifiable: '', strategic: '' },
        strategicRecommendation: { roadmap: '', criticalConsiderations: '', kpis: '', vendors: '', technicalDetails: '' },
        supportData: { internal: '', external: '' }
      } as TechTrend);
    }
    setShowModal(true);
  };

  const handleSave = (trend: TechTrend) => {
    setTrends(prev => {
      const exists = prev.find(t => t.id === trend.id);
      if (exists) return prev.map(t => t.id === trend.id ? trend : t);
      return [...prev, trend];
    });
    setShowModal(false);
  };

  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EF3340]/10 flex items-center justify-center text-[#EF3340]">
              <Eye size={22} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EF3340]">Workflow de Inversión</span>
          </div>
          <h2 className={`text-4xl font-black mb-2 tracking-tighter ${textColor}`}>Vigilancia Tecnológica</h2>
          <p className="text-sm font-medium text-gray-400 max-w-xl">
            Promueva tendencias a Casos de Negocio aprobados. Comenzando análisis desde el ciclo 2026.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#EF3340] hover:bg-[#D62E39] text-white text-[11px] font-black px-12 py-5 rounded-2xl transition-all shadow-xl flex items-center gap-4 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          NUEVA TENDENCIA
        </button>
      </div>

      <div className={`p-10 border rounded-[3.5rem] transition-all relative overflow-hidden ${cardBg}`}>
        <div className="flex flex-col md:flex-row gap-8 justify-between items-center mb-16 relative z-10 overflow-x-auto">
          <div className="flex gap-2 p-1.5 bg-gray-100/50 backdrop-blur-md rounded-2xl border border-gray-200 shrink-0">
            {quarters.map(q => (
              <button
                key={q}
                onClick={() => setActiveQuarter(q)}
                className={`px-6 py-3 text-[9px] font-black rounded-xl transition-all whitespace-nowrap ${
                  activeQuarter === q ? 'bg-white text-[#EF3340] shadow-xl shadow-black/5' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar tendencia..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-16 pr-8 py-5 text-xs font-bold rounded-2xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-white border-gray-100'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredTrends.map(trend => (
            <TrendCard 
              key={trend.id} 
              theme={theme} 
              trend={trend} 
              onEdit={() => handleOpenModal(trend)} 
            />
          ))}
          {filteredTrends.length === 0 && (
            <div className="lg:col-span-2 py-32 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Search size={32} />
               </div>
               <p className="text-gray-400 font-bold italic">No se encontraron tendencias para {activeQuarter}.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && editingTrend && (
        <BusinessCaseModal 
          theme={theme} 
          trend={editingTrend} 
          onClose={() => setShowModal(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

// Reutilizamos BusinessCaseModal y StrategyBlock que ya están definidos en el archivo original...
// (Se asume que el resto del archivo se mantiene igual para conservar la lógica de modales)

const StrategyBlock: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  theme: string; 
  children: React.ReactNode; 
  bgColor?: string;
  required?: boolean;
  completed?: boolean;
}> = ({ title, icon, theme, children, bgColor, required, completed }) => (
  <div className={`p-8 rounded-[3rem] border flex flex-col transition-all hover:shadow-xl group relative overflow-hidden ${
    completed ? 'border-emerald-100' : 'border-gray-100'
  } ${bgColor || (theme === 'dark' ? 'bg-[#1a1f26]' : 'bg-white shadow-sm')}`}>
    
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-inherit">
      <div className="flex items-center gap-4">
        <div className="text-[#EF3340]">{icon}</div>
        <h4 className="text-[14px] font-black text-gray-800 tracking-tight">{title}</h4>
      </div>
      {required && (
        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
          completed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'
        }`}>
          {completed ? 'COMPLETADO' : 'OBLIGATORIO'}
        </div>
      )}
    </div>
    
    <div className="flex-1 relative z-10">
      {children}
    </div>

    {completed && (
      <div className="absolute -bottom-4 -right-4 text-emerald-500/10 rotate-12 group-hover:scale-125 transition-transform duration-500">
        <CheckCircle2 size={120} />
      </div>
    )}
  </div>
);

const BusinessCaseModal: React.FC<{ theme: 'light' | 'dark'; trend: TechTrend; onClose: () => void; onSave: (t: TechTrend) => void }> = ({ theme, trend, onClose, onSave }) => {
  const [data, setData] = useState<TechTrend>(trend);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#0f1219]' : 'bg-white';

  const statuses: { key: BusinessCaseStatus; label: string }[] = [
    { key: 'BORRADOR', label: 'Borrador' },
    { key: 'REVISION_TECNICA', label: 'Rev. Técnica' },
    { key: 'EVALUACION_FINANCIERA', label: 'Finanzas' },
    { key: 'COMITE_DIRECTIVO', label: 'Dir. Técnico' },
    { key: 'APROBADO', label: 'Comité Central' }
  ];

  const leaders = ['Roberto Gómez', 'Ana Maria Silva', 'Carlos Ruiz', 'Beatriz Castrillón', 'Luis Fernando Ortiz'];
  const categorizations = [
    'Convertir Amenaza en Oportunidad',
    'Eficiencia Operativa (Cost-Out)',
    'Crecimiento de Mercado / Nuevo Revenue',
    'Mitigación de Riesgos de Infraestructura',
    'Innovación Disruptiva / Core 2030'
  ];

  const isFormComplete = () => {
    return (
      data.name && data.leader && data.categorization && data.probability &&
      data.contextTrigger && data.businessImpact.quantifiable && 
      data.businessImpact.strategic && data.strategicRecommendation.roadmap &&
      data.strategicRecommendation.technicalDetails && data.supportData.internal
    );
  };

  const handlePromote = () => {
    if (!isFormComplete()) {
      setValidationError("⚠️ No se puede avanzar: Complete todos los campos del Caso de Negocio.");
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    const nextStatus: Record<BusinessCaseStatus, BusinessCaseStatus> = {
      'BORRADOR': 'REVISION_TECNICA',
      'REVISION_TECNICA': 'EVALUACION_FINANCIERA',
      'EVALUACION_FINANCIERA': 'COMITE_DIRECTIVO',
      'COMITE_DIRECTIVO': 'APROBADO',
      'APROBADO': 'APROBADO',
      'RECHAZADO': 'BORRADOR'
    };
    setData({...data, status: nextStatus[data.status]});
  };

  const getCurrentStatusIndex = () => statuses.findIndex(s => s.key === data.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`w-full max-w-[95vw] h-[95vh] rounded-[4rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden ${cardBg}`}>
        {/* Header Workflow */}
        <div className="p-8 border-b border-inherit bg-gray-50/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#EF3340] text-white rounded-[2rem] flex items-center justify-center shadow-lg">
              <Lightbulb size={32} />
            </div>
            <div>
              <h3 className={`text-2xl font-black tracking-tighter ${textColor}`}>Caso de Negocio: {data.name || 'Nueva Tendencia'}</h3>
              <p className="text-[10px] font-black text-[#EF3340] uppercase tracking-[0.3em]">Protocolo de Aprobación Corporativa</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center max-w-2xl px-10">
            {statuses.map((s, idx) => {
              const isActive = idx <= getCurrentStatusIndex();
              const isCurrent = idx === getCurrentStatusIndex();
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center gap-2 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-[#EF3340] text-white' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-8 ring-red-500/10 scale-110' : ''}`}>
                      {isActive ? <Check size={20} strokeWidth={3} /> : <span className="text-[12px] font-black">{idx + 1}</span>}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter absolute top-12 whitespace-nowrap ${isActive ? 'text-[#EF3340]' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < statuses.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full ${idx < getCurrentStatusIndex() ? 'bg-[#EF3340]' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <button onClick={onClose} className="p-4 hover:bg-red-50 rounded-full text-gray-400 transition-all"><X size={32} /></button>
        </div>

        {/* Form Body - 4 Cuadrantes */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-inherit">
          {/* Fila superior: Selectores obligatorios */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-100">
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Variable / Tecnología</label>
                <input 
                  value={data.name} 
                  onChange={e => setData({...data, name: e.target.value})}
                  placeholder="Nombre de la tecnología"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 font-black text-xs"
                />
             </div>
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Líder Responsable</label>
                <select 
                  value={data.leader} 
                  onChange={e => setData({...data, leader: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 font-black text-xs"
                >
                  <option value="">Seleccione Líder...</option>
                  {leaders.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
             </div>
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Categorización</label>
                <select 
                  value={data.categorization} 
                  onChange={e => setData({...data, categorization: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 font-black text-xs"
                >
                  <option value="">Seleccione Categoría...</option>
                  {categorizations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2 text-center">Probabilidad Ocurrencia</label>
                <div className="flex gap-2">
                  {['Alta', 'Media', 'Baja'].map(p => (
                    <button
                      key={p}
                      onClick={() => setData({...data, probability: p as any})}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${
                        data.probability === p 
                        ? 'bg-[#EF3340] border-[#EF3340] text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <StrategyBlock 
              title="Contexto (Trigger) – Supuesto / Hipótesis" 
              icon={<Eye size={22} />} 
              theme={theme}
              required
              completed={!!data.contextTrigger}
            >
              <textarea 
                value={data.contextTrigger}
                onChange={e => setData({...data, contextTrigger: e.target.value})}
                className="w-full h-48 bg-transparent border-none outline-none resize-none text-[13px] leading-relaxed text-gray-600 font-medium p-4"
                placeholder="Actualmente la organización dedica personas para atender eventos e incidentes de seguridad..."
              />
            </StrategyBlock>

            <StrategyBlock 
              title="Impacto en el Negocio" 
              icon={<BarChart3 size={22} />} 
              theme={theme}
              required
              completed={!!data.businessImpact.quantifiable && !!data.businessImpact.strategic}
            >
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-[#EF3340] uppercase mb-2 block tracking-widest">• Impactos cuantificables:</label>
                  <textarea 
                    value={data.businessImpact.quantifiable}
                    onChange={e => setData({...data, businessImpact: {...data.businessImpact, quantifiable: e.target.value}})}
                    className="w-full h-20 bg-gray-50/50 rounded-2xl border border-gray-50 outline-none resize-none text-[12px] p-4"
                    placeholder="Reducción MTTR 60%..."
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#EF3340] uppercase mb-2 block tracking-widest">• Impactos estratégicos:</label>
                  <textarea 
                    value={data.businessImpact.strategic}
                    onChange={e => setData({...data, businessImpact: {...data.businessImpact, strategic: e.target.value}})}
                    className="w-full h-20 bg-gray-50/50 rounded-2xl border border-gray-50 outline-none resize-none text-[12px] p-4"
                    placeholder="Continuidad, reputación..."
                  />
                </div>
              </div>
            </StrategyBlock>
          </div>
        </div>

        <div className="p-8 border-t border-inherit flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 bg-inherit">
          <div className="flex gap-4">
            <button 
              onClick={() => onSave(data)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 text-gray-500 text-[11px] font-black hover:bg-gray-50 transition-all active:scale-95"
            >
              <Save size={18} /> GUARDAR BORRADOR
            </button>
            <button 
              onClick={handlePromote}
              className={`px-10 py-4 rounded-2xl text-[11px] font-black shadow-lg flex items-center gap-3 active:scale-95 transition-all ${
                isFormComplete() 
                ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Send size={18} /> PROMOVER A SIGUIENTE FASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendCard: React.FC<{ theme: string; trend: TechTrend; onEdit: () => void }> = ({ theme, trend, onEdit }) => {
  const isDark = theme === 'dark';
  const statusConfig: Record<BusinessCaseStatus, { label: string; color: string; bg: string }> = {
    'BORRADOR': { label: 'Borrador Iniciado', color: 'text-gray-400', bg: 'bg-gray-100' },
    'REVISION_TECNICA': { label: 'Revisión Técnica', color: 'text-blue-500', bg: 'bg-blue-50' },
    'EVALUACION_FINANCIERA': { label: 'Evaluación Finanzas', color: 'text-purple-500', bg: 'bg-purple-50' },
    'COMITE_DIRECTIVO': { label: 'Puesto Comité Dir.', color: 'text-orange-500', bg: 'bg-orange-50' },
    'APROBADO': { label: 'Inversión Aprobada', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    'RECHAZADO': { label: 'Rechazado / Descartado', color: 'text-red-500', bg: 'bg-red-50' }
  };

  const st = statusConfig[trend.status];

  return (
    <div className={`p-10 rounded-[3.5rem] border transition-all group relative overflow-hidden ${isDark ? 'bg-[#161b22] border-white/5' : 'bg-white border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2'}`}>
      <div className="flex justify-between items-start mb-10">
        <div className="flex flex-col gap-2">
          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${st.bg} ${st.color}`}>
            {st.label}
          </span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{trend.category}</span>
        </div>
        <button onClick={onEdit} className="p-3 text-gray-300 hover:text-[#EF3340] bg-gray-50 rounded-xl transition-all"><ArrowRight size={22} /></button>
      </div>

      <h3 className={`text-2xl font-black mb-4 tracking-tight leading-tight group-hover:text-[#EF3340] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{trend.name}</h3>
      <p className="text-gray-400 text-[13px] font-medium leading-relaxed mb-8 h-10 overflow-hidden line-clamp-2">{trend.description}</p>

      <div className="flex items-center justify-between pt-8 border-t border-inherit">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-[#EF3340] shadow-sm">
            {trend.leader ? trend.leader[0] : 'U'}
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Líder del Caso</p>
            <p className="text-[11px] font-black text-gray-700">{trend.leader || 'Sin asignar'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Impacto Previsto</p>
          <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-widest ${
            trend.impact === 'ALTO' ? 'text-red-500 bg-red-50 border-red-100' : 'text-gray-400 bg-gray-50 border-gray-100'
          }`}>
            {trend.impact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechWatch;
