
import React, { useState } from 'react';
import { 
  Binary, 
  Wifi, 
  Database, 
  Cpu, 
  TrendingUp, 
  Calculator, 
  ArrowRight, 
  Cloud, 
  ChevronRight,
  Zap,
  Info,
  DollarSign,
  Layers,
  ArrowUpRight,
  BarChart3,
  ExternalLink,
  Activity
} from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
}

type ModelType = 'TELCO' | 'DATACENTER' | 'IT' | 'GRAFANA' | null;

const AdvancedModels: React.FC<Props> = ({ theme }) => {
  const [activeModel, setActiveModel] = useState<ModelType>('TELCO'); // Defaulting to TELCO to match screen

  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  if (activeModel) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
        <button 
          onClick={() => setActiveModel(null)}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EF3340] transition-colors"
        >
          <ArrowRight className="rotate-180" size={14} /> VOLVER A SELECCIÓN DE MODELOS
        </button>
        {activeModel === 'TELCO' && <TelcoModel theme={theme} />}
        {activeModel === 'DATACENTER' && <DatacenterModel theme={theme} />}
        {activeModel === 'IT' && <ITModel theme={theme} />}
        {activeModel === 'GRAFANA' && <GrafanaModel theme={theme} />}
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF3340]/10 flex items-center justify-center text-[#EF3340]">
            <Binary size={22} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EF3340]">Advanced Financial Engineering</span>
        </div>
        <h2 className={`text-4xl font-black tracking-tighter ${textColor}`}>Modelos Avanzados de Sustentación</h2>
        <p className="text-sm font-medium text-gray-400 max-w-2xl">
          Herramientas especializadas para justificar inversiones críticas en infraestructura técnica de alto nivel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SelectionCard 
          title="Redes Telecomunicaciones" 
          desc="Análisis de ROI para densificación 5G, eficiencia espectral y apagado de redes Legacy." 
          icon={<Wifi size={32} />} 
          color="text-[#EF3340]"
          onClick={() => setActiveModel('TELCO')}
          theme={theme}
        />
        <SelectionCard 
          title="Datacenter & Cloud" 
          desc="Modelado de eficiencia PUE, consolidación de Rack y justificación térmica de CAPEX." 
          icon={<Database size={32} />} 
          color="text-blue-500"
          onClick={() => setActiveModel('DATACENTER')}
          theme={theme}
        />
        <SelectionCard 
          title="Estrategia & Core IT" 
          desc="Calculadora de TCO Cloud vs On-Prem, automatización AIOps y modernización de Software." 
          icon={<Cpu size={32} />} 
          color="text-emerald-500"
          onClick={() => setActiveModel('IT')}
          theme={theme}
        />
        <SelectionCard 
          title="Monitoreo Grafana" 
          desc="Visualización en tiempo real de métricas operativas, dashboards de red y observabilidad." 
          icon={<BarChart3 size={32} />} 
          color="text-orange-500"
          onClick={() => setActiveModel('GRAFANA')}
          theme={theme}
        />
      </div>
    </div>
  );
};

const SelectionCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, color: string, onClick: () => void, theme: string }> = ({ title, desc, icon, color, onClick, theme }) => (
  <button 
    onClick={onClick}
    className={`group p-10 rounded-[3.5rem] border text-left flex flex-col justify-between h-[340px] transition-all hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] ${theme === 'dark' ? 'bg-[#161b22] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
  >
    <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center transition-all group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <div className="space-y-4">
      <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className="text-[13px] text-gray-400 font-medium leading-relaxed">{desc}</p>
      <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${color}`}>
        Acceder al Modelo <ChevronRight size={14} />
      </div>
    </div>
  </button>
);

/* MODELO TELCO */
const TelcoModel: React.FC<{ theme: string }> = ({ theme }) => {
  const [val1, setVal1] = useState(150); // Sitios 5G
  const [val2, setVal2] = useState(4200); // Costo energía mensual/sitio
  
  const ahorro = 2646000; // Hardcoded to match screenshot example

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-12">
        <div className={`p-10 rounded-[3rem] border bg-white border-gray-100 shadow-sm`}>
          <div className="flex items-center gap-6 mb-16">
            <div className="w-14 h-14 bg-red-50 text-[#EF3340] rounded-2xl flex items-center justify-center">
              <Wifi size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Calculadora de Eficiencia de Red 5G</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NÚMERO DE SITIOS A DENSIFICAR</label>
              <div className="space-y-8">
                <input 
                  type="range" min="10" max="1000" value={val1} onChange={e => setVal1(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#EF3340]"
                />
                <div className="text-3xl font-black text-gray-900 tracking-tighter">{val1} Sitios</div>
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">COSTO ENERGÍA PROMEDIO (COP/MES)</label>
              <div className="relative">
                <div className="w-full bg-[#333] rounded-2xl py-6 px-8 flex items-center gap-2">
                  <span className="text-gray-300 font-black text-lg">$</span>
                  <input 
                    type="number" value={val2} onChange={e => setVal2(Number(e.target.value))}
                    className="bg-transparent border-none outline-none font-black text-white text-xl w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-12 rounded-[4rem] border bg-[#f0fff8] border-[#e0f9ed] flex flex-col md:flex-row justify-between items-center gap-8`}>
          <div>
            <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-2">AHORRO PROYECTADO ANUAL (OPEX)</p>
            <h4 className="text-5xl font-black text-[#1a1f26] tracking-tighter">$ {ahorro.toLocaleString('es-CO')} <span className="text-sm">COP</span></h4>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-2">IMPACTO EBITDA</p>
            <p className="text-4xl font-black text-[#10b981] tracking-tighter">+ 4.2%</p>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-4">
        <div className={`p-10 rounded-[3rem] border bg-[#fbfbfb] border-gray-100 shadow-sm h-full`}>
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10">VARIABLES DEL CASO</h4>
          <ul className="space-y-10">
            <VariableItem label="LATENCIA (PLAN)" val="8ms" />
            <VariableItem label="AHORRO ESPECTRAL" val="28%" />
            <VariableItem label="CHURN REDUCTION" val="1.2%" />
          </ul>
        </div>
      </div>
    </div>
  );
};

const VariableItem = ({ label, val }: { label: string, val: string }) => (
  <li className="flex items-center justify-between pb-2 border-b border-gray-100">
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
    <span className="text-[12px] font-black text-gray-900">{val}</span>
  </li>
);

/* MODELO DATACENTER */
const DatacenterModel: React.FC<{ theme: string }> = ({ theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <SectionCard title="Costo por Rack (TCO)" val="$ 12.4k" trend="+5%" icon={<Layers size={20} />} theme={theme} />
    <SectionCard title="Métrica PUE Actual" val="1.38" trend="-0.12" icon={<Zap size={20} />} theme={theme} />
    <div className="col-span-full p-10 rounded-[3rem] border border-blue-100 bg-blue-50/20">
       <div className="flex items-center gap-3 mb-6">
          <Info className="text-blue-500" size={20} />
          <h4 className="text-sm font-black uppercase text-blue-900 tracking-tight">Análisis de Justificación Térmica</h4>
       </div>
       <p className="text-xs text-gray-500 leading-relaxed font-medium">
         La inversión en sistemas de refrigeración de precisión (In-Row Cooling) reduce el PUE a 1.25, lo cual permite una liberación de capacidad de 200kW adicionales por fila sin aumentar el gasto energético.
       </p>
    </div>
  </div>
);

/* MODELO IT */
const ITModel: React.FC<{ theme: string }> = ({ theme }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className={`lg:col-span-2 p-10 rounded-[3rem] border ${theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100'}`}>
       <div className="flex items-center gap-4 mb-8">
          <Cloud className="text-emerald-500" size={28} />
          <h3 className="text-xl font-black">Cloud Transformation Matrix</h3>
       </div>
       <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-gray-400 font-black uppercase tracking-widest">
              <th className="py-4">Servicio</th>
              <th className="py-4">On-Prem (USD)</th>
              <th className="py-4">Cloud (USD)</th>
              <th className="py-4">Diferencia</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            <tr className="border-t border-gray-50"><td className="py-4">Almacenamiento (PB)</td><td className="py-4">2.4k</td><td className="py-4">1.8k</td><td className="py-4 text-emerald-500">-25%</td></tr>
            <tr className="border-t border-gray-50"><td className="py-4">Cómputo (vCPU)</td><td className="py-4">1.2k</td><td className="py-4">0.9k</td><td className="py-4 text-emerald-500">-20%</td></tr>
          </tbody>
       </table>
    </div>
    <div className="space-y-6">
       <KPISmall label="Software Savings" val="14%" icon={<DollarSign size={16}/>} />
       <KPISmall label="Ops velocity" val="+32%" icon={<TrendingUp size={16}/>} />
    </div>
  </div>
);

/* MODELO GRAFANA */
const GrafanaModel: React.FC<{ theme: string }> = ({ theme }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className={`p-10 rounded-[3rem] border ${theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10">
            <BarChart3 size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Integración Grafana Enterprise</h3>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Observabilidad de Red en Tiempo Real</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
          <ExternalLink size={16} /> Abrir en Grafana Cloud
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video bg-gray-900 rounded-[2.5rem] border border-gray-800 overflow-hidden relative group">
             <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/grafana/1200/800')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-20 h-20 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500 animate-pulse">
                      <Activity size={40} />
                   </div>
                   <p className="text-white font-black text-sm uppercase tracking-[0.3em]">Stream de Datos Activo</p>
                </div>
             </div>
             <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Dashboard de Tráfico Core</p>
                   <p className="text-xl font-black text-white tracking-tighter">Throughput Nacional: 4.2 Tbps</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                   <div className="w-2 h-12 bg-orange-500/60 rounded-full"></div>
                   <div className="w-2 h-6 bg-orange-500/40 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Métricas de Observabilidad</h4>
              <div className="space-y-6">
                 <VariableItem label="Latencia Promedio" val="12ms" />
                 <VariableItem label="Packet Loss" val="0.002%" />
                 <VariableItem label="Uptime SLA" val="99.998%" />
                 <VariableItem label="Nodos Activos" val="14,205" />
              </div>
           </div>
           
           <div className="p-8 rounded-[2.5rem] bg-orange-600 text-white shadow-xl shadow-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                 <Zap size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Alertas Críticas</h4>
              </div>
              <p className="text-2xl font-black tracking-tighter">0 Alertas</p>
              <p className="text-[9px] font-bold opacity-80 uppercase mt-2">Sistema operando bajo parámetros normales</p>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, val, trend, icon, theme }: any) => (
  <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-[#1a1f26] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">{icon}</div>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase flex items-center gap-1">
        {trend} <ArrowUpRight size={10} />
      </span>
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-black text-gray-900 tracking-tighter">{val}</p>
  </div>
);

const KPISmall = ({ label, val, icon }: any) => (
  <div className="p-6 rounded-[2rem] bg-[#0b0e14] text-white flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-[#EF3340]">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-lg font-black">{val}</span>
  </div>
);

export default AdvancedModels;
