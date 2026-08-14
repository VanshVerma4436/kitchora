import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Search, Flame, ShieldCheck, Dumbbell, Clock, Utensils, 
  Tag, Award, ArrowRight, RefreshCw, Zap
} from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { KitchenCard } from '../components/KitchenCard';
import { useUIStore } from '../store/uiStore';

// Rich Mock Fallback Data in case Backend has no seed rows
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Biryani Handis', icon: '🍲' },
  { id: 2, name: 'High Protein Bowls', icon: '🥗' },
  { id: 3, name: 'North Indian Curries', icon: '🥘' },
  { id: 4, name: 'Artisan Pizza', icon: '🍕' },
  { id: 5, name: 'Street Kathi Rolls', icon: '🌯' },
  { id: 6, name: 'Desserts & Sweets', icon: '🍰' }
];

const FALLBACK_KITCHENS = [
  {
    id: 1,
    name: 'Saffron & Spice Cloud Kitchen',
    description: 'Specializing in authentic Awadhi & Dum Pukht Biryanis cooked in traditional clay pots.',
    address: 'Hitech City, Hyderabad',
    cuisine_tags: ['Hyderabadi Biryani', 'Mughlai', 'North Indian'],
    banner_image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    rating: 4.9,
    total_ratings: 1240,
    avg_prep_time_mins: 22
  },
  {
    id: 2,
    name: 'Green Bowl Co. (Fitness Hub)',
    description: 'Macro-calculated high protein, keto, and clean eating salad bowls designed by nutritionists.',
    address: 'Gachibowli, Hyderabad',
    cuisine_tags: ['Fitness', 'Keto', 'Salad Bowls'],
    banner_image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    rating: 4.8,
    total_ratings: 890,
    avg_prep_time_mins: 15
  },
  {
    id: 3,
    name: 'Curry Express Kitchen',
    description: 'Rich buttery paneer handis, slow cooked dal makhani, and hot garlic butter naan.',
    address: 'Jubilee Hills, Hyderabad',
    cuisine_tags: ['North Indian', 'Curries', 'Tandoori'],
    banner_image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80',
    rating: 4.7,
    total_ratings: 650,
    avg_prep_time_mins: 25
  }
];

const FALLBACK_MENU_ITEMS = [
  {
    id: 101,
    name: 'Special Chicken Dum Biryani Handi',
    description: 'Slow-cooked fragrant basmati rice layered with marinated tender chicken piece, saffron milk, and aromatic spices.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
    is_veg: false,
    is_bestseller: true,
    protein_g: 38,
    calories: 620,
    prep_time_mins: 22,
    kitchen_id: 1
  },
  {
    id: 102,
    name: 'Quinoa & Grilled Chicken Macro Bowl',
    description: 'Herb grilled chicken breast, organic quinoa, roasted sweet potatoes, avocado, and lime vinaigrette.',
    price: 340,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    is_veg: false,
    is_bestseller: true,
    protein_g: 45,
    calories: 480,
    prep_time_mins: 15,
    kitchen_id: 2
  },
  {
    id: 103,
    name: 'Paneer Butter Masala Handi',
    description: 'Soft cottage cheese cubes simmered in a creamy tomato gravy infused with kasuri methi and butter.',
    price: 290,
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
    is_veg: true,
    is_bestseller: true,
    protein_g: 22,
    calories: 520,
    prep_time_mins: 20,
    kitchen_id: 3
  },
  {
    id: 104,
    name: 'Truffle Mushroom Woodfire Pizza',
    description: 'Artisan sourdough crust, white truffle oil drizzle, wild cremini mushrooms, and melted mozzarella.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    is_veg: true,
    is_bestseller: false,
    protein_g: 18,
    calories: 590,
    prep_time_mins: 25,
    kitchen_id: 3
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { openAIChat } = useUIStore();

  const [categories, setCategories] = useState<any[]>([]);
  const [kitchens, setKitchens] = useState<any[]>([]);
  const [recommendedDishes, setRecommendedDishes] = useState<any[]>([]);
  const [bestsellerDishes, setBestsellerDishes] = useState<any[]>([]);
  const [quickDishes, setQuickDishes] = useState<any[]>([]);
  const [healthyDishes, setHealthyDishes] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, kitchensRes, itemsRes] = await Promise.all([
          api.getCategories().catch(() => []),
          api.getKitchens().catch(() => []),
          api.getMenuItems().catch(() => [])
        ]);

        const finalCats = (catsRes && catsRes.length > 0) ? catsRes : FALLBACK_CATEGORIES;
        const finalKitchens = (kitchensRes && kitchensRes.length > 0) ? kitchensRes : FALLBACK_KITCHENS;
        const finalItems = (itemsRes && itemsRes.length > 0) ? itemsRes : FALLBACK_MENU_ITEMS;

        setCategories(finalCats);
        setKitchens(finalKitchens);

        // Filter dish sections
        setRecommendedDishes(finalItems.slice(0, 4));
        setBestsellerDishes(finalItems.filter(i => i.is_bestseller));
        setQuickDishes(finalItems.filter(i => i.prep_time_mins <= 20));
        setHealthyDishes(finalItems.filter(i => i.protein_g >= 20 || i.is_veg));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setCategories(FALLBACK_CATEGORIES);
        setKitchens(FALLBACK_KITCHENS);
        setRecommendedDishes(FALLBACK_MENU_ITEMS);
        setBestsellerDishes(FALLBACK_MENU_ITEMS.filter(i => i.is_bestseller));
        setHealthyDishes(FALLBACK_MENU_ITEMS.filter(i => i.protein_g >= 20));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(queryInput.trim())}`);
    }
  };

  return (
    <div className="space-y-14 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1322] to-[#090d16] border border-slate-800/80 px-6 sm:px-10 text-center shadow-2xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-5 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>Customer Food Portal • AI Recommendation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            What are you <span className="gradient-text-orange">craving</span> today?
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
            Discover macro-optimized delicacies, high-protein bowls, authentic dum biryanis, and street rolls prepared fresh across intelligent cloud kitchens.
          </p>

          {/* Clean Search Bar */}
          <form onSubmit={handleAISearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Search dishes, biryanis, or cloud kitchens..."
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-orange-500 text-white placeholder-slate-500 text-xs sm:text-sm rounded-2xl pl-11 pr-28 py-4 outline-none shadow-2xl transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Intent Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-500 text-[11px] font-bold">Popular Queries:</span>
            {[
              "High protein veg meals",
              "Healthy dinner under ₹300",
              "Hyderabadi Biryani",
              "Low calorie lunch"
            ].map((q) => (
              <button
                key={q}
                onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                className="px-3 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-orange-400 text-[11px] font-semibold transition-all"
              >
                {q}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Category Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-500" />
            <span>Explore Cuisines & Categories</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition-all border ${
              activeCategory === null
                ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            🔥 All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition-all border flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{cat.icon || '🍽️'}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Offers & Coupons Banner */}
      <section className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border border-orange-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
            <Tag className="w-3 h-3" /> Exclusive Kitchora Offers
          </div>
          <h3 className="text-xl font-extrabold text-white">Get 20% OFF on your first order!</h3>
          <p className="text-xs text-slate-400">Use code <span className="font-extrabold text-orange-400">KITCHORA20</span> at checkout + earn double reward points.</p>
        </div>

        <button
          onClick={openAIChat}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition-all shadow-lg shadow-orange-500/20 shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI For Deals</span>
        </button>
      </section>

      {/* Section 1: Recommended For You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Recommended For You</span>
            </h2>
            <p className="text-xs text-slate-400">AI-driven macro and diet scoring tailored to your preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedDishes.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Section 2: Popular Cloud Kitchens Near You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Popular Cloud Kitchens</span>
            </h2>
            <p className="text-xs text-slate-400">Verified hygienic kitchens with real-time tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kitchens.map((kitchen) => (
            <KitchenCard key={kitchen.id} kitchen={kitchen} />
          ))}
        </div>
      </section>

      {/* Section 3: Trending Bestsellers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Trending Today</span>
            </h2>
            <p className="text-xs text-slate-400">Top ordered dishes across Hyderabad cloud kitchens</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellerDishes.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Section 4: Healthy & High-Protein Choices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <span>Healthy & Protein Choices</span>
            </h2>
            <p className="text-xs text-slate-400">Macro calculated meals with &gt; 20g protein per portion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthyDishes.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
};
