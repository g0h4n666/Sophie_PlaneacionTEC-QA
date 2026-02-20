
import React, { useState } from 'react';
import { User } from '../types';
import { 
  Mail, 
  Lock, 
  LogIn, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Eye, 
  Activity,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface Props {
  onLogin: (u: User) => void;
}


const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('E-mail corporativo es obligatorio');
      return;
    }
    if (!password) {
      setError('Pin de acceso es obligatorio');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Formato de E-mail no válido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (res.status === 500) {
        setError('Error del servidor. Verifique la conexión con la base de datos.');
        return;
      }

      if (!res.ok || !data.success) {
        setError('Acceso Denegado: Credenciales incorrectas para el entorno corporativo');
        return;
      }

      const u = data.user;
      onLogin({
        id:     String(u.id),
        name:   u.name,
        email:  u.email,
        role:   u.role,
        area:   u.area ?? '',
        status: u.status,
      });
    } catch {
      setError('Error de conexión con el servidor. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { 
      icon: <TrendingUp size={20} />, 
      title: "Gestión CAPEX", 
      desc: "Control total de ciclos de inversión y presupuestos." 
    },
    { 
      icon: <Eye size={20} />, 
      title: "Vigilancia Tech", 
      desc: "Monitoreo de tendencias y roadmaps estratégicos." 
    },
    { 
      icon: <Activity size={20} />, 
      title: "Control T-Unitarios", 
      desc: "Seguimiento en tiempo real de adquisiciones operativas." 
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#FDFDFD] overflow-hidden">
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes halo-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.05; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.05; }
        }
        @keyframes rotate-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        .animate-float-delayed {
          animation: float 25s infinite ease-in-out reverse;
          animation-delay: -5s;
        }
        .animate-halo {
          animation: halo-pulse 8s infinite ease-in-out, rotate-slow 20s infinite linear;
        }
      `}</style>

      {/* Panel Informativo (Izquierda) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1a1f26] via-[#0f1219] to-[#EF3340] relative overflow-hidden flex-col justify-center p-24">
        {/* Decoración de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#EF3340] opacity-[0.05] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-white opacity-[0.02] rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="space-y-12">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.85] mb-8">
                Sophie orquestando la <br />
                <span className="text-[#EF3340]">infraestructura</span> <br />
                del mañana.
              </h2>
              <p className="text-gray-400 font-medium text-xl leading-relaxed">
                Plataforma inteligente centralizada para la toma de decisiones estratégicas y financieras en entornos de alta demanda.
              </p>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Ecosistema de Módulos</p>
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-6 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EF3340] group-hover:scale-110 group-hover:bg-[#EF3340] group-hover:text-white transition-all duration-300 shadow-lg">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white group-hover:text-[#EF3340] transition-colors">{f.title}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-24 text-[10px] font-black text-gray-500 uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
          <span>Sophie • Claro Colombia • 2027</span>
        </div>
      </div>

      {/* Panel de Formulario (Derecha) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white overflow-hidden">
        
        {/* Efecto HALO Dinámico */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-[1px] border-[#EF3340]/5 rounded-full animate-halo opacity-20 pointer-events-none"></div>
        
        <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
          <div className="lg:hidden mb-12 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#EF3340] to-[#b01e28] rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
              <Cpu size={40} strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter leading-tight">
              Portal <br />
              <span className="text-[#EF3340]">Sophie</span>
            </h1>
            <div className="w-12 h-1 bg-[#EF3340] mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
              Acceso Seguro Corporativo (RBAC)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
            <div className="space-y-3 w-full">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${error.includes('E-mail') ? 'text-red-400' : 'text-gray-300 group-focus-within:text-[#EF3340]'}`} size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                  className={`w-full pl-16 pr-8 py-5 bg-gray-50/50 backdrop-blur-sm border rounded-3xl outline-none transition-all font-black text-gray-900 text-sm placeholder:text-gray-300 shadow-sm ${error.includes('E-mail') ? 'border-red-400 ring-4 ring-red-50' : 'border-gray-100 focus:ring-8 focus:ring-red-500/5 focus:border-[#EF3340]'}`}
                  placeholder="ejemplo@claro.com.co"
                />
              </div>
            </div>

            <div className="space-y-3 w-full">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pin de Acceso</label>
              <div className="relative group">
                <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${error.includes('Pin') ? 'text-red-400' : 'text-gray-300 group-focus-within:text-[#EF3340]'}`} size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if(error) setError(''); }}
                  className={`w-full pl-16 pr-8 py-5 bg-gray-50/50 backdrop-blur-sm border rounded-3xl outline-none transition-all font-black text-gray-900 text-sm placeholder:text-gray-300 shadow-sm ${error.includes('Pin') ? 'border-red-400 ring-4 ring-red-50' : 'border-gray-100 focus:ring-8 focus:ring-red-500/5 focus:border-[#EF3340]'}`}
                  placeholder="••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-5 w-full bg-red-50 border border-red-100 text-[#EF3340] text-[11px] font-black rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error.toUpperCase()}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full max-w-[320px] bg-[#EF3340] hover:bg-[#D62E39] text-white font-black py-6 rounded-3xl shadow-[0_20px_40px_-10px_rgba(239,51,64,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(239,51,64,0.4)] flex items-center justify-center gap-4 transition-all transform active:scale-[0.96] disabled:opacity-70 text-[11px] tracking-[0.2em] mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  ENTRAR A SOPHIE
                  <ChevronRight size={18} className="opacity-50" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Acceso con usuarios registrados en CAPEX Central</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
