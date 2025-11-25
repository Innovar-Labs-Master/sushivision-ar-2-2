
import React from 'react';
import { BookOpen, ShoppingBag, User, MapPin } from 'lucide-react';
import { AppView } from '../types';

interface Props {
  currentView: AppView;
  cartCount: number;
  onNavigate: (view: AppView) => void;
}

const Navigation: React.FC<Props> = ({ currentView, cartCount, onNavigate }) => {
  // Hide nav on landing or admin pages, but keep for other customer views
  if (currentView === 'landing' || currentView === 'admin' || currentView === 'kitchen') return null;

  const navItems = [
    { id: 'menu', label: 'Menu', icon: BookOpen, view: 'menu' },
    { id: 'cart', label: 'Bestelling', icon: ShoppingBag, view: 'cart' },
    { id: 'contact', label: 'Contact', icon: MapPin, view: 'contact' },
    { id: 'profile', label: 'Profiel', icon: User, view: 'customer-dashboard' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 pb-safe z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          // Consider 'builder' as part of 'menu' for active state
          const isActive = 
            (currentView === item.view) || 
            (item.view === 'menu' && currentView === 'builder') ||
            (item.view === 'cart' && currentView === 'order-tracker');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view as AppView)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 ${
                isActive ? 'text-sushi-gold' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <item.icon 
                    size={isActive ? 24 : 22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-all ${isActive ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`}
                />
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#1a1a1a]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
