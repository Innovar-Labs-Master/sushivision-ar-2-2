
import React from 'react';
import { User, ShoppingBag, Star, Calendar, LogOut, ChevronRight, Gift, Utensils } from 'lucide-react';
import { PresetDish } from '../types';

interface Props {
  username: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  favorites?: PresetDish[];
}

const CustomerDashboard: React.FC<Props> = ({ username, onNavigate, onLogout, favorites = [] }) => {
  return (
    <div className="min-h-screen bg-[#121212] pb-24">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-6 sticky top-0 z-30">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <p className="text-gray-400 text-sm mb-1">Welkom terug,</p>
            <h1 className="text-2xl font-serif font-bold text-white capitalize">{username}</h1>
          </div>
          <div className="w-10 h-10 bg-gray-800 rounded-full border border-gray-700 flex items-center justify-center text-sushi-gold">
            <User size={20} />
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        
        {/* Loyalty Card */}
        <div className="bg-gradient-to-br from-sushi-gold to-yellow-600 rounded-xl p-6 shadow-lg text-black relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <Gift size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <span className="font-bold text-xs uppercase tracking-widest bg-black/10 px-2 py-1 rounded">SushiVision Member</span>
                    <Star className="text-black fill-black" size={24} />
                </div>
                <p className="text-sm font-medium opacity-80 mb-1">Jouw Punten</p>
                <h2 className="text-5xl font-bold mb-4">240</h2>
                <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-black h-full w-[60%]"></div>
                </div>
                <p className="text-xs font-bold mt-2">Nog 60 punten tot een gratis rol!</p>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => onNavigate('menu')}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-sushi-gold/50 transition-all group text-left"
            >
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-sushi-gold mb-3 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={20} />
                </div>
                <h3 className="font-bold text-white">Nieuwe Bestelling</h3>
                <p className="text-xs text-gray-400 mt-1">Bekijk het menu & bestel</p>
            </button>

            <button 
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-sushi-gold/50 transition-all group text-left"
            >
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                    <Calendar size={20} />
                </div>
                <h3 className="font-bold text-white">Reserveren</h3>
                <p className="text-xs text-gray-400 mt-1">Boek een tafel</p>
            </button>
        </div>

        {/* Recent Activity Mockup */}
        <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Bestelgeschiedenis</span>
                <span className="text-xs text-sushi-gold font-normal cursor-pointer hover:underline">Bekijk alles</span>
            </h2>
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                            <Utensils size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-medium">Sushi Dinner {i === 1 ? '(Gisteren)' : '(Vorige week)'}</h4>
                            <p className="text-xs text-gray-500">3 items • €{(32.50 * i).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                             <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">Voltooid</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Account Settings */}
        <div className="pt-4 border-t border-gray-800">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 transition-colors text-red-400"
            >
                <div className="flex items-center gap-3">
                    <LogOut size={20} />
                    <span className="font-medium">Uitloggen</span>
                </div>
                <ChevronRight size={16} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
