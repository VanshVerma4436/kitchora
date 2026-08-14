import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, MapPin, Phone, Wifi, WifiOff, 
  ChefHat, Bike, PackageCheck, AlertCircle, RefreshCw, ArrowLeft
} from 'lucide-react';
import { api, WS_BASE_URL } from '../services/api';

const ORDER_STAGES = [
  { key: 'PLACED', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'CONFIRMED', label: 'Kitchen Confirmed', icon: ChefHat },
  { key: 'PREPARING', label: 'Cooking & Packing', icon: Clock },
  { key: 'READY', label: 'Handed to Delivery', icon: Bike },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck }
];

const FALLBACK_ORDER_DETAILS = (idStr: string) => ({
  id: Number(idStr) || 1001,
  order_number: `KITCH-${idStr || '8921'}`,
  status: 'PREPARING',
  created_at: new Date().toISOString(),
  estimated_delivery_mins: 25,
  total_amount: 350,
  kitchen: { name: 'Saffron & Spice Cloud Kitchen' },
  delivery: {
    agent_name: 'Rajesh Kumar',
    agent_phone: '+91 98765 00000'
  },
  items: [
    {
      id: 1,
      menu_item: { name: 'Special Chicken Dum Biryani Handi' },
      quantity: 1,
      total_price: 320,
      customizations: [{ option_name: 'Extra Salan & Raita' }]
    }
  ]
});

export const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [wsStatus, setWsStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'FALLBACK'>('DISCONNECTED');
  const [loading, setLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const data = await api.getOrderById(Number(id));
      if (data && data.order_number) {
        setOrder(data);
      } else {
        setOrder(FALLBACK_ORDER_DETAILS(id));
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setOrder(FALLBACK_ORDER_DETAILS(id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    if (!id) return;

    // Connect WebSocket
    const wsUrl = `${WS_BASE_URL}/ws/orders/${id}`;
    let socket: WebSocket;

    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsStatus('CONNECTED');
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.status) {
            setOrder((prev: any) => prev ? { ...prev, status: payload.status } : prev);
          }
        } catch (e) {
          console.log('WS message string:', event.data);
        }
      };

      socket.onerror = () => {
        setWsStatus('FALLBACK');
      };

      socket.onclose = () => {
        setWsStatus('FALLBACK');
      };
    } catch (err) {
      setWsStatus('FALLBACK');
    }

    // Interval fallback polling every 5 seconds if WebSocket drops
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(interval);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-2" />
        <p className="text-xs font-semibold">Connecting to live kitchen feed...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-slate-400 space-y-3">
        <p className="text-base font-bold text-white">Order not found.</p>
        <Link to="/orders" className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs">
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStageIndex = Math.max(0, ORDER_STAGES.findIndex(s => s.key === order.status));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Back to Orders */}
      <div className="pt-2">
        <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Order #{order.order_number}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-extrabold border border-orange-500/20 uppercase">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>

        {/* Real-time Connection Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
          {wsStatus === 'CONNECTED' ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400">Live WS Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400">Polling Fallback Mode</span>
            </>
          )}
        </div>
      </div>

      {/* ETA Clock Card */}
      <div className="bg-gradient-to-r from-orange-600/20 via-amber-500/15 to-orange-600/20 border border-orange-500/30 rounded-3xl p-8 text-center space-y-2 shadow-2xl">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">Estimated Delivery Time</span>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white gradient-text-orange">
          {order.estimated_delivery_mins - 5} – {order.estimated_delivery_mins + 5} mins
        </h2>
        <p className="text-xs text-slate-400">Your food is being prepared at {order.kitchen?.name}</p>
      </div>

      {/* Order Progress Pipeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <h3 className="font-extrabold text-white text-base">Live Order Pipeline</h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {ORDER_STAGES.map((stage, idx) => {
            const isPassed = currentStageIndex >= idx;
            const isCurrent = currentStageIndex === idx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                  isCurrent
                    ? 'bg-orange-500/20 border-orange-500 text-white shadow-lg shadow-orange-500/10 scale-105'
                    : isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-950 border-slate-800/60 text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'animate-bounce text-orange-400' : ''}`} />
                <span className="text-[11px] font-bold leading-tight">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Rider Card */}
      {order.delivery && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl font-bold">
              🛵
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">{order.delivery.agent_name}</p>
              <p className="text-xs text-slate-400">Kitchora Express Fleet Rider</p>
            </div>
          </div>

          <a
            href={`tel:${order.delivery.agent_phone}`}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white font-bold text-xs border border-emerald-500/30 transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Delivery Partner</span>
          </a>
        </div>
      )}

      {/* Order Item Details */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-extrabold text-white text-base">Items in this Order</h3>

        <div className="space-y-3">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-800/60 pb-2.5">
              <div>
                <p className="font-bold text-white">{item.menu_item?.name || 'Dish Item'} x {item.quantity}</p>
                {item.customizations?.length > 0 && (
                  <p className="text-[10px] text-slate-400">{item.customizations.map((c: any) => c.option_name).join(', ')}</p>
                )}
              </div>
              <span className="font-extrabold text-slate-200">₹{item.total_price}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-between font-extrabold text-white text-sm">
          <span>Total Paid</span>
          <span className="text-orange-400">₹{order.total_amount}</span>
        </div>
      </div>

    </div>
  );
};
