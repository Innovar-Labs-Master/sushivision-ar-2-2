
export type IngredientType = 'Base' | 'Protein' | 'Vegetable' | 'Topping' | 'Sauce';

export interface Ingredient {
  id: string;
  name: string;
  type: IngredientType;
  price: number;
  premium?: boolean;
  image?: string;
}

export interface CuisineConfig {
  id: string;
  name: string;
  label: string; // e.g. "Sushi Bar"
  description: string;
  themeColor: string; // Tailwind class prefix or hex
  ingredients: Ingredient[];
  portionSizes: string[];
  presets: PresetDish[];
}

export interface CustomDish {
  base: Ingredient | null;
  proteins: Ingredient[];
  vegetables: Ingredient[];
  toppings: Ingredient[];
  sauce: Ingredient | null;
  portionSize: string;
}

export interface ChefAnalysis {
  name: string;
  description: string;
  pairing: string;
  caloriesEstimate: string;
  priceEstimate: number;
}

export interface StaffGuide {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  prepTime: string;
  steps: string[];
  safetyTips: string[];
}

export interface PresetDish {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // Base64 or URL of uploaded photo
  modelUrl?: string; // URL of uploaded .glb/.gltf 3D model
  usdzUrl?: string; // URL of uploaded .usdz 3D model (for iOS)
  category?: string;
  ingredients: {
    baseId: string;
    proteinIds: string[];
    vegetableIds: string[];
    toppingIds: string[];
    sauceId: string;
  };
}

export interface CartItem {
  id: string;
  dishName: string;
  description: string;
  price: number;
  quantity: number;
  isCustom: boolean;
  details: string; // String summary of ingredients
  image?: string;
  completed?: boolean; // For kitchen tracking
}

export type AppView = 'landing' | 'builder' | 'menu' | 'ar' | 'cart' | 'order-tracker' | 'review' | 'admin' | 'kitchen' | 'customer-dashboard' | 'contact' | 'developer';

export type OrderStatus = 'received' | 'preparing' | 'quality_check' | 'ready';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  tableNumber?: number;
}

export interface ReviewData {
  rating: number;
  text: string;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  logoUrl?: string; // Optional logo override
  coverImageUrl?: string; // Optional landing page background
}

export type UserRole = 'admin' | 'customer' | 'kitchen';

export interface User {
    id: number;
    username: string;
    role: UserRole;
}
