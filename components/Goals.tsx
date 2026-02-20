
import React, { useState } from 'react';
import { Budget } from '../types';
import { Target, TrendingUp, Info } from 'lucide-react';

interface Props {
  budget: Budget;
  onSave: (target: number) => void;
}

const Goals: React.FC<Props> = ({ budget, onSave }) => {
  const [target, setTarget] = useState(budget.savingsTarget || (budget.totalIncome * 0.2));
  
  const totalFixed = budget.fixedCosts.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget.totalIncome - totalFixed;
  const percentage = (target / budget.totalIncome) * 100;

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Tu Meta de Ahorro</h3>
            <p className="text-gray-500 text-sm">Define cuánto quieres guardar cada mes.</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <p className="text-6xl font-black text-indigo-600 mb-2">
              {target.toLocaleString()} <span className="text-2xl font-medium text-indigo-400">{budget.currency}</span>
            </p>
            <p className="text-gray-500 font-medium">Equivale al {percentage.toFixed(1)}% de tus ingresos.</p>
          </div>

          <div className="space-y-4">
            <input 
              type="range" 
              min="0" 
              max={remaining} 
              step="10"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Mínimo (0)</span>
              <span>Límite Real ({remaining.toLocaleString()})</span>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
            <div className="text-blue-600 flex-shrink-0">
              <Info size={24} />
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">Recomendación Financiera</p>
              <p className="text-sm text-blue-600">Expertos recomiendan ahorrar al menos el 20% de tus ingresos. Para ti, eso serían <span className="font-bold">{(budget.totalIncome * 0.2).toLocaleString()} {budget.currency}</span>.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Gasto Variable Permitido</p>
            <p className="text-xl font-bold">{(remaining - target).toLocaleString()} {budget.currency}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onSave(target)}
          className="bg-indigo-600 text-white rounded-3xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center"
        >
          Guardar y Ver Tablero
        </button>
      </div>
    </div>
  );
};

export default Goals;
