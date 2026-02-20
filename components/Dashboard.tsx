
import React, { useState, useMemo } from 'react';
import { Budget, Expense } from '../types';
import { 
  TrendingUp, 
  Layers, 
  Activity, 
  Filter, 
  ChevronRight, 
  FolderOpen, 
  BarChart3, 
  Coins, 
  ShoppingCart, 
  Target, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  PieChart as PieChartIcon,
  Download,
  Search,
  Briefcase,
  FileText,
  Gem,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface Props {
  budget: Budget;
  expenses: Expense[];
  theme: 'light' | 'dark';
}

type DashboardView = 'DIRECTORY' | 'PLANNING_REPORT' | 'FOLLOWUP_REPORT';

const Dashboard: React.FC<Props> = ({ theme, budget }) => {
  const [view, setView] = useState<DashboardView>('DIRECTORY');
  
  // Estados para Filtros
  const [filters, setFilters] = useState({
    macro: 'TODOS',
    proyecto: 'TODOS',
    director: 'TODOS',
    gerente: 'TODOS'
  });

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('es-CO').format(val);
  };

  // Mock Data Generada para Reportes
  const planningData = {
    totalNPV: 485000000000,
    avgROI: 24.8,
    efficiency: 1.45,
    categories: [
      { name: 'Crecimiento', value: 45000, color: '#10B981' },
      { name: 'Mantenimiento', value: 30000, color: '#3B82F6' },
      { name: 'Obligatorios', value: 15000, color: '#EF3340' },
      { name: 'Adyacentes', value: 10000, color: '#8B5CF6' },
    ],
    scatterData: [
      { x: 100, y: 150, z: 200, name: 'Core 5G' },
      { x: 250, y: 320, z: 150, name: 'Cloud Mig.' },
      { x: 180, y: 190, z: 100, name: 'B2B Sec.' },
      { x: 400, y: 550, z: 300, name: 'Fiber Rural' },
    ]
  };

  const followUpData = {
    committed: 85400000000,
    executed: 32100000000,
    cashFlow: [
      { name: 'ENE', plan: 120, real: 115 },
      { name: 'FEB', plan: 140, real: 138 },
      { name: 'MAR', plan: 180, real: 195 },
      { name: 'ABR', plan: 220, real: 210 },
      { name: 'MAY', plan: 250, real: 242 },
    ],
    purchaseOrders: [
      { id: '7000124', provider: 'CISCO', concept: 'Switches Nexus', amount: 450000000, status: 'GR RECIBIDO' },
      { id: '7000189', provider: 'NOKIA', concept: 'Licencias Core', amount: 1200000000, status: 'PO EMITIDA' },
      { id: '7000215', provider: 'HUAWEI', concept: 'Antenas Rurales', amount: 890000000, status: 'EN TRANSITO' },
    ]
  };

  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9';

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER DE NAVEGACIÓN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-lg bg-red-50 text-[#EF3340] text-[9px] font-black uppercase tracking-widest border border-red-100">Sophie Analytics v3.0</span>
            {view !== 'DIRECTORY' && (
              <button 
                onClick={() => setView('DIRECTORY')}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-200 transition-all flex items-center gap-1"
              >
                <ArrowRight className="rotate-180" size={10} /> Volver al Directorio
              </button>
            )}
          </div>
          <h2 className={`text-5xl font-black mb-2 tracking-tighter ${textColor}`}>
            {view === 'DIRECTORY' && "Directorios de Inversión"}
            {view === 'PLANNING_REPORT' && "Reporte Estratégico 2027"}
            {view === 'FOLLOWUP_REPORT' && "Seguimiento de Ejecución 0+n"}
          </h2>
          <p className="text-base font-medium text-gray-400">Inteligencia financiera y control de capital Claro Colombia.</p>
        </div>
        
        {view !== 'DIRECTORY' && (
          <div className="flex gap-4">
             <button className="px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                <Download size={14} /> Exportar Data Maestra
             </button>
          </div>
        )}
      </div>

      {/* PANEL DE FILTROS (Solo visible en reportes) */}
      {view !== 'DIRECTORY' && (
        <div className={`p-8 rounded-[2.5rem] border ${cardBg} grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4`}>
          <FilterSelect label="Macroproyecto" value={filters.macro} onChange={(v) => setFilters({...filters, macro: v})} options={['TODOS', 'ENERGÍA', '5G', 'FIBRA', 'CORE IT']} />
          <FilterSelect label="Proyecto" value={filters.proyecto} onChange={(v) => setFilters({...filters, proyecto: v})} options={['TODOS', 'PROYECTO A', 'PROYECTO B']} />
          <FilterSelect label="Director" value={filters.director} onChange={(v) => setFilters({...filters, director: v})} options={['TODOS', 'RICARDO ACOSTA', 'PATRICIA LONDONO']} />
          <FilterSelect label="Gerente" value={filters.gerente} onChange={(v) => setFilters({...filters, gerente: v})} options={['TODOS', 'DANIELA ORJUELA', 'JORGE VARGAS']} />
        </div>
      )}

      {/* VISTA 1: DIRECTORIO DE CARPETAS */}
      {view === 'DIRECTORY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FolderCard 
            title="Planeación Estratégica 2027"
            desc="Modelado financiero de demanda, indicadores de valor (VPN/ROI) y clasificaciones de inversión para el ciclo 2027."
            icon={<BarChart3 size={40} />}
            color="bg-red-500"
            onClick={() => setView('PLANNING_REPORT')}
          />
          <FolderCard 
            title="Seguimiento de Ejecución 0+n"
            desc="Control mensual de ejecución presupuestal, monitoreo de POs SAP, flujo de caja y seguimiento de T-Unitarios."
            icon={<Activity size={40} />}
            color="bg-blue-500"
            onClick={() => setView('FOLLOWUP_REPORT')}
          />
        </div>
      )}

      {/* VISTA 2: REPORTE PLANEACIÓN 2027 */}
      {view === 'PLANNING_REPORT' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          {/* KPIs Financieros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="VPN ACUMULADO (NPV)" value={formatMoney(planningData.totalNPV)} icon={<Gem />} color="text-emerald-500" theme={theme} />
            <StatCard label="ROI DEL PORTAFOLIO" value={`${planningData.avgROI}%`} icon={<TrendingUp />} color="text-blue-500" theme={theme} />
            <StatCard label="ÍNDICE DE EFICIENCIA" value={`${planningData.efficiency}x`} icon={<Target />} color="text-purple-500" theme={theme} />
            <StatCard label="CAPEX REQUERIDO" value={formatMoney(budget.totalIncome)} icon={<Coins />} color="text-red-500" theme={theme} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Gráfico Mix de Inversión */}
            <div className={`lg:col-span-4 p-10 rounded-[4rem] border ${cardBg}`}>
              <h4 className={`text-xl font-black mb-1 ${textColor}`}>Mix de Inversión</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">Distribución por Categoría</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planningData.categories} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {planningData.categories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                 {planningData.categories.map(c => (
                   <div key={c.name} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}></div>
                     <span className="text-[10px] font-black text-gray-500 uppercase">{c.name}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Matriz de Valor Scatter */}
            <div className={`lg:col-span-8 p-10 rounded-[4rem] border ${cardBg}`}>
              <h4 className={`text-xl font-black mb-1 ${textColor}`}>Matriz de Generación de Valor</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">CAPEX (X) vs VPN (Y) por Iniciativa</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis type="number" dataKey="x" name="CAPEX" unit="M" />
                    <YAxis type="number" dataKey="y" name="VPN" unit="M" />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Proyectos" data={planningData.scatterData} fill="#EF3340">
                      {planningData.scatterData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.y > entry.x ? '#10B981' : '#EF3340'} />)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: REPORTE SEGUIMIENTO 0+n */}
      {view === 'FOLLOWUP_REPORT' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="CAPEX COMPROMETIDO" value={formatMoney(followUpData.committed)} icon={<ShoppingCart />} color="text-blue-600" theme={theme} />
            <StatCard label="CAPEX EJECUTADO" value={formatMoney(followUpData.executed)} icon={<Zap />} color="text-emerald-600" theme={theme} />
            <StatCard label="AHORRO EN GESTIÓN" value={formatMoney(5400000000)} icon={<Coins />} color="text-amber-500" theme={theme} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Flujo de Caja Mensual */}
            <div className={`lg:col-span-7 p-10 rounded-[4rem] border ${cardBg}`}>
              <h4 className={`text-xl font-black mb-1 ${textColor}`}>Flujo de Caja Real vs Plan</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">Desembolsos Mensuales Acumulados</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={followUpData.cashFlow}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="plan" stroke="#cbd5e1" fill="#f8fafc" strokeWidth={3} strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="real" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Supervisión T-Unitarios SAP */}
            <div className={`lg:col-span-5 p-10 rounded-[4rem] border ${cardBg}`}>
              <h4 className={`text-xl font-black mb-1 ${textColor}`}>Supervisión SAP T-Unitarios</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Órdenes de Compra Activas</p>
              <div className="space-y-4">
                {followUpData.purchaseOrders.map(po => (
                  <div key={po.id} className="p-5 rounded-3xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-[11px] font-black text-[#EF3340] font-mono">{po.id}</p>
                      <p className={`text-[12px] font-black ${textColor}`}>{po.concept}</p>
                      <p className="text-[9px] font-bold text-gray-400">{po.provider}</p>
                    </div>
                    <div className="text-right">
                       <p className={`text-[13px] font-black ${textColor}`}>{formatMoney(po.amount)}</p>
                       <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase">{po.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componentes Auxiliares
const FolderCard = ({ title, desc, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="group p-10 rounded-[4rem] border border-gray-100 bg-white hover:border-red-500/20 hover:shadow-2xl transition-all text-left flex flex-col min-h-[350px]"
  >
    <div className={`w-20 h-20 rounded-3xl ${color} text-white flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-xl`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">{title}</h3>
      <p className="text-gray-400 font-medium text-base leading-relaxed">{desc}</p>
    </div>
    <div className="mt-8 flex items-center gap-3 text-red-500 font-black text-[11px] uppercase tracking-widest">
      Abrir Carpeta de Informe <ArrowRight size={16} />
    </div>
  </button>
);

const StatCard = ({ label, value, icon, color, theme }: any) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-8 rounded-[3rem] border transition-all flex flex-col justify-between min-h-[180px] ${isDark ? 'bg-[#161b22] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="mt-6">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
        <div className={`text-2xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl text-[11px] font-black outline-none focus:border-red-400 transition-all cursor-pointer"
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 rotate-90" size={14} />
    </div>
  </div>
);

export default Dashboard;
