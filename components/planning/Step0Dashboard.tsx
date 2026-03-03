
import React, { useMemo } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ProjectRow } from '../Planning';
import { motion } from 'framer-motion';

interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
}

const COLORS = ['#EF3340', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#EC4899'];

const Step0Dashboard: React.FC<Props> = ({ rows, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  const stats = useMemo(() => {
    const totalCapex = rows.reduce((acc, row) => acc + (parseFloat(row.presupuestoCop) || 0), 0);
    const macroprojects = new Set(rows.map(r => r.macroproyecto)).size;
    const approved = rows.filter(r => r.estadoSoporte === 'APROBADO').length;
    const inProgress = rows.filter(r => r.estadoSoporte === 'EN REVISION' || r.estadoSoporte === 'PENDIENTE').length;
    
    // CAPEX by Macroproject
    const capexByMacro: Record<string, number> = {};
    rows.forEach(r => {
      capexByMacro[r.macroproyecto] = (capexByMacro[r.macroproyecto] || 0) + (parseFloat(r.presupuestoCop) || 0);
    });
    const macroData = Object.entries(capexByMacro).map(([name, value]) => ({ name, value }));

    // Status Distribution
    const statusCounts: Record<string, number> = {};
    rows.forEach(r => {
      const status = r.estadoSoporte || 'PENDIENTE';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // Projects by Stage (Funnel-like)
    const stageData = [
      { name: 'Identificación', value: rows.length },
      { name: 'Clasificación', value: rows.filter(r => r.categoria || r.categoriasEstrategicas.length > 0).length },
      { name: 'Pressure Test', value: rows.filter(r => r.scorecard && r.scorecard.decisionComite !== 'SIN DECISIÓN').length },
      { name: 'Consolidación', value: rows.filter(r => r.estadoSoporte === 'APROBADO').length },
    ];

    return {
      totalCapex,
      macroprojects,
      approved,
      inProgress,
      macroData,
      statusData,
      stageData
    };
  }, [rows]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="CAPEX TOTAL" 
          value={formatCurrency(stats.totalCapex)} 
          subValue="Presupuesto Consolidado" 
          icon={<DollarSign size={20} />} 
          color="text-red-500" 
          theme={theme}
        />
        <KPICard 
          label="MACROPROYECTOS" 
          value={stats.macroprojects} 
          subValue="Verticales Estratégicas" 
          icon={<Layers size={20} />} 
          color="text-blue-500" 
          theme={theme}
        />
        <KPICard 
          label="EN TRÁMITE" 
          value={stats.inProgress} 
          subValue="Proyectos en Revisión" 
          icon={<Clock size={20} />} 
          color="text-amber-500" 
          theme={theme}
        />
        <KPICard 
          label="APROBADOS" 
          value={stats.approved} 
          subValue="Proyectos Validados" 
          icon={<CheckCircle2 size={20} />} 
          color="text-emerald-500" 
          theme={theme}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CAPEX by Macroproject */}
        <div className={`lg:col-span-2 p-8 rounded-[2.5rem] border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-red-500" size={20} />
            <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Distribución CAPEX por Macroproyecto
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.macroData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: isDark ? '#999' : '#666' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
                  tick={{ fontSize: 10, fontWeight: 700, fill: isDark ? '#999' : '#666' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#1a1f26' : '#fff',
                    color: isDark ? '#fff' : '#000'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {stats.macroData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-8">
            <PieChartIcon className="text-blue-500" size={20} />
            <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Estado de Proyectos
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#1a1f26' : '#fff',
                    color: isDark ? '#fff' : '#000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {stats.statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Progress Funnel */}
      <div className="grid grid-cols-1 gap-8">
        <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-emerald-500" size={20} />
            <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Avance por Etapa del Ciclo (Pipeline)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.stageData.map((stage, idx) => (
              <div key={stage.name} className="relative">
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} text-center`}>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{stage.name}</p>
                  <p className={`text-3xl font-black ${textColor}`}>{stage.value}</p>
                  <p className="text-[9px] font-bold text-gray-400 mt-1">Iniciativas</p>
                </div>
                {idx < stats.stageData.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-white dark:bg-[#0b0e14] border border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center shadow-sm">
                      <TrendingUp size={12} className="text-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Table or Step Progress */}
      <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-purple-500" size={20} />
          <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Resumen de Iniciativas por Macroproyecto
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Macroproyecto</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Proyectos</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Inversión Total</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {Object.entries(
                rows.reduce((acc, r) => {
                  if (!acc[r.macroproyecto]) acc[r.macroproyecto] = { count: 0, capex: 0, approved: 0 };
                  acc[r.macroproyecto].count += 1;
                  acc[r.macroproyecto].capex += parseFloat(r.presupuestoCop) || 0;
                  if (r.estadoSoporte === 'APROBADO') acc[r.macroproyecto].approved += 1;
                  return acc;
                }, {} as Record<string, { count: number, capex: number, approved: number }>)
              ).map(([name, data]: [string, any]) => (
                <tr key={name} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-black uppercase ${textColor}`}>{name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[11px] font-bold text-gray-500">{data.count}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[11px] font-black text-red-500">{formatCurrency(data.capex)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${(data.approved / data.count) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400">{Math.round((data.approved / data.count) * 100)}% Aprobado</span>
                    </div>
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

const KPICard: React.FC<{ 
  label: string, 
  value: string | number, 
  subValue: string, 
  icon: React.ReactNode, 
  color: string,
  theme: 'light' | 'dark'
}> = ({ label, value, subValue, icon, color, theme }) => {
  const isDark = theme === 'dark';
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[2rem] border transition-all flex flex-col justify-between min-h-[140px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-50'} ${color}`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex flex-col">
          <span className={`text-xl font-black tracking-tighter leading-none mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </span>
          <span className="text-[9px] font-bold text-gray-400 opacity-60 uppercase">{subValue}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Step0Dashboard;
