import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, ShieldCheck, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';

const FALLBACK_KITCHENS_MAP: Record<number, any> = {
  1: {
    id: 1,
    name: 'Saffron & Spice Cloud Kitchen',
    description: 'Specializing in authentic Awadhi & Dum Pukht Biryanis cooked in traditional clay pots.',
    address: 'Hitech City, Hyderabad',
    cuisine_tags: ['Hyderabadi Biryani', 'Mughlai', 'North Indian'],
    banner_image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80',
    rating: 4.9,
    total_ratings: 1240,
    avg_prep_time_mins: 22,
    menu_items: [
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
        id: 105,
        name: 'Paneer Dum Biryani Clay Pot',
        description: 'Rich paneer cubes cooked in saffron basmati rice with caramelised onions and mint leaves.',
        price: 280,
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
        is_veg: true,
        is_bestseller: true,
        protein_g: 24,
        calories: 540,
        prep_time_mins: 20,
        kitchen_id: 1
      },
      {
        id: 106,
        name: 'Hyderabadi Double Ka Meetha',
        description: 'Traditional fried bread dessert soaked in saffron infused rabri and topped with slivered almonds.',
        price: 140,
        image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80',
        is_veg: true,
        is_bestseller: false,
        protein_g: 8,
        calories: 320,
        prep_time_mins: 10,
        kitchen_id: 1
      }
    ]
  },
  2: {
    id: 2,
    name: 'Green Bowl Co. (Fitness Hub)',
    description: 'Macro-calculated high protein, keto, and clean eating salad bowls designed by nutritionists.',
    address: 'Gachibowli, Hyderabad',
    cuisine_tags: ['Fitness', 'Keto', 'Salad Bowls'],
    banner_image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80',
    rating: 4.8,
    total_ratings: 890,
    avg_prep_time_mins: 15,
    menu_items: [
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
        id: 107,
        name: 'Tofu & Avocado Power Protein Salad',
        description: 'Pan-seared organic tofu, avocado slices, edamame, mixed greens, and sesame garlic dressing.',
        price: 310,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
        is_veg: true,
        is_bestseller: true,
        protein_g: 32,
        calories: 410,
        prep_time_mins: 12,
        kitchen_id: 2
      }
    ]
  },
  3: {
    id: 3,
    name: 'Curry Express Kitchen',
    description: 'Rich buttery paneer handis, slow cooked dal makhani, and hot garlic butter naan.',
    address: 'Jubilee Hills, Hyderabad',
    cuisine_tags: ['North Indian', 'Curries', 'Tandoori'],
    banner_image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&q=80',
    rating: 4.7,
    total_ratings: 650,
    avg_prep_time_mins: 25,
    menu_items: [
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
    ]
  }
};

export const KitchenDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [kitchen, setKitchen] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      const kitchenNum = Number(id);

      try {
        const res = await api.getKitchenDetail(kitchenNum);
        if (res && res.name) {
          setKitchen(res);
        } else {
          setKitchen(FALLBACK_KITCHENS_MAP[kitchenNum] || FALLBACK_KITCHENS_MAP[1]);
        }
      } catch (err) {
        console.error('Failed to load kitchen detail:', err);
        setKitchen(FALLBACK_KITCHENS_MAP[kitchenNum] || FALLBACK_KITCHENS_MAP[1]);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-xs font-semibold">Loading cloud kitchen menu...</p>
      </div>
    );
  }

  if (!kitchen) {
    return (
      <div className="text-center py-20 text-slate-400 space-y-4">
        <p className="text-base font-bold">Kitchen details unavailable.</p>
        <Link to="/explore" className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <div className="pt-2">
        <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kitchens</span>
        </Link>
      </div>

      {/* Banner */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <img
          src={kitchen.banner_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'}
          alt={kitchen.name}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                Verified Cloud Kitchen
              </span>
              {kitchen.cuisine_tags?.map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 text-[10px] font-semibold">
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{kitchen.name}</h1>
            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">{kitchen.description}</p>

            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1 text-amber-400 font-extrabold">
                <Star className="w-4 h-4 fill-amber-400" />
                {kitchen.rating} ({kitchen.total_ratings} reviews)
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-4 h-4 text-orange-400" />
                {kitchen.avg_prep_time_mins} mins average prep
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Header & Food Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <span>Kitchen Menu ({kitchen.menu_items?.length || 0} Dishes)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kitchen.menu_items?.map((item: any) => (
            <FoodCard key={item.id} item={{ ...item, kitchen_id: kitchen.id }} />
          ))}
        </div>
      </div>
    </div>
  );
};
