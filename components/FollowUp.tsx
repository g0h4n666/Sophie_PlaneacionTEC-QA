import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Milestone, Search, Filter, Download, Plus, User, Users, ChevronDown, Target, TrendingUp, BarChart3, ArrowUpRight, PieChart, Briefcase, ShoppingCart, Zap, Activity } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import { Budget } from '../types';

interface FollowUpProps {
  theme: 'light' | 'dark';
  budget: Budget;
}

const FollowUp: React.FC<FollowUpProps> = ({ theme, budget }) => {
  const isDark = theme === 'dark';

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

  const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

  // Mock data for the hierarchy including projects
  const hierarchy = [
    {
      corporativo: "IADER MALDONADO",
      areas: [
        {
          nombre: "HUGO SALAZAR",
          gerentes: [
            {
              nombre: "MAURICIO SANCHEZ",
              macros: [
                {
                  nombre: "ENERGÍA 2026",
                  proyectos: [
                    {
                      nombre: "OPTIMIZACIÓN RED ELÉCTRICA",
                      ids: ["PRJ-ENG-001", "PRJ-ENG-002"],
                      detalles: [
                        { 
                          rubro: "IT", 
                          subrubro: "SOFTWARE", 
                          posPresupuestal: "520010", 
                          metrica: "LICENCIAS", 
                          servicios: "SOPORTE TÉCNICO", 
                          proveedor: "MICROSOFT", 
                          cantidad: 50,
                          capexCop: 250000000,
                          capexUsd: 62500,
                          mensual: MONTHS.map(m => ({ 
                            mes: m, 
                            comprometido: 4, 
                            fcComprometido: "100",
                            ejecutado: Math.floor(Math.random() * 5),
                            fcEjecutado: "FC" + Math.floor(Math.random() * 100),
                            capexComprometido: 20000000 + Math.floor(Math.random() * 5000000),
                            capexComprometidoReal: 21000000 + Math.floor(Math.random() * 4000000),
                            capexEjecutado: 18000000 + Math.floor(Math.random() * 6000000),
                            capexReal: 17000000 + Math.floor(Math.random() * 7000000)
                          }))
                        },
                        { 
                          rubro: "RED", 
                          subrubro: "HARDWARE", 
                          posPresupuestal: "520020", 
                          metrica: "EQUIPOS", 
                          servicios: "INSTALACIÓN", 
                          proveedor: "CISCO", 
                          cantidad: 12,
                          capexCop: 450000000,
                          capexUsd: 112500,
                          mensual: MONTHS.map(m => ({ 
                            mes: m, 
                            comprometido: 1, 
                            fcComprometido: "FC-A",
                            ejecutado: Math.floor(Math.random() * 2),
                            fcEjecutado: "FC-B",
                            capexComprometido: 35000000 + Math.floor(Math.random() * 5000000),
                            capexComprometidoReal: 36000000 + Math.floor(Math.random() * 4000000),
                            capexEjecutado: 30000000 + Math.floor(Math.random() * 10000000),
                            capexReal: 28000000 + Math.floor(Math.random() * 12000000)
                          }))
                        }
                      ]
                    },
                    {
                      nombre: "SUBESTACIÓN NORTE",
                      ids: ["PRJ-ENG-003"],
                      detalles: [
                        { 
                          rubro: "OBRA", 
                          subrubro: "CIVIL", 
                          posPresupuestal: "530010", 
                          metrica: "METROS", 
                          servicios: "CONSTRUCCIÓN", 
                          proveedor: "CONCRETO S.A.", 
                          cantidad: 500,
                          capexCop: 1200000000,
                          capexUsd: 300000,
                          mensual: MONTHS.map(m => ({ 
                            mes: m, 
                            comprometido: 40, 
                            fcComprometido: "FC-CIV",
                            ejecutado: Math.floor(Math.random() * 45),
                            fcEjecutado: "FC-CIV-E",
                            capexComprometido: 100000000 + Math.floor(Math.random() * 10000000),
                            capexComprometidoReal: 105000000 + Math.floor(Math.random() * 8000000),
                            capexEjecutado: 95000000 + Math.floor(Math.random() * 15000000),
                            capexReal: 90000000 + Math.floor(Math.random() * 20000000)
                          }))
                        }
                      ]
                    }
                  ]
                },
                {
                  nombre: "DATA 2026",
                  proyectos: [
                    {
                      nombre: "MIGRACIÓN CLOUD",
                      ids: ["PRJ-DAT-001"],
                      detalles: [
                        { 
                          rubro: "IT", 
                          subrubro: "CLOUD", 
                          posPresupuestal: "540010", 
                          metrica: "INSTANCIAS", 
                          servicios: "MIGRACIÓN", 
                          proveedor: "AWS", 
                          cantidad: 5,
                          capexCop: 150000000,
                          capexUsd: 37500,
                          mensual: MONTHS.map(m => ({ 
                            mes: m, 
                            comprometido: 1, 
                            fcComprometido: "FC-CLD",
                            ejecutado: 0,
                            fcEjecutado: "",
                            capexComprometido: 12000000,
                            capexComprometidoReal: 12000000,
                            capexEjecutado: 0,
                            capexReal: 0
                          }))
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            { nombre: "JUAN PEREZ", macros: [] },
            { nombre: "ANA MARIA", macros: [] }
          ]
        },
        {
          nombre: "CARLOS RODRIGUEZ",
          gerentes: [
            { nombre: "LUIS GOMEZ", macros: [] },
            { nombre: "MARIA PAULA", macros: [] }
          ]
        }
      ]
    },
    {
      corporativo: "FRANCISCO GOMEZ",
      areas: [
        {
          nombre: "RICARDO ACOSTA",
          gerentes: [
            { nombre: "FELIPE TORRES", macros: [] },
            { nombre: "SANDRA MILENA", macros: [] }
          ]
        }
      ]
    }
  ];

  const [selectedCorp, setSelectedCorp] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedGerente, setSelectedGerente] = useState<string>("");
  const [selectedMacro, setSelectedMacro] = useState<string>("");
  const [selectedProyecto, setSelectedProyecto] = useState<string>("");
  const [selectedIdProyecto, setSelectedIdProyecto] = useState<string>("");
  const [trackingMode, setTrackingMode] = useState<'METRICA' | 'CAPEX' | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("TODOS");
  const [localMetricaEjecutada, setLocalMetricaEjecutada] = useState<Record<string, number[]>>({});
  const [localFCEjecutado, setLocalFCEjecutado] = useState<Record<string, string[]>>({});

  const availableAreas = useMemo(() => {
    if (!selectedCorp) return [];
    return hierarchy.find(h => h.corporativo === selectedCorp)?.areas || [];
  }, [selectedCorp]);

  const availableGerentes = useMemo(() => {
    if (!selectedArea) return [];
    return availableAreas.find(a => a.nombre === selectedArea)?.gerentes || [];
  }, [selectedArea, availableAreas]);

  const availableMacros = useMemo(() => {
    if (!selectedGerente) return [];
    return availableGerentes.find(g => g.nombre === selectedGerente)?.macros || [];
  }, [selectedGerente, availableGerentes]);

  const availableProyectos = useMemo(() => {
    if (!selectedMacro) return [];
    return availableMacros.find(m => m.nombre === selectedMacro)?.proyectos || [];
  }, [selectedMacro, availableMacros]);

  const availableIds = useMemo(() => {
    if (!selectedProyecto) return [];
    return availableProyectos.find(p => p.nombre === selectedProyecto)?.ids || [];
  }, [selectedProyecto, availableProyectos]);

  const projectDetails = useMemo(() => {
    if (!selectedProyecto) return [];
    const details = availableProyectos.find(p => p.nombre === selectedProyecto)?.detalles || [];
    return details;
  }, [selectedProyecto, availableProyectos]);

  // Chart Data Calculation
  const chartData = useMemo(() => {
    if (projectDetails.length === 0) return [];
    
    return MONTHS.map((month, monthIdx) => {
      let totalComp = 0;
      let totalEjec = 0;
      
      projectDetails.forEach((detail, detailIdx) => {
        const key = `${selectedProyecto}-${detailIdx}`;
        totalComp += detail.mensual[monthIdx].comprometido;
        totalEjec += localMetricaEjecutada[key]?.[monthIdx] ?? 0;
      });
      
      const spi = totalComp > 0 ? (totalEjec / totalComp) : (totalEjec > 0 ? 1.2 : 1);
      
      return {
        name: month,
        Comprometido: totalComp,
        Ejecutado: totalEjec,
        SPI: parseFloat(spi.toFixed(2))
      };
    });
  }, [projectDetails, localMetricaEjecutada, selectedProyecto]);

  const capexChartData = useMemo(() => {
    if (projectDetails.length === 0) return [];
    
    return MONTHS.map((month, monthIdx) => {
      let totalComp = 0;
      let totalEjec = 0;
      
      projectDetails.forEach((detail) => {
        totalComp += detail.mensual[monthIdx].capexComprometido || 0;
        totalEjec += detail.mensual[monthIdx].capexEjecutado || 0;
      });
      
      const cpi = totalComp > 0 ? (totalEjec / totalComp) : (totalEjec > 0 ? 1.2 : 1);
      
      return {
        name: month,
        Comprometido: totalComp,
        Ejecutado: totalEjec,
        CPI: parseFloat(cpi.toFixed(2))
      };
    });
  }, [projectDetails]);

  // Initialize local states when projectDetails changes
  useEffect(() => {
    if (projectDetails.length > 0) {
      const initialMetrica: Record<string, number[]> = {};
      const initialFC: Record<string, string[]> = {};
      
      projectDetails.forEach((detail, idx) => {
        const key = `${selectedProyecto}-${idx}`;
        initialMetrica[key] = detail.mensual.map(m => m.ejecutado);
        initialFC[key] = detail.mensual.map(m => m.fcEjecutado || "");
      });
      
      setLocalMetricaEjecutada(initialMetrica);
      setLocalFCEjecutado(initialFC);
    }
  }, [projectDetails, selectedProyecto]);

  const handleMetricaChange = (detailIdx: number, monthIdx: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalMetricaEjecutada(prev => {
      const key = `${selectedProyecto}-${detailIdx}`;
      const currentArray = [...(prev[key] || [])];
      currentArray[monthIdx] = numValue;
      return { ...prev, [key]: currentArray };
    });
  };

  const handleFCChange = (detailIdx: number, monthIdx: number, value: string) => {
    setLocalFCEjecutado(prev => {
      const key = `${selectedProyecto}-${detailIdx}`;
      const currentArray = [...(prev[key] || [])];
      currentArray[monthIdx] = value;
      return { ...prev, [key]: currentArray };
    });
  };

  // Reset dependent filters when parent changes
  useEffect(() => {
    setSelectedArea("");
    setSelectedGerente("");
    setSelectedMacro("");
    setSelectedProyecto("");
    setSelectedIdProyecto("");
  }, [selectedCorp]);

  useEffect(() => {
    setSelectedGerente("");
    setSelectedMacro("");
    setSelectedProyecto("");
    setSelectedIdProyecto("");
  }, [selectedArea]);

  useEffect(() => {
    setSelectedMacro("");
    setSelectedProyecto("");
    setSelectedIdProyecto("");
  }, [selectedGerente]);

  useEffect(() => {
    setSelectedProyecto("");
    setSelectedIdProyecto("");
  }, [selectedMacro]);

  useEffect(() => {
    setSelectedIdProyecto("");
  }, [selectedProyecto]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Seguimiento <span className="text-[#EF3340]">0+n</span>
          </h2>
          <p className="text-gray-400 font-medium text-sm mt-1">
            Módulo de control y ejecución presupuestal en tiempo real.
          </p>
        </div>

        <div className="flex gap-6">
          <div className={`px-8 py-4 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'} flex flex-col`}>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Metas (Presupuesto)</span>
            <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatMoney(budget.totalIncome)}</span>
          </div>
          <div className={`px-8 py-4 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'} flex flex-col`}>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">CAPEX (Outlook)</span>
            <span className={`text-xl font-black text-blue-600`}>{formatMoney(125400000000)}</span>
          </div>
        </div>
      </div>

      {/* Hierarchical Filters Section - Government */}
      <div className={`p-10 border rounded-[3rem] transition-all ${isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-50 rounded-2xl text-[#EF3340] border border-red-100">
            <User size={24} />
          </div>
          <h3 className={`text-xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Gobierno & Responsables
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Director Corporativo */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Director Corporativo *
            </label>
            <div className="relative">
              <select 
                value={selectedCorp}
                onChange={(e) => setSelectedCorp(e.target.value)}
                className={`w-full appearance-none px-6 py-4 text-xs font-black rounded-2xl border outline-none transition-all cursor-pointer pr-12 uppercase ${
                  isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                  : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                }`}
              >
                <option value="">SELECCIONE DIRECTOR...</option>
                {hierarchy.map(h => (
                  <option key={h.corporativo} value={h.corporativo}>{h.corporativo}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Director de Área */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${!selectedCorp ? 'text-gray-300' : 'text-gray-400'}`}>
              Director de Área *
            </label>
            <div className="relative">
              <select 
                disabled={!selectedCorp}
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className={`w-full appearance-none px-6 py-4 text-xs font-black rounded-2xl border outline-none transition-all cursor-pointer pr-12 uppercase ${
                  !selectedCorp ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                  : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                }`}
              >
                <option value="">SELECCIONE ÁREA...</option>
                {availableAreas.map(a => (
                  <option key={a.nombre} value={a.nombre}>{a.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Gerente Líder */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${!selectedArea ? 'text-gray-300' : 'text-gray-400'}`}>
              Gerente Líder *
            </label>
            <div className="relative">
              <select 
                disabled={!selectedArea}
                value={selectedGerente}
                onChange={(e) => setSelectedGerente(e.target.value)}
                className={`w-full appearance-none px-6 py-4 text-xs font-black rounded-2xl border outline-none transition-all cursor-pointer pr-12 uppercase ${
                  !selectedArea ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                  : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                }`}
              >
                <option value="">SELECCIONE GERENTE...</option>
                {availableGerentes.map(g => (
                  <option key={g.nombre} value={g.nombre}>{g.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchical Filters Section - Projects */}
      <div className={`p-10 border rounded-[3rem] transition-all ${isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-50 rounded-2xl text-[#EF3340] border border-red-100">
            <Milestone size={24} />
          </div>
          <h3 className={`text-xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Proyectos & Iniciativas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Macroproyecto */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${!selectedGerente ? 'text-gray-300' : 'text-gray-400'}`}>
              Macroproyecto *
            </label>
            <div className="relative">
              <select 
                disabled={!selectedGerente}
                value={selectedMacro}
                onChange={(e) => setSelectedMacro(e.target.value)}
                className={`w-full appearance-none px-6 py-4 text-xs font-black rounded-2xl border outline-none transition-all cursor-pointer pr-12 uppercase ${
                  !selectedGerente ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                  : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                }`}
              >
                <option value="">SELECCIONE MACRO...</option>
                {availableMacros.map(m => (
                  <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Proyecto */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${!selectedMacro ? 'text-gray-300' : 'text-gray-400'}`}>
              Proyecto *
            </label>
            <div className="relative">
              <select 
                disabled={!selectedMacro}
                value={selectedProyecto}
                onChange={(e) => setSelectedProyecto(e.target.value)}
                className={`w-full appearance-none px-6 py-4 text-xs font-black rounded-2xl border outline-none transition-all cursor-pointer pr-12 uppercase ${
                  !selectedMacro ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                  : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                }`}
              >
                <option value="">SELECCIONE PROYECTO...</option>
                {availableProyectos.map(p => (
                  <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* ID Proyecto */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${!selectedProyecto ? 'text-gray-300' : 'text-gray-400'}`}>
              ID Proyecto *
            </label>
            <div className="relative">
              <select 
                disabled={!selectedProyecto}
                value={selectedIdProyecto}
                onChange={(e) => setSelectedIdProyecto(e.target.value)}
                className={`w-full appearance-none px-6 py-4 text-xs font-black rounded-2xl border outline-none transition-all cursor-pointer pr-12 uppercase ${
                  !selectedProyecto ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                  : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                }`}
              >
                <option value="">SELECCIONE ID...</option>
                {availableIds.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setTrackingMode('METRICA')}
          className={`p-8 rounded-[2.5rem] border transition-all flex items-center gap-6 group ${
            trackingMode === 'METRICA' 
            ? 'bg-[#EF3340] border-[#EF3340] text-white shadow-2xl shadow-red-500/20 scale-[1.02]' 
            : isDark ? 'bg-[#0f1219] border-white/5 text-gray-400 hover:border-white/20' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 shadow-sm'
          }`}
        >
          <div className={`p-4 rounded-2xl transition-all ${trackingMode === 'METRICA' ? 'bg-white/20' : 'bg-red-50 text-[#EF3340]'}`}>
            <Target size={32} />
          </div>
          <div className="text-left">
            <h3 className={`text-xl font-black tracking-tighter uppercase ${trackingMode === 'METRICA' ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
              Métrica (Metas)
            </h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${trackingMode === 'METRICA' ? 'text-white/60' : 'text-gray-400'}`}>
              Seguimiento de KPIs y Objetivos Técnicos
            </p>
          </div>
        </button>

        <button 
          onClick={() => setTrackingMode('CAPEX')}
          className={`p-8 rounded-[2.5rem] border transition-all flex items-center gap-6 group ${
            trackingMode === 'CAPEX' 
            ? 'bg-[#0b0e14] border-[#0b0e14] text-white shadow-2xl shadow-black/20 scale-[1.02]' 
            : isDark ? 'bg-[#0f1219] border-white/5 text-gray-400 hover:border-white/20' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 shadow-sm'
          }`}
        >
          <div className={`p-4 rounded-2xl transition-all ${trackingMode === 'CAPEX' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
            <TrendingUp size={32} />
          </div>
          <div className="text-left">
            <h3 className={`text-xl font-black tracking-tighter uppercase ${trackingMode === 'CAPEX' ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
              CAPEX (Outlook)
            </h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${trackingMode === 'CAPEX' ? 'text-white/60' : 'text-gray-400'}`}>
              Control de Ejecución y Proyección Financiera
            </p>
          </div>
        </button>
      </div>

      {/* Metrics Table Section */}
      {trackingMode === 'METRICA' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 border rounded-[3rem] transition-all ${isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-2xl text-[#EF3340] border border-red-100">
                <Target size={24} />
              </div>
              <div>
                <h3 className={`text-xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Seguimiento de Metas
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {selectedProyecto || 'TODOS LOS PROYECTOS'}
                </p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          {projectDetails.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className={`col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-[#EF3340]" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Tendencia de Ejecución vs Meta</h4>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                      <Line 
                        type="monotone" 
                        dataKey="Comprometido" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Ejecutado" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 size={18} className="text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Índice de Desempeño (SPI)</h4>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                        domain={[0, 2]}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Bar dataKey="SPI" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.SPI >= 1 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Filtro de Mes antes de la tabla */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtrar Mes:</label>
              <div className="relative min-w-[140px]">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`w-full appearance-none px-4 py-2 text-[10px] font-black rounded-xl border outline-none transition-all cursor-pointer pr-10 uppercase ${
                    isDark 
                    ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                    : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                  }`}
                >
                  <option value="TODOS">TODOS LOS MESES</option>
                  {MONTHS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left border-collapse transition-all ${selectedMonth === 'TODOS' ? 'min-w-[3200px]' : 'min-w-full'}`}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-inherit z-10 border-r border-gray-100">Información General</th>
                  {MONTHS.filter(m => selectedMonth === 'TODOS' || m === selectedMonth).map(m => (
                    <th key={m} colSpan={5} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-r border-gray-100">
                      {m}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="px-6 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest sticky left-0 bg-inherit z-10 border-r border-gray-100">Rubro / Sub / Pos / Métrica</th>
                  {MONTHS.filter(m => selectedMonth === 'TODOS' || m === selectedMonth).map(m => (
                    <React.Fragment key={m}>
                      <th className="px-2 py-2 text-[7px] font-black text-blue-500 uppercase tracking-tighter text-center">Met. Comp.</th>
                      <th className="px-2 py-2 text-[7px] font-black text-blue-700 uppercase tracking-tighter text-center">FC Comp.</th>
                      <th className="px-2 py-2 text-[7px] font-black text-emerald-500 uppercase tracking-tighter text-center">Met. Ejec.</th>
                      <th className="px-2 py-2 text-[7px] font-black text-emerald-700 uppercase tracking-tighter text-center">FC Ejec.</th>
                      <th className="px-2 py-2 text-[7px] font-black text-purple-600 uppercase tracking-tighter text-center border-r border-gray-100">SPI</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projectDetails.length > 0 ? (
                  projectDetails.map((detail, detailIdx) => (
                    <tr key={detailIdx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-900 uppercase">{detail.rubro}</span>
                            <span className="text-[10px] font-bold text-gray-400">/</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{detail.subrubro}</span>
                          </div>
                          <div className="text-[10px] font-mono text-blue-600 font-bold">{detail.posPresupuestal}</div>
                          <div className="text-[10px] font-black text-[#EF3340] uppercase">{detail.metrica}</div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase">{detail.proveedor}</div>
                        </div>
                      </td>
                      {MONTHS.map((m, monthIdx) => {
                        if (selectedMonth !== 'TODOS' && m !== selectedMonth) return null;
                        
                        const key = `${selectedProyecto}-${detailIdx}`;
                        const metricaEjecVal = localMetricaEjecutada[key]?.[monthIdx] ?? 0;
                        const fcEjecVal = localFCEjecutado[key]?.[monthIdx] ?? "";
                        
                        const metricaCompVal = detail.mensual[monthIdx].comprometido;
                        const fcCompVal = detail.mensual[monthIdx].fcComprometido;
                        
                        const isOver = metricaEjecVal > metricaCompVal;
                        const spi = metricaCompVal > 0 ? (metricaEjecVal / metricaCompVal) : (metricaEjecVal > 0 ? 1.2 : 1);
                        
                        return (
                          <React.Fragment key={m}>
                            {/* Comprometido Métrica */}
                            <td className="px-2 py-5 text-center bg-blue-50/10">
                              <span className="text-[10px] font-bold text-blue-700">{metricaCompVal}</span>
                            </td>
                            {/* Comprometido FC */}
                            <td className="px-2 py-5 text-center bg-blue-50/20">
                              <span className="text-[10px] font-bold text-blue-900">{fcCompVal}</span>
                            </td>
                            {/* Ejecutado Métrica */}
                            <td className={`px-2 py-5 text-center ${isOver ? 'bg-red-50/30' : 'bg-emerald-50/10'}`}>
                              <input 
                                type="number"
                                value={metricaEjecVal}
                                onChange={(e) => handleMetricaChange(detailIdx, monthIdx, e.target.value)}
                                className={`w-10 text-center bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-[10px] font-black transition-all ${isOver ? 'text-red-600' : 'text-emerald-700'}`}
                              />
                            </td>
                            {/* Ejecutado FC */}
                            <td className={`px-2 py-5 text-center bg-emerald-50/20`}>
                              <input 
                                type="text"
                                value={fcEjecVal}
                                onChange={(e) => handleFCChange(detailIdx, monthIdx, e.target.value)}
                                placeholder="FC..."
                                className={`w-14 text-center bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-[10px] font-black transition-all text-emerald-900 placeholder:text-gray-300`}
                              />
                            </td>
                            {/* SPI */}
                            <td className={`px-2 py-5 text-center border-r border-gray-100 bg-purple-50/20`}>
                              <span className={`text-[10px] font-black ${spi >= 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {spi.toFixed(2)}
                              </span>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={selectedMonth === 'TODOS' ? 62 : 6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={32} className="text-gray-200" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Seleccione un proyecto para ver sus métricas mensuales y FC
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* CAPEX Table Section */}
      {trackingMode === 'CAPEX' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 border rounded-[3rem] transition-all ${isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className={`text-xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Seguimiento CAPEX (Outlook)
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {selectedProyecto || 'TODOS LOS PROYECTOS'}
                </p>
              </div>
            </div>
          </div>

          {/* CAPEX Chart Section */}
          {projectDetails.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className={`col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Tendencia CAPEX: Comprometido vs Ejecutado</h4>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={capexChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip 
                        formatter={(value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                      <Line 
                        type="monotone" 
                        dataKey="Comprometido" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Ejecutado" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 size={18} className="text-purple-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Índice de Desempeño de Costos (CPI)</h4>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={capexChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 800, fill: '#999' }}
                        domain={[0, 2]}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Bar dataKey="CPI" radius={[4, 4, 0, 0]}>
                        {capexChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.CPI >= 1 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Filtro de Mes antes de la tabla */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtrar Mes:</label>
              <div className="relative min-w-[140px]">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`w-full appearance-none px-4 py-2 text-[10px] font-black rounded-xl border outline-none transition-all cursor-pointer pr-10 uppercase ${
                    isDark 
                    ? 'bg-white/5 border-white/10 text-white focus:border-[#EF3340]' 
                    : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-[#EF3340] shadow-sm'
                  }`}
                >
                  <option value="TODOS">TODOS LOS MESES</option>
                  {MONTHS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left border-collapse transition-all ${selectedMonth === 'TODOS' ? 'min-w-[4400px]' : 'min-w-full'}`}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-inherit z-10 border-r border-gray-100">Información General</th>
                  <th colSpan={5} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-r border-gray-100 bg-gray-50/50">CAPEX REAL (TOTAL)</th>
                  {MONTHS.filter(m => selectedMonth === 'TODOS' || m === selectedMonth).map(m => (
                    <th key={m} colSpan={5} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-r border-gray-100">
                      {m}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="px-6 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest sticky left-0 bg-inherit z-10 border-r border-gray-100">Rubro / Sub / Pos / Proveedor</th>
                  <th className="px-2 py-2 text-[7px] font-black text-blue-400 uppercase tracking-tighter text-center bg-blue-50/5">Comp. Base</th>
                  <th className="px-2 py-2 text-[7px] font-black text-blue-600 uppercase tracking-tighter text-center bg-blue-50/10">Comp. Real</th>
                  <th className="px-2 py-2 text-[7px] font-black text-emerald-600 uppercase tracking-tighter text-center bg-emerald-50/10">Ejec. Real</th>
                  <th className="px-2 py-2 text-[7px] font-black text-purple-600 uppercase tracking-tighter text-center bg-purple-50/10">CAPEX Real</th>
                  <th className="px-2 py-2 text-[7px] font-black text-orange-600 uppercase tracking-tighter text-center border-r border-gray-100 bg-orange-50/10">CPI</th>
                  {MONTHS.filter(m => selectedMonth === 'TODOS' || m === selectedMonth).map(m => (
                    <React.Fragment key={m}>
                      <th className="px-2 py-2 text-[7px] font-black text-blue-400 uppercase tracking-tighter text-center">CAPEX Comp. Base</th>
                      <th className="px-2 py-2 text-[7px] font-black text-blue-600 uppercase tracking-tighter text-center">CAPEX Comp. Real</th>
                      <th className="px-2 py-2 text-[7px] font-black text-emerald-500 uppercase tracking-tighter text-center">CAPEX Ejec.</th>
                      <th className="px-2 py-2 text-[7px] font-black text-purple-500 uppercase tracking-tighter text-center">CAPEX Real</th>
                      <th className="px-2 py-2 text-[7px] font-black text-orange-600 uppercase tracking-tighter text-center border-r border-gray-100">CPI</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projectDetails.length > 0 ? (
                  <>
                    {projectDetails.map((detail, detailIdx) => {
                      const totalCompBase = detail.mensual.reduce((acc, m) => acc + (m.capexComprometido || 0), 0);
                      const totalEjec = detail.mensual.reduce((acc, m) => acc + (m.capexEjecutado || 0), 0);
                      const totalCPI = totalCompBase > 0 ? (totalEjec / totalCompBase) : (totalEjec > 0 ? 1.2 : 1);

                      return (
                        <tr key={detailIdx} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-5 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-900 uppercase">{detail.rubro}</span>
                                <span className="text-[10px] font-bold text-gray-400">/</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{detail.subrubro}</span>
                              </div>
                              <div className="text-[10px] font-mono text-blue-600 font-bold">{detail.posPresupuestal}</div>
                              <div className="text-[8px] font-bold text-gray-400 uppercase">{detail.proveedor}</div>
                            </div>
                          </td>
                          {/* CAPEX Real Totals */}
                          <td className="px-4 py-5 text-center bg-blue-50/10">
                            <span className="text-[9px] font-bold text-blue-600">
                              {new Intl.NumberFormat('es-CO').format(totalCompBase)}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center bg-blue-50/20">
                            <span className="text-[10px] font-black text-blue-800">
                              {new Intl.NumberFormat('es-CO').format(detail.mensual.reduce((acc, m) => acc + (m.capexComprometidoReal || 0), 0))}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center bg-emerald-50/20">
                            <span className="text-[10px] font-black text-emerald-800">
                              {new Intl.NumberFormat('es-CO').format(totalEjec)}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center bg-purple-50/20">
                            <span className="text-[10px] font-black text-purple-800">
                              {new Intl.NumberFormat('es-CO').format(detail.mensual.reduce((acc, m) => acc + (m.capexReal || 0), 0))}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center bg-orange-50/20 border-r border-gray-100">
                            <span className={`text-[10px] font-black ${totalCPI >= 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {totalCPI.toFixed(2)}
                            </span>
                          </td>
                          {MONTHS.map((m, monthIdx) => {
                            if (selectedMonth !== 'TODOS' && m !== selectedMonth) return null;
                            
                            const capexCompBase = detail.mensual[monthIdx].capexComprometido || 0;
                            const capexCompReal = detail.mensual[monthIdx].capexComprometidoReal || 0;
                            const capexEjecVal = detail.mensual[monthIdx].capexEjecutado || 0;
                            const capexRealVal = detail.mensual[monthIdx].capexReal || 0;
                            const cpi = capexCompBase > 0 ? (capexEjecVal / capexCompBase) : (capexEjecVal > 0 ? 1.2 : 1);
                            
                            return (
                              <React.Fragment key={m}>
                                <td className="px-2 py-5 text-center bg-blue-50/5">
                                  <span className="text-[8px] font-bold text-blue-500">
                                    {new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(capexCompBase)}
                                  </span>
                                </td>
                                <td className="px-2 py-5 text-center bg-blue-50/10">
                                  <span className="text-[9px] font-bold text-blue-700">
                                    {new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(capexCompReal)}
                                  </span>
                                </td>
                                <td className="px-2 py-5 text-center bg-emerald-50/10">
                                  <span className="text-[9px] font-bold text-emerald-700">
                                    {new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(capexEjecVal)}
                                  </span>
                                </td>
                                <td className="px-2 py-5 text-center bg-purple-50/10">
                                  <span className="text-[9px] font-bold text-purple-700">
                                    {new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(capexRealVal)}
                                  </span>
                                </td>
                                <td className="px-2 py-5 text-center border-r border-gray-100 bg-orange-50/10">
                                  <span className={`text-[9px] font-black ${cpi >= 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {cpi.toFixed(2)}
                                  </span>
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="bg-gray-100/50 font-black border-t-2 border-gray-200">
                      <td className="px-6 py-4 sticky left-0 bg-gray-100 z-10 border-r border-gray-200 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                        <span className="text-[10px] uppercase tracking-widest text-gray-900">TOTALES GENERALES</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-blue-100/20">
                        <span className="text-[10px] text-blue-700">
                          {new Intl.NumberFormat('es-CO').format(projectDetails.reduce((acc, d) => acc + d.mensual.reduce((mAcc, m) => mAcc + (m.capexComprometido || 0), 0), 0))}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center bg-blue-100/30">
                        <span className="text-[11px] text-blue-900">
                          {new Intl.NumberFormat('es-CO').format(projectDetails.reduce((acc, d) => acc + d.mensual.reduce((mAcc, m) => mAcc + (m.capexComprometidoReal || 0), 0), 0))}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center bg-emerald-100/30">
                        <span className="text-[11px] text-emerald-900">
                          {new Intl.NumberFormat('es-CO').format(projectDetails.reduce((acc, d) => acc + d.mensual.reduce((mAcc, m) => mAcc + (m.capexEjecutado || 0), 0), 0))}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center bg-purple-100/30">
                        <span className="text-[11px] text-purple-900">
                          {new Intl.NumberFormat('es-CO').format(projectDetails.reduce((acc, d) => acc + d.mensual.reduce((mAcc, m) => mAcc + (m.capexReal || 0), 0), 0))}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center bg-orange-100/30 border-r border-gray-200">
                        {(() => {
                          const totalComp = projectDetails.reduce((acc, d) => acc + d.mensual.reduce((mAcc, m) => mAcc + (m.capexComprometido || 0), 0), 0);
                          const totalEjec = projectDetails.reduce((acc, d) => acc + d.mensual.reduce((mAcc, m) => mAcc + (m.capexEjecutado || 0), 0), 0);
                          const avgCPI = totalComp > 0 ? totalEjec / totalComp : 1;
                          return (
                            <span className={`text-[11px] ${avgCPI >= 1 ? 'text-emerald-700' : 'text-red-700'}`}>
                              {avgCPI.toFixed(2)}
                            </span>
                          );
                        })()}
                      </td>
                      {MONTHS.map((m, monthIdx) => {
                        if (selectedMonth !== 'TODOS' && m !== selectedMonth) return null;
                        const monthCompBase = projectDetails.reduce((acc, d) => acc + (d.mensual[monthIdx].capexComprometido || 0), 0);
                        const monthCompReal = projectDetails.reduce((acc, d) => acc + (d.mensual[monthIdx].capexComprometidoReal || 0), 0);
                        const monthEjec = projectDetails.reduce((acc, d) => acc + (d.mensual[monthIdx].capexEjecutado || 0), 0);
                        const monthReal = projectDetails.reduce((acc, d) => acc + (d.mensual[monthIdx].capexReal || 0), 0);
                        const monthCPI = monthCompBase > 0 ? monthEjec / monthCompBase : 1;
                        return (
                          <React.Fragment key={m}>
                            <td className="px-2 py-4 text-center bg-blue-50/20">
                              <span className="text-[9px] text-blue-600">{new Intl.NumberFormat('es-CO').format(monthCompBase)}</span>
                            </td>
                            <td className="px-2 py-4 text-center bg-blue-50/30">
                              <span className="text-[9px] text-blue-800">{new Intl.NumberFormat('es-CO').format(monthCompReal)}</span>
                            </td>
                            <td className="px-2 py-4 text-center bg-emerald-50/20">
                              <span className="text-[9px] text-emerald-800">{new Intl.NumberFormat('es-CO').format(monthEjec)}</span>
                            </td>
                            <td className="px-2 py-4 text-center bg-purple-50/20">
                              <span className="text-[9px] text-purple-800">{new Intl.NumberFormat('es-CO').format(monthReal)}</span>
                            </td>
                            <td className="px-2 py-4 text-center border-r border-gray-200 bg-orange-50/20">
                              <span className={`text-[9px] ${monthCPI >= 1 ? 'text-emerald-700' : 'text-red-700'}`}>{monthCPI.toFixed(2)}</span>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={selectedMonth === 'TODOS' ? 66 : 11} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={32} className="text-gray-200" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Seleccione un proyecto para ver su ejecución CAPEX mensual
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default FollowUp;
