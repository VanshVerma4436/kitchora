import React from 'react';
import { Plus, Flame, Sparkles, Clock, Dumbbell } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface FoodCardProps {
  item: {
    id: number;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_veg: boolean;
    is_bestseller?: boolean;
    protein_g?: number;
    calories?: number;
    spice_level?: number;
    prep_time_mins?: number;
    kitchen_id: number;
  };
  onCustomise?: (item: any) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onCustomise }) => {
  const { addItem } = useCartStore();

  const handleAdd = () => {
    if (onCustomise) {
      onCustomise(item);
    } else {
      addItem({
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        is_veg: item.is_veg,
        quantity: 1,
        kitchen_id: item.kitchen_id,
        customizations: []
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {/* Veg/Non-Veg */}
          <span className={`w-5 h-5 rounded-md flex items-center justify-center border shadow-md bg-black/60 backdrop-blur-md ${item.is_veg ? 'border-emerald-500' : 'border-rose-500'}`}>
            <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </span>

          {/* Bestseller Badge */}
          {item.is_bestseller && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500 text-black shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-black" /> BESTSELLER
            </span>
          )}
        </div>

        {/* Protein Badge */}
        {item.protein_g && item.protein_g >= 15 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1 backdrop-blur-md">
            <Dumbbell className="w-3 h-3" />
            <span>{item.protein_g}g Protein</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-white text-sm group-hover:text-orange-400 transition-colors line-clamp-1">
              {item.name}
            </h4>
          </div>

          <p className="text-slate-400 text-xs line-clamp-2 mt-1 font-normal leading-relaxed">
            {item.description || 'Prepared fresh with high quality cloud kitchen standards.'}
          </p>
        </div>

        {/* Meta details */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold border-t border-slate-800/80 pt-2.5">
          {item.prep_time_mins && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              {item.prep_time_mins} mins
            </span>
          )}
          {item.calories && (
            <span className="flex items-center gap-1 text-slate-400">
              <Flame className="w-3 h-3 text-amber-400" />
              {item.calories} kcal
            </span>
          )}
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold block">Price</span>
            <span className="text-base font-extrabold text-white">₹{item.price}</span>
          </div>

          <button
            onClick={handleAdd}
            className="px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white font-extrabold text-xs border border-orange-500/30 transition-all shadow-md flex items-center gap-1.5 group-hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
