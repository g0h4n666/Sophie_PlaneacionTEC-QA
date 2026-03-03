
import React, { useState, useEffect } from 'react';
import { AppPhase, User, Budget, Expense, UserRole, RolePermissions } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Planning from './components/Planning';
import FollowUp from './components/FollowUp';
import ImpactMeasurement from './components/ImpactMeasurement';
import AdvancedModels from './components/AdvancedModels';
import UserManagement from './components/UserManagement';
import TechWatch from './components/TechWatch';
import BudgetParameters from './components/BudgetParameters';
import DatabaseSettings from './components/DatabaseSettings';
import HelpCenter from './components/HelpCenter';
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  ShieldCheck,
  Milestone,
  TrendingUp,
  Cpu,
  Eye,
  Settings,
  Settings2,
  Zap,
  Database,
  ListChecks,
  ArrowRight,
  ChevronRight,
  Truck,
  PackagePlus,
  Binary,
  Layers,
  Calculator,
  GanttChart,
  PackageSearch,
  HelpCircle
} from 'lucide-react';

export const SofiaLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M120 70C110 60 90 50 90 50C90 50 100 80 105 90M180 70C190 60 210 50 210 50C210 50 200 80 195 90" stroke="#1a1f26" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M110 65C110 45 130 35 150 35C170 35 190 45 190 65" stroke="#EF3340" strokeWidth="3" strokeLinecap="round"/>
    <path d="M125 45V55M150 35V60M175 45V55" stroke="#EF3340" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="125" cy="42" r="3" fill="#EF3340"/>
    <circle cx="150" cy="32" r="3" fill="#EF3340"/>
    <circle cx="175" cy="42" r="3" fill="#EF3340"/>
    <path d="M115 55H135M165 55H185" stroke="#EF3340" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="120" cy="110" r="14" stroke="#1a1f26" strokeWidth="4"/>
    <circle cx="120" cy="110" r="5" fill="#1a1f26"/>
    <circle cx="180" cy="110" r="14" stroke="#1a1f26" strokeWidth="4"/>
    <circle cx="180" cy="110" r="5" fill="#1a1f26"/>
    <path d="M145 125L150 140L155 125H145Z" fill="#1a1f26"/>
    <path d="M100 110C80 130 80 200 110 260C125 290 175 290 190 260C220 200 220 130 200 110" stroke="#1a1f26" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M100 150C85 170 85 240 95 260" stroke="#EF3340" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="115" cy="175" r="12" stroke="#EF3340" strokeWidth="3" strokeDasharray="4 4"/>
    <path d="M115 163V187M103 175H127" stroke="#EF3340" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M105 210L130 190M100 230L125 210" stroke="#EF3340" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="130" cy="190" r="2.5" fill="#EF3340"/>
    <circle cx="125" cy="210" r="2.5" fill="#EF3340"/>
    <path d="M200 150C215 170 215 240 205 260" stroke="#1a1f26" strokeWidth="3" strokeLinecap="round"/>
    <rect x="165" y="185" width="6" height="20" fill="#1a1f26" rx="1"/>
    <rect x="175" y="175" width="6" height="30" fill="#1a1f26" rx="1"/>
    <rect x="185" y="165" width="6" height="40" fill="#1a1f26" rx="1"/>
    <path d="M165 185L195 155" stroke="#EF3340" strokeWidth="3" strokeLinecap="round"/>
    <path d="M188 155H195V162" stroke="#EF3340" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M140 160L160 180M150 145L150 170" stroke="#EF3340" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="160" cy="180" r="3" fill="#EF3340"/>
    <path d="M135 270V290M150 275V310M165 270V290" stroke="#EF3340" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="135" cy="295" r="4" fill="#EF3340"/>
    <circle cx="150" cy="315" r="4" fill="#EF3340"/>
    <circle cx="165" cy="295" r="4" fill="#EF3340"/>
    <path d="M125 285L110 310M175 285L190 310" stroke="#1a1f26" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const DEFAULT_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'ADMINISTRADOR': {
    modules: { dashboard: true, planning: true, followup: true, impactMeasurement: true, advancedModels: true, techWatch: true, userMgmt: true, params: true, dbConfig: true },
    steps: { step1: true, step2: true, step3: true, step4: true, step5: true, step6: true }
  },
  'GERENTE_RESPONSABLE': {
    modules: { dashboard: false, planning: true, followup: false, impactMeasurement: true, advancedModels: true, techWatch: false, userMgmt: false, params: false, dbConfig: false },
    steps: { step1: true, step2: false, step3: true, step4: false, step5: false, step6: false }
  },
  'RESPONSABLE_PLANEACION': {
    modules: { dashboard: true, planning: true, followup: true, impactMeasurement: true, advancedModels: true, techWatch: true, userMgmt: false, params: false, dbConfig: false },
    steps: { step1: false, step2: true, step3: false, step4: true, step5: true, step6: true }
  },
  'CONTROLLER_PRESUPUESTAL': {
    modules: { dashboard: false, planning: false, followup: false, impactMeasurement: false, advancedModels: false, techWatch: false, userMgmt: false, params: false, dbConfig: false },
    steps: { step1: false, step2: false, step3: false, step4: false, step5: false, step6: false }
  }
};

const DEFAULT_BUDGET: Budget = {
  totalIncome: 1250000000,
  fixedCosts: [],
  savingsTarget: 250000000,
  currency: 'COP',
  trm: 4250,
  vat: 19,
  ceilings: {
    'Infraestructura de Red': 1240000,
    'Tecnología e IA': 840000,
    'Soluciones B2B': 450000,
    'Ciberseguridad': 320000
  }
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(DEFAULT_PERMISSIONS);
  const [vigencia, setVigencia] = useState('2026');
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    inversion: true,
    admin: true
  });

  const toggleCat = (cat: string) => {
    setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('budget_user');
    const savedTheme = localStorage.getItem('app_theme') as 'light' | 'dark';
    const savedPerms = localStorage.getItem('role_permissions');
    const savedVigencia = localStorage.getItem('global_vigencia');
    const savedBudget = localStorage.getItem('global_budget');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPhase(AppPhase.PORTAL_HOME);
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedPerms) {
      setRolePermissions(JSON.parse(savedPerms));
    }
    if (savedVigencia) {
      setVigencia(savedVigencia);
    }
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('budget_user', JSON.stringify(u));
    setPhase(AppPhase.PORTAL_HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('budget_user');
    setPhase(AppPhase.LOGIN);
  };

  const handleUpdatePermissions = (newPerms: Record<UserRole, RolePermissions>) => {
    setRolePermissions(newPerms);
    localStorage.setItem('role_permissions', JSON.stringify(newPerms));
  };

  const handleUpdateVigencia = (v: string) => {
    setVigencia(v);
    localStorage.setItem('global_vigencia', v);
  };

  const handleUpdateBudget = (newBudget: Budget) => {
    setBudget(newBudget);
    localStorage.setItem('global_budget', JSON.stringify(newBudget));
  };

  if (phase === AppPhase.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  const perms = user ? rolePermissions[user.role] : DEFAULT_PERMISSIONS.RESPONSABLE_PLANEACION;

  const themeClasses = theme === 'dark' 
    ? "bg-[#0b0e14] text-gray-200" 
    : "bg-[#FDFDFD] text-gray-800";

  const asideClasses = theme === 'dark'
    ? "bg-[#05070a] border-r border-white/5"
    : "bg-white border-r border-gray-100";

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-all duration-500 ${themeClasses}`}>
      <aside className={`w-full md:w-64 flex flex-col sticky top-0 md:h-screen z-[60] transition-all duration-500 ${asideClasses}`}>
        <div className="p-8">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setPhase(AppPhase.PORTAL_HOME)}>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 border border-gray-50 p-2">
              <SofiaLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className={`text-lg font-black tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>SOFIA</h1>
              <h1 className={`text-[8px] font-black tracking-[0.3em] text-[#EF3340] mt-1`}>PLATFORM</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-4 py-4">
          <NavItem active={phase === AppPhase.PORTAL_HOME} onClick={() => setPhase(AppPhase.PORTAL_HOME)} icon={<LayoutDashboard size={18} />} label="Home Central" theme={theme} />

          {(perms.modules.dashboard || perms.modules.planning || perms.modules.followup || perms.modules.impactMeasurement || perms.modules.advancedModels || perms.modules.techWatch) && (
            <div className="space-y-1">
              <NavCategory label="FINANZAS & CAPEX" isOpen={openCats.inversion} onToggle={() => toggleCat('inversion')} theme={theme} />
              {openCats.inversion && (
                <div className="space-y-1">
                  {perms.modules.planning && (
                    <NavItem active={phase === AppPhase.CAPEX_PLANNING} onClick={() => setPhase(AppPhase.CAPEX_PLANNING)} icon={<FileText size={18} />} label={`Planeación ${vigencia}`} theme={theme} isSubItem hasAlert />
                  )}
                  {perms.modules.followup && (
                    <NavItem active={phase === AppPhase.CAPEX_FOLLOWUP} onClick={() => setPhase(AppPhase.CAPEX_FOLLOWUP)} icon={<Milestone size={18} />} label="Seguimiento 0+n" theme={theme} isSubItem />
                  )}
                  {perms.modules.impactMeasurement && (
                    <NavItem active={phase === AppPhase.IMPACT_MEASUREMENT} onClick={() => setPhase(AppPhase.IMPACT_MEASUREMENT)} icon={<GanttChart size={18} />} label="Medición Impacto" theme={theme} isSubItem />
                  )}
                  {perms.modules.dashboard && (
                    <NavItem active={phase === AppPhase.CAPEX_DASHBOARD} onClick={() => setPhase(AppPhase.CAPEX_DASHBOARD)} icon={<Activity size={18} />} label="Dashboard Capex" theme={theme} isSubItem />
                  )}
                  {perms.modules.advancedModels && (
                    <NavItem active={phase === AppPhase.ADVANCED_MODELS} onClick={() => setPhase(AppPhase.ADVANCED_MODELS)} icon={<Calculator size={18} />} label="Modelos Avanzados" theme={theme} isSubItem hasAlert />
                  )}
                  {perms.modules.techWatch && (
                    <NavItem active={phase === AppPhase.TECH_WATCH} onClick={() => setPhase(AppPhase.TECH_WATCH)} icon={<Eye size={18} />} label="Vigilancia Tech" theme={theme} isSubItem />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <NavCategory label="AYUDA & SOPORTE" isOpen={true} onToggle={() => {}} theme={theme} />
            <NavItem active={phase === AppPhase.HELP_CENTER} onClick={() => setPhase(AppPhase.HELP_CENTER)} icon={<HelpCircle size={18} />} label="Ayuda Didáctica" theme={theme} isSubItem />
          </div>

          {(perms.modules.userMgmt || perms.modules.params || perms.modules.dbConfig) && (
            <div className="space-y-1">
              <NavCategory label="ADMINISTRACIÓN" isOpen={openCats.admin} onToggle={() => toggleCat('admin')} theme={theme} />
              {openCats.admin && (
                <div className="space-y-1">
                  {perms.modules.userMgmt && (
                    <NavItem active={phase === AppPhase.USER_MGMT} onClick={() => setPhase(AppPhase.USER_MGMT)} icon={<ShieldCheck size={18} />} label="Accesos y Roles" theme={theme} isSubItem />
                  )}
                  {perms.modules.params && (
                    <NavItem active={phase === AppPhase.BUDGET_PARAMETERS} onClick={() => setPhase(AppPhase.BUDGET_PARAMETERS)} icon={<Settings2 size={18} />} label="Parámetros Globales" theme={theme} isSubItem />
                  )}
                  {perms.modules.dbConfig && (
                    <NavItem active={phase === AppPhase.DATABASE_CONFIG} onClick={() => setPhase(AppPhase.DATABASE_CONFIG)} icon={<Database size={18} />} label="Configuración DB" theme={theme} isSubItem />
                  )}
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50 flex items-center justify-between">
          <button onClick={toggleTheme} className={`p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-gray-50 text-gray-400 hover:text-[#EF3340]'}`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-[#EF3340] font-black tracking-widest transition-colors px-2">
            <LogOut size={16} /> SALIR
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className={`h-20 flex items-center justify-between px-8 sticky top-0 z-50 transition-all duration-500 ${theme === 'dark' ? 'bg-[#0b0e14]/70 border-b border-white/5' : 'bg-[#FDFDFD]/70 border-b border-gray-100'} backdrop-blur-xl`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#EF3340]"></div>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {phase.replace(/_/g, ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-[#EF3340] uppercase tracking-widest">{user?.role}</span>
                <span className={`text-[11px] font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name.toUpperCase()}
                </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-[#EF3340] shadow-sm text-xs">
              {user?.name[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-80px-60px)] w-full">
          {phase === AppPhase.PORTAL_HOME && <PortalHome user={user} theme={theme} setPhase={setPhase} rolePermissions={rolePermissions} />}
          {phase === AppPhase.CAPEX_DASHBOARD && <Dashboard budget={budget} expenses={[]} theme={theme} />}
          {phase === AppPhase.CAPEX_PLANNING && <Planning user={user!} budget={budget} onSave={() => setPhase(AppPhase.CAPEX_DASHBOARD)} theme={theme} rolePermissions={rolePermissions} vigencia={vigencia} />}
          {phase === AppPhase.CAPEX_FOLLOWUP && <FollowUp theme={theme} budget={budget} />}
          {phase === AppPhase.IMPACT_MEASUREMENT && <ImpactMeasurement theme={theme} />}
          {phase === AppPhase.ADVANCED_MODELS && <AdvancedModels theme={theme} />}
          {phase === AppPhase.TECH_WATCH && <TechWatch theme={theme} />}
          {phase === AppPhase.HELP_CENTER && <HelpCenter theme={theme} />}
          {phase === AppPhase.USER_MGMT && (
            <UserManagement 
              theme={theme} 
              rolePermissions={rolePermissions} 
              onUpdatePermissions={handleUpdatePermissions} 
            />
          )}
          {phase === AppPhase.BUDGET_PARAMETERS && <BudgetParameters theme={theme} budget={budget} onUpdateVigencia={handleUpdateVigencia} onUpdateBudget={handleUpdateBudget} />}
          {phase === AppPhase.DATABASE_CONFIG && <DatabaseSettings theme={theme} />}
        </div>

        <footer className={`py-4 px-8 border-t flex items-center justify-between text-[10px] font-bold tracking-widest uppercase mt-auto ${theme === 'dark' ? 'border-white/5 text-gray-500 bg-[#0b0e14]' : 'border-gray-100 text-gray-400 bg-[#FDFDFD]'}`}>
          <span>{currentTime.toLocaleString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })} (GMT-5)</span>
          <span>SOFIA v1.1.0.1</span>
        </footer>
      </main>
    </div>
  );
};

const NavCategory: React.FC<{ label: string; isOpen: boolean; onToggle: () => void; theme: string }> = ({ label, isOpen, onToggle, theme }) => {
  const isDark = theme === 'dark';
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-2 group">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-900'}`}>{label}</span>
      </div>
      <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; theme: 'light' | 'dark'; disabled?: boolean; isSubItem?: boolean; isDeepNested?: boolean; hasAlert?: boolean }> = ({ active, onClick, icon, label, theme, disabled, isSubItem, isDeepNested, hasAlert }) => {
  const isDark = theme === 'dark';
  return (
    <button 
      disabled={disabled} 
      onClick={onClick} 
      className={`w-full flex items-center justify-between py-3 rounded-xl transition-all duration-300 relative ${
        disabled ? 'opacity-20 cursor-not-allowed' : 
        active ? 'bg-red-50 text-[#EF3340]' : 
        'text-gray-500 hover:bg-gray-50'
      } ${isDeepNested ? 'pl-10 pr-4' : 'px-4'}`}
    >
      {active && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#EF3340] rounded-r-full"></div>}
      <div className="flex items-center gap-3">
        <span className={active ? 'text-[#EF3340]' : 'text-gray-400'}>{icon}</span>
        <span className={`text-[11px] font-bold tracking-tight ${active ? 'text-[#EF3340]' : ''}`}>{label}</span>
      </div>
      {hasAlert && <div className="w-1.5 h-1.5 rounded-full bg-[#EF3340]"></div>}
    </button>
  );
};

const PortalHome: React.FC<{ user: User | null; theme: string; setPhase: (p: AppPhase) => void; rolePermissions: Record<UserRole, RolePermissions> }> = ({ user, theme, setPhase, rolePermissions }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const perms = user ? rolePermissions[user.role] : DEFAULT_PERMISSIONS.RESPONSABLE_PLANEACION;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="max-w-4xl">
        <div className="inline-block px-5 py-2 rounded-full bg-red-50 border border-red-100 mb-6">
          <span className="text-[10px] font-black text-[#EF3340] uppercase tracking-[0.2em]">Sesión Corporativa: {user?.role.replace(/_/g, ' ')}</span>
        </div>
        <h2 className={`text-5xl font-black tracking-tighter mb-6 leading-tight ${textColor}`}>
          Dirección de <span className="text-[#EF3340]">Planeación Tecnológica</span>
        </h2>
        <p className="text-lg font-medium text-gray-400 leading-relaxed max-w-3xl">
          SOFIA es el núcleo de inteligencia estratégica de Claro Colombia. Nuestra plataforma orquesta el ciclo de vida completo del <span className="text-gray-600 font-bold">CAPEX</span>, integrando vigilancia tecnológica de vanguardia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {perms.modules.planning && (
          <ModuleCard theme={theme} title="Gestión Capex" subtitle="Capital Expenditure" icon={<TrendingUp size={24} />} desc="Administración del ciclo de inversión desde la demanda hasta el seguimiento real en SAP." detailedDesc="Optimice el despliegue de capital mediante el seguimiento preciso de PEPs y solicitudes de pedido." color="#EF3340" onClick={() => setPhase(AppPhase.CAPEX_PLANNING)} />
        )}
        {perms.modules.techWatch && (
          <ModuleCard theme={theme} title="Vigilancia Tech" subtitle="Trends & Radar" icon={<Eye size={24} />} desc="Monitoreo estratégico de tendencias y roadmaps para la toma de decisiones tecnológicas." detailedDesc="Explore el horizonte tecnológico a través de un radar especializado y workflow de casos." color="#10B981" onClick={() => setPhase(AppPhase.TECH_WATCH)} />
        )}
      </div>
    </div>
  );
};

const ModuleCard: React.FC<{ theme: string; title: string; subtitle: string; icon: React.ReactNode; desc: string; detailedDesc?: string; color: string; onClick?: () => void; disabled?: boolean }> = ({ theme, title, subtitle, icon, desc, detailedDesc, color, onClick, disabled }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`card-perspective w-full h-[380px] ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer group'}`}>
      <div className="card-inner w-full h-full">
        <div className={`card-front p-8 border flex flex-col transition-all duration-300 ${isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl bg-gray-50 text-gray-800 transition-all duration-500`} style={{ color: color }}>
              {icon}
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
               <ChevronRight size={14} />
            </div>
          </div>
          <h3 className={`text-xl font-black tracking-tighter mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className="text-[#EF3340] text-[8px] font-black uppercase tracking-[0.25em] mb-4">{subtitle}</p>
          <p className="text-gray-400 font-medium text-xs leading-relaxed mb-6 flex-1">{desc}</p>
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.15em] text-[#EF3340]">
            <span className="animate-pulse">Ver detalles</span>
            <ArrowRight size={10} />
          </div>
        </div>

        <div className={`card-back p-8 border flex flex-col justify-between ${isDark ? 'bg-[#1a1f26] border-[#EF3340]/40' : 'bg-[#0f1219] border-[#EF3340]/40 text-white shadow-2xl'}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-7 h-7 rounded-lg bg-[#EF3340]/20 flex items-center justify-center text-[#EF3340]">
                  <ListChecks size={16} />
               </div>
               <h4 className="text-[9px] font-black uppercase tracking-widest text-white">Capacidades</h4>
            </div>
            <p className="text-gray-300 text-[10px] leading-relaxed font-medium">{detailedDesc}</p>
          </div>
          <div className="pt-4">
            <button 
              onClick={!disabled ? (e) => { e.stopPropagation(); if(onClick) onClick(); } : undefined} 
              className="w-full py-3 bg-[#EF3340] text-white text-[9px] font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#D62E39] transition-all tracking-[0.15em] shadow-lg shadow-red-500/10 active:scale-95"
            >
              ACCEDER <ChevronRight size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
