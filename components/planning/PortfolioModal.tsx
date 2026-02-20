
import React from 'react';
import { X, Briefcase, PieChart, TrendingUp, DollarSign, Activity, ChevronRight } from 'lucide-react';

interface Props {
  show: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const PortfolioModal: React.FC<Props> = ({ show, onClose, theme }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-6xl rounded-[4rem] border border-blue-500/20 shadow-2xl overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-[#0f1219]' : 'bg-white'}`}>
        <div className="p-10 border-b border-inherit flex justify-between items-center bg-blue-50/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Briefcase size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">Consolidado de Portafolio</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1">Estrategia Global de Inversión</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-blue-50 rounded-full transition-all text-gray-400"><X size={32} /></button>
        </div>

        <div className="flex-1 p-12 overflow-y-auto space-y-12">
          {/* KPIs del Portafolio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatBox icon={<DollarSign />} label="Inversión Total" value="$ 1,420 M" color="text-blue-600" />
            <StatBox icon={<PieChart />} label="Participación 5G" value="45.2%" color="text-[#EF3340]" />
            <StatBox icon={<TrendingUp />} label="ROI Promedio" value="22.4%" color="text-emerald-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gráfico de Distribución (Simulado) */}
            <div className="p-10 rounded-[3rem] border border-gray-100 bg-gray-50/30">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Activity size={16} /> Salud del Portafolio por Dirección
               </h4>
               <div className="space-y-6">
                  <HealthBar label="Infraestructura de Red" pct={85} />
                  <HealthBar label="TI & Ciberseguridad" pct={40} />
                  <HealthBar label="Estrategia B2B" pct={65} />
               </div>
            </div>

            {/* Iniciativas Estratégicas */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Proyectos Flagship Q1-2027</h4>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-500/30 transition-all group">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Activity size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">Densificación LTE {i}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Capex: $14.2M • Región: Occidente</p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-inherit bg-gray-50/10 flex justify-end">
          <button className="px-12 py-5 bg-blue-600 text-white text-[12px] font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">EXPORTAR EXECUTIVE SUMMARY</button>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="p-8 rounded-[2.5rem] border border-gray-100 bg-white flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
    <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  </div>
);

const HealthBar: React.FC<{ label: string, pct: number }> = ({ label, pct }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
       <span className="text-gray-500">{label}</span>
       <span className={pct < 50 ? 'text-red-500' : 'text-emerald-500'}>{pct}%</span>
    </div>
    <div className="h-3 w-full bg-white rounded-full border border-gray-100 overflow-hidden">
       <div className={`h-full transition-all duration-1000 ${pct < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }}></div>
    </div>
  </div>
);

export default PortfolioModal;
