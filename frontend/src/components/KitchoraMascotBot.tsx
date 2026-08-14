import React, { useState, useEffect } from 'react';
import { Sparkles, X, MessageSquare, ChefHat, ShieldCheck, User } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const KitchoraMascotBot: React.FC = () => {
  const { isAIChatOpen, toggleAIChat } = useUIStore();
  const { user } = useAuthStore();

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Role-aware Greeting Sets & Badges
  const getRoleBotConfig = () => {
    if (!user) {
      return {
        botTitle: "Host Kitchy",
        roleTag: "WELCOME AI",
        badgeColor: "bg-orange-500",
        greetings: [
          "Welcome to Kitchora! 🍳",
          "Sign in to explore 15+ Cloud Kitchens! 🚀",
          "Need a quick demo? Use 1-Click Sign In! ⚡",
          "Click me for a guided tour of Kitchora 🦉"
        ]
      };
    }

    switch (user.role) {
      case 'KITCHEN_OWNER':
        return {
          botTitle: "Sous-Chef Kitchy",
          roleTag: "KITCHEN AI",
          badgeColor: "bg-amber-500",
          greetings: [
            "3 orders waiting for preparation! 👨‍🍳",
            "Low stock alert on Fresh Paneer! ⚠️",
            "AI Demand predicts +35% Biryani sales today! 📈",
            "Click for raw ingredient restocking tips! 📦"
          ]
        };

      case 'ADMIN':
        return {
          botTitle: "Commander Kitchy",
          roleTag: "ADMIN AI",
          badgeColor: "bg-cyan-500",
          greetings: [
            "Gross Platform Revenue up +18% this week! 💰",
            "Active Cloud Kitchens: 15 Hubs Online 🚀",
            "Order Fulfillment Rate is 99.4%! 🎯",
            "Ask me for regional expansion analytics! 📊"
          ]
        };

      case 'CUSTOMER':
      default:
        return {
          botTitle: "Chef Kitchy",
          roleTag: "FOOD AI",
          badgeColor: "bg-emerald-500",
          greetings: [
            "Craving something spicy today? 🌶️",
            "Need a high-protein meal pick? 🥗",
            "Ask me for today's secret coupon! 🎁",
            "Want Biryani under ₹300? 🍲",
            "I'm Chef Kitchy! Click me to chat 🦉"
          ]
        };
    }
  };

  const botConfig = getRoleBotConfig();

  // Rotate greetings every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % botConfig.greetings.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [botConfig.greetings.length]);

  if (isAIChatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 selection:bg-none">
      
      {/* Duolingo-style Speech Bubble */}
      {showBubble && (
        <div 
          onClick={toggleAIChat}
          className="relative max-w-[230px] bg-slate-900/95 border-2 border-orange-500/60 hover:border-orange-400 text-white rounded-2xl p-3 shadow-2xl shadow-orange-500/20 cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-300 group"
        >
          {/* Close Bubble Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-[10px] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-xs font-extrabold text-slate-100 group-hover:text-orange-400 transition-colors leading-snug">
              {botConfig.greetings[greetingIndex % botConfig.greetings.length]}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-[10px] font-extrabold">
            <span className="text-orange-400 flex items-center gap-1">
              <span>{botConfig.botTitle}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Tap to chat
            </span>
          </div>

          {/* Pointer Arrow pointing to Mascot */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-orange-500/60 rotate-45" />
        </div>
      )}

      {/* Mascot Bot Floating Character */}
      <button
        onClick={toggleAIChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group focus:outline-none"
        title={`Chat with ${botConfig.botTitle}`}
      >
        {/* Glow Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 opacity-75 blur-md group-hover:opacity-100 transition duration-300 animate-pulse" />

        {/* Mascot Circle Avatar Container */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#1a233b] to-[#0d1322] border-2 border-orange-400 p-1 shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
          
          {/* Mascot Image */}
          <img
            src="/kitchora_owl_mascot.png"
            alt="Chef Kitchy Owl Mascot"
            className={`w-full h-full object-cover rounded-full transition-transform duration-300 ${
              isHovered ? 'scale-115 rotate-6' : 'scale-100'
            }`}
          />

          {/* Dynamic Role Status Badge */}
          <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full ${botConfig.badgeColor} text-black text-[9px] font-extrabold shadow-md border border-slate-900 flex items-center gap-0.5`}>
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            <span>{botConfig.roleTag}</span>
          </div>
        </div>

        {/* Floating Chat Icon Trigger Badge */}
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-lg border-2 border-[#070a12] group-hover:scale-125 transition-transform">
          <MessageSquare className="w-3.5 h-3.5 fill-white" />
        </div>
      </button>

    </div>
  );
};
