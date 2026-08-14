import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';

interface KitchenCardProps {
  kitchen: {
    id: number;
    name: string;
    description?: string;
    address: string;
    cuisine_tags: string[];
    banner_image?: string;
    rating: number;
    total_ratings: number;
    avg_prep_time_mins: number;
  };
}

export const KitchenCard: React.FC<KitchenCardProps> = ({ kitchen }) => {
  return (
    <Link
      to={`/restaurant/${kitchen.id}`}
      className="glass-card rounded-2xl overflow-hidden block group transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={kitchen.banner_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'}
          alt={kitchen.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-400 font-extrabold text-xs flex items-center gap-1 backdrop-blur-md shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{kitchen.rating}</span>
          <span className="text-[10px] text-slate-400">({kitchen.total_ratings})</span>
        </div>

        {/* Prep Time Badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-[11px] font-bold flex items-center gap-1 backdrop-blur-md">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span>{kitchen.avg_prep_time_mins} mins prep</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-base group-hover:text-orange-400 transition-colors truncate">
            {kitchen.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        <p className="text-slate-400 text-xs line-clamp-1">
          {kitchen.description || 'Cloud Kitchen Specializing in fresh gourmet meals.'}
        </p>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {kitchen.cuisine_tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{kitchen.address}</span>
        </div>
      </div>
    </Link>
  );
};
