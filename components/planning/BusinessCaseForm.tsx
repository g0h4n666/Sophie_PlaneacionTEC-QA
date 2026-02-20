
import React from 'react';
import { 
  FileText, HelpCircle, TrendingUp, Minus, Plus, 
  ShieldAlert, Trash2, Link, BarChart3, Check 
} from 'lucide-react';
import { BusinessCaseData, FinancialYearData, FinancialRisk } from '../Planning';

interface Props {
  data: BusinessCaseData;
  projectName: string;
  theme: 'light' | 'dark';
  onFieldChange: (field: string, value: string) => void;
  onFinancialChange: (row: keyof BusinessCaseData, field: keyof FinancialYearData, value: string) => void;
  onUpdateRisks: (risks: FinancialRisk[]) => void;
  onToggleActive: (active: boolean) => void;
}

const AREA_OPTIONS = [
  "DIRECCIÓN DE PLANEACIÓN", "DIRECCIÓN DE INFRAESTRUCTURA", "OPERACIÓN Y MANTENIMIENTO", "GESTIÓN DE RED", "SOPORTE IT", "PRODUCCIÓN TV", "ADMINISTRACIÓN"
];

const ALINEACION_OPTIONS = [
  "EXPANSIÓN 5G", "TRANSFORMACIÓN DIGITAL", "EFICIENCIA OPERATIVA", "CRECIMIENTO B2B", "CONVERGENCIA FIJA-MÓVIL"
];

const BusinessCaseForm: React.FC<Props> = ({ data, projectName, theme, onFieldChange, onFinancialChange, onUpdateRisks }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  const getInputClasses = (isReadOnly?: boolean) => `
    w-full px-4 py-4 text-[12px] font-bold rounded-[1.2rem] border transition-all duration-200 outline-none appearance-none shadow-sm
    ${theme === 'dark' 
      ? `bg-[#1a1f26] border-[#2d3748] ${isReadOnly ? 'text-gray-400 opacity-70' : 'text-white focus:border-[#EF3340]'}` 
      : `${isReadOnly ? 'bg-gray-100/50 cursor-not-allowed text-gray-600' : 'bg-white focus:ring-8 focus:ring-red-500/5 focus:border-[#EF3340]'} border-gray-200 text-gray-900`}
  `;

  const addFinancialRisk = () => {
    const newRisk: FinancialRisk = {
      id: Math.random().toString(36).substr(2, 9),
      riesgo: '', probabilidad: 'M', impacto: 'M', monto: '0', mitigacion: ''
    };
    onUpdateRisks([...data.riesgosFinancieros, newRisk]);
  };

  const updateFinancialRisk = (id: string, field: keyof FinancialRisk, value: any) => {
    onUpdateRisks(data.riesgosFinancieros.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="animate-in slide-in-from-top-12 duration-1000 space-y-12 mt-12 pb-20">
      {/* 1. Información General */}
      <div className={`p-10 rounded-[3.5rem] border ${theme === 'dark' ? 'bg-[#0b0e14] border-emerald-500/20' : 'bg-emerald-50/5 border-emerald-100 shadow-lg'}`}>
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
            <FileText size={32} />
          </div>
          <div>
            <h4 className={`text-2xl font-black tracking-tighter ${textColor}`}>Información General del Caso</h4>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Definición de alineación y objetivos corporativos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField label="Nombre del Proyecto" tooltip="Título descriptivo para el portafolio.">
            <input value={projectName} readOnly className={getInputClasses(true)} />
          </FormField>
          
          <FormField label="Área Solicitante" tooltip="Departamento que genera la necesidad.">
            <select value={data.areaSolicitante} onChange={e => onFieldChange('areaSolicitante', e.target.value)} className={getInputClasses()}>
              <option value="">Seleccione Departamento...</option>
              {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </FormField>

          <FormField label="Alineación Estratégica" tooltip="Pilar corporativo al que contribuye.">
            <select value={data.alineacionEstrategica} onChange={e => onFieldChange('alineacionEstrategica', e.target.value)} className={getInputClasses()}>
              <option value="">Seleccione Pilar...</option>
              {ALINEACION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </FormField>

          <div className="md:col-span-3">
            <FormField label="Objetivo" tooltip="¿Qué problema soluciona o qué oportunidad captura?">
              <textarea 
                value={data.objetivo} 
                onChange={e => onFieldChange('objetivo', e.target.value)}
                placeholder="Describa el objetivo principal..."
                className={`${getInputClasses()} h-32 resize-none leading-relaxed p-6`}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Contribución a KPIs" tooltip="Indicador que mejorará (ej. Reducción de Churn).">
              <input value={data.contribucionKPIs} onChange={e => onFieldChange('contribucionKPIs', e.target.value)} placeholder="Ej. ARPU, Churn, NPS" className={getInputClasses()} />
            </FormField>
          </div>

          <FormField label="Interdependencias" tooltip="¿Depende de otro proyecto o infraestructura?">
            <input value={data.interdependencias} onChange={e => onFieldChange('interdependencias', e.target.value)} placeholder="ID de proyecto relacionado" className={getInputClasses()} />
          </FormField>

          <div className="md:col-span-3">
            <FormField label="Caso de negocio financiero" tooltip="Link al archivo de soporte financiero excel/pdf.">
              <div className="relative group">
                <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input value={data.casoNegocioFinanciero} onChange={e => onFieldChange('casoNegocioFinanciero', e.target.value)} placeholder="Link a repositorio documental..." className={`${getInputClasses()} pl-10`} />
              </div>
            </FormField>
          </div>
        </div>
      </div>

      {/* 2. Evaluación Financiera Proyectada */}
      <div className={`p-10 rounded-[3.5rem] border ${theme === 'dark' ? 'bg-[#0b0e14] border-emerald-500/20' : 'bg-emerald-50/5 border-emerald-100 shadow-lg'}`}>
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
            <TrendingUp size={32} />
          </div>
          <div>
            <h4 className={`text-2xl font-black tracking-tighter ${textColor}`}>Evaluación Financiera Proyectada</h4>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Proyección de flujos de caja incremental (USD)</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[2.5rem] border border-emerald-100 bg-white mb-12 shadow-inner">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-emerald-700 text-white font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Concepto</th>
                <th className="px-8 py-6 text-center">Año 0</th>
                <th className="px-8 py-6 text-center">Año 1</th>
                <th className="px-8 py-6 text-center">Año 2</th>
                <th className="px-8 py-6 text-center">Año n...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 font-bold">
              <FinancialRow label="Inversión CAPEX Incremental" icon={<Minus size={12} />} color="text-red-500" data={data.capex} onChange={(f, v) => onFinancialChange('capex', f, v)} placeholderPrefix="(-) " />
              <FinancialRow label="Ingresos Incrementales" icon={<Plus size={12} />} color="text-emerald-600" data={data.ingresos} onChange={(f, v) => onFinancialChange('ingresos', f, v)} placeholderPrefix="(+) " />
              <FinancialRow label="Beneficios de Costos (Ahorros)" icon={<Plus size={12} />} color="text-emerald-600" data={data.ahorros} onChange={(f, v) => onFinancialChange('ahorros', f, v)} placeholderPrefix="(+) " />
              <FinancialRow label="Evitación de Costos (Avoidance)" icon={<Plus size={12} />} color="text-blue-500" data={data.avoidance} onChange={(f, v) => onFinancialChange('avoidance', f, v)} placeholderPrefix="(+) " />
              <FinancialRow label="Gastos Operativos (OPEX)" icon={<Minus size={12} />} color="text-red-500" data={data.opex} onChange={(f, v) => onFinancialChange('opex', f, v)} placeholderPrefix="(-) " />
              <tr className="bg-emerald-50/30">
                <td className="px-8 py-5 font-black uppercase text-gray-500">Tasa de Impuestos / WACC (%)</td>
                <td colSpan={3}></td>
                <td className="px-8 py-5">
                  <input value={data.wacc} onChange={e => onFieldChange('wacc', e.target.value)} className="w-full text-center font-black text-gray-900 bg-white rounded-2xl py-4 border border-emerald-200 outline-none" placeholder="12.5%" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. Indicadores de Resultado */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <IndicatorCard label="VPN" subLabel="(Valor Presente Neto)" value={`$ ${data.indicadores.vpn}`} desc="Si es > 0, el proyecto crea valor económico." color="emerald" />
          <IndicatorCard label="TIR" subLabel="(Tasa Interna Retorno)" value={`${data.indicadores.tir}%`} desc="Debe ser mayor a la tasa mínima aceptable." color="blue" />
          <IndicatorCard label="Payback" subLabel="(Meses)" value={`${data.indicadores.payback} meses`} desc="Tiempo estimado para recuperar la inversión." color="amber" />
          <IndicatorCard label="ROI" subLabel="(Retorno Inversión)" value={`${data.indicadores.roi}%`} desc="Eficiencia de la inversión realizada." color="purple" />
          <IndicatorCard label="Valor Residual" subLabel="" value={`$ ${data.indicadores.valorResidual}`} desc="Valor de activos al final del horizonte." color="gray" />
        </div>
      </div>

      {/* 4. Matriz de Riesgos Financieros */}
      <div className={`p-10 rounded-[3.5rem] border bg-white shadow-xl border-gray-100`}>
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
              <ShieldAlert size={32} />
            </div>
            <h4 className="text-2xl font-black tracking-tighter text-gray-900">Matriz de Riesgos Financieros</h4>
          </div>
          <button type="button" onClick={addFinancialRisk} className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#EF3340] transition-all active:scale-95 shadow-lg">
            <Plus size={18} /> AÑADIR RIESGO
          </button>
        </div>

        <div className="overflow-x-auto rounded-[2.5rem] border border-gray-100">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-gray-800 text-white font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Riesgo Identificado</th>
                <th className="px-8 py-6 text-center">Probabilidad (B/M/A)</th>
                <th className="px-8 py-6 text-center">Impacto (B/M/A)</th>
                <th className="px-8 py-6 text-right">Impacto Financiero Est.</th>
                <th className="px-8 py-6">Plan de Mitigación</th>
                <th className="px-8 py-6 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold">
              {data.riesgosFinancieros.map(risk => (
                <tr key={risk.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <input value={risk.riesgo} onChange={e => updateFinancialRisk(risk.id, 'riesgo', e.target.value)} placeholder="Ej. Retraso en licencias" className="w-full bg-transparent border-none outline-none font-black text-gray-800" />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <select value={risk.probabilidad} onChange={e => updateFinancialRisk(risk.id, 'probabilidad', e.target.value)} className="bg-white border-gray-200 rounded-xl py-2 px-3 outline-none">
                      <option value="B">Baja</option><option value="M">Media</option><option value="A">Alta</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <select value={risk.impacto} onChange={e => updateFinancialRisk(risk.id, 'impacto', e.target.value)} className="bg-white border-gray-200 rounded-xl py-2 px-3 outline-none">
                      <option value="B">Baja</option><option value="M">Media</option><option value="A">Alta</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <input value={risk.monto} onChange={e => updateFinancialRisk(risk.id, 'monto', e.target.value)} className="w-full text-right bg-transparent border-none outline-none font-black text-red-600" />
                  </td>
                  <td className="px-6 py-5">
                    <input value={risk.mitigacion} onChange={e => updateFinancialRisk(risk.id, 'mitigacion', e.target.value)} placeholder="Plan de respuesta..." className="w-full bg-transparent border-none outline-none" />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button type="button" onClick={() => onUpdateRisks(data.riesgosFinancieros.filter(r => r.id !== risk.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
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

const FormField: React.FC<{ label: string; tooltip: string; children: React.ReactNode }> = ({ label, tooltip, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="group relative">
        <HelpCircle size={12} className="text-gray-300 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {tooltip}
        </div>
      </div>
    </div>
    {children}
  </div>
);

const FinancialRow: React.FC<{ label: string, icon: React.ReactNode, color: string, data: FinancialYearData, onChange: (field: keyof FinancialYearData, val: string) => void, placeholderPrefix?: string }> = ({ label, icon, color, data, onChange, placeholderPrefix = "" }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="px-8 py-6 text-gray-600 flex items-center gap-4">
       <span className={color}>{icon}</span> {label}
    </td>
    {['ano0', 'ano1', 'ano2', 'anon'].map((yr) => (
      <td key={yr} className="px-6 py-4">
        <input 
          value={data[yr as keyof FinancialYearData]} 
          onChange={e => onChange(yr as keyof FinancialYearData, e.target.value)} 
          className="w-full text-center bg-gray-50/30 rounded-2xl py-4 border border-transparent focus:border-emerald-200 focus:bg-white outline-none font-black text-gray-800 transition-all shadow-inner" 
          placeholder={`${placeholderPrefix}0.00`} 
        />
      </td>
    ))}
  </tr>
);

const IndicatorCard: React.FC<{ label: string, subLabel: string, value: string, desc: string, color: string }> = ({ label, subLabel, value, desc, color }) => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-100'
  };
  return (
    <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1 ${colors[color]}`}>
       <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-80">{label}</span>
       <span className="text-[8px] font-bold uppercase tracking-widest mb-3 opacity-60 italic">{subLabel}</span>
       <span className="text-2xl font-black mb-3 tracking-tighter">{value}</span>
       <p className="text-[8px] font-bold uppercase leading-tight opacity-70 tracking-widest">{desc}</p>
    </div>
  );
};

export default BusinessCaseForm;
