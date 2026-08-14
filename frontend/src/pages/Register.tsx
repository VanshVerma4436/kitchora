import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'KITCHEN_OWNER' | 'ADMIN'>('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.register({
        email,
        password,
        full_name: fullName,
        phone,
        role
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-2xl">
          🍳
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Kitchora Account</h1>
        <p className="text-xs text-slate-400">Join the cloud kitchen revolution</p>
      </div>

      <form onSubmit={handleRegister} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Vansh Verma"
            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vansh@example.com"
            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none focus:border-orange-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-300">Account Type</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-3 outline-none focus:border-orange-500"
          >
            <option value="CUSTOMER">Food Customer</option>
            <option value="KITCHEN_OWNER">Cloud Kitchen Owner</option>
            <option value="ADMIN">Platform Administrator</option>
          </select>
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
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs transition-all shadow-lg shadow-orange-500/20"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-orange-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
