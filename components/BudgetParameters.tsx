
import React, { useState, useEffect } from 'react';
import { 
  Settings2, 
  DollarSign, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  Save, 
  RefreshCw,
  Info,
  Calendar,
  Layers,
  Percent,
  Activity,
  Milestone
} from 'lucide-react';
import { Budget } from '../types';

interface Props {
  theme: 'light' | 'dark';
  budget: Budget;
  onUpdateVigencia: (v: string) => void;
  onUpdateBudget: (b: Budget) => void;
}

const Section: React.FC<{ theme: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ theme, title, icon, children }) => (
  <div className={`p-10 rounded-[3.5rem] border transition-all ${theme === 'dark' ? 'bg-[#0f1219] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#EF3340] flex items-center justify-center border border-red-100">{icon}</div>
      <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    </div>
    {children}
  </div>
);

const CeilingInput: React.FC<{ label: string; value: number; onChange: (v: number) => void; theme: string; color: string }> = ({ label, value, onChange, theme, color }) => (
  <div className={`p-6 rounded-[2rem] border-l-4 bg-gray-50/30 border-gray-100 transition-all hover:bg-white hover:shadow-lg ${color}`}>
     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>
     <div className="flex items-center gap-2">
        <span className="text-gray-400 font-black text-sm">$</span>
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`bg-transparent outline-none font-black text-lg w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        />
        <span className="text-gray-400 font-bold text-[10px]">M</span>
     </div>
  </div>
);

const BudgetParameters: React.FC<Props> = ({ theme, budget, onUpdateVigencia, onUpdateBudget }) => {
  const [loading, setLoading] = useState(false);
  const [localBudget, setLocalBudget] = useState<Budget>(budget);
  const [vigencia, setVigencia] = useState('2027');

  useEffect(() => {
    const savedVigencia = localStorage.getItem('global_vigencia');
    if (savedVigencia) setVigencia(savedVigencia);
    setLocalBudget(budget);
  }, [budget]);
  
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      onUpdateVigencia(vigencia);
      onUpdateBudget(localBudget);
      setLoading(false);
    }, 1000);
  };

  const updateCeiling = (name: string, val: number) => {
    setLocalBudget({
      ...localBudget,
      ceilings: {
        ...localBudget.ceilings,
        [name]: val
      }
    });
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tighter mb-1 ${textColor}`}>Parámetros del Presupuesto</h2>
          <p className={`text-xs font-medium ${subTextColor}`}>Configuración global de variables financieras y techos operativos.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-[#EF3340] hover:bg-[#D62E39] text-white text-[11px] font-black px-12 py-4 rounded-2xl transition-all shadow-2xl shadow-red-500/20 flex items-center gap-4 active:scale-95 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          GUARDAR CONFIGURACIÓN GLOBAL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <Section theme={theme} title="Ciclo Fiscal" icon={<Calendar size={20} />}>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vigencia de Planeación (Año)</label>
              <div className="relative group">
                <Milestone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#EF3340]" size={20} />
                <input 
                  type="text" 
                  value={vigencia}
                  onChange={(e) => setVigencia(e.target.value)}
                  placeholder="Ej. 2027"
                  className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none transition-all font-black text-lg ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748] focus:border-[#EF3340]' : 'bg-gray-50 border-gray-100 focus:border-[#EF3340] shadow-inner'}`}
                />
              </div>
              <p className="text-[10px] text-gray-400 italic px-2">Define el año objetivo para todos los módulos de CAPEX.</p>
            </div>
          </Section>

          <Section theme={theme} title="Variables de Mercado" icon={<Globe size={20} />}>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TRM Proyectada (USD/COP)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-[#EF3340]" size={20} />
                  <input 
                    type="number" 
                    value={localBudget.trm}
                    onChange={(e) => setLocalBudget({...localBudget, trm: Number(e.target.value)})}
                    className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none transition-all font-black text-lg ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748] focus:border-[#EF3340]' : 'bg-gray-50 border-gray-100 focus:border-[#EF3340] shadow-inner'}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IVA Aplicable (%)</label>
                <div className="relative group">
                  <Percent className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                  <input 
                    type="number" 
                    value={localBudget.vat}
                    onChange={(e) => setLocalBudget({...localBudget, vat: Number(e.target.value)})}
                    className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none transition-all font-black text-lg ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748] focus:border-[#EF3340]' : 'bg-gray-50 border-gray-100 focus:border-[#EF3340] shadow-inner'}`}
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <Section theme={theme} title="Techos Presupuestales por Vertical" icon={<Layers size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CeilingInput 
                label="Infraestructura de Red" 
                value={localBudget.ceilings['Infraestructura de Red']} 
                onChange={(v) => updateCeiling('Infraestructura de Red', v)}
                theme={theme} 
                color="border-blue-500" 
              />
              <CeilingInput 
                label="Tecnología e IA" 
                value={localBudget.ceilings['Tecnología e IA']} 
                onChange={(v) => updateCeiling('Tecnología e IA', v)}
                theme={theme} 
                color="border-purple-500" 
              />
              <CeilingInput 
                label="Soluciones B2B" 
                value={localBudget.ceilings['Soluciones B2B']} 
                onChange={(v) => updateCeiling('Soluciones B2B', v)}
                theme={theme} 
                color="border-emerald-500" 
              />
              <CeilingInput 
                label="Ciberseguridad" 
                value={localBudget.ceilings['Ciberseguridad']} 
                onChange={(v) => updateCeiling('Ciberseguridad', v)}
                theme={theme} 
                color="border-red-500" 
              />
            </div>
          </Section>

          <Section theme={theme} title="Reglas de Aprobación & Periodos" icon={<ShieldCheck size={20} />}>
             <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Calendar size={24} /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Periodo Contable Activo</p>
                         <p className={`text-sm font-black ${textColor}`}>Q3 - {vigencia} (JUL-SEP)</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                      <Activity className="text-emerald-600" size={24} />
                      <div>
                         <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Umbral Autogestión</p>
                         <p className="text-xs font-bold text-emerald-800">Proyectos &lt; $5,000 COP aprueban en cascada automática.</p>
                      </div>
                   </div>
                   <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                      <TrendingUp className="text-amber-600" size={24} />
                      <div>
                         <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Margen de Error SAP</p>
                         <p className="text-xs font-bold text-amber-800">Tolerancia del 2% sin alerta.</p>
                      </div>
                   </div>
                </div>
             </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default BudgetParameters;
