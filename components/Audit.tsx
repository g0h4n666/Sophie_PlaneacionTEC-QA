
import React, { useState, useEffect } from 'react';
import { Budget, Expense, AIInsight } from '../types';
import { getFinancialAudit } from '../services/gemini';
import { BrainCircuit, Sparkles, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';

interface Props {
  budget: Budget;
  expenses: Expense[];
  theme: 'light' | 'dark';
}

const Audit: React.FC<Props> = ({ budget, expenses, theme }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    const data = await getFinancialAudit(budget, expenses);
    setInsights(data);
    setLoading(false);
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 md:p-12 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <BrainCircuit size={160} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-amber-300" size={24} />
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-200">Impulsado por Gemini IA</span>
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Análisis Inteligente</h2>
          <p className="text-indigo-100 max-w-lg mb-8">
            Nuestra inteligencia artificial analiza tus patrones de gasto y te ofrece consejos personalizados para alcanzar tus metas de ahorro más rápido.
          </p>
          <button 
            onClick={runAudit}
            disabled={loading}
            className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <RefreshCw size={20} />}
            Actualizar Auditoría
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-6 rounded-3xl border animate-pulse flex gap-6 ${theme === 'dark' ? 'bg-[#0d1117] border-[#1a1f26]' : 'bg-white border-gray-100'}`}>
                <div className="w-12 h-12 bg-gray-200 bg-opacity-20 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 bg-opacity-20 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 bg-opacity-20 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} theme={theme} />
            ))}
            {insights.length === 0 && !loading && (
              <div className={`text-center py-20 rounded-3xl border italic transition-colors ${theme === 'dark' ? 'bg-[#0d1117] border-[#1a1f26] text-gray-500' : 'bg-white border-gray-100 text-gray-400'}`}>
                Haz clic en "Actualizar Auditoría" para generar insights.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InsightCard: React.FC<{ insight: AIInsight; theme: 'light' | 'dark' }> = ({ insight, theme }) => {
  // Fix: Map Icon component references instead of pre-instantiated elements
  const config = (({
    success: { Icon: CheckCircle, color: 'emerald' },
    warning: { Icon: AlertCircle, color: 'amber' },
    info: { Icon: Info, color: 'blue' }
  } as any)[insight.type] || { Icon: Info, color: 'indigo' });

  const colorClasses: Record<string, string> = theme === 'dark' ? {
    emerald: 'bg-emerald-950 bg-opacity-20 text-emerald-400 border-emerald-900',
    amber: 'bg-amber-950 bg-opacity-20 text-amber-400 border-amber-900',
    blue: 'bg-blue-950 bg-opacity-20 text-blue-400 border-blue-900',
    indigo: 'bg-indigo-950 bg-opacity-20 text-indigo-400 border-indigo-900'
  } : {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className={`p-6 rounded-3xl border flex gap-6 transition-all hover:shadow-md ${colorClasses[config.color]}`}>
      <div className="flex-shrink-0">
        {/* Render the Icon component directly with size prop */}
        <config.Icon size={32} />
      </div>
      <div>
        <h4 className="text-xl font-bold mb-1">{insight.title}</h4>
        <p className={`opacity-80 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{insight.message}</p>
      </div>
    </div>
  );
};

export default Audit;
