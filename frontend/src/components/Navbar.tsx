import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, MapPin, Search, User as UserIcon, 
  Award, UtensilsCrossed, LogOut, ChevronDown, LayoutDashboard, ShieldCheck, Compass
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { openCart, selectedLocation } = useUIStore();

  const [searchInput, setSearchInput] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-2xl">🍳</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Kitch<span className="text-orange-500">ora</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                AI SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Smart Food. Smarter Kitchens.
            </p>
          </div>
        </Link>

        {/* Explore Food Link */}
        <Link
          to="/explore"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 text-slate-200 hover:text-orange-400 font-bold text-xs transition-all"
        >
          <Compass className="w-4 h-4 text-orange-500" />
          <span>Explore Menu</span>
        </Link>

        {/* Location Dropdown — Only Visible When Logged In */}
        {user && (
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs text-slate-300 cursor-pointer transition-colors">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <div className="truncate max-w-[140px]">
              <span className="block text-[10px] uppercase text-slate-500 font-bold">Deliver To</span>
              <span className="font-semibold text-white truncate">{selectedLocation}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </div>
        )}

        {/* Clean Universal Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden sm:block relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search dishes, biryanis, or kitchens..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-20 py-2.5 outline-none transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] rounded-lg transition-all"
          >
            Search
          </button>
        </form>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Customer Orders — Only Visible When Logged In */}
          {user && (
            <Link
              to="/orders"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="My Orders"
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              <span>Orders</span>
            </Link>
          )}

          {/* Rewards — Only Visible When Logged In */}
          {user && (
            <Link
              to="/rewards"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors hidden md:flex items-center gap-1.5 text-xs font-semibold"
              title="Rewards"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Rewards</span>
            </Link>
          )}

          {/* Cart Trigger — Only Visible When Logged In */}
          {user && (
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-orange-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-bounce shadow-md">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {/* Profile Menu / Authentication */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-xs font-semibold text-white"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  {user.full_name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/explore"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-orange-400 font-semibold hover:bg-slate-800/60 flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    Explore Food Menu
                  </Link>

                  {user.role === 'KITCHEN_OWNER' && (
                    <Link
                      to="/kitchen"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-orange-400 font-semibold hover:bg-slate-800/60 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Kitchen Dashboard
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-cyan-400 font-semibold hover:bg-slate-800/60 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Analytics
                    </Link>
                  )}

                  <Link
                    to="/orders"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 flex items-center gap-2"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-slate-400" />
                    My Orders
                  </Link>

                  <Link
                    to="/rewards"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-slate-400" />
                    Loyalty Rewards
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 font-semibold hover:bg-slate-800/60 flex items-center gap-2 border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-lg shadow-orange-500/20"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
};
