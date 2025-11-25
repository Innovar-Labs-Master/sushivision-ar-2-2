import React, { useState } from "react";
import { ChefAnalysis, StaffGuide as StaffGuideType } from "../types";
import StaffGuide from "./StaffGuide";
import {
  Sparkles,
  Utensils,
  Wine,
  Activity,
  Loader2,
  Camera,
  DollarSign,
  ChefHat,
  Eye,
  Plus,
  Check,
} from "lucide-react";

interface Props {
  imageData: string | null;
  chefAnalysis: ChefAnalysis | null;
  staffGuide: StaffGuideType | null;
  isLoading: boolean;
  hasIngredients: boolean;
  onGenerate: () => void;
  onOpenAR: () => void;
  onAddToOrder: () => void;
}

const DishPreview: React.FC<Props> = ({
  imageData,
  chefAnalysis,
  staffGuide,
  isLoading,
  hasIngredients,
  onGenerate,
  onOpenAR,
  onAddToOrder,
}) => {
  const [viewMode, setViewMode] = useState<"customer" | "staff">("customer");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToOrder();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!hasIngredients) {
    return (
      <div className="h-48 sm:h-full flex flex-col items-center justify-center text-gray-500 p-8 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/30">
        <Utensils size={32} className="mb-2 opacity-50" />
        <p className="text-center text-sm sm:text-lg">
          Start adding ingredients
        </p>
      </div>
    );
  }

  // Render Staff Guide
  if (viewMode === "staff" && staffGuide && !isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setViewMode("customer")}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
          >
            <Eye size={16} /> Back to Preview
          </button>
        </div>
        <StaffGuide guide={staffGuide} />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Visualizer Area */}
      <div className="card-glass relative aspect-[4/3] w-full overflow-hidden shadow-2xl border border-gray-800 group animate-in slide-in-from-right">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-sushi-gold animate-spin mb-4" />
            <p className="text-sushi-rice text-xs font-serif tracking-widest animate-pulse">
              PREPARING...
            </p>
          </div>
        ) : imageData ? (
          <>
            <img
              src={imageData}
              alt="AI Generated Dish"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>

            {/* Mobile Floating Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <button
                onClick={onOpenAR}
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20"
              >
                <Camera size={16} /> AR View
              </button>
              <button
                onClick={() => setViewMode("staff")}
                className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg flex items-center justify-center hover:bg-white/20"
              >
                <ChefHat size={16} />
              </button>
            </div>

            {/* Price Tag */}
            {chefAnalysis && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-sushi-gold px-3 py-1 rounded-full border border-sushi-gold/30 font-serif font-bold flex items-center gap-1 text-sm">
                <DollarSign size={12} />
                {chefAnalysis.priceEstimate.toFixed(2)}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-400 p-6">
            <div className="bg-gray-800/50 p-4 rounded-full mb-4 ring-1 ring-white/10">
              <Sparkles size={24} className="text-sushi-gold" />
            </div>
            <p className="text-center text-sm max-w-[200px]">
              Tap visualize to see your custom creation.
            </p>
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      {!isLoading &&
        (imageData ? (
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full py-4 font-bold text-lg uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
              added
                ? "bg-green-600 text-white"
                : "bg-sushi-gold text-black hover:brightness-110"
            }`}
          >
            {added ? <Check size={20} /> : <Plus size={20} />}
            {added ? "Added to Order" : "Add to Order"}
          </button>
        ) : (
          <button
            onClick={onGenerate}
            className="w-full py-4 bg-gray-800 text-white font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-gray-700 border border-gray-600 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Visualize Dish
          </button>
        ))}

      {/* Chef's Analysis Card */}
      {chefAnalysis && !isLoading && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 space-y-3 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-serif text-sushi-gold mb-1">
              {chefAnalysis.name}
            </h2>
            <p className="text-gray-300 italic text-xs leading-relaxed">
              "{chefAnalysis.description}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Wine size={14} className="text-purple-400" />
              <span className="truncate">{chefAnalysis.pairing}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Activity size={14} className="text-green-400" />
              <span>{chefAnalysis.caloriesEstimate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishPreview;
