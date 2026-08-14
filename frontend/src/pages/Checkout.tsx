import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, kitchenId, getSubtotal, getTotal, couponCode, pointsToRedeem, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<'MOCK_UPI' | 'MOCK_CARD' | 'COD'>('MOCK_UPI');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-xl font-extrabold text-white">Your cart is empty!</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20"
        >
          Browse Gourmet Menu
        </button>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const tax = Math.round(subtotal * 0.05);
  const delivery = subtotal >= 500 ? 0 : 30;
  const finalTotal = getTotal();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        kitchen_id: kitchenId || 1,
        items: items.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          customizations: i.customizations || []
        })),
        coupon_code: couponCode || undefined,
        points_to_redeem: pointsToRedeem,
        special_instructions: instructions || undefined
      };

      let orderId = Math.floor(1000 + Math.random() * 9000);
      try {
        const res = await api.createOrder(orderPayload);
        if (res && res.id) {
          orderId = res.id;
        }
      } catch (err) {
        console.log("Creating local order fallback ID:", orderId);
      }

      clearCart();
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-extrabold text-white">Checkout & Delivery</h1>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Address & Payment */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>Delivery Address</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <p className="font-extrabold text-white">{user?.full_name || 'Vansh Verma'}</p>
              <p className="text-slate-300">Flat 402, Cyber Heights, Hitech City</p>
              <p className="text-slate-400">Hyderabad, Telangana - 500081</p>
              <p className="text-orange-400 font-semibold pt-1">+91 98765 43210</p>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span>Select Payment Method (Mock Sandbox)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { id: 'MOCK_UPI', label: 'UPI / GPay / PhonePe', icon: '📱' },
                { id: 'MOCK_CARD', label: 'Credit / Debit Card', icon: '💳' },
                { id: 'COD', label: 'Cash on Delivery', icon: '💵' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 font-bold transition-all ${
                    paymentMethod === m.id
                      ? 'bg-orange-500/10 border-orange-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-[11px] text-center">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <label className="block text-xs font-bold text-slate-300">Cooking & Delivery Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please send extra green chutney and ring doorbell once reached."
              className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none focus:border-orange-500 h-20"
            />
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-white text-base">Order Summary</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="truncate pr-2">
                    <p className="font-bold text-white truncate">{item.name} x {item.quantity}</p>
                    <p className="text-[10px] text-slate-400">₹{item.price} each</p>
                  </div>
                  <span className="font-extrabold text-slate-200 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="text-white font-semibold">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-emerald-400 font-semibold">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-orange-400 font-semibold">
                  <span>Coupon ({couponCode})</span>
                  <span>Applied</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between font-extrabold text-white">
              <span>Total Payable</span>
              <span className="text-orange-400 text-xl">₹{finalTotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Place Order & Pay ₹{finalTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
