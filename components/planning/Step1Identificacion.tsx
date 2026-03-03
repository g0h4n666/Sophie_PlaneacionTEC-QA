import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, ListChecks, Lock, Send, Save, Cpu, AlertTriangle, RefreshCw, XCircle, AlertCircle, Clock, CheckCircle2, BarChart3, PieChart as PieChartIcon, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { ProjectRow } from '../Planning';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const stats = useMemo(() => {
    const uniqueMacros = new Set(rows.map(r => r.macroproyecto)).size;
    const totalProjects = rows.length;
    
    const byStatus: Record<string, { count: number, total: number, color: string }> = {
      'BORRADOR': { count: 0, total: 0, color: '#9CA3AF' },
      'EN REVISIÓN': { count: 0, total: 0, color: '#3B82F6' },
      'REVISAR INFO': { count: 0, total: 0, color: '#F59E0B' },
      'APROBADO': { count: 0, total: 0, color: '#10B981' },
      'BACKLOG': { count: 0, total: 0, color: '#EF4444' },
      'PENDIENTE COMITÉ': { count: 0, total: 0, color: '#6366F1' }
    };

    rows.forEach(row => {
      const amount = parseFloat(row.presupuestoCop) || 0;
      let statusKey = 'BORRADOR';

      if (row.estadoSoporte === 'EN REVISION') {
        statusKey = 'EN REVISIÓN';
      } else if (row.estadoSoporte === 'DEVUELTO' || row.scorecard?.decisionComite === 'PIVOT') {
        statusKey = 'REVISAR INFO';
      } else if (row.estadoSoporte === 'APROBADO') {
        const decision = row.scorecard?.decisionComite || 'SIN DECISIÓN';
        if (decision === 'GO') statusKey = 'APROBADO';
        else if (decision === 'NO-GO') statusKey = 'BACKLOG';
        else statusKey = 'PENDIENTE COMITÉ';
      } else if (row.estadoSoporte === 'PENDIENTE') {
        statusKey = 'BORRADOR';
      }

      if (byStatus[statusKey]) {
        byStatus[statusKey].count++;
        byStatus[statusKey].total += amount;
      }
    });

    const pieData = Object.entries(byStatus)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        value: data.count,
        total: data.total,
        color: data.color
      }));

    const totalInvestment = Object.values(byStatus).reduce((acc, curr) => acc + curr.total, 0);

    return {
      uniqueMacros,
      totalProjects,
      byStatus,
      pieData,
      totalInvestment
    };
  }, [rows]);

  const handleDeleteClick = (idx: number) => {
    setDeleteConfirmIdx(idx);
  };

  const confirmDelete = () => {
    if (deleteConfirmIdx !== null) {
      onDelete(deleteConfirmIdx);
      setDeleteConfirmIdx(null);
    }
  };

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

      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Layers size={18} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Macroproyectos</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{stats.uniqueMacros}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Unidades</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={18} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Iniciativas</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalProjects}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Proyectos</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 text-[#EF3340] rounded-xl">
                <DollarSign size={18} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inversión Total</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 tracking-tighter">
                {formatCurrency(stats.totalInvestment)}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Consolidado CAPEX</span>
            </div>
          </div>

          {/* Resumen por Estado */}
          <div className="md:col-span-3 bg-[#F8F9FB] p-6 rounded-[3rem] border border-gray-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.byStatus).map(([status, data]) => {
              const d = data as { count: number, total: number, color: string };
              return (
                <div key={status} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter truncate">{status}</span>
                  </div>
                  <p className="text-lg font-black text-gray-900 tracking-tighter leading-none">{d.count}</p>
                  <p className="text-[9px] font-bold text-gray-400 mt-1">{formatCurrency(d.total)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <PieChartIcon size={18} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distribución por Estado</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} Proyectos (${formatCurrency(props.payload.total)})`,
                    name
                  ]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
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
                const renderStatus = () => {
                  if (row.estadoSoporte === 'PENDIENTE') {
                    return <span className="text-gray-300 font-black uppercase text-[9px]">Borrador</span>;
                  }
                  
                  if (row.estadoSoporte === 'EN REVISION') {
                    return (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-black text-[9px] uppercase animate-pulse">
                        <RefreshCw size={10} className="animate-spin" /> EN REVISIÓN
                      </div>
                    );
                  }

                  if (row.estadoSoporte === 'DEVUELTO' || row.scorecard?.decisionComite === 'PIVOT') {
                    return (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 font-black text-[9px] uppercase">
                        <AlertTriangle size={10} /> REVISAR INFO
                      </div>
                    );
                  }

                  if (row.estadoSoporte === 'APROBADO') {
                    const decision = row.scorecard?.decisionComite || 'SIN DECISIÓN';
                    
                    if (decision === 'GO') {
                      return (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[9px] uppercase">
                          <CheckCircle2 size={10} /> APROBADO
                        </div>
                      );
                    }
                    
                    if (decision === 'NO-GO') {
                      return (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-black text-[9px] uppercase">
                          <XCircle size={10} /> BACKLOG
                        </div>
                      );
                    }
                    
                    return (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-black text-[9px] uppercase">
                        <Clock size={10} /> PENDIENTE COMITE
                      </div>
                    );
                  }

                  return <span className="text-gray-300 font-black uppercase text-[9px]">Borrador</span>;
                };

                const isReview = row.scorecard?.decisionComite === 'PIVOT' || row.estadoSoporte === 'DEVUELTO' || row.estadoSoporte === 'EN REVISION';
                
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
                      {renderStatus()}
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
                      <div className="flex justify-center items-center gap-3 transition-all duration-300">
                        {canModify ? (
                          <>
                            <button 
                              onClick={() => onEdit(idx)} 
                              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all border border-gray-100 shadow-sm" 
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(idx)} 
                              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-[#EF3340] transition-all border border-gray-100 shadow-sm" 
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              onClick={() => onSend(idx)} 
                              className="p-3.5 rounded-2xl bg-[#F1FBF4] text-[#108548] hover:bg-[#108548] hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-md border border-[#D1F2DC]"
                              title="Enviar a Clasificación"
                            >
                              <Send size={18} strokeWidth={2.5} />
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
        </div>
      )}

      {/* Popup de Confirmación de Eliminación */}
      {deleteConfirmIdx !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 text-[#EF3340] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">¿Confirmar Eliminación?</h4>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-4">
                  Esta acción eliminará permanentemente la iniciativa <span className="text-red-500">"{rows[deleteConfirmIdx].proyecto}"</span> y todos sus ítems asociados.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setDeleteConfirmIdx(null)}
                  className="flex-1 py-4 rounded-2xl text-[11px] font-black text-gray-400 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl text-[11px] font-black text-white bg-[#EF3340] shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1Identificacion;