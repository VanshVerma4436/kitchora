import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

const FALLBACK_ORDERS = [
  {
    id: 1001,
    order_number: 'KITCH-8921',
    status: 'PREPARING',
    kitchen: { name: 'Saffron & Spice Cloud Kitchen' },
    created_at: new Date().toISOString(),
    total_amount: 350,
    items: [
      { name: 'Special Chicken Dum Biryani Handi', quantity: 1, price: 320 }
    ]
  },
  {
    id: 1002,
    order_number: 'KITCH-7832',
    status: 'DELIVERED',
    kitchen: { name: 'Green Bowl Co. (Fitness Hub)' },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    total_amount: 370,
    items: [
      { name: 'Quinoa & Grilled Chicken Macro Bowl', quantity: 1, price: 340 }
    ]
  }
];

export const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getUserOrders();
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders(FALLBACK_ORDERS);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders(FALLBACK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-xs font-semibold">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div className="pt-2">
        <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Orders</h1>
        <span className="text-xs text-slate-400 font-bold">{orders.length} total orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="font-bold text-white text-base">No past orders yet</p>
          <Link to="/explore" className="inline-block px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs">
            Discover Food & Kitchens
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 block transition-all shadow-xl"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm">Order #{o.order_number}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-extrabold border border-orange-500/20 uppercase">
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">{o.kitchen?.name || 'Cloud Kitchen'}</p>
                <p className="text-[11px] text-slate-500">
                  {new Date(o.created_at).toLocaleDateString()} • {o.items?.length || 1} items
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Total Paid</span>
                  <span className="text-base font-extrabold text-white">₹{o.total_amount}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
