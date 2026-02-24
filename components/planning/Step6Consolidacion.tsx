
import React, { useMemo, useState } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Calculator, 
  ArrowRight, 
  Wallet,
  Zap,
  TrendingUp,
  ShieldAlert,
  Inbox,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Gem,
  Activity,
  Download,
  FileSpreadsheet
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
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';
import { ProjectRow } from '../Planning';

interface Props {
  rows: ProjectRow[];
  theme: 'light' | 'dark';
  onFinalize: () => void;
  canModify: boolean;
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

const formatWithSeparators = (val: string | number | undefined) => {
  if (val === undefined || val === null || val === '') return '';
  const numericValue = val.toString().replace(/\D/g, '');
  return new Intl.NumberFormat('es-CO').format(parseInt(numericValue) || 0);
};

// Paleta de colores Premium
const COLORS = {
  red: '#EF3340',
  blue: '#3B82F6',
  emerald: '#10B981',
  indigo: '#6366F1',
  amber: '#F59E0B',
  gray: '#94a3b8',
  lightGray: '#F1F5F9',
  dark: '#0b0e14'
};

const Step6Consolidacion: React.FC<Props> = ({ rows: allRows, theme, onFinalize, canModify }) => {
  // Solo mostrar iniciativas que hayan sido persistidas en Paso 3 (Pressure Test)
  const rows = allRows.filter(r => r.scorecardPersistido === true);
  const [availableCapex, setAvailableCapex] = useState<number>(15000000000); 
  const [hoveredProject, setHoveredProject] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';

  const analytics = useMemo(() => {
    const processed = rows.map(r => {
      const s = r.scorecard || { pilarEstrategico: 3, pilarFinanciero: 3, pilarRiesgo: 3, pilarEquipo: 3, pilarUrgencia: 3 };
      const stratVal = (s.pilarEstrategico || 0) * 20;
      const finVal = (s.pilarFinanciero || 0) * 20;
      const riskVal = (s.pilarRiesgo || 3) * 20; 
      const calculatedScore = (stratVal * 0.4) + (finVal * 0.4) - (riskVal * 0.2);
      const capex = parseFloat(r.presupuestoCop) || 0;
      const vpn = parseFloat(r.businessCase?.indicadores?.vpn) || 0;
      
      return {
        ...r,
        vpn,
        capex,
        normalizedScore: Math.round(calculatedScore),
        tipo: r.categoria || 'POR DEFINIR',
        scores: s
      };
    }).sort((a, b) => b.normalizedScore - a.normalizedScore);

    let runningTotal = 0;
    let cutIdx = -1;
    const waterlineData = processed.map((p, idx) => {
      runningTotal += p.capex;
      const isApproved = runningTotal <= availableCapex;
      if (!isApproved && cutIdx === -1) cutIdx = idx;
      return { ...p, acumulado: runningTotal, estadoWaterline: isApproved ? 'APROBADO' : 'BACKLOG' };
    });

    const approvedOnly = waterlineData.filter(p => p.estadoWaterline === 'APROBADO');

    // Categorías (Paso 2)
    const categoryStats: Record<string, number> = {};
    approvedOnly.forEach(p => {
      categoryStats[p.tipo] = (categoryStats[p.tipo] || 0) + p.capex;
    });
    const categoryData = Object.keys(categoryStats).map(cat => ({
      name: cat.substring(0, 12),
      value: categoryStats[cat]
    }));

    // Top 5 VPN
    const topVpnData = [...approvedOnly]
      .sort((a,b) => b.vpn - a.vpn)
      .slice(0, 5)
      .map(p => ({
        name: p.proyecto.length > 10 ? p.proyecto.substring(0, 10) + '..' : p.proyecto,
        vpn: p.vpn
      }));

    // Radar de Pilares (Paso 3)
    const avgScores = { Estrategia: 0, Finanzas: 0, Riesgo: 0, Equipo: 0, Urgencia: 0 };
    if (approvedOnly.length > 0) {
      approvedOnly.forEach(p => {
        avgScores.Estrategia += p.scores.pilarEstrategico;
        avgScores.Finanzas += p.scores.pilarFinanciero;
        avgScores.Riesgo += p.scores.pilarRiesgo;
        avgScores.Equipo += p.scores.pilarEquipo;
        avgScores.Urgencia += p.scores.pilarUrgencia;
      });
      Object.keys(avgScores).forEach(k => avgScores[k as keyof typeof avgScores] /= approvedOnly.length);
    }
    const radarData = Object.keys(avgScores).map(k => ({
      subject: k,
      A: avgScores[k as keyof typeof avgScores],
      fullMark: 5
    }));

    return {
      projects: waterlineData,
      cutIdx,
      totalRequested: runningTotal,
      totalApprovedCapex: approvedOnly.reduce((a,b)=>a+b.capex, 0),
      approvedCount: approvedOnly.length,
      backlogCount: waterlineData.filter(p => p.estadoWaterline === 'BACKLOG').length,
      categoryData,
      topVpnData,
      radarData
    };
  }, [rows, availableCapex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleDownloadCSV = () => {
    const headers = ["Ranking", "Macroproyecto", "ID Proyecto", "Nombre Iniciativa", "Categoria", "Inversion COP", "Score Sophie", "Estado Waterline"];
    const rowsCSV = analytics.projects.map((p, idx) => [
      idx + 1,
      `"${p.macroproyecto}"`,
      `"${p.idProyecto}"`,
      `"${p.proyecto}"`,
      `"${p.tipo}"`,
      p.capex,
      p.normalizedScore,
      `"${p.estadoWaterline}"`
    ]);

    const csvContent = [headers, ...rowsCSV].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Portafolio_Sophie_Consolidado_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const usagePercent = Math.min(100, (analytics.totalApprovedCapex / availableCapex) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-10 pb-20 relative">
      
      {/* 1. KPIs SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="PRESUPUESTO DISPONIBLE" value={formatCurrency(availableCapex)} subValue="Techo de Inversión" icon={<Calculator size={18} />} color="text-gray-500" />
        <KPICard label="INVERSIÓN APROBADA" value={formatCurrency(analytics.totalApprovedCapex)} subValue={`${analytics.approvedCount} Proyectos`} icon={<CheckCircle2 size={18} />} color="text-emerald-500" highlight />
        <KPICard label="REMANENTE / DÉFICIT" value={formatCurrency(availableCapex - analytics.totalApprovedCapex)} subValue="Diferencia de Fondos" icon={<RefreshCw size={18} />} color="text-blue-500" />
        <KPICard label="EN BACKLOG" value={analytics.backlogCount} subValue={formatCurrency(analytics.totalRequested - analytics.totalApprovedCapex)} icon={<Inbox size={18} />} color="text-amber-500" />
      </div>

      {/* 2. DASHBOARD DE ANALÍTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gráfico Barras: Categorías */}
        <div className={`lg:col-span-4 p-8 rounded-[3.5rem] border ${cardBg} shadow-sm h-[380px] flex flex-col`}>
            <div className="flex items-center gap-3 mb-8">
               <Layers className="text-[#EF3340]" size={18} />
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distribución por Categoría</h4>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={theme === 'dark' ? '#333' : '#f1f1f1'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: COLORS.gray, fontSize: 8, fontWeight: 900}} width={80} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px' }}
                    formatter={(v: any) => formatCurrency(v)}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={16}>
                    {analytics.categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.red : COLORS.blue} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Gráfico Barras: Top VPN */}
        <div className={`lg:col-span-4 p-8 rounded-[3.5rem] border ${cardBg} shadow-sm h-[380px] flex flex-col`}>
            <div className="flex items-center gap-3 mb-8">
               <Gem className="text-emerald-500" size={18} />
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generación de Valor (VPN)</h4>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topVpnData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: COLORS.gray, fontSize: 8, fontWeight: 900}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px' }}
                    formatter={(v: any) => formatCurrency(v)}
                  />
                  <Bar dataKey="vpn" radius={[10, 10, 0, 0]} barSize={22} fill={COLORS.emerald} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Gráfico Radar: Equilibrio */}
        <div className={`lg:col-span-4 p-8 rounded-[3.5rem] border ${cardBg} shadow-sm h-[380px] flex flex-col`}>
            <div className="flex items-center gap-3 mb-8">
               <Target className="text-indigo-500" size={18} />
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Equilibrio Pressure Test</h4>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={analytics.radarData}>
                  <PolarGrid stroke={theme === 'dark' ? '#333' : '#e2e8f0'} />
                  <PolarAngleAxis dataKey="subject" tick={{fill: COLORS.gray, fontSize: 8, fontWeight: 900}} />
                  <Radar name="Promedio" dataKey="A" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* 3. BARRA DE TECHO PRESUPUESTAL REFINADA SEGÚN REFERENCIA - ANCHO COMPLETO */}
      <div className={`p-10 rounded-[3.5rem] border ${cardBg} shadow-xl flex flex-col md:flex-row items-center justify-between gap-10`}>
        <div className="flex items-center gap-6 shrink-0">
          <div className="w-16 h-16 bg-[#0b0e14] text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
            <Wallet size={32} />
          </div>
          <div>
            <h3 className={`text-xl font-black text-gray-900 tracking-tight leading-none`}>Techo Presupuestal Ciclo</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Defina el límite de inversión (Waterline)</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row items-center gap-10 w-full">
          <div className="flex-1 relative w-full group">
            <div className="flex items-center gap-3 px-10 py-6 bg-gray-100/50 rounded-[2.5rem] border border-gray-100 transition-all focus-within:ring-4 focus-within:ring-red-50 focus-within:border-red-200">
              <span className="text-gray-400 font-black text-lg">$</span>
              <input 
                type="text"
                value={formatWithSeparators(availableCapex)}
                onChange={(e) => setAvailableCapex(Number(e.target.value.replace(/\D/g, '')) || 0)}
                className="w-full bg-transparent outline-none text-2xl font-black text-[#EF3340] placeholder:text-gray-200"
                placeholder="0"
              />
            </div>
            <div className="absolute left-10 -bottom-6">
              <p className="text-[9px] font-black text-gray-400 uppercase">Equivale a: {formatCurrency(availableCapex)}</p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-3 min-w-[220px]">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Utilización de fondos:</p>
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                <div 
                  className="h-full bg-[#10B981] transition-all duration-1000 ease-out"
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter">{usagePercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABLA WATERLINE */}
      <div className={`p-12 rounded-[4rem] border shadow-2xl space-y-10 ${cardBg}`}>
        <div className="flex justify-between items-end border-b border-gray-50 pb-8">
           <div>
              <h2 className={`text-4xl font-black tracking-tighter ${textColor}`}>🌊 Priorización Estratégica</h2>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">Iniciativas ordenadas por Sophie Score (Ponderado P2 + P3)</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 bg-red-50 text-[#EF3340] rounded-xl text-[10px] font-black border border-red-100">
                CAPEX TOTAL: {formatCurrency(analytics.totalRequested)}
              </div>
           </div>
        </div>

        <div className="overflow-hidden rounded-[3rem] border border-gray-100 bg-white">
           <table className="w-full text-left text-[11px]">
             <thead className="bg-[#0b0e14] text-white font-black uppercase tracking-widest">
               <tr>
                 <th className="px-8 py-7 text-center">RK</th>
                 <th className="px-8 py-7">Iniciativa</th>
                 <th className="px-8 py-7">Categoría</th>
                 <th className="px-8 py-7 text-right">Inversión</th>
                 <th className="px-8 py-7 text-right">Acumulado</th>
                 <th className="px-8 py-7 text-center">Score</th>
                 <th className="px-8 py-7 text-center">Estado</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {analytics.projects.map((p, idx) => {
                 const isCorte = idx === analytics.cutIdx;
                 return (
                   <React.Fragment key={p.idProyecto}>
                     {isCorte && (
                       <tr className="bg-red-50/80">
                         <td colSpan={7} className="px-8 py-4 text-center">
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.5em]">--- UMBRAL PRESUPUESTAL EXCEDIDO ---</span>
                         </td>
                       </tr>
                     )}
                     <tr 
                       onMouseEnter={() => setHoveredProject(p)}
                       onMouseLeave={() => setHoveredProject(null)}
                       onMouseMove={handleMouseMove}
                       className={`transition-all cursor-crosshair group ${p.estadoWaterline === 'BACKLOG' ? 'opacity-40 grayscale-[80%]' : 'hover:bg-red-50/10'}`}
                     >
                        <td className="px-8 py-6 text-center font-black text-gray-400 group-hover:text-[#EF3340]">{idx + 1}</td>
                        <td className="px-8 py-6">
                          <p className="font-black text-gray-900 uppercase tracking-tight leading-none">{p.proyecto}</p>
                          <p className="text-[9px] font-mono text-gray-400 mt-1">{p.idProyecto}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 font-black text-[9px] uppercase">{p.tipo}</span>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-gray-800">{formatCurrency(p.capex)}</td>
                        <td className="px-8 py-6 text-right font-bold text-gray-400">{formatCurrency(p.acumulado)}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`text-sm font-black ${p.normalizedScore > 70 ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {p.normalizedScore}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-black text-[10px] border ${
                            p.estadoWaterline === 'APROBADO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                          }`}>
                            {p.estadoWaterline === 'APROBADO' ? 'APROBADO' : 'EN ESPERA'}
                          </div>
                        </td>
                     </tr>
                   </React.Fragment>
                 );
               })}
             </tbody>
           </table>
        </div>
      </div>

      {/* FOOTER ACCIÓN Y DESCARGA CSV */}
      <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-8">
          <button 
            onClick={handleDownloadCSV}
            className="px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border-2 border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-4 active:scale-95 shadow-sm"
          >
            <FileSpreadsheet size={18} /> DESCARGAR PORTAFOLIO (CSV)
          </button>

          <button 
            onClick={onFinalize}
            disabled={!canModify || analytics.approvedCount === 0}
            className={`group px-24 py-8 rounded-full text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center gap-6 active:scale-95 border-b-4 border-black/20 ${
              canModify && analytics.approvedCount > 0 
              ? 'bg-[#0b0e14] text-white hover:bg-[#EF3340] shadow-black/20' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            CONFIRMAR OPTIMIZACIÓN Y SELLAR <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </button>
      </div>

      <div className="flex justify-center">
         <div className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
            <Download size={14} className="text-gray-400" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">Al exportar se incluirá el detalle de los {rows.length} macroproyectos y proyectos registrados en este ciclo.</p>
         </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ label: string, value: string | number, subValue: string, icon: React.ReactNode, color: string, highlight?: boolean }> = ({ label, value, subValue, icon, color, highlight }) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group ${highlight ? 'bg-emerald-50/50 border-emerald-100 shadow-xl' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="mt-6">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">{label}</p>
      <div className="flex flex-col">
        <span className={`text-xl font-black tracking-tighter ${color} leading-none mb-1.5`}>{value}</span>
        <span className="text-[9px] font-black text-gray-400 opacity-60 uppercase">{subValue}</span>
      </div>
    </div>
  </div>
);

export default Step6Consolidacion;
