
import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, ClipboardEdit, Search, FileSearch, ChevronDown, Lock } from 'lucide-react';
import { ProjectRow } from '../Planning';

interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
  canModify: boolean;
  // Added onUpdateRows and onNext to match usage in Planning.tsx
  onUpdateRows: (rows: ProjectRow[]) => void;
  onNext: () => void;
}

const Step3Soporte: React.FC<Props> = ({ rows, theme, canModify, onUpdateRows, onNext }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-700 space-y-10 max-w-5xl pb-10">
      <div className="space-y-3">
        <h3 className={`text-3xl font-black tracking-tighter ${textColor}`}>3. Desarrollo del soporte de proyecto</h3>
        {!canModify && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-[10px] font-black w-fit border border-amber-100">
             <Lock size={12} /> MODO LECTURA - SOLO GERENTE RESPONSABLE O ADMIN PUEDE COMPLETAR SOPORTES
          </div>
        )}
      </div>

      <div className={`p-1 rounded-[3rem] border overflow-hidden ${theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-gray-50/50 font-black uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-10 py-6">Identificación del Proyecto</th>
                <th className="px-10 py-6 text-center">Estado del Modelo</th>
                <th className="px-10 py-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-10 py-6 font-black text-gray-700">{row.proyecto}</td>
                  <td className="px-10 py-6 text-center">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 font-black text-[9px] uppercase">PENDIENTE</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <button 
                      disabled={!canModify}
                      onClick={() => {
                        // In a real app, this would open a sub-modal or switch view
                        // For now we just go to the next step to simulate progress
                        onNext();
                      }}
                      className={`px-6 py-3 rounded-2xl text-[9px] font-black transition-all flex items-center gap-2 mx-auto ${
                        canModify ? 'bg-gray-900 text-white hover:bg-[#EF3340]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <ClipboardEdit size={14} /> COMPLETAR MODELO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Step3Soporte;
