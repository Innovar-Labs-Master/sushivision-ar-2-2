
import React from 'react';
import { Ingredient, IngredientType } from '../types';
import { Check, Star } from 'lucide-react';

interface Props {
  category: IngredientType;
  ingredients: Ingredient[];
  selectedIds: string[];
  onToggle: (ingredient: Ingredient) => void;
  singleSelect?: boolean;
}

const IngredientCategory: React.FC<Props> = ({ category, ingredients, selectedIds, onToggle }) => {
  const items = ingredients.filter(i => i.type === category);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-serif text-sushi-rice mb-3 border-b border-gray-800 pb-2">{category}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {items.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item)}
              className={`
                relative p-2 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[80px]
                ${isSelected 
                  ? 'bg-sushi-seaweed/60 border-sushi-gold text-sushi-gold shadow-[0_0_10px_rgba(251,191,36,0.1)]' 
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 active:scale-95'}
              `}
            >
              {item.premium && (
                <div className="absolute top-1 right-1 text-sushi-gold">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
              {isSelected && (
                <div className="absolute top-1 left-1 text-sushi-gold">
                  <Check size={12} />
                </div>
              )}
              <span className="text-xs font-medium leading-tight">{item.name}</span>
              <span className="text-[10px] text-gray-500 mt-1">${item.price.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IngredientCategory;
