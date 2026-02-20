import React from 'react';
import { Plus, Pencil, Trash2, ListChecks, Lock, Send, Save, Cpu, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { ProjectRow } from '../Planning';

interface Props {
  rows: ProjectRow[];
  onAdd: () => void;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onSend: (idx: number) => void;
  onExecuteSimulator: () => void;
  onSaveGlobal?: () => void;
  theme: 'light' | 'dark';
  canModify: boolean;
  vigencia: string;
}

const formatCurrency = (val: string | number) => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num || 0);
};

const Step1Identificacion: React.FC<Props> = ({ rows, onAdd, onEdit, onDelete, onSend, onExecuteSimulator, onSaveGlobal, theme, canModify, vigencia }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="animate-in slide-in-from-left-4 duration-500 space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-3xl font-black tracking-tight ${textColor}`}>Listado de Iniciativas de Inversión</h3>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-black opacity-80">Gestión de demanda operativa CAPEX {vigencia}</p>
        </div>
        {canModify ? (
          <div className="flex gap-4">
            <button 
              onClick={onExecuteSimulator} 
              className="px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-[1.8rem] text-[10px] font-black flex flex-col items-center justify-center leading-none hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]"
            >
              <Cpu size={14} className="mb-1" />
              <span>EJECUTAR SIMULADOR</span>
              <span className="text-[9px] mt-0.5 opacity-80 tracking-tighter uppercase">Carga Inicial</span>
            </button>
            <button 
              onClick={onAdd} 
              className="px-10 py-5 bg-[#EF3340] text-white rounded-[1.8rem] text-[11px] font-black flex flex-col items-center justify-center leading-none hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(239,51,64,0.4)]"
            >
              <span>REGISTRAR</span>
              <span className="text-[10px] mt-1 opacity-90 tracking-tighter uppercase">Nueva Iniciativa</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-6 py-2 bg-gray-100 rounded-xl text-gray-400 text-[9px] font-black uppercase tracking-widest border border-gray-200">
             <Lock size={14} /> Solo Lectura
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[3.5rem] border border-gray-100 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-[#F8F9FB] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-gray-100 z-10">
              <tr>
                <th className="px-12 py-10">MACROPROYECTO</th>
                <th className="px-12 py-10">PROYECTO</th>
                <th className="px-12 py-10 text-center">ESTADO</th>
                <th className="px-8 py-10 text-center">CANT. ÍTEMS</th>
                <th className="px-8 py-10 text-right">MONTO TOTAL COP</th>
                <th className="px-12 py-10 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, idx) => {
                const isReview = row.scorecard?.decisionComite === 'PIVOT' || row.estadoSoporte === 'DEVUELTO';
                const isRejected = row.scorecard?.decisionComite === 'NO-GO';
                
                return (
                  <tr key={idx} className={`transition-all hover:bg-gray-50/20 group ${isReview ? 'bg-amber-50/10' : ''}`}>
                    <td className="px-12 py-8">
                      <span className="inline-block font-black text-[10px] px-4 py-2 rounded-xl bg-[#F0F2F5] text-[#5F6368] uppercase tracking-tighter">
                        {row.macroproyecto}
                      </span>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-[14px] tracking-tight leading-none uppercase">{row.proyecto}</span>
                        <span className="text-[10px] font-bold text-[#EF3340] mt-1.5 font-mono">{row.idProyecto}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8 text-center">
                      {isReview ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 font-black text-[9px] uppercase animate-pulse">
                          <RefreshCw size={10} className="animate-spin" /> EN REVISIÓN
                        </div>
                      ) : isRejected ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-black text-[9px] uppercase">
                          <XCircle size={10} /> RECHAZADO
                        </div>
                      ) : (
                        <span className="text-gray-300 font-black uppercase text-[9px]">Borrador</span>
                      )}
                    </td>
                    <td className="px-8 py-8 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 font-black text-[10px]">
                        <ListChecks size={12} /> {row.items.length}
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right font-black text-[14px] text-gray-900 tracking-tighter">
                      {formatCurrency(row.presupuestoCop)}
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {canModify ? (
                          <>
                            <button onClick={() => onEdit(idx)} className="p-2.5 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all" title="Editar"><Pencil size={18} /></button>
                            <button onClick={() => onDelete(idx)} className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-[#EF3340] transition-all" title="Eliminar"><Trash2 size={18} /></button>
                            <button 
                              onClick={() => onSend(idx)} 
                              className="p-3 rounded-xl bg-[#F1FBF4] text-[#108548] hover:bg-[#108548] hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm border border-[#D1F2DC]"
                              title="Enviar a Clasificación"
                            >
                              <Send size={16} strokeWidth={2.5} />
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-300 italic text-[10px]">Restringido</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {rows.length === 0 && (
        <div className="py-40 text-center border-[3px] border-dashed border-gray-100 rounded-[5rem] bg-gray-50/20 flex flex-col items-center justify-center">
           <p className="text-gray-400 font-black uppercase text-[13px] tracking-[0.4em] opacity-40">No hay iniciativas registradas aún.</p>
           <button onClick={onExecuteSimulator} className="mt-8 text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline">
              <Cpu size={14} /> O utiliza el simulador para cargar datos demo
           </button>
        </div>
      )}
    </div>
  );
};

export default Step1Identificacion;