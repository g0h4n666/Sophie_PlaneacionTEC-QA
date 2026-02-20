
import React from 'react';
import { X, ShieldAlert, AlertTriangle, TrendingUp, Info, ShieldCheck } from 'lucide-react';

interface Props {
  show: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  vigencia: string;
}

const RiskMatrixModal: React.FC<Props> = ({ show, onClose, theme, vigencia }) => {
  if (!show) return null;

  const risks = [
    { id: 'R1', name: 'Volatilidad TRM (USD/COP)', level: 'CRÍTICO', type: 'Financiero', impact: 'Impacto directo en CAPEX de equipos importados.' },
    { id: 'R2', name: 'Escasez de Semiconductores', level: 'ALTO', type: 'Suministro', impact: 'Retraso en despliegue de radiobases 5G.' },
    { id: 'R3', name: 'Obsolescencia Tecnológica', level: 'MEDIO', type: 'Estratégico', impact: 'Inversión en tecnologías con ciclo de vida corto.' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-[3rem] border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-[#0f1219]' : 'bg-white'}`}>
        <div className="p-8 border-b border-inherit flex justify-between items-center bg-amber-50/5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">Matriz de Riesgo Presupuestal</h3>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Evaluación de Contingencias {vigencia}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-red-50 rounded-full transition-all text-gray-400"><X size={28} /></button>
        </div>

        <div className="flex-1 p-10 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Mapa de Calor (Probabilidad vs Impacto)</h4>
            <div className="grid grid-cols-5 gap-2 h-80">
              {[...Array(25)].map((_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const isCritical = row < 2 && col > 2;
                const isLow = row > 2 && col < 2;
                return (
                  <div key={i} className={`rounded-xl border flex items-center justify-center relative group cursor-help ${
                    isCritical ? 'bg-red-500/10 border-red-500/20' : 
                    isLow ? 'bg-emerald-500/10 border-emerald-500/20' : 
                    'bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {i === 2 && <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>}
                    {i === 2 && <div className="w-3 h-3 bg-red-600 rounded-full absolute"></div>}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[9px] font-black text-gray-400 px-2 uppercase tracking-widest">
              <span>Impacto Mínimo</span>
              <span>Impacto Catastrófico</span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Riesgos Identificados</h4>
            {risks.map(r => (
              <div key={r.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-amber-500/30 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black ${
                    r.level === 'CRÍTICO' ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>{r.level}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase">{r.type}</span>
                </div>
                <h5 className="text-sm font-black text-gray-900 mb-1">{r.name}</h5>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{r.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-inherit bg-gray-50/10 flex justify-between items-center">
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">3 Alertas Críticas Detectadas</span>
          </div>
          <button className="px-8 py-3 bg-gray-900 text-white text-[11px] font-black rounded-xl hover:bg-amber-600 transition-all">RECALCULAR EXPOSICIÓN</button>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrixModal;
