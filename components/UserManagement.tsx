
import React, { useState, useEffect } from 'react';
import { User, UserRole, RolePermissions } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Mail, 
  Building2,
  CheckCircle2,
  X,
  Save,
  Pencil,
  Trash2,
  Lock,
  Eye,
  Settings,
  LayoutDashboard,
  FileText,
  Milestone,
  Zap,
  Settings2,
  Database,
  ChevronRight,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Check,
  ShoppingCart,
  Truck
} from 'lucide-react';

interface Props {
  theme: 'light' | 'dark';
  rolePermissions: Record<UserRole, RolePermissions>;
  onUpdatePermissions: (newPerms: Record<UserRole, RolePermissions>) => void;
}

const UserManagement: React.FC<Props> = ({ theme, rolePermissions, onUpdatePermissions }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Administrador Sistema', email: 'admin@claro.com.co', role: 'ADMINISTRADOR', area: 'Gobierno IT', status: 'ACTIVO' },
    { id: '2', name: 'Gerente de Inversión', email: 'gerente@claro.com.co', role: 'GERENTE_RESPONSABLE', area: 'Dirección Capex', status: 'ACTIVO' },
    { id: '3', name: 'Líder de Planeación', email: 'planeacion@claro.com.co', role: 'RESPONSABLE_PLANEACION', area: 'Planeación Financiera', status: 'ACTIVO' },
    { id: '4', name: 'Controller T-Unitarios', email: 'controller@claro.com.co', role: 'CONTROLLER_PRESUPUESTAL', area: 'Gestión Adquisiciones', status: 'ACTIVO' },
  ]);

  const [stagedPermissions, setStagedPermissions] = useState<Record<UserRole, RolePermissions>>(rolePermissions);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '', email: '', role: 'RESPONSABLE_PLANEACION', area: '', status: 'ACTIVO'
  });

  useEffect(() => {
    setStagedPermissions(rolePermissions);
  }, [rolePermissions]);

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdatePermissions(stagedPermissions);
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1200);
  };

  const toggleModule = (role: UserRole, module: keyof RolePermissions['modules']) => {
    const updated = {
      ...stagedPermissions,
      [role]: {
        ...stagedPermissions[role],
        modules: {
          ...stagedPermissions[role].modules,
          [module]: !stagedPermissions[role].modules[module]
        }
      }
    };
    setStagedPermissions(updated);
    setHasUnsavedChanges(true);
  };

  const toggleStep = (role: UserRole, step: keyof RolePermissions['steps']) => {
    const updated = {
      ...stagedPermissions,
      [role]: {
        ...stagedPermissions[role],
        steps: {
          ...stagedPermissions[role].steps,
          [step]: !stagedPermissions[role].steps[step]
        }
      }
    };
    setStagedPermissions(updated);
    setHasUnsavedChanges(true);
  };

  const cardBg = theme === 'dark' ? 'bg-[#0d1117] border-[#1a1f26]' : 'bg-white border-gray-200 shadow-sm';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tighter mb-1 ${textColor}`}>Administración de Accesos</h2>
          <p className={`text-xs font-medium ${subTextColor}`}>Configure los privilegios para los {Object.keys(stagedPermissions).length} roles del sistema.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`p-1 rounded-2xl border flex gap-1 ${theme === 'dark' ? 'bg-[#0b0e14] border-[#1a1f26]' : 'bg-gray-100 border-gray-200'}`}>
            <button onClick={() => setActiveTab('users')} className={`px-8 py-3 text-[11px] font-black rounded-xl transition-all ${activeTab === 'users' ? 'bg-white text-[#EF3340] shadow-sm' : 'text-gray-500'}`}>USUARIOS</button>
            <button onClick={() => setActiveTab('roles')} className={`px-8 py-3 text-[11px] font-black rounded-xl transition-all ${activeTab === 'roles' ? 'bg-white text-[#EF3340] shadow-sm' : 'text-gray-500'}`}>MATRIZ DE PERMISOS</button>
          </div>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className={`border rounded-[3rem] overflow-hidden ${cardBg}`}>
            <div className="p-8 border-b border-inherit flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Buscar colaborador..." className={`w-full pl-12 pr-4 py-3.5 text-xs font-bold rounded-2xl border outline-none ${theme === 'dark' ? 'bg-[#1a1f26] border-[#2d3748]' : 'bg-gray-50 border-gray-100'}`} />
              </div>
              <button onClick={() => setShowModal(true)} className="bg-[#EF3340] hover:bg-[#D62E39] text-white text-[11px] font-black px-8 py-4 rounded-2xl transition-all shadow-xl flex items-center gap-3">
                <UserPlus size={18} /> REGISTRAR COLABORADOR
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className={`font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#1a1f26] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  <tr>
                    <th className="px-10 py-6">Identidad</th>
                    <th className="px-10 py-6">Perfil</th>
                    <th className="px-10 py-6">Área</th>
                    <th className="px-10 py-6 text-center">Estado</th>
                    <th className="px-10 py-6 text-center">Gestión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {users.map(u => (
                    <tr key={u.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-white/5 border-gray-800' : 'hover:bg-red-50/20 border-gray-100'}`}>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-[#EF3340] text-sm shadow-sm">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className={`text-[13px] font-black tracking-tight ${textColor}`}>{u.name.toUpperCase()}</p>
                            <p className="text-gray-400 font-bold flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase ${u.role === 'ADMINISTRADOR' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-10 py-6 font-bold text-gray-500">{u.area.toUpperCase()}</td>
                      <td className="px-10 py-6 text-center">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">{u.status}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex justify-center gap-3">
                          <button className="p-2.5 text-gray-400 hover:text-blue-600 rounded-xl transition-all"><Pencil size={18} /></button>
                          <button className="p-2.5 text-gray-400 hover:text-[#EF3340] rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {(Object.keys(stagedPermissions) as UserRole[]).map(role => (
              <PermissionCard 
                key={role}
                role={role} 
                icon={role === 'ADMINISTRADOR' ? <ShieldCheck size={24} /> : role === 'CONTROLLER_PRESUPUESTAL' ? <ShoppingCart size={24} /> : <FileText size={24} />} 
                theme={theme} 
                permissions={stagedPermissions[role]}
                onToggleModule={(mod) => toggleModule(role, mod)}
                onToggleStep={(step) => toggleStep(role, step)}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-6 pt-10">
            {showSaveSuccess && (
              <div className="flex items-center gap-2 text-emerald-500 font-black text-[11px] uppercase animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 size={18} /> ¡Permisos actualizados con éxito!
              </div>
            )}
            
            <button 
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges || isSaving}
              className={`min-w-[300px] py-6 px-12 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${
                hasUnsavedChanges 
                ? 'bg-[#EF3340] text-white hover:bg-[#D62E39] shadow-red-500/20' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              {isSaving ? 'APLICANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionCard: React.FC<{ 
  role: UserRole; 
  icon: React.ReactNode; 
  theme: string; 
  permissions: RolePermissions;
  onToggleModule: (m: keyof RolePermissions['modules']) => void;
  onToggleStep: (s: keyof RolePermissions['steps']) => void;
}> = ({ role, icon, theme, permissions, onToggleModule, onToggleStep }) => {
  const isDark = theme === 'dark';
  const roleName = role.replace(/_/g, ' ');

  return (
    <div className={`p-8 rounded-[3rem] border transition-all ${isDark ? 'bg-[#0f1219] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center gap-4 mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 text-[#EF3340] border border-gray-100 shadow-inner`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{roleName}</h3>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Gestión de privilegios</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-[10px] font-black text-[#EF3340] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Settings2 size={14} /> MÓDULOS DEL PORTAL
          </h4>
          <div className="space-y-3">
            <ToggleItem icon={<LayoutDashboard size={14}/>} label="Dashboard" active={permissions.modules.dashboard} onToggle={() => onToggleModule('dashboard')} />
            <ToggleItem icon={<FileText size={14}/>} label="Capex" active={permissions.modules.planning} onToggle={() => onToggleModule('planning')} />
            <ToggleItem icon={<Truck size={14}/>} label="T-Unitarios" active={permissions.modules.newPurchaseOrders} onToggle={() => onToggleModule('newPurchaseOrders')} />
            <ToggleItem icon={<Zap size={14}/>} label="Vigilancia" active={permissions.modules.techWatch} onToggle={() => onToggleModule('techWatch')} />
            <ToggleItem icon={<ShieldCheck size={14}/>} label="Usuarios" active={permissions.modules.userMgmt} onToggle={() => onToggleModule('userMgmt')} />
          </div>
        </div>

        <div className="pt-8 border-t border-inherit">
          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <ShieldAlert size={14} /> FLUJO PLANEACIÓN
          </h4>
          <div className="grid grid-cols-2 gap-2">
             {Object.keys(permissions.steps).map((step, idx) => (
               <button 
                 key={step} 
                 onClick={() => onToggleStep(step as keyof RolePermissions['steps'])}
                 className={`py-2 rounded-xl text-[8px] font-black uppercase border transition-all ${permissions.steps[step as keyof RolePermissions['steps']] ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
               >
                 P{idx + 1}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onToggle: () => void }> = ({ icon, label, active, onToggle }) => (
  <button onClick={onToggle} className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-all group">
    <div className="flex items-center gap-3">
      <span className={active ? 'text-[#EF3340]' : 'text-gray-300'}>{icon}</span>
      <span className={`text-[11px] font-bold ${active ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
    </div>
    {active ? <ToggleRight size={22} className="text-[#EF3340]" /> : <ToggleLeft size={22} className="text-gray-300" />}
  </button>
);

export default UserManagement;
