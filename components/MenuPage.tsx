import React, { useState, useMemo } from 'react';
import { PresetDish } from '../types';
import { Star, PlusCircle, Box, ChefHat, ArrowRight, Search, Check } from 'lucide-react';

interface Props {
  presets?: PresetDish[];
  onSelectPreset: (preset: PresetDish) => void;
  onOpenBuilder: () => void;
  onAddToCart?: (preset: PresetDish) => void;
  selectedItems?: Set<string>;
  onToggleSelection?: (presetId: string) => void;
  onProceedToOrder?: () => void;
}

const CATEGORIES = [
  'All',
  'Take-away drank',
  'Salades',
  'Sashimi',
  'Nigiri',
  'Hoso Maki',
  'Inside Out Roll',
  'Sushi a la carte',
  'Wok',
  'Pad Thai',
  'Curry'
];

const MenuPage: React.FC<Props> = ({ 
  presets = [], 
  onSelectPreset, 
  onOpenBuilder, 
  onAddToCart,
  selectedItems = new Set(),
  onToggleSelection,
  onProceedToOrder
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPresets = useMemo(() => {
    return presets.filter(preset => {
      const matchesCategory = activeCategory === 'All' || preset.category === activeCategory;
      const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            preset.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [presets, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pb-24 lg:pb-0">
      {/* Sidebar / Top Nav */}
      <div className="lg:w-64 flex-shrink-0 bg-[#121212]/50 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-gray-800 sticky top-[60px] z-20 overflow-x-auto lg:overflow-y-auto lg:h-[calc(100vh-60px)] no-scrollbar">
        <div className="p-4 space-y-4 min-w-max lg:min-w-0">
            {/* Search - Mobile Only (or compact) */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search menu..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-sushi-gold/50 transition-colors"
                />
            </div>

            <div className="flex lg:flex-col gap-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap text-left flex items-center justify-between group ${
                            activeCategory === cat 
                            ? 'bg-sushi-gold text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {cat}
                        {activeCategory === cat && <Star size={12} className="fill-black hidden lg:block" />}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">
                        {activeCategory === 'All' ? 'Full Menu' : activeCategory}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {filteredPresets.length} items found
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* Builder Card - Always visible if All or Sushi */}
                {(activeCategory === 'All' || activeCategory === 'Sushi a la carte') && (
                    <button
                        onClick={onOpenBuilder}
                        className="col-span-1 md:col-span-2 xl:col-span-1 min-h-[200px] flex flex-col relative group overflow-hidden rounded-2xl border border-sushi-gold/30 bg-gradient-to-br from-gray-900 to-black shadow-2xl hover:shadow-sushi-gold/20 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-[url('https://picsum.photos/800/600?random=18')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity scale-105 group-hover:scale-110 duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        
                        <div className="relative z-10 p-6 flex flex-col h-full justify-end items-start text-left">
                            <div className="w-12 h-12 bg-sushi-gold rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform">
                                <ChefHat size={24} className="text-black" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 font-serif">
                                Stel Zelf Samen
                            </h3>
                            <p className="text-gray-300 text-sm mb-4 max-w-[200px]">
                                Create your own custom sushi roll with our AI chef.
                            </p>
                            <div className="flex items-center gap-2 text-sushi-gold font-bold text-sm tracking-wide uppercase group-hover:gap-3 transition-all">
                                Start Builder <ArrowRight size={16} />
                            </div>
                        </div>
                    </button>
                )}

                {/* Menu Items */}
                {filteredPresets.map((preset) => {
                    const isSelected = selectedItems?.has(preset.id) || false;
                    
                    return (
                        <div
                            key={preset.id}
                            className="card-glass group flex flex-row gap-3 text-left h-full min-h-[140px] relative"
                        >
                            {/* Checkbox Selection - Left Side */}
                            <div className="flex items-center justify-center pl-3 py-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSelection?.(preset.id);
                                    }}
                                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                        isSelected 
                                            ? 'bg-sushi-gold border-sushi-gold shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                                            : 'border-gray-600 hover:border-sushi-gold/50'
                                    }`}
                                    aria-label={isSelected ? "Deselect item" : "Select item"}
                                >
                                    {isSelected && <Check size={16} className="text-black font-bold" />}
                                </button>
                            </div>

                            {/* Image Area */}
                            <div className="relative w-32 h-full flex-shrink-0 overflow-hidden rounded-lg">
                                {preset.image ? (
                                    <img
                                        src={preset.image}
                                        alt={preset.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <ChefHat className="text-gray-600" size={32} />
                                    </div>
                                )}
                                
                                {/* 3D Badge */}
                                {preset.modelUrl && (
                                    <div className="absolute top-2 left-2 bg-blue-500/20 backdrop-blur-md text-blue-200 px-2 py-1 rounded-md border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
                                        <Box size={10} /> 3D
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 py-3 pr-3 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sushi-gold transition-colors font-serif leading-tight">
                                        {preset.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">
                                        {preset.description}
                                    </p>
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        {preset.category || 'Special'}
                                    </span>
                                </div>
                                
                                {/* Action Buttons Row */}
                                <div className="flex items-center justify-between gap-2 mt-2">
                                    {/* Price */}
                                    <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/10 font-mono text-sm font-bold">
                                        €{preset.price.toFixed(2)}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* AR View Button */}
                                        {preset.modelUrl && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectPreset(preset);
                                                }}
                                                className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/30 hover:border-blue-500/50 transition-all group/ar"
                                                aria-label="View in AR"
                                                title="View in AR"
                                            >
                                                <Box size={16} className="text-blue-300 group-hover/ar:text-blue-100" />
                                            </button>
                                        )}
                                        
                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToCart?.(preset);
                                            }}
                                            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-sushi-gold hover:text-black transition-all group/add"
                                            aria-label="Add to cart"
                                            title="Add to cart"
                                        >
                                            <PlusCircle size={16} className="group-hover/add:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Sticky Bottom Bar - Only show when items are selected */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 bg-gradient-to-t from-black via-gray-900 to-transparent pb-6 pt-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-sushi-gold rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.4)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Check size={20} className="text-sushi-gold" />
                </div>
                <div>
                  <p className="text-black font-bold text-lg">
                    {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} geselecteerd
                  </p>
                  <p className="text-black/70 text-sm">
                    Klaar om te bestellen
                  </p>
                </div>
              </div>
              
              <button
                onClick={onProceedToOrder}
                className="bg-black text-sushi-gold px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-gray-900 transition-all flex items-center gap-2 shadow-lg hover:scale-105"
              >
                Doorgaan naar Bestelling
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
