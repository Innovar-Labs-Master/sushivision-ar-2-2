
import React from 'react';
import { Scan, ChevronRight, ChefHat, MapPin } from 'lucide-react';
import { CuisineConfig, RestaurantInfo } from '../types';

interface Props {
  cuisine: CuisineConfig;
  onStart: () => void;
  restaurantInfo?: RestaurantInfo | null;
}

const Landing: React.FC<Props> = ({ cuisine, onStart, restaurantInfo }) => {
  const bgImage = restaurantInfo?.coverImageUrl || 'https://picsum.photos/1920/1080?random=17';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#121212]">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-1000"
        style={{ backgroundImage: `url('${bgImage}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-700">
        <div className="relative mb-4 group">
          {/* Outer glow layer */}
          <div className="absolute inset-0 w-32 h-32 rounded-2xl blur-xl bg-red-600/30 animate-pulse"></div>
          
          {/* Main logo container with multiple shadow layers */}
          <div className="relative w-32 h-32 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-all duration-300"
               style={{
                 boxShadow: `
                   0 0 20px rgba(220, 38, 38, 0.4),
                   0 0 40px rgba(220, 38, 38, 0.3),
                   0 0 60px rgba(220, 38, 38, 0.2),
                   0 0 80px rgba(220, 38, 38, 0.1)
                 `
               }}>
            <img 
              src={restaurantInfo?.logoUrl || "/images/logo.png"} 
              alt="Saitama Sushi Logo" 
              className="w-full h-full object-cover scale-110" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-lg">
            {restaurantInfo?.name || cuisine.label}
          </h1>
          <div className="flex flex-col items-center justify-center gap-2 text-gray-300 text-sm font-medium">
             <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin size={14} className="text-sushi-gold" />
                <span>{restaurantInfo?.address || "Table 05 • Main Dining Room"}</span>
             </div>
          </div>
        </div>

        <p className="text-lg text-gray-200 max-w-md leading-relaxed drop-shadow-md">
          {restaurantInfo?.description || "Experience our interactive AR menu. Visualize your dishes before you order."}
        </p>

        <button 
          onClick={onStart}
          className="w-full max-w-xs group relative flex items-center justify-between bg-sushi-gold text-black px-6 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <span className="flex items-center gap-3">
            <Scan size={24} />
            Bekijk Menu
          </span>
          <div className="bg-black/10 p-1 rounded-full group-hover:bg-black/20 transition-colors">
            <ChevronRight className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        <div className="text-xs text-gray-500 pt-8 space-y-1">
          <p>{restaurantInfo?.phone}</p>
          <p>{restaurantInfo?.email}</p>
        </div>
      </div>

      <div className="relative z-10 p-6 text-center">
         <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">Powered by Gemini AI</p>
      </div>
    </div>
  );
};

export default Landing;