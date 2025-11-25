
import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Globe, ArrowLeft } from 'lucide-react';
import { RestaurantInfo } from '../types';

interface Props {
  restaurantInfo: RestaurantInfo | null;
  onBack: () => void;
}

const Contact: React.FC<Props> = ({ restaurantInfo, onBack }) => {
  return (
    <div className="min-h-screen bg-[#121212] pb-24 animate-in fade-in">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-6 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <h1 className="text-2xl font-serif font-bold text-white">Contact & Info</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        
        {/* Info Cards */}
        <div className="grid gap-4">
            {/* Address */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 flex items-start gap-4 hover:border-sushi-gold/50 transition-colors">
                <div className="bg-gray-900 p-3 rounded-lg text-sushi-gold">
                    <MapPin size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold mb-1">Locatie</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {restaurantInfo?.address || "Mechelsesteenweg 20, 3140 Keerbergen"}
                    </p>
                    <button className="mt-3 text-xs font-bold text-sushi-gold uppercase tracking-wider flex items-center gap-1 hover:underline">
                        Open in Maps <ArrowLeft className="rotate-180" size={12} />
                    </button>
                </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 flex items-start gap-4 hover:border-sushi-gold/50 transition-colors">
                <div className="bg-gray-900 p-3 rounded-lg text-blue-400">
                    <Phone size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">Bereikbaarheid</h3>
                    <div className="space-y-2 mt-2">
                        <a href={`tel:${restaurantInfo?.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                            <Phone size={14} />
                            {restaurantInfo?.phone || "+32 15 61 05 05"}
                        </a>
                        <a href={`mailto:${restaurantInfo?.email}`} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                            <Mail size={14} />
                            {restaurantInfo?.email || "info@saitamasushi.be"}
                        </a>
                    </div>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-sushi-gold/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-900 p-3 rounded-lg text-green-400">
                        <Clock size={24} />
                    </div>
                    <h3 className="text-white font-bold">Openingstijden</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400 border-b border-gray-700/50 pb-2">
                        <span>Maandag - Woensdag</span>
                        <span className="text-white">17:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between text-gray-400 border-b border-gray-700/50 pb-2">
                        <span>Donderdag - Zaterdag</span>
                        <span className="text-white">17:00 - 23:00</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Zondag</span>
                        <span className="text-white">16:00 - 22:00</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Socials */}
        <div className="flex justify-center gap-4 pt-4">
            <button className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-pink-500 hover:bg-gray-700 transition-all">
                <Instagram size={24} />
            </button>
            <button className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-700 transition-all">
                <Facebook size={24} />
            </button>
            <button className="p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
                <Globe size={24} />
            </button>
        </div>

        <div className="text-center pt-8">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} {restaurantInfo?.name || "SushiVision AR"}. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default Contact;
