
import React from 'react';
import { CheckCircle2, ShieldCheck, FileSearch, Clock } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  projectName: string;
}

const Step2Validacion: React.FC<Props> = ({ theme, projectName }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
          <ShieldCheck size={20} />
        </div>
        <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Validación de Hitos Técnicos</h3>
      </div>

      <div className="space-y-4">
        <ValidationItem title="Diseño Final Aprobado" desc="Validado por Arquitectura de Red" status="OK" theme={theme} />
        <ValidationItem title="Evaluación de Riesgo Q4" desc="Pressure test completado" status="OK" theme={theme} />
        <ValidationItem title="Disponibilidad de Materiales" desc="Sincronizado con Supply Chain" status="PENDING" theme={theme} />
      </div>

      <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-blue-50/30 border-blue-100'}`}>
        <div className="flex items-center gap-3 mb-4">
          <FileSearch className="text-blue-600" size={20} />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-700">Estado de la Revisión</h4>
        </div>
        <p className="text-xs font-medium text-gray-500 leading-relaxed">
          El proyecto <b>{projectName}</b> requiere la carga del certificado de importación para liberar el hito de Procura.
        </p>
      </div>

      <button className="w-full py-5 bg-gray-900 text-white rounded-2xl text-[11px] font-black flex items-center justify-center gap-3 hover:bg-[#EF3340] transition-colors shadow-xl">
        <Clock size={18} /> SOLICITAR VISTO BUENO
      </button>
    </div>
  );
};

const ValidationItem: React.FC<{ title: string, desc: string, status: 'OK' | 'PENDING', theme: string }> = ({ title, desc, status, theme }) => (
  <div className={`p-5 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div>
      <p className={`text-[11px] font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</p>
      <p className="text-[9px] text-gray-400 font-bold uppercase">{desc}</p>
    </div>
    {status === 'OK' ? (
      <CheckCircle2 size={20} className="text-emerald-500" />
    ) : (
      <div className="w-5 h-5 rounded-full border-2 border-dashed border-amber-400 animate-spin"></div>
    )}
  </div>
);

export default Step2Validacion;
