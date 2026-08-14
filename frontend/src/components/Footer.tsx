import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, Share2, Smartphone, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Footer: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <footer className="bg-[#05070d] border-t border-slate-800/80 pt-14 pb-8 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header Row with Logo and Country Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl">🍳</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              Kitch<span className="text-orange-500">ora</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" />
              <span>India (English)</span>
            </div>
          </div>
        </div>

        {/* 4 Clean Columns for Real Consumer Foodtech Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About Kitchora */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">About Kitchora</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Who We Are</Link></li>
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Blog & Culinary Stories</Link></li>
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Careers & Culture</Link></li>
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Press & Media</Link></li>
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Investor Relations</Link></li>
            </ul>
          </div>

          {/* Column 2: Portals & Services */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Services & Portals</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to={user ? "/explore" : "/login"} className="hover:text-orange-400 transition-colors">Customer Food Portal</Link></li>
              <li><Link to={user ? "/kitchen" : "/login"} className="hover:text-orange-400 transition-colors">Kitchen Owner Portal</Link></li>
              <li><Link to={user ? "/admin" : "/login"} className="hover:text-orange-400 transition-colors">Admin Control Center</Link></li>
              <li><Link to={user ? "/rewards" : "/login"} className="hover:text-orange-400 transition-colors">Kitchora Pro & Rewards</Link></li>
              <li><Link to={user ? "/orders" : "/login"} className="hover:text-orange-400 transition-colors">Live Order Tracker</Link></li>
            </ul>
          </div>

          {/* Column 3: For Kitchen Partners */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">For Kitchen Partners</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Add Your Kitchen</Link></li>
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Partner Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Kitchen Guidelines</Link></li>
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Hygiene & Safety Standards</Link></li>
            </ul>
          </div>

          {/* Column 4: Social & App Links */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Connect With Us</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 hover:text-orange-400 flex items-center justify-center transition-colors" title="Social Hub">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 hover:text-orange-400 flex items-center justify-center transition-colors" title="Global Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 hover:text-orange-400 flex items-center justify-center transition-colors" title="Support Chat">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 hover:text-orange-400 flex items-center justify-center transition-colors" title="Verified Security">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </a>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-[11px] font-bold text-slate-300">Get the App</p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer">
                  <Smartphone className="w-3.5 h-3.5 text-orange-400" /> App Store
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Google Play
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 Kitchora Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
            <span className="hover:text-slate-400 cursor-pointer">Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
