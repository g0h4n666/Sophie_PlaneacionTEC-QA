
import React from 'react';
import { Activity, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  aprobado: number;
}

const Step4Seguimiento: React.FC<Props> = ({ theme, aprobado }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const realEjecutado = aprobado * 0.42; // Simulación del 42%

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
          <Activity size={20} />
        </div>
        <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Ejecución vs Proyectado</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">PROGRESADO</p>
          <p className={`text-2xl font-black ${textColor}`}>42.0%</p>
          <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black mt-1">
             <TrendingUp size={12} /> +2.4% vs Mes Ant.
          </div>
        </div>
        <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">REAL SAP</p>
          <p className={`text-xl font-black ${textColor}`}>$ {realEjecutado.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado de los Trámites:</p>
        <div className="space-y-4">
           <ProgressLine label="Solicitud de Pedido (SOLPED)" pct={100} color="bg-emerald-500" />
           <ProgressLine label="Órdenes de Compra (PO)" pct={75} color="bg-blue-500" />
           <ProgressLine label="Entrada de Mercancía (GR)" pct={30} color="bg-amber-500" />
        </div>
      </div>

      <div className={`p-6 rounded-[2rem] bg-gray-900 text-white flex items-center gap-6`}>
         <div className="p-4 bg-white/10 rounded-2xl text-[#EF3340]">
            <Target size={24} />
         </div>
         <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pronóstico de Cierre Q4</p>
            <p className="text-sm font-bold">Cierre estimado al 98% del presupuesto.</p>
         </div>
      </div>
    </div>
  );
};

const ProgressLine: React.FC<{ label: string, pct: number, color: string }> = ({ label, pct, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[10px] font-black uppercase">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{pct}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
    </div>
  </div>
);

export default Step4Seguimiento;
