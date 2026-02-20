
import React, { useState } from 'react';
import { Database, Server, Lock, ShieldCheck, Activity, RefreshCw, Save, Globe, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
}

const Section: React.FC<{ theme: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ theme, title, icon, children }) => (
  <div className={`p-12 rounded-[4rem] border transition-all ${theme === 'dark' ? 'bg-[#0f1219] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className="flex items-center gap-5 mb-12">
      <div className="w-14 h-14 rounded-[1.5rem] bg-gray-50 text-[#EF3340] flex items-center justify-center border border-gray-100 shadow-inner">
        {icon}
      </div>
      <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    </div>
    {children}
  </div>
);

const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; icon: React.ReactNode; theme: string; type?: string }> = ({ label, value, onChange, icon, theme, type = 'text' }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EF3340] transition-colors">{icon}</div>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none transition-all font-black text-xs ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748] focus:border-[#EF3340] text-white' : 'bg-gray-50 border-gray-100 focus:border-[#EF3340] shadow-inner text-gray-800'}`}
      />
    </div>
  </div>
);

const DatabaseSettings: React.FC<Props> = ({ theme }) => {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [config, setConfig] = useState({
    host: 'mysql.claro.corp.local',
    port: 3306,
    database: 'portal_tech_db',
    user: 'admin_tech',
    pass: '••••••••••••',
    ssl: true,
    pooling: 10
  });

  const addLog = (msg: string) => {
    setConnectionLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 9)]);
  };

  const handleTestConnection = () => {
    setTesting(true);
    addLog('Iniciando handshake con el host...');
    setTimeout(() => {
      addLog('Resolviendo DNS: mysql.claro.corp.local -> 10.24.11.82');
      setTimeout(() => {
        addLog('Conexión establecida con éxito.');
        setTesting(false);
      }, 800);
    }, 1000);
  };

  const handleSave = () => {
    setLoading(true);
    addLog('Guardando nueva configuración...');
    setTimeout(() => {
      setLoading(false);
      addLog('Configuración aplicada.');
    }, 1500);
  };

  const cardBg = theme === 'dark' ? 'bg-[#0d1117] border-[#1a1f26]' : 'bg-white border-gray-100 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-[#EF3340]" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EF3340]">System Infrastructure</span>
          </div>
          <h2 className={`text-4xl font-black tracking-tighter mb-1 ${textColor}`}>Parámetros de Persistencia</h2>
          <p className="text-sm font-medium text-gray-400">Toda la solución se conectará con la base de datos MySQL configurada.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleTestConnection}
            disabled={testing}
            className={`px-8 py-4 rounded-2xl text-[11px] font-black flex items-center gap-3 transition-all ${testing ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'}`}
          >
            {testing ? <RefreshCw className="animate-spin" size={16} /> : <Activity size={16} />}
            PROBAR CONEXIÓN
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#EF3340] hover:bg-[#D62E39] text-white text-[11px] font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-red-500/20 flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            GUARDAR Y REINICIAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <Section theme={theme} title="Conectividad de Servidor" icon={<Server size={22} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Host / IP del Servidor" value={config.host} onChange={v => setConfig({...config, host: v})} icon={<Globe size={18} />} theme={theme} />
              <InputField label="Puerto MySQL" value={config.port.toString()} onChange={v => setConfig({...config, port: parseInt(v) || 0})} icon={<Terminal size={18} />} theme={theme} />
              <InputField label="Nombre de Base de Datos" value={config.database} onChange={v => setConfig({...config, database: v})} icon={<Database size={18} />} theme={theme} />
              <div className="flex items-center justify-between p-6 rounded-3xl bg-emerald-50/30 border border-emerald-100 mt-auto">
                 <div className="flex items-center gap-4">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    <div>
                       <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Seguridad SSL/TLS</p>
                       <p className="text-xs font-bold text-emerald-800">Conexión Encriptada Activada</p>
                    </div>
                 </div>
              </div>
            </div>
          </Section>

          <Section theme={theme} title="Credenciales de Acceso" icon={<Lock size={22} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Usuario (Root/Service)" value={config.user} onChange={v => setConfig({...config, user: v})} icon={<ShieldCheck size={18} />} theme={theme} />
              <InputField label="Contraseña" value={config.pass} onChange={v => setConfig({...config, pass: v})} type="password" icon={<Lock size={18} />} theme={theme} />
            </div>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className={`p-8 rounded-[3.5rem] border ${cardBg}`}>
              <div className="flex items-center gap-4 mb-8">
                 <Terminal className="text-[#EF3340]" size={20} />
                 <h3 className={`text-sm font-black uppercase tracking-widest ${textColor}`}>Connection Console</h3>
              </div>
              <div className="space-y-4 font-mono text-[10px] leading-relaxed">
                 {connectionLogs.map((log, i) => (
                   <div key={i} className={`flex gap-3 ${log.includes('establecida') ? 'text-emerald-500' : 'text-gray-400'}`}>
                      <span className="opacity-30">{i === 0 ? '>' : ''}</span>
                      {log}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSettings;
