
import React from 'react';
import { Layers, Shuffle, AlertTriangle, ArrowRightLeft } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
}

const Step5Ajustes: React.FC<Props> = ({ theme }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white">
          <Layers size={20} />
        </div>
        <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Ajustes y Repriorización</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AjusteCard 
          icon={<Shuffle size={20} />} 
          title="Traslado entre Meses" 
          desc="Mover presupuesto planeado hacia periodos futuros sin afectar el total."
          theme={theme}
        />
        <AjusteCard 
          icon={<ArrowRightLeft size={20} />} 
          title="Transferencia de Excedentes" 
          desc="Ceder remanentes a otros proyectos prioritarios de la misma Dirección."
          theme={theme}
        />
      </div>

      <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex gap-4">
         <AlertTriangle className="text-[#EF3340] shrink-0" size={24} />
         <div>
            <p className="text-[11px] font-black text-[#EF3340] uppercase tracking-widest mb-1">Nota de Cumplimiento</p>
            <p className="text-xs text-red-600/80 font-medium">Cualquier ajuste superior al 15% del valor mensual requiere aprobación del Director de Área.</p>
         </div>
      </div>

      <button className="w-full py-5 bg-gray-900 text-white rounded-2xl text-[11px] font-black hover:bg-[#EF3340] transition-colors">
        SOLICITAR REPRIORIZACIÓN
      </button>
    </div>
  );
};

const AjusteCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, theme: string }> = ({ icon, title, desc, theme }) => (
  <div className={`p-6 rounded-[2rem] border transition-all cursor-pointer hover:border-amber-400 ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className="flex items-center gap-4 mb-3">
       <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">{icon}</div>
       <h4 className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
    </div>
    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Step5Ajustes;
