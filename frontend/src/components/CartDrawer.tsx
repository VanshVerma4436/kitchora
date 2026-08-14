import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Award, ArrowRight } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isCartOpen, closeCart } = useUIStore();
  const { 
    items, removeItem, updateQuantity, getSubtotal, getTotal,
    couponCode, couponDiscount, applyCoupon, pointsToRedeem, setPointsToRedeem 
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const tax = Math.round(subtotal * 0.05);
  const delivery = subtotal >= 500 || subtotal === 0 ? 0 : 30;
  const pointsDiscount = pointsToRedeem / 10.0;
  const finalTotal = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === 'KITCHORA20') {
      const disc = Math.min((subtotal * 0.2), 100);
      applyCoupon('KITCHORA20', disc);
      setCouponMsg('✅ Coupon KITCHORA20 applied! 20% OFF');
    } else if (couponInput.toUpperCase() === 'WELCOME100') {
      applyCoupon('WELCOME100', 100);
      setCouponMsg('✅ Coupon WELCOME100 applied! ₹100 OFF');
    } else {
      setCouponMsg('❌ Invalid coupon code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1322] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-sm text-white">Your Food Basket</h3>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-xs">
              {items.length} items
            </span>
          </div>

          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-2xl">
                🛒
              </div>
              <p className="text-white font-bold text-sm">Your cart is empty</p>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">
                Explore delicious meals from top cloud kitchens and add them to your cart!
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div className="truncate">
                    <p className="font-bold text-white text-xs truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">₹{item.price}</p>
                    {item.customizations.length > 0 && (
                      <p className="text-[10px] text-slate-500 truncate">
                        {item.customizations.map(c => c.option_name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => updateQuantity(idx, item.quantity - 1)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white text-xs w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(idx, item.quantity + 1)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Coupon Input */}
          {items.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 space-y-2 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Tag className="w-4 h-4 text-orange-400" />
                <span>Apply Coupon Code</span>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. KITCHORA20"
                  className="flex-1 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 outline-none uppercase font-semibold"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white text-xs font-bold rounded-xl border border-orange-500/20 transition-all"
                >
                  Apply
                </button>
              </form>
              {couponMsg && <p className="text-[11px] font-semibold">{couponMsg}</p>}
            </div>
          )}

          {/* Loyalty Slider */}
          {items.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Award className="w-4 h-4" />
                  <span>Redeem Kitchora Points</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {pointsToRedeem} pts (-₹{pointsToRedeem / 10})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Bill Summary Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-2.5">
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="text-white font-semibold">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-emerald-400 font-semibold">
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-orange-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Points Discount</span>
                  <span>-₹{pointsDiscount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
              <span>Total Amount</span>
              <span className="text-orange-400 text-base">₹{finalTotal}</span>
            </div>

            <button
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
