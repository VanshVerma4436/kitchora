import React, { useState, useEffect } from 'react';
import { Award, Gift, Zap, Share2, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const Rewards: React.FC = () => {
  const [loyalty, setLoyalty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLoyalty = async () => {
      setLoading(true);
      try {
        const res = await api.getLoyalty();
        setLoyalty(res);
      } catch (err) {
        console.error('Error fetching loyalty overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  const handleCopyCode = () => {
    if (loyalty?.referral_code) {
      navigator.clipboard.writeText(loyalty.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            <span>Kitchora Rewards</span>
          </h1>
          <p className="text-xs text-slate-400">Earn 1 Point for every ₹10 spent on cloud kitchen orders</p>
        </div>
      </div>

      {/* Main Loyalty Balance Card */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-extrabold border border-amber-500/30 uppercase tracking-wider">
              {loyalty?.tier || 'GOLD'} MEMBER TIER
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white pt-2">
              {loyalty?.points_balance || 450} <span className="text-amber-400 text-2xl font-bold">PTS</span>
            </h2>
            <p className="text-xs text-slate-300">Equivalent to <span className="font-extrabold text-emerald-400 text-sm">₹{loyalty?.value_in_inr || 45} OFF</span> on your next checkout</p>
          </div>

          {/* Referral Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-center shrink-0 min-w-[220px]">
            <p className="text-[10px] uppercase font-bold text-slate-400">Your Referral Code</p>
            <p className="text-lg font-extrabold text-orange-400 tracking-wider font-mono">
              {loyalty?.referral_code || 'VANSH2026'}
            </p>
            <button
              onClick={handleCopyCode}
              className="w-full py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white text-xs font-bold border border-orange-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy & Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Gift className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-sm">Instant Discounts</h3>
          <p className="text-xs text-slate-400">Redeem points directly at checkout for instant cash savings.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-sm">Order Streaks</h3>
          <p className="text-xs text-slate-400">Maintain a 3-day ordering streak to unlock 2x bonus points!</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white text-sm">Exclusive Tasting</h3>
          <p className="text-xs text-slate-400">Gold & Platinum members get early access to newly launched dishes.</p>
        </div>
      </div>
    </div>
  );
};
