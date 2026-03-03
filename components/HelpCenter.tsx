
import React, { useState } from 'react';
import { 
  HelpCircle, 
  Target, 
  Lightbulb, 
  Search, 
  ChevronDown, 
  Zap, 
  TrendingUp, 
  Activity, 
  GanttChart, 
  Calculator, 
  Truck, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Compass, 
  ArrowRight,
  Info,
  Sparkles,
  ShieldAlert,
  Database,
  Users,
  Settings2,
  Binary,
  Layers,
  ArrowUpRight,
  PackageSearch,
  // Fix: Add missing Cpu icon import
  Cpu
} from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
}

const HelpCenter: React.FC<Props> = ({ theme }) => {
  const [activeTopic, setActiveTopic] = useState<string>('vision');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';

  const topics = [
    { id: 'vision', label: 'Visión & Propósito', icon: <Compass size={18} /> },
    { id: 'planning', label: 'Ciclo de Planeación', icon: <TrendingUp size={18} /> },
    { id: 'followup', label: 'Seguimiento & SAP', icon: <Activity size={18} /> },
    { id: 'impact', label: 'Medición de Valor', icon: <GanttChart size={18} /> },
    { id: 'tech', label: 'Radar de Innovación', icon: <Eye size={18} /> },
    { id: 'advanced', label: 'Ingeniería Financiera', icon: <Binary size={18} /> },
    { id: 'admin', label: 'Gobernanza & Admin', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      {/* Hero Header Didáctico */}
      <div className="relative p-12 rounded-[4rem] bg-[#0b0e14] overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
            <SofiaLogoLarge />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#EF3340]/10 rounded-full border border-[#EF3340]/20 mb-6">
            <Sparkles className="text-[#EF3340]" size={16} />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sofia Knowledge Hub</span>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter mb-6 leading-none">
            Manual de <br /> <span className="text-[#EF3340]">Inteligencia Inversora</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Entienda el ecosistema Sofia: Desde la vigilancia de tendencias tecnológicas hasta el seguimiento del flujo de caja real en SAP.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar de Navegación del Conocimiento */}
        <div className="lg:col-span-3 space-y-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-4">¿Qué desea aprender?</p>
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl transition-all border ${
                activeTopic === topic.id 
                ? 'bg-[#EF3340] border-[#EF3340] text-white shadow-xl shadow-red-500/20 translate-x-2' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                {topic.icon}
                <span className="text-[11px] font-black uppercase tracking-tight">{topic.label}</span>
              </div>
              {activeTopic === topic.id && <ArrowRight size={14} />}
            </button>
          ))}
        </div>

        {/* Contenedor de Contenido Didáctico */}
        <div className="lg:col-span-9">
          <div className={`p-16 rounded-[4rem] border ${cardBg} min-h-[700px] shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden`}>
            {activeTopic === 'vision' && <VisionSection theme={theme} />}
            {activeTopic === 'planning' && <PlanningSection theme={theme} />}
            {activeTopic === 'followup' && <FollowupSection theme={theme} />}
            {activeTopic === 'impact' && <ImpactSection theme={theme} />}
            {activeTopic === 'tech' && <TechSection theme={theme} />}
            {activeTopic === 'advanced' && <AdvancedSection theme={theme} />}
            {activeTopic === 'admin' && <AdminSection theme={theme} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SECCIONES DE AYUDA ESPECÍFICAS --- */

const VisionSection = ({ theme }: { theme: string }) => (
  <div className="space-y-12">
    <div className="max-w-2xl">
      <h3 className="text-4xl font-black tracking-tighter text-[#EF3340] mb-6">El Círculo Dorado de SOFIA</h3>
      <p className="text-xl text-gray-500 font-medium leading-relaxed">
        SOFIA es el acrónimo de <b>Sistema Orquestador Financiero con Inteligencia Artificial</b>. Nuestra misión es transformar la cultura de gasto en una cultura de inversión.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <GoldenCircleCard title="EL POR QUÉ" desc="Maximizar el valor de cada peso invertido en infraestructura para garantizar la sostenibilidad de Claro." icon={<Target />} color="red" />
      <GoldenCircleCard title="EL CÓMO" desc="Mediante una gobernanza rigurosa de 6 pasos que une la demanda técnica con la auditoría financiera IA." icon={<Layers />} color="blue" />
      <GoldenCircleCard title="EL QUÉ" desc="Una plataforma centralizada que integra planeación, ejecución y medición de impacto post-inversión." icon={<Zap />} color="amber" />
    </div>

    <div className="p-10 rounded-[3rem] bg-gray-900 text-white flex items-center gap-10">
       <div className="w-24 h-24 bg-[#EF3340] rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl">
          <BrainCircuitLarge />
       </div>
       <div>
         <h4 className="text-sm font-black text-[#EF3340] uppercase tracking-widest mb-2">El Cerebro Sofia AI</h4>
         <p className="text-gray-400 text-sm leading-relaxed">
           Sofia analiza sus Casos de Negocio detectando inconsistencias en el VPN y generando "Preguntas Asesinas" que el Comité Central usará para evaluar su iniciativa.
         </p>
       </div>
    </div>
  </div>
);

const PlanningSection = ({ theme }: { theme: string }) => (
  <div className="space-y-10">
    <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-red-50 text-[#EF3340] rounded-[1.5rem] flex items-center justify-center shadow-sm"><TrendingUp size={32} /></div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Entendiendo el Ciclo de Planeación</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Protocolo de Gobernanza CAPEX</p>
        </div>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <StepHelpBox step="01" title="Identificación de Demanda" desc="Donde los equipos técnicos cargan su necesidad. Se definen macroproyectos e ítems (Hardware/Software/Servicios)." />
      <StepHelpBox step="02" title="Clasificación Estratégica" desc="Se asigna prioridad (Obligatorio, Mantenimiento, Crecimiento). Es vital para el filtrado en caso de recortes de capital." />
      <StepHelpBox step="03" title="Sustento IA (Pressure Test)" desc="Evaluación de ROI y VPN. Aquí la IA audita si el proyecto realmente entrega valor o es solo gasto operativo disfrazado." />
      <StepHelpBox step="04" title="Optimización Waterline" desc="Se traza la línea de corte según el presupuesto disponible anual. Los proyectos por debajo de la línea quedan en Backlog." />
    </div>
  </div>
);

const FollowupSection = ({ theme }: { theme: string }) => (
  <div className="space-y-12">
    <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-sm"><Activity size={32} /></div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Seguimiento 0+n vs SAP</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Control de Ejecución Real</p>
        </div>
    </div>

    <div className="p-10 rounded-[3rem] border border-gray-100 bg-[#f9fbff] space-y-8">
       <div className="flex items-start gap-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600 shrink-0"><Database size={24} /></div>
          <div>
             <h5 className="font-black text-gray-900 uppercase text-sm mb-2">Conexión con el ERP Corporativo</h5>
             <p className="text-sm text-gray-500 leading-relaxed">
               Sofia no es un silo. Este módulo lee las <b>Solicitudes de Pedido (SolPed)</b> y <b>Órdenes de Compra (PO)</b> directamente de SAP. Si un proyecto no está planeado en Sofia, no podrá liberar fondos en SAP.
             </p>
          </div>
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ConceptSummary title="Línea Base" desc="Es el plan maestro aprobado al inicio del año. No cambia a menos que haya una repriorización oficial." icon={<Target size={16}/>} />
      <ConceptSummary title="Forecast (0+n)" desc="Es la proyección viva. Los meses pasados son 'Reales' y los futuros son 'Estimados'." icon={<TrendingUp size={16}/>} />
    </div>
  </div>
);

const ImpactSection = ({ theme }: { theme: string }) => (
  <div className="space-y-10">
    <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-sm"><GanttChart size={32} /></div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Medición de Impacto</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">¿Se cumplió la promesa de valor?</p>
        </div>
    </div>

    <p className="text-lg text-gray-500 font-medium">El ciclo Sofia solo se cierra cuando auditamos el impacto real. Este módulo exige:</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100">
         <h5 className="font-black text-emerald-800 uppercase text-[11px] tracking-widest mb-4">Métricas de Beneficio</h5>
         <ul className="space-y-3 text-xs font-bold text-emerald-700">
            <li>• KPI de Red (Latencia, Disponibilidad)</li>
            <li>• KPI Financiero (Ahorro OPEX real)</li>
            <li>• KPI de Cliente (Churn, NPS)</li>
         </ul>
      </div>
      <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
         <h5 className="font-black text-gray-800 uppercase text-[11px] tracking-widest mb-4">Evidencia Documental</h5>
         <p className="text-xs text-gray-500 leading-relaxed font-medium">
           Debe cargar los reportes que demuestren que la inversión de 2026 generó los beneficios prometidos en el Paso 1 de Planeación.
         </p>
      </div>
    </div>
  </div>
);

const TechSection = ({ theme }: { theme: string }) => (
  <div className="space-y-12">
    <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-sm"><Eye size={32} /></div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Vigilancia Tech (Radar)</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Anticipando el futuro de la red</p>
        </div>
    </div>

    <div className="relative p-10 rounded-[3.5rem] bg-gradient-to-br from-[#1a1f26] to-[#0b0e14] text-white shadow-2xl">
      <div className="absolute top-0 right-0 p-10 opacity-20"><Zap size={150} /></div>
      <h4 className="text-xl font-black mb-6 flex items-center gap-3">
        <Lightbulb className="text-yellow-400" /> El Workflow de "Promoción"
      </h4>
      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl font-medium">
        En Vigilancia Tech no solo observamos tendencias (IA, 6G, Cloud Edge). Cuando una tecnología está madura, Sofia permite <b>"Promover a CAPEX"</b>. Esto crea automáticamente una iniciativa en Planeación, heredando toda la investigación del Radar.
      </p>
    </div>
  </div>
);

const AdvancedSection = ({ theme }: { theme: string }) => (
  <div className="space-y-10">
    <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[1.5rem] flex items-center justify-center shadow-sm"><Binary size={32} /></div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Modelos Avanzados</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Calculadoras de ingeniería financiera</p>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="p-6 rounded-3xl border border-gray-100 space-y-4">
          <div className="text-red-500"><Zap size={24}/></div>
          <h6 className="font-black text-xs uppercase">Modelo Telco</h6>
          <p className="text-[10px] text-gray-400 font-bold">Calcula ROI basado en densificación de sitios y ahorro espectral.</p>
       </div>
       <div className="p-6 rounded-3xl border border-gray-100 space-y-4">
          <div className="text-blue-500"><Database size={24}/></div>
          <h6 className="font-black text-xs uppercase">Modelo Cloud</h6>
          <p className="text-[10px] text-gray-400 font-bold">Compara TCO de On-Premise vs Nube (AWS/Azure/GCP).</p>
       </div>
       <div className="p-6 rounded-3xl border border-gray-100 space-y-4">
          <div className="text-emerald-500"><Cpu size={24}/></div>
          <h6 className="font-black text-xs uppercase">Modelo IT Core</h6>
          <p className="text-[10px] text-gray-400 font-bold">Justifica actualizaciones de software por reducción de deuda técnica.</p>
       </div>
    </div>
  </div>
);

const AdminSection = ({ theme }: { theme: string }) => (
  <div className="space-y-10">
    <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-gray-100 text-gray-900 rounded-[1.5rem] flex items-center justify-center shadow-sm"><ShieldCheck size={32} /></div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter">Administración & Roles</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Control de Accesos (RBAC)</p>
        </div>
    </div>

    <div className="space-y-8">
      <RoleBox role="ADMINISTRADOR" access="Control total del sistema, bases de datos y permisos." />
      <RoleBox role="RESPONSABLE PLANEACIÓN" access="Validación técnica, definición de Waterline y cierre de ciclo." />
      <RoleBox role="GERENTE LÍDER" access="Registro de proyectos, carga de SolPeds y sustento de beneficios." />
      <RoleBox role="CONTROLLER" access="Operación T-Unitarios y validación de precios en órdenes de compra." />
    </div>
  </div>
);

/* --- MINI COMPONENTES --- */

const GoldenCircleCard = ({ title, desc, icon, color }: any) => {
  const colors = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  return (
    <div className="p-8 rounded-[3rem] border border-gray-100 bg-white flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colors[color as keyof typeof colors]}`}>
        {icon}
      </div>
      <h5 className="text-[12px] font-black text-gray-900 uppercase tracking-widest mb-3">{title}</h5>
      <p className="text-[11px] text-gray-400 font-bold leading-relaxed">{desc}</p>
    </div>
  );
};

const StepHelpBox = ({ step, title, desc }: any) => (
  <div className="flex gap-8 items-start p-8 rounded-[2.5rem] bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all group">
    <div className="text-4xl font-black text-gray-200 group-hover:text-[#EF3340] transition-colors">{step}</div>
    <div className="space-y-1">
      <h5 className="text-sm font-black text-gray-900 uppercase tracking-tight">{title}</h5>
      <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ConceptSummary = ({ title, desc, icon }: any) => (
  <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm flex items-center gap-6">
    <div className="p-4 bg-gray-50 text-[#EF3340] rounded-2xl">{icon}</div>
    <div>
      <h6 className="font-black text-xs text-gray-900 uppercase tracking-tight mb-1">{title}</h6>
      <p className="text-[10px] text-gray-400 font-bold leading-tight">{desc}</p>
    </div>
  </div>
);

const RoleBox = ({ role, access }: any) => (
  <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-gray-300 transition-all">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-[#EF3340] uppercase tracking-widest">{role}</p>
      <p className="text-xs font-bold text-gray-500">{access}</p>
    </div>
    <div className="text-gray-200"><ArrowRight size={20}/></div>
  </div>
);

const SofiaLogoLarge = () => (
  <svg viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-96 h-96">
    <circle cx="150" cy="150" r="140" stroke="white" strokeWidth="2" opacity="0.2" />
    <path d="M100 150C100 130 120 110 150 110C180 110 200 130 200 150" stroke="white" strokeWidth="4" />
    <path d="M150 200V250" stroke="#EF3340" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const BrainCircuitLarge = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-4.12 2.5 2.5 0 0 1 0-4.12A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-4.12 2.5 2.5 0 0 0 0-4.12A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);

export default HelpCenter;
