import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, MapPin, Search, ChevronRight, ChevronDown, Smartphone, 
  Download, ArrowRight, Utensils, ShieldCheck, Flame, Dumbbell, Award, Check, User, LogIn,
  Play, Pause, Volume2, VolumeX, Film, Star, Navigation, ArrowUp, Zap, Clock, TrendingUp, X, ChefHat, Lock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Expanded Preset Food Videos for Hero Background and Food Reels
const FOOD_VIDEOS = [
  {
    id: 'woodfire-pizza',
    title: 'Artisan Woodfire Pizza Pull',
    category: 'Italian Gourmet',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-pizza-being-prepared-42795-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80',
    dish: 'Truffle Mushroom Pizza',
    price: '₹390',
    rating: '4.9',
    time: '25 mins',
    badge: 'Woodfired Italian',
    icon: '🍕'
  },
  {
    id: 'chole-bhature',
    title: 'Sizzling Hot Bhature & Punjabi Chole',
    category: 'North Indian Street Food',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-pan-with-fire-42797-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1600&q=80',
    dish: 'Delhi Style Chole Bhature Handi',
    price: '₹180',
    rating: '4.9',
    time: '15 mins',
    badge: 'Popular Street Food',
    icon: '🥟'
  },
  {
    id: 'masala-dosa',
    title: 'Crispy Golden Masala Dosa & Chutney',
    category: 'South Indian Special',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-pizza-being-prepared-42795-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1600&q=80',
    dish: 'Mysore Butter Masala Dosa',
    price: '₹140',
    rating: '4.9',
    time: '12 mins',
    badge: 'Crispy & Golden',
    icon: '🥞'
  },
  {
    id: 'pav-bhaji',
    title: 'Sizzling Buttered Pav Bhaji',
    category: 'Mumbai Street Delicacies',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-food-being-cooked-in-a-wok-pan-43093-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1600&q=80',
    dish: 'Special Amul Butter Pav Bhaji',
    price: '₹160',
    rating: '4.8',
    time: '15 mins',
    badge: 'Mumbai Classic',
    icon: '🍞'
  },
  {
    id: 'idli-sambar',
    title: 'Steaming Soft Idli & Sambar Dip',
    category: 'South Indian Breakfast',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-pan-with-fire-42797-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1600&q=80',
    dish: 'Ghee Button Idli Sambar Plate',
    price: '₹120',
    rating: '4.8',
    time: '10 mins',
    badge: 'Healthy & Light',
    icon: '🍚'
  },
  {
    id: 'street-chowmein',
    title: 'Wok-Tossed Street Chowmein Noodles',
    category: 'Indo-Chinese Street Food',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-food-being-cooked-in-a-wok-pan-43093-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1600&q=80',
    dish: 'Schezwan Street Chowmein',
    price: '₹170',
    rating: '4.7',
    time: '15 mins',
    badge: 'Flame Wok Tossed',
    icon: '🍜'
  },
  {
    id: 'chocolate-cake',
    title: 'Decadent Chocolate Truffle Cake',
    category: 'Desserts & Bakery',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-serving-a-delicious-hamburger-with-french-fries-42800-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&q=80',
    dish: 'Belgian Chocolate Truffle Cake',
    price: '₹240',
    rating: '5.0',
    time: '20 mins',
    badge: 'Sweet Temptation',
    icon: '🍰'
  },
  {
    id: 'bengali-rasgulla',
    title: 'Syrupy Soft Bengali Rasgulla',
    category: 'Traditional Indian Sweets',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-pizza-being-prepared-42795-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=80',
    dish: 'Kesari Rasgulla Handi (4 Pcs)',
    price: '₹130',
    rating: '4.9',
    time: '10 mins',
    badge: 'Bengali Special',
    icon: '🍬'
  },
  {
    id: 'burger-fries',
    title: 'Juicy Cheeseburger & Fries',
    category: 'Fast Food Favorites',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-serving-a-delicious-hamburger-with-french-fries-42800-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
    dish: 'Double Smash Cheeseburger',
    price: '₹310',
    rating: '4.7',
    time: '18 mins',
    badge: 'Cheesy Delight',
    icon: '🍔'
  },
  {
    id: 'dum-biryani',
    title: 'Royal Awadhi Chicken Dum Biryani',
    category: 'Hyderabadi Biryani',
    sources: [
      'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-pan-with-fire-42797-large.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ],
    poster: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&q=80',
    dish: 'Special Chicken Dum Biryani Handi',
    price: '₹320',
    rating: '4.9',
    time: '25 mins',
    badge: 'Bestseller Handi',
    icon: '🍲'
  }
];

const SEARCH_SUGGESTIONS = [
  { text: 'Truffle Woodfire Pizza', type: 'dish', icon: '🍕' },
  { text: 'Chole Bhature Handi', type: 'dish', icon: '🥟' },
  { text: 'Crispy Masala Dosa', type: 'dish', icon: '🥞' },
  { text: 'Mumbai Butter Pav Bhaji', type: 'dish', icon: '🍞' },
  { text: 'Steaming Idli Sambar', type: 'dish', icon: '🍚' },
  { text: 'Street Hakka Chowmein', type: 'dish', icon: '🍜' },
  { text: 'Belgian Chocolate Cake', type: 'dish', icon: '🍰' },
  { text: 'Syrupy Bengali Rasgulla', type: 'dish', icon: '🍬' },
  { text: 'Double Smash Cheeseburger', type: 'dish', icon: '🍔' },
  { text: 'Chicken Dum Biryani Handi', type: 'dish', icon: '🍲' }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Location & Search state
  const [location, setLocation] = useState('Hitech City, Hyderabad');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // App download link state
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [appLinkSent, setAppLinkSent] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Hero Video Control States
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Scroll header state
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Food Reel Video Modal state
  const [activeReelVideo, setActiveReelVideo] = useState<typeof FOOD_VIDEOS[0] | null>(null);

  // Auto cycle video every 8 seconds if playing
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        setCurrentVideoIdx((prev) => (prev + 1) % FOOD_VIDEOS.length);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle Scroll to toggle navbar glass and scroll-top button
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to determine portal URL based on user role
  const getUserPortalPath = () => {
    if (!user) return '/login';
    if (user.role === 'KITCHEN_OWNER') return '/kitchen';
    if (user.role === 'ADMIN') return '/admin';
    return '/explore';
  };

  const getPortalLabel = () => {
    if (!user) return 'Login to Access Portal';
    if (user.role === 'KITCHEN_OWNER') return 'Enter Kitchen Owner Portal 🍳';
    if (user.role === 'ADMIN') return 'Enter Admin Control Portal 🛡️';
    return 'Enter Customer Food Portal 🍲';
  };

  // Auth Guard for Landing Page Feature Actions
  const handleFeatureClick = (customPath?: string) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(customPath || getUserPortalPath());
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      const query = searchInput.trim();
      const targetPath = user.role === 'CUSTOMER' || user.role === 'ADMIN'
        ? (query ? `/search?q=${encodeURIComponent(query)}` : '/explore')
        : getUserPortalPath();
      navigate(targetPath);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cycleVideo = () => {
    const nextIdx = (currentVideoIdx + 1) % FOOD_VIDEOS.length;
    setCurrentVideoIdx(nextIdx);
  };

  const scrollToExplore = () => {
    const exploreElement = document.getElementById('explore-section');
    if (exploreElement) {
      exploreElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredSuggestions = searchInput.trim()
    ? SEARCH_SUGGESTIONS.filter(item => item.text.toLowerCase().includes(searchInput.toLowerCase()))
    : SEARCH_SUGGESTIONS;

  return (
    <div className="space-y-16 pb-24 -mt-6 selection:bg-orange-500 selection:text-white">
      
      {/* 0. Scroll-Activated Sticky Glass Header */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
          scrolled ? 'translate-y-0 opacity-100 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3 px-6' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🍳</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              Kitch<span className="text-orange-500">ora</span>
            </span>
          </Link>

          {/* Compact Sticky Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 focus-within:border-orange-500 rounded-full px-4 py-1.5 w-96 shadow-inner">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search dishes, kitchens, or cuisines..."
              className="bg-transparent text-white placeholder-slate-500 text-xs outline-none w-full"
            />
          </form>

          {/* Auth / Action CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(getUserPortalPath())}
                  className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>{getPortalLabel()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-rose-400 text-xs font-bold transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-orange-400 transition-colors">
                  Log in
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 1. HERO SECTION WITH ANIMATED FOOD BACKGROUND VIDEO */}
      <section className="relative min-h-[660px] rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-10 border border-slate-800 shadow-2xl bg-slate-950 group">
        
        {/* HTML5 Dynamic Food Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            key={FOOD_VIDEOS[currentVideoIdx].id}
            poster={FOOD_VIDEOS[currentVideoIdx].poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover scale-105 filter brightness-90 transition-opacity duration-700"
          >
            {FOOD_VIDEOS[currentVideoIdx].sources.map((src, idx) => (
              <source key={idx} src={src} type="video/mp4" />
            ))}
          </video>
          
          {/* Multi-layer Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070a12]/90 via-[#070a12]/75 to-[#070a12]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070a12]/50 to-[#070a12]" />
        </div>

        {/* Top Navigation Bar inside Hero */}
        <div className="relative z-30 flex items-center justify-between gap-4 text-xs font-bold text-slate-200">
          
          {/* Left App Link Badge & Video Scene Tag */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => handleFeatureClick()}
              className="flex items-center gap-2 text-slate-300 hover:text-orange-400 cursor-pointer transition-colors bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800"
            >
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span>Get the App</span>
            </div>

            {/* Video Controls Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/70 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full text-[11px] text-slate-300">
              <Film className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="font-extrabold text-amber-300 truncate max-w-[160px]">
                {FOOD_VIDEOS[currentVideoIdx].icon} {FOOD_VIDEOS[currentVideoIdx].title}
              </span>
              
              <button 
                onClick={togglePlayPause} 
                className="hover:text-white transition-colors p-1"
                title={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-orange-400" />}
              </button>

              <button 
                onClick={toggleMute} 
                className="hover:text-white transition-colors p-1"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button 
                onClick={cycleVideo}
                className="px-2.5 py-0.5 rounded-full bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white font-extrabold text-[10px] transition-all ml-1 flex items-center gap-1"
              >
                <span>Next Dish Scene</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Role Portal Indicator */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-[11px]">
                  Logged in as {user.full_name} ({user.role})
                </span>
                <button
                  onClick={() => navigate(getUserPortalPath())}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>My Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-all">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all">
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6 my-auto py-10">
          
          {/* Animated Platform Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 border border-orange-500/30 text-orange-400 font-black text-xs tracking-wide shadow-xl backdrop-blur-md animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>NEXT-GEN SMART FOOD PLATFORM</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
            Kitch<span className="gradient-text-orange">ora</span>
          </h1>

          <p className="text-base sm:text-2xl font-extrabold text-slate-200 max-w-2xl mx-auto drop-shadow-md">
            Discover authentic <span className="text-orange-400">Chole Bhature</span>, <span className="text-amber-400">Crisp Dosa</span>, <span className="text-rose-400">Pav Bhaji</span>, <span className="text-emerald-400">Idli</span>, <span className="text-yellow-400">Chowmein</span>, <span className="text-cyan-400">Woodfire Pizza</span> & <span className="text-pink-400">Decadent Cake</span> across top cloud kitchens.
          </p>

          {/* Interactive Hero Dish Video Reel Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-3xl mx-auto">
            {FOOD_VIDEOS.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => {
                  setCurrentVideoIdx(idx);
                  setIsPlaying(true);
                }}
                className={`px-3 py-1.5 rounded-2xl font-extrabold text-xs transition-all border flex items-center gap-1.5 backdrop-blur-md ${
                  currentVideoIdx === idx
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30 scale-105'
                    : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-orange-500/40 hover:text-white'
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.dish.split(' ')[0]} {v.dish.split(' ')[1] || ''}</span>
              </button>
            ))}
          </div>

          {/* Location & Clean Search Bar */}
          <div className="relative max-w-3xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit} className="bg-slate-900/90 border border-slate-700/80 focus-within:border-orange-500 rounded-2xl sm:rounded-full p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl backdrop-blur-xl">
              
              {/* Location Select */}
              <div className="relative w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-xl sm:rounded-full bg-slate-950/80 hover:bg-slate-800 text-white text-xs font-bold transition-all border border-slate-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="truncate max-w-[140px]">{location}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-left backdrop-blur-xl space-y-1">
                    {[
                      'Hitech City, Hyderabad',
                      'Gachibowli, Hyderabad',
                      'Jubilee Hills, Hyderabad',
                      'Banjara Hills, Hyderabad',
                      'Kondapur, Hyderabad'
                    ].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className="w-full p-2 rounded-xl text-xs text-slate-300 hover:text-orange-400 hover:bg-slate-800 text-left font-semibold transition-colors flex items-center gap-2"
                      >
                        <Navigation className="w-3.5 h-3.5 text-slate-400" />
                        <span>{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-slate-700/80" />

              {/* Main Search Input */}
              <div className="relative w-full flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search dishes, kitchens, or cuisines..."
                  className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm outline-none"
                />
                {searchInput && (
                  <button type="button" onClick={() => setSearchInput('')} className="text-slate-500 hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Action Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-orange-500/30 shrink-0 flex items-center justify-center gap-2 group/btn"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-left backdrop-blur-xl space-y-1"
                onMouseLeave={() => setShowSearchSuggestions(false)}
              >
                <div className="flex items-center justify-between px-3 py-1 border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-orange-500" /> Popular Searches
                  </span>
                  <button 
                    onClick={() => setShowSearchSuggestions(false)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Close
                  </button>
                </div>
                {filteredSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchInput(item.text);
                      setShowSearchSuggestions(false);
                      handleFeatureClick(user ? `/search?q=${encodeURIComponent(item.text)}` : '/login');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{item.text}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase font-bold">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Portal Entry Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!user ? (
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Link
                  to="/login"
                  className="px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 transform hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Access Portal</span>
                </Link>

                <Link
                  to="/register"
                  className="px-7 py-3 rounded-full bg-slate-900 border border-slate-700 hover:border-orange-500 text-slate-200 font-black text-xs transition-all flex items-center gap-2 transform hover:scale-105"
                >
                  <User className="w-4 h-4 text-orange-400" />
                  <span>Create Free Account</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => navigate(getUserPortalPath())}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm transition-all shadow-xl shadow-orange-500/30 flex items-center gap-2.5 transform hover:scale-105"
              >
                <Utensils className="w-4 h-4" />
                <span>{getPortalLabel()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* ANIMATED SCROLL DOWN CUE */}
        <div className="relative z-20 flex flex-col items-center justify-center pt-4 pb-2">
          <button
            onClick={scrollToExplore}
            className="group flex flex-col items-center gap-1.5 text-slate-300 hover:text-orange-400 transition-colors focus:outline-none cursor-pointer"
          >
            <span className="text-[11px] font-black tracking-widest uppercase text-slate-300 group-hover:text-orange-400 transition-colors">
              Scroll Down to Explore
            </span>
            <div className="w-9 h-9 rounded-full bg-slate-900/80 border border-orange-500/40 flex items-center justify-center shadow-lg group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all animate-bounce">
              <ChevronDown className="w-5 h-5 text-orange-400 group-hover:text-white" />
            </div>
          </button>
        </div>

      </section>

      {/* 2. ANIMATED CONTINUOUS FOOD REEL MARQUEE */}
      <section className="overflow-hidden py-4 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-2 px-6 mb-3">
          <Film className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Trending Food Video Reels
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-6">
            {[...FOOD_VIDEOS, ...FOOD_VIDEOS].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveReelVideo(item)}
                className="shrink-0 w-72 h-40 rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-800 hover:border-orange-500/80 transition-all shadow-xl"
              >
                <img
                  src={item.poster}
                  alt={item.dish}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-orange-500 text-white font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1">
                  <span>{item.icon}</span>
                  <span>{item.badge}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h4 className="font-extrabold text-white text-xs group-hover:text-orange-400 transition-colors">
                      {item.dish}
                    </h4>
                    <p className="text-[10px] text-slate-300 font-semibold">{item.category}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-orange-500/90 text-white font-black text-xs shadow-md">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURE CARDS SECTION (Portal Route Trigger Cards) */}
      <section id="explore-section" className="space-y-6 pt-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What are you looking for?</h2>
            <p className="text-xs text-slate-400 mt-1">Select a portal below to explore features</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Order Online / Customer Portal */}
          <div 
            onClick={() => handleFeatureClick('/explore')}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500/60 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80" 
                alt="Order Online"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-500 text-white font-black text-[10px] uppercase shadow-lg">
                Customer Food Portal
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                <span>Order Food Online</span>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse verified cloud kitchens, add meals to cart, track orders live, and earn rewards.
              </p>
              <div className="pt-2 text-xs font-bold text-orange-400 flex items-center gap-1">
                {!user ? 'Sign in to access Customer Portal →' : 'Enter Customer Portal →'}
              </div>
            </div>
          </div>

          {/* Card 2: AI Diet & Macro Search */}
          <div 
            onClick={() => handleFeatureClick('/search')}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/60 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80" 
                alt="AI Intent Discovery"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Macro Search
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Macro & Diet Search</span>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter high-protein, low-calorie, or keto meals calculated down to exact grams of protein.
              </p>
              <div className="pt-2 text-xs font-bold text-amber-400 flex items-center gap-1">
                {!user ? 'Sign in to search macros →' : 'Search Macros Now →'}
              </div>
            </div>
          </div>

          {/* Card 3: Kitchen Owner Portal */}
          <div 
            onClick={() => handleFeatureClick('/kitchen')}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" 
                alt="Cloud Kitchen Operations"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-black font-black text-[10px] uppercase shadow-lg">
                Kitchen Owner Portal
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Cloud Kitchen Portal</span>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kitchen owners manage live Kanban order stages, live dish availability, and AI raw ingredient forecasting.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                {!user ? 'Sign in as Kitchen Owner →' : 'Enter Kitchen Dashboard →'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SIZZLING DISHES VIDEO REELS GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-orange-500 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Sizzling Food Shorts & Video Reels</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Watch live animated video previews of Pizza, Chole Bhature, Dosa, Pav Bhaji, Idli, Chowmein & Cake</p>
          </div>

          <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full w-fit">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Tap video card to play reel modal
          </span>
        </div>

        {/* Video Reel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOOD_VIDEOS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveReelVideo(item)}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500/60 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Video Preview Loop Thumbnail */}
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <video
                  poster={item.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                >
                  {item.sources.map((src, i) => (
                    <source key={i} src={src} type="video/mp4" />
                  ))}
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1">
                    <span>{item.icon}</span>
                    <span>{item.badge}</span>
                  </span>
                </div>

                {/* Play Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-white text-sm group-hover:text-orange-400 transition-colors">
                    {item.dish}
                  </h3>
                  <span className="text-xs font-black text-orange-400 shrink-0">{item.price}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" /> {item.time}
                  </span>
                  <span className="text-slate-500 font-semibold">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FULL-SCREEN VIDEO REEL PLAYER MODAL */}
      {activeReelVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
            
            <div className="relative h-96 bg-black">
              <video
                poster={activeReelVideo.poster}
                autoPlay
                controls
                className="w-full h-full object-cover"
              >
                {activeReelVideo.sources.map((src, i) => (
                  <source key={i} src={src} type="video/mp4" />
                ))}
              </video>

              <button
                onClick={() => setActiveReelVideo(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 border border-slate-800 text-white flex items-center justify-center hover:bg-rose-500 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-extrabold text-[10px] uppercase border border-orange-500/30">
                    {activeReelVideo.icon} {activeReelVideo.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-white pt-1">{activeReelVideo.dish}</h3>
                  <p className="text-xs text-slate-400">{activeReelVideo.title}</p>
                </div>
                <span className="text-2xl font-black text-orange-400">{activeReelVideo.price}</span>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {activeReelVideo.rating} Rating
                </span>
                <span className="flex items-center gap-1 text-slate-300 font-semibold">
                  <Clock className="w-4 h-4 text-orange-400" /> {activeReelVideo.time} Prep
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveReelVideo(null);
                  handleFeatureClick('/explore');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>{user ? 'Order This Dish Now' : 'Log In to Order This Dish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
