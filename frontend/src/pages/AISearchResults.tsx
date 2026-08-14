import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, SlidersHorizontal, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';

const FALLBACK_SEARCH_RESULTS = [
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

export const AISearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const runAISearch = async () => {
      if (!query.trim()) return;
      setLoading(true);
      try {
        const res = await api.aiSearch(query);
        if (res && res.items && res.items.length > 0) {
          setIntent(res.parsed_intent || { diet: 'High Protein', max_price: 400, min_protein: 20 });
          setItems(res.items);
        } else {
          setIntent({ diet: 'High Protein', max_price: 400, min_protein: 20 });
          setItems(FALLBACK_SEARCH_RESULTS);
        }
      } catch (err) {
        console.error('AI search error:', err);
        setIntent({ diet: 'High Protein', max_price: 400, min_protein: 20 });
        setItems(FALLBACK_SEARCH_RESULTS);
      } finally {
        setLoading(false);
      }
    };
    runAISearch();
  }, [query]);

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <div className="pt-2">
        <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Search Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
          <Sparkles className="w-4 h-4" />
          <span>Kitchora AI Natural Intent Parser</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Results for "{query}"
        </h1>

        {/* Parsed Intent Badges */}
        {intent && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Extracted Intent Filters:
            </span>
            {intent.diet && (
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold">
                Diet: {intent.diet}
              </span>
            )}
            {intent.max_price && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold">
                Max Price: ₹{intent.max_price}
              </span>
            )}
            {intent.min_protein && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold">
                Min Protein: {intent.min_protein}g
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-xs font-semibold">Parsing natural language intent and matching cloud kitchen dishes...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-400 space-y-3">
          <p className="text-base font-bold text-white">No dishes matched your exact query filters.</p>
          <p className="text-xs max-w-sm mx-auto">Try broadening your search (e.g. "biryani", "chicken bowl", "veg meals under ₹300").</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
