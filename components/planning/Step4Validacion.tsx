
import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, ShieldCheck, ChevronDown, Save, Info, Lock } from 'lucide-react';
import { ProjectRow } from '../Planning';

interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
  canModify: boolean;
}

const Step4Validacion: React.FC<Props> = ({ rows, theme, canModify }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(rows.length > 0 ? 0 : null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';

  const selectedProject = selectedIdx !== null ? rows[selectedIdx] : null;

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h3 className={`text-2xl font-black tracking-tighter ${textColor}`}>4. Validación de requisitos</h3>
        {!canModify && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-[10px] font-black w-fit border border-amber-100">
             <Lock size={12} /> MODO LECTURA - SOLO RESPONSABLE PLANEACIÓN PUEDE VALIDAR
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12">
           <div className={`p-10 rounded-[3rem] border flex flex-col transition-all shadow-xl ${cardBg}`}>
              {selectedProject ? (
                <div className="space-y-8">
                  <h4 className={`text-xl font-black tracking-tighter ${textColor}`}>{selectedProject.proyecto}</h4>
                  
                  <div className="border-t border-dashed border-gray-200 pt-8 space-y-6">
                    <h5 className="text-[11px] font-black text-gray-900 tracking-tight">Decisión del Comité</h5>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Decisión</label>
                      <select disabled={!canModify} className="w-full px-6 py-4 text-[11px] font-black rounded-2xl border border-gray-200 bg-gray-50 outline-none">
                        <option>Sin decisión</option>
                        <option>Aprobar</option>
                        <option>Rechazar</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      disabled={!canModify}
                      className={`text-[12px] font-black px-14 py-5 rounded-2xl shadow-xl flex items-center gap-3 transition-all ${
                        canModify ? 'bg-[#EF3340] text-white hover:bg-[#D62E39]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canModify ? 'Guardar decisión' : 'Modificación no autorizada'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">No hay proyectos para validar.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Validacion;
