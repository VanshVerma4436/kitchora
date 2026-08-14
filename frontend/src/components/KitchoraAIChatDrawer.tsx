import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestedDishes?: any[];
}

export const KitchoraAIChatDrawer: React.FC = () => {
  const { isAIChatOpen, closeAIChat } = useUIStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const getDrawerConfig = () => {
    if (!user) {
      return {
        title: "Host Kitchy AI",
        tagline: "Welcome Assistant",
        initialGreeting: "👋 Welcome to Kitchora! I can guide you through our 15+ cloud kitchens, natural search, or 1-click quick demo sign-in.",
        chips: [
          "How does Kitchora work?",
          "Show demo sign-in options",
          "What is AI Demand Forecast?",
          "Explore Biryani Cloud Kitchens"
        ]
      };
    }

    switch (user.role) {
      case 'KITCHEN_OWNER':
        return {
          title: "Sous-Chef Kitchy AI",
          tagline: "Kitchen Operations Copilot",
          initialGreeting: "👨‍🍳 Hello Chef! I'm your Kitchen Copilot. Ask me about live orders, raw ingredient inventory levels, or tomorrow's AI demand forecasts.",
          chips: [
            "Check low stock inventory",
            "Show tomorrow's demand forecast",
            "Orders pending prep",
            "Average kitchen prep time"
          ]
        };

      case 'ADMIN':
        return {
          title: "Commander Kitchy AI",
          tagline: "Platform Analytics Analyst",
          initialGreeting: "📊 Welcome Admin! I can analyze platform gross revenue, active cloud kitchen counts, order cancellation rates, and expansion trends.",
          chips: [
            "Platform Gross Revenue",
            "Active Kitchen Count",
            "Order Fulfillment Rate",
            "Recent Transaction Logs"
          ]
        };

      case 'CUSTOMER':
      default:
        return {
          title: "Chef Kitchy AI",
          tagline: "Foodie & Nutrition Assistant",
          initialGreeting: "👋 Hi! I'm Chef Kitchy, your smart food assistant. Ask me for dietary recommendations, protein breakdowns, or active coupon codes like KITCHORA20!",
          chips: [
            "High protein veg meals",
            "Bestselling Biryanis",
            "Coupon code KITCHORA20",
            "Healthy dinner < ₹300"
          ]
        };
    }
  };

  const drawerConfig = getDrawerConfig();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: drawerConfig.initialGreeting
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionUuid, setSessionUuid] = useState<string | undefined>(undefined);

  if (!isAIChatOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.aiChat(queryText, sessionUuid);
      setSessionUuid(res.session_uuid);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.reply,
        suggestedDishes: res.suggested_dishes
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `${drawerConfig.title} is ready to assist. You can explore all options smoothly!`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d1322] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 overflow-hidden">
              <img src="/kitchora_owl_mascot.png" alt="Mascot" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">{drawerConfig.title}</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{drawerConfig.tagline}</p>
            </div>
          </div>

          <button
            onClick={closeAIChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {drawerConfig.chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-orange-400 hover:border-orange-500/40 shrink-0 text-[11px] font-semibold transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs shrink-0 font-bold mt-1">
                  🦉
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-orange-500 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Suggested Menu Cards */}
                {m.suggestedDishes && m.suggestedDishes.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-800 pt-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Dishes:</p>
                    {m.suggestedDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <p className="font-bold text-white text-[11px] truncate">{dish.name}</p>
                          <p className="text-[10px] text-slate-400">₹{dish.price} • {dish.protein_g}g Protein</p>
                        </div>
                        <button
                          onClick={() => {
                            addItem({
                              menu_item_id: dish.id,
                              name: dish.name,
                              price: dish.price,
                              is_veg: dish.is_veg,
                              quantity: 1,
                              kitchen_id: dish.kitchen_id,
                              customizations: []
                            });
                          }}
                          className="px-2 py-1 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white rounded-lg text-[10px] font-bold border border-orange-500/20 transition-all shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs shrink-0 font-bold mt-1">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
              <span>{drawerConfig.title} is analyzing...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${drawerConfig.title}...`}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white transition-all shadow-md shadow-orange-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
