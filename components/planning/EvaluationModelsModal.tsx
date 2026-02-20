
import React from 'react';
import { X, BarChart3, Calculator, TrendingUp, Info, ArrowRight } from 'lucide-react';

interface Props {
  show: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const EvaluationModelsModal: React.FC<Props> = ({ show, onClose, theme }) => {
  if (!show) return null;

  const models = [
    { title: 'TCO (Total Cost of Ownership)', desc: 'Análisis integral de costos de adquisición, operación y mantenimiento de activos tecnológicos.', icon: <Calculator size={32} />, color: 'text-purple-600' },
    { title: 'NPV (Net Present Value)', desc: 'Valoración de la rentabilidad esperada del proyecto descontada a fecha de hoy.', icon: <TrendingUp size={32} />, color: 'text-emerald-600' },
    { title: 'Métrica Estratégica (MVA)', desc: 'Market Value Added: Impacto proyectado en la valoración de marca por liderazgo tecnológico.', icon: <BarChart3 size={32} />, color: 'text-blue-600' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-[3rem] border border-purple-500/20 shadow-2xl overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-[#0f1219]' : 'bg-white'}`}>
        <div className="p-8 border-b border-inherit flex justify-between items-center bg-purple-50/5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BarChart3 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">Modelos de Evaluación</h3>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">Criterios de Priorización Financiera</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-purple-50 rounded-full transition-all text-gray-400"><X size={28} /></button>
        </div>

        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h4 className="text-3xl font-black tracking-tight text-gray-900 mb-6">Seleccione el Framework de Evaluación</h4>
            <p className="text-sm font-medium text-gray-400 leading-relaxed">
              Cada iniciativa de inversión debe ser validada bajo al menos uno de nuestros modelos de rentabilidad corporativa para asegurar el crecimiento sostenible de la red.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((m, i) => (
              <div key={i} className="p-10 rounded-[3rem] border border-gray-100 bg-white hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5 transition-all group cursor-pointer flex flex-col">
                 <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center mb-10 transition-colors group-hover:bg-purple-600 group-hover:text-white ${m.color}`}>
                   {m.icon}
                 </div>
                 <h5 className="text-lg font-black text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">{m.title}</h5>
                 <p className="text-xs text-gray-400 font-medium leading-relaxed mb-10 flex-1">{m.desc}</p>
                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-purple-600 transition-colors">
                   Configurar Variables <ArrowRight size={14} />
                 </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex gap-6 items-center">
             <div className="text-blue-600"><Info size={32} /></div>
             <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
               <b>Aviso:</b> El modelo de evaluación para proyectos de 5G incluye un factor de corrección por depreciación acelerada de equipos legacy 4G.
             </p>
          </div>
        </div>

        <div className="p-8 border-t border-inherit bg-gray-50/10 flex justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Powered by Corporate Finance Engine 2027</p>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModelsModal;
