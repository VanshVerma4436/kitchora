import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChefHat, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLogin = async (loginEmail: string, loginPass: string, fallbackRole?: 'CUSTOMER' | 'KITCHEN_OWNER' | 'ADMIN', fallbackName?: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email: loginEmail, password: loginPass });
      const meRes = await api.getMe(res.access_token);
      setAuth(meRes, res.access_token);

      if (meRes.role === 'KITCHEN_OWNER') {
        navigate('/kitchen');
      } else if (meRes.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/explore');
      }
    } catch (err: any) {
      if (fallbackRole) {
        // Fallback for seamless demo portal access if backend is unreachable or initializing
        const mockUser = {
          id: fallbackRole === 'ADMIN' ? 3 : fallbackRole === 'KITCHEN_OWNER' ? 2 : 1,
          email: loginEmail,
          full_name: fallbackName || (fallbackRole === 'ADMIN' ? 'Kitchora Admin' : fallbackRole === 'KITCHEN_OWNER' ? 'Chef Ranveer Brar' : 'Vansh Verma'),
          role: fallbackRole
        };
        setAuth(mockUser, 'demo-token-' + fallbackRole.toLowerCase());
        if (fallbackRole === 'KITCHEN_OWNER') {
          navigate('/kitchen');
        } else if (fallbackRole === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/explore');
        }
      } else {
        setError(err.message || 'Incorrect email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickDemoClick = (demoEmail: string, role: 'CUSTOMER' | 'KITCHEN_OWNER' | 'ADMIN', name: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    executeLogin(demoEmail, 'password123', role, name);
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
          🍳
        </div>
        <h1 className="text-2xl font-extrabold text-white">Welcome back to Kitchora</h1>
        <p className="text-xs text-slate-400">Sign in to your foodtech account</p>
      </div>

      {/* 1-Click Instant Demo Login Buttons */}
      <div className="bg-slate-900/90 border border-orange-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
        <p className="text-[11px] uppercase font-extrabold text-orange-400 text-center tracking-wider">
          ⚡ 1-Click Instant Portal Access
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoClick('demo@kitchora.com', 'CUSTOMER', 'Vansh Verma')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/40 text-slate-200 flex flex-col items-center gap-1 font-bold transition-all group"
          >
            <User className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px]">Customer</span>
            <span className="text-[9px] text-slate-500 font-normal">Food App</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoClick('chef@saffron.com', 'KITCHEN_OWNER', 'Chef Ranveer Brar')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-200 flex flex-col items-center gap-1 font-bold transition-all group"
          >
            <ChefHat className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px]">Kitchen Owner</span>
            <span className="text-[9px] text-slate-500 font-normal">Kanban Board</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoClick('admin@kitchora.com', 'ADMIN', 'Kitchora Admin')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex flex-col items-center gap-1 font-bold transition-all group"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px]">Super Admin</span>
            <span className="text-[9px] text-slate-500 font-normal">Analytics</span>
          </button>
        </div>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleLoginSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@kitchora.com"
            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-400 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};
