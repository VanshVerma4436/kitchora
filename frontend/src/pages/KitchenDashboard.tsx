import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, Clock, AlertTriangle, 
  CheckCircle2, RefreshCw, Sparkles, Box, TrendingUp, ChefHat, ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';

const KANBAN_STAGES = [
  { key: 'PLACED', label: 'New Orders', color: 'border-orange-500/40 bg-orange-500/5' },
  { key: 'CONFIRMED', label: 'Accepted', color: 'border-amber-500/40 bg-amber-500/5' },
  { key: 'PREPARING', label: 'Cooking', color: 'border-cyan-500/40 bg-cyan-500/5' },
  { key: 'READY', label: 'Ready for Pickup', color: 'border-emerald-500/40 bg-emerald-500/5' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'border-purple-500/40 bg-purple-500/5' },
  { key: 'DELIVERED', label: 'Completed', color: 'border-slate-800 bg-slate-900/40' }
];

const FALLBACK_KITCHEN_ORDERS = [
  {
    id: 1001,
    order_number: 'KITCH-8921',
    status: 'PLACED',
    total_amount: 320,
    items: [{ id: 1, menu_item: { name: 'Special Chicken Dum Biryani Handi' }, quantity: 1 }]
  },
  {
    id: 1002,
    order_number: 'KITCH-7832',
    status: 'PREPARING',
    total_amount: 290,
    items: [{ id: 2, menu_item: { name: 'Paneer Butter Masala Handi' }, quantity: 1 }]
  },
  {
    id: 1003,
    order_number: 'KITCH-6541',
    status: 'READY',
    total_amount: 340,
    items: [{ id: 3, menu_item: { name: 'Quinoa & Grilled Chicken Bowl' }, quantity: 1 }]
  }
];

const FALLBACK_INVENTORY = [
  { id: 1, ingredient_name: 'Basmati Rice (Saffron Grade)', quantity: 45, unit: 'kg', min_threshold: 15, status: 'HEALTHY' },
  { id: 2, ingredient_name: 'Fresh Paneer Cubes', quantity: 4, unit: 'kg', min_threshold: 10, status: 'LOW' },
  { id: 3, ingredient_name: 'Fresh Chicken Breast', quantity: 18, unit: 'kg', min_threshold: 8, status: 'HEALTHY' },
  { id: 4, ingredient_name: 'Amul Butter & Cream', quantity: 2, unit: 'kg', min_threshold: 5, status: 'CRITICAL' }
];

const FALLBACK_FORECAST = [
  {
    id: 1,
    menu_item_name: 'Special Chicken Dum Biryani Handi',
    forecast_date: 'Tomorrow (Peak Lunch)',
    confidence_score: 0.94,
    predicted_demand_qty: 65,
    procurement_recommendation: 'Procure 25kg Basmati Rice and 20kg Chicken Breast before 9:00 AM.'
  },
  {
    id: 2,
    menu_item_name: 'Paneer Butter Masala Handi',
    forecast_date: 'Tomorrow (Dinner)',
    confidence_score: 0.89,
    predicted_demand_qty: 40,
    procurement_recommendation: 'Restock 8kg Fresh Paneer Cubes and 3kg Butter to prevent stockout.'
  }
];

export const KitchenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'INVENTORY' | 'FORECAST'>('KANBAN');
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const kitchenId = 1;

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, invRes, foreRes] = await Promise.all([
        api.getUserOrders().catch(() => []),
        api.getInventory(kitchenId).catch(() => []),
        api.getDemandForecast(kitchenId).catch(() => [])
      ]);
      setOrders(ordersRes.length > 0 ? ordersRes : FALLBACK_KITCHEN_ORDERS);
      setInventory(invRes.length > 0 ? invRes : FALLBACK_INVENTORY);
      setForecast(foreRes.length > 0 ? foreRes : FALLBACK_FORECAST);
    } catch (err) {
      console.error('Error fetching kitchen dashboard data:', err);
      setOrders(FALLBACK_KITCHEN_ORDERS);
      setInventory(FALLBACK_INVENTORY);
      setForecast(FALLBACK_FORECAST);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusAdvance = async (orderId: number, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    try {
      await api.updateOrderStatus(orderId, nextStatus);
    } catch (err) {
      console.log('Updated order status locally for demo:', orderId, nextStatus);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-extrabold uppercase">
              Cloud Kitchen Owner Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Saffron & Spice Operations</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('KANBAN')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'KANBAN' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Order Kanban
          </button>
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'INVENTORY' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('FORECAST')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'FORECAST' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Demand Forecast</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Orders</span>
          <p className="text-3xl font-extrabold text-white">{orders.length}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue</span>
          <p className="text-3xl font-extrabold text-emerald-400">₹{totalRevenue}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Prep Time</span>
          <p className="text-3xl font-extrabold text-amber-400">22 mins</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Kitchen Workload</span>
          <p className="text-3xl font-extrabold text-cyan-400">65%</p>
        </div>
      </div>

      {/* Tab 1: Order Kanban */}
      {activeTab === 'KANBAN' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-500" />
              <span>Real-Time Order Kanban Board</span>
            </h2>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto no-scrollbar">
            {KANBAN_STAGES.map((stage) => {
              const stageOrders = orders.filter(o => o.status === stage.key);

              return (
                <div
                  key={stage.key}
                  className={`border rounded-3xl p-4 space-y-3 min-h-[400px] flex flex-col justify-between ${stage.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <h3 className="font-extrabold text-white text-xs truncate">{stage.label}</h3>
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-300 text-[10px] font-bold flex items-center justify-center border border-slate-800">
                        {stageOrders.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stageOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 space-y-2 shadow-md"
                        >
                          <div className="flex justify-between text-xs">
                            <span className="font-extrabold text-white truncate">#{ord.order_number}</span>
                            <span className="text-orange-400 font-bold">₹{ord.total_amount}</span>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            {ord.items?.map((it: any) => (
                              <p key={it.id} className="truncate">• {it.menu_item?.name || 'Dish'} (x{it.quantity})</p>
                            ))}
                          </div>

                          {/* Advance Status Controls */}
                          <div className="pt-1 flex gap-1">
                            {stage.key === 'PLACED' && (
                              <button
                                onClick={() => handleStatusAdvance(ord.id, 'CONFIRMED')}
                                className="w-full py-1 rounded-lg bg-orange-500 text-white font-bold text-[10px]"
                              >
                                Accept Order
                              </button>
                            )}
                            {stage.key === 'CONFIRMED' && (
                              <button
                                onClick={() => handleStatusAdvance(ord.id, 'PREPARING')}
                                className="w-full py-1 rounded-lg bg-cyan-500 text-white font-bold text-[10px]"
                              >
                                Start Cooking
                              </button>
                            )}
                            {stage.key === 'PREPARING' && (
                              <button
                                onClick={() => handleStatusAdvance(ord.id, 'READY')}
                                className="w-full py-1 rounded-lg bg-emerald-500 text-white font-bold text-[10px]"
                              >
                                Mark Ready
                              </button>
                            )}
                            {stage.key === 'READY' && (
                              <button
                                onClick={() => handleStatusAdvance(ord.id, 'OUT_FOR_DELIVERY')}
                                className="w-full py-1 rounded-lg bg-purple-500 text-white font-bold text-[10px]"
                              >
                                Hand to Rider
                              </button>
                            )}
                            {stage.key === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => handleStatusAdvance(ord.id, 'DELIVERED')}
                                className="w-full py-1 rounded-lg bg-slate-800 text-white font-bold text-[10px]"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Management */}
      {activeTab === 'INVENTORY' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-orange-500" />
            <span>Raw Ingredients & Stock Levels</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Ingredient</th>
                  <th className="p-3">Stock Quantity</th>
                  <th className="p-3">Min Threshold</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {inventory.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-white">{inv.ingredient_name}</td>
                    <td className="p-3 font-semibold">{inv.quantity} {inv.unit}</td>
                    <td className="p-3 text-slate-400">{inv.min_threshold} {inv.unit}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        inv.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        inv.status === 'LOW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white font-bold text-[11px] rounded-lg border border-orange-500/20 transition-all">
                        + Restock 10{inv.unit}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AI Demand Forecast */}
      {activeTab === 'FORECAST' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Time-Series Demand Forecast & Procurement</span>
            </h2>
            <p className="text-xs text-slate-400">Statistical forecasting model predicting tomorrow's dish sales and raw ingredient requirements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forecast.map((f) => (
              <div key={f.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{f.menu_item_name}</h3>
                    <p className="text-[11px] text-slate-400">Forecast Date: {f.forecast_date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold text-xs border border-amber-500/20">
                    {Math.round(f.confidence_score * 100)}% Confidence
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">Predicted Sales Demand:</span>
                  <span className="text-lg font-extrabold text-orange-400">{f.predicted_demand_qty} portions</span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                  <span className="font-bold text-orange-400 block mb-0.5">Procurement Recommendation:</span>
                  {f.procurement_recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
