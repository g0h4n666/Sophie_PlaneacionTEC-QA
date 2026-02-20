
import React from 'react';
import { Database, Cpu, Send, CheckCircle } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  codigo: string;
}

const Step3Liberacion: React.FC<Props> = ({ theme, codigo }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
          <Database size={20} />
        </div>
        <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Interfaz SAP / Liberación</h3>
      </div>

      <div className={`p-8 rounded-[2.5rem] border border-dashed text-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <Cpu size={48} className="text-gray-300 mx-auto mb-6" />
        <h4 className={`text-lg font-black ${textColor}`}>Generación de PO Automática</h4>
        <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">Al confirmar, el sistema enviará los datos de planeación al Job batch de SAP para la reserva de fondos.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ID Interface:</span>
           <span className="text-[11px] font-black text-gray-900 font-mono">SAP-CL-2027-X</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Código PRJ:</span>
           <span className="text-[11px] font-black text-[#EF3340] font-mono">{codigo}</span>
        </div>
      </div>

      <button className="w-full py-6 bg-emerald-600 text-white rounded-3xl text-[11px] font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
        <Send size={18} /> ENVIAR A SAP PARA LIBERACIÓN
      </button>
    </div>
  );
};

export default Step3Liberacion;
