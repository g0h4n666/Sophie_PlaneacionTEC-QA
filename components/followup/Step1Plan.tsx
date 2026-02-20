
import React from 'react';
import { RotateCcw, Save, AlertCircle } from 'lucide-react';

interface ExecutionLine {
  proyecto: string;
  codigo: string;
  pospre: string;
  aprobadoCop: number;
}

interface Props {
  selectedLine: ExecutionLine;
  monthlyPlan: Record<string, number>;
  onMonthChange: (month: string, val: string) => void;
  onReset: () => void;
  theme: 'light' | 'dark';
}

const Step1Plan: React.FC<Props> = ({ selectedLine, monthlyPlan, onMonthChange, onReset, theme }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  // Fix: Cast Object.values to number[] to avoid 'unknown' type inference errors during reduce
  const totalPlanned = (Object.values(monthlyPlan) as number[]).reduce((a, b) => a + b, 0);
  const difference = selectedLine.aprobadoCop - totalPlanned;
  const isPerfectMatch = difference === 0 && totalPlanned > 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
            <span className="font-black text-xs">01</span>
          </div>
          <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Distribución Mensual (Línea Base)</h3>
        </div>
        <button onClick={onReset} className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-[#EF3340] transition-colors">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className={`p-5 rounded-3xl border ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-red-50/30 border-red-100'}`}>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">PROYECTO EN EDICIÓN</p>
        <p className={`text-sm font-black leading-tight ${textColor}`}>{selectedLine.proyecto}</p>
        <p className="text-[10px] font-bold text-[#EF3340] mt-1">CÓDIGO: {selectedLine.codigo}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {Object.keys(monthlyPlan).map(month => (
          <div key={month} className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{month}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[9px]">$</span>
              <input 
                type="number" 
                value={monthlyPlan[month] || ''}
                onChange={(e) => onMonthChange(month, e.target.value)}
                placeholder="0"
                className={`w-full pl-7 pr-4 py-3 text-[11px] font-black rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-[#0b0e14] border-[#2d3748] focus:border-[#EF3340]' : 'bg-white border-gray-200 focus:border-[#EF3340] focus:ring-2 focus:ring-red-50'}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-[2rem] border mt-4 space-y-4 transition-all ${isPerfectMatch ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-gray-400">Total Planificado:</span>
          <span className={isPerfectMatch ? 'text-emerald-600' : textColor}>$ {totalPlanned.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-gray-400">Delta Presupuestal:</span>
          <span className={difference === 0 ? 'text-emerald-600' : 'text-[#EF3340]'}>$ {difference.toLocaleString()}</span>
        </div>
        
        {!isPerfectMatch && totalPlanned > 0 && (
          <p className="text-[9px] font-bold text-[#EF3340] flex items-center gap-1.5 animate-pulse">
            <AlertCircle size={12} /> Ajuste el total para coincidir con el aprobado.
          </p>
        )}
      </div>

      <button 
        disabled={!isPerfectMatch}
        className={`w-full py-5 text-[11px] font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
          isPerfectMatch ? 'bg-[#EF3340] text-white hover:bg-[#D62E39]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Save size={18} /> GUARDAR PLAN BASE
      </button>
    </div>
  );
};

export default Step1Plan;
