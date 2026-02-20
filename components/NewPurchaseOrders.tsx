
import React, { useState } from 'react';
import { 
  PackagePlus, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  ShoppingCart,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
}

interface PurchaseOrder {
  id: string;
  sapId: string;
  description: string;
  vendor: string;
  amount: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

const NewPurchaseOrders: React.FC<Props> = ({ theme }) => {
  const [orders] = useState<PurchaseOrder[]>([
    { id: '1', sapId: 'PO-2027-001', description: 'Mantenimiento Red Fibra Nodo Norte', vendor: 'Cisco Systems', amount: 15200000, status: 'Pending', date: '2027-04-12' },
    { id: '2', sapId: 'PO-2027-002', description: 'Suministro de Baterías de Respaldo', vendor: 'Schneider Electric', amount: 8400000, status: 'Draft', date: '2027-04-13' },
    { id: '3', sapId: 'PO-2027-003', description: 'Licenciamiento Software Monitoreo', vendor: 'Microsoft Corp', amount: 45000000, status: 'Approved', date: '2027-04-10' },
  ]);

  const cardBg = theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Draft': return 'bg-gray-50 text-gray-500 border-gray-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-[#EF3340]/10 text-[#EF3340] rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EF3340]">Control Operativo T-Unitarios</span>
          </div>
          <h2 className={`text-4xl font-black tracking-tighter mb-1 ${textColor}`}>Órdenes de Compra</h2>
          <p className="text-sm font-medium text-gray-400">Gestión centralizada de requisiciones y adquisiciones de red.</p>
        </div>
        <button className="bg-[#EF3340] hover:bg-[#D62E39] text-white text-[11px] font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-red-500/20 flex items-center gap-4 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          CREAR NUEVA SOLICITUD
        </button>
      </div>

      <div className={`p-10 border rounded-[3.5rem] transition-all relative overflow-hidden ${cardBg}`}>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID SAP, Proveedor o Concepto..." 
              className={`w-full pl-14 pr-6 py-4 text-xs font-bold rounded-2xl border outline-none ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-gray-50 border-gray-100'}`}
            />
          </div>
          <div className="flex gap-4">
             <button className="p-4 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Filter size={20} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-inherit">
          <table className="w-full text-left text-[11px]">
            <thead className={`font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#1a1f26] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                <th className="px-8 py-6">ID SAP</th>
                <th className="px-8 py-6">Descripción</th>
                <th className="px-8 py-6">Proveedor</th>
                <th className="px-8 py-6 text-right">Monto</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {orders.map((order) => (
                <tr key={order.id} className={`transition-all ${theme === 'dark' ? 'hover:bg-white/5 border-gray-800' : 'hover:bg-red-50/20 border-gray-50'}`}>
                  <td className="px-8 py-6 font-mono text-[#EF3340] font-black">{order.sapId}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`font-black tracking-tight ${textColor}`}>{order.description}</span>
                      <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase">Fecha: {order.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-600">{order.vendor}</td>
                  <td className="px-8 py-6 text-right font-black text-[13px]">$ {order.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 text-gray-400 hover:text-[#EF3340] transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <SummaryCard icon={<Clock size={20} />} label="En Revisión" value="12" theme={theme} color="text-blue-500" />
         <SummaryCard icon={<CheckCircle2 size={20} />} label="Aprobadas Q3" value="45" theme={theme} color="text-emerald-500" />
         <SummaryCard icon={<AlertCircle size={20} />} label="Alertas de Pago" value="03" theme={theme} color="text-[#EF3340]" />
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ icon: React.ReactNode, label: string, value: string, theme: string, color: string }> = ({ icon, label, value, theme, color }) => (
  <div className={`p-8 rounded-[2.5rem] border flex items-center gap-6 ${theme === 'dark' ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  </div>
);

export default NewPurchaseOrders;
