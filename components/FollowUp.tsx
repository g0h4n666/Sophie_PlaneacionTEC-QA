
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2,
  Box,
  Layers,
  Target
} from 'lucide-react';

import Step1Plan from './followup/Step1Plan';
import Step2Validacion from './followup/Step2Validacion';
import Step3Liberacion from './followup/Step3Liberacion';
import Step4Seguimiento from './followup/Step4Seguimiento';
import Step5Ajustes from './followup/Step5Ajustes';

interface Props {
  theme: 'light' | 'dark';
}

interface ExecutionLine {
  macroproyecto: string;
  proyecto: string;
  codigo: string;
  pospre: string;
  aprobadoCop: number;
  unidAprobadas: number;
  metrica: string;
  estado: 'Pendiente' | 'Listo para validar' | 'Rechazado';
}

const FollowUp: React.FC<Props> = ({ theme }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLine, setSelectedLine] = useState<ExecutionLine | null>(null);
  const [hoveredLine, setHoveredLine] = useState<ExecutionLine | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [monthlyPlan, setMonthlyPlan] = useState<Record<string, number>>({
    'ENE': 0, 'FEB': 0, 'MAR': 0, 'ABR': 0, 'MAY': 0, 'JUN': 0,
    'JUL': 0, 'AGO': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DIC': 0
  });

  const steps = [
    { id: 1, label: 'Generación del Plan', desc: 'Línea base (0+n)' },
    { id: 2, label: 'Validación', desc: 'Aprobación PT' },
    { id: 3, label: 'Liberación', desc: 'SAP / FIN' },
    { id: 4, label: 'Seguimiento', desc: 'SAP batch + unidades' },
    { id: 5, label: 'Ajustes', desc: 'Repriorización' }
  ];

  const lines: ExecutionLine[] = [
    { macroproyecto: 'ENERGÍA 2027', proyecto: 'Reemplazo de Baterías Críticas', codigo: 'PRJ009', pospre: 'PP41009', aprobadoCop: 3124563230, unidAprobadas: 679, metrica: 'BATERIAS', estado: 'Pendiente' },
    { macroproyecto: 'DATA 2027', proyecto: 'Plataforma de Datos', codigo: 'PRJ011', pospre: 'PP41011', aprobadoCop: 1281102685, unidAprobadas: 15, metrica: 'SERVICIOS', estado: 'Pendiente' },
    { macroproyecto: 'FIBRA REGIONAL 2027', proyecto: 'Backbone Regional Cali', codigo: 'PRJ012', pospre: 'PP41012', aprobadoCop: 2829631127, unidAprobadas: 1016, metrica: 'HOGARES_PASADOS', estado: 'Pendiente' },
    { macroproyecto: 'TRANSPORTE 2027', proyecto: 'Microondas Regional', codigo: 'PRJ017', pospre: 'PP41017', aprobadoCop: 1920605441, unidAprobadas: 184, metrica: 'ENLACES', estado: 'Pendiente' },
    { macroproyecto: '5G 2027', proyecto: 'Densificación 5G Capitales', codigo: 'PRJ023', pospre: 'PP41023', aprobadoCop: 933290683, unidAprobadas: 188, metrica: 'SITIOS', estado: 'Pendiente' },
  ];

  const filteredLines = useMemo(() => {
    return lines.filter(l => 
      l.proyecto.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.codigo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMonthChange = (month: string, val: string) => {
    const num = parseFloat(val) || 0;
    setMonthlyPlan(prev => ({ ...prev, [month]: num }));
  };

  const resetPlan = () => {
    setMonthlyPlan({
      'ENE': 0, 'FEB': 0, 'MAR': 0, 'ABR': 0, 'MAY': 0, 'JUN': 0,
      'JUL': 0, 'AGO': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DIC': 0
    });
  };

  const cardBg = theme === 'dark' ? 'bg-[#0d1117] border-[#1a1f26]' : 'bg-white border-gray-200 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black tracking-tighter mb-1 ${textColor}`}>Seguimiento de Ejecución CAPEX</h2>
          <p className={`text-xs font-medium ${subTextColor}`}>Fase de control presupuestario y físico 2027.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`p-5 text-left border rounded-[1.5rem] transition-all relative overflow-hidden group ${
              currentStep === step.id
                ? 'bg-red-50 border-[#EF3340] shadow-md ring-1 ring-[#EF3340]/20'
                : theme === 'dark' ? 'bg-[#0b0e14] border-[#1a1f26] hover:bg-white/5' : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${currentStep === step.id ? 'text-[#EF3340]' : 'text-gray-400'}`}>
              Paso {step.id}: {step.label}
            </p>
            <p className={`text-[12px] font-black tracking-tight ${currentStep === step.id ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-[#EF3340] rounded-2xl flex items-center justify-center border border-red-100">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Líneas de Portafolio</h3>
                </div>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className={`w-full pl-11 pr-4 py-3 text-[11px] font-bold rounded-2xl border outline-none ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-gray-50 border-gray-100'}`}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-inherit">
              <table className="w-full text-left text-[11px]">
                <thead className={`font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#1a1f26] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  <tr>
                    <th className="px-6 py-5">Proyecto</th>
                    <th className="px-6 py-5 text-right">Aprobado</th>
                    <th className="px-6 py-5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {filteredLines.map((line, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => { setSelectedLine(line); resetPlan(); }}
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setHoveredLine(line)}
                      onMouseLeave={() => setHoveredLine(null)}
                      className={`cursor-pointer transition-all ${
                        selectedLine?.codigo === line.codigo ? 'bg-red-50' : theme === 'dark' ? 'hover:bg-white/5 border-gray-800' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`font-black tracking-tight ${textColor}`}>{line.proyecto}</span>
                          <span className="text-[10px] font-bold text-[#EF3340] uppercase">{line.codigo}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-5 text-right font-black ${textColor}`}>$ {line.aprobadoCop.toLocaleString()}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black border ${
                          line.estado === 'Pendiente' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {line.estado.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className={`sticky top-24 p-8 rounded-[3rem] border flex flex-col min-h-[600px] shadow-xl ${cardBg}`}>
            {!selectedLine ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-[2.5rem] border-gray-200 bg-gray-50/30">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Seleccione un proyecto de la lista izquierda.</p>
              </div>
            ) : (
              <div className="flex-1 animate-in slide-in-from-right-8 duration-500">
                {currentStep === 1 && <Step1Plan selectedLine={selectedLine} monthlyPlan={monthlyPlan} onMonthChange={handleMonthChange} onReset={resetPlan} theme={theme} />}
                {currentStep === 2 && <Step2Validacion projectName={selectedLine.proyecto} theme={theme} />}
                {currentStep === 3 && <Step3Liberacion codigo={selectedLine.codigo} theme={theme} />}
                {currentStep === 4 && <Step4Seguimiento aprobado={selectedLine.aprobadoCop} theme={theme} />}
                {currentStep === 5 && <Step5Ajustes theme={theme} />}
              </div>
            )}
          </div>
        </div>
      </div>

      {hoveredLine && (
        <div 
          className="fixed z-[200] pointer-events-none transition-opacity duration-200"
          style={{ left: mousePos.x + 20, top: mousePos.y + 20, maxWidth: '380px' }}
        >
          <div className={`p-8 rounded-[2.5rem] border-2 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 ${
            theme === 'dark' ? 'bg-[#161b22]/95 border-white/10' : 'bg-white/95 border-[#EF3340]/20'
          }`}>
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-[#EF3340] text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Layers size={22} />
               </div>
               <div>
                  <h4 className={`text-sm font-black tracking-tight leading-tight ${textColor}`}>{hoveredLine.proyecto}</h4>
                  <p className="text-[10px] font-black text-[#EF3340] uppercase tracking-widest mt-1">Detalle SAP Maestro</p>
               </div>
            </div>
            <div className="space-y-4">
               <div className={`p-4 rounded-xl border-l-4 border-[#EF3340] ${theme === 'dark' ? 'bg-white/5' : 'bg-red-50/30'}`}>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">MONTO APROBADO 2027</p>
                  <p className={`text-lg font-black ${textColor}`}>$ {hoveredLine.aprobadoCop.toLocaleString()}</p>
               </div>
               <div className="flex items-center justify-between py-2 px-4 bg-emerald-50 text-emerald-600 rounded-xl">
                  <div className="flex items-center gap-2">
                     <Box size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Metas:</span>
                  </div>
                  <span className="text-[12px] font-black">{hoveredLine.unidAprobadas} {hoveredLine.metrica}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;
