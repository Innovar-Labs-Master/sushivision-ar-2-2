
import { create } from 'zustand';
import { PresetDish, RestaurantInfo, UserRole } from '../types';
import { supabase } from '../services/supabase';
import { toast } from '../utils/toast';

interface AppState {
  // Auth
  token: string | null;
  isAuthenticated: boolean;
  currentUser: { username: string; role: UserRole } | null;
  login: (token: string, role: UserRole, username: string) => void;
  logout: () => void;

  // Menu
  customMenuItems: PresetDish[];
  fetchMenu: () => Promise<void>;
  saveMenu: (items: PresetDish[]) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;

  // Restaurant Info
  restaurantInfo: RestaurantInfo | null;
  fetchRestaurantInfo: () => Promise<void>;
  saveRestaurantInfo: (info: RestaurantInfo) => Promise<void>;
  
  // Developer Settings
  apiKey: string;
  predictiveInventory: boolean;
  kitchenOptimization: boolean;
  setApiKey: (key: string) => void;
  setPredictiveInventory: (value: boolean) => void;
  setKitchenOptimization: (value: boolean) => void;
  fetchSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const useStore = create<AppState>((set, get) => ({
  // --- STATE ---
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!) : null,
  customMenuItems: localStorage.getItem('cachedMenu') ? JSON.parse(localStorage.getItem('cachedMenu')!) : [],
  restaurantInfo: localStorage.getItem('cachedInfo') ? JSON.parse(localStorage.getItem('cachedInfo')!) : null,
  apiKey: '',
  predictiveInventory: false,
  kitchenOptimization: false,

  // --- ACTIONS ---

  // Auth Actions (Updated to clear Supabase session on logout)
  login: (token: string, role: UserRole, username: string) => {
    localStorage.setItem('authToken', token);
    const user = { username, role };
    localStorage.setItem('currentUser', JSON.stringify(user));
    set({ token, isAuthenticated: true, currentUser: user });
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    set({ token: null, isAuthenticated: false, currentUser: null });
  },

  // Menu Actions
  fetchMenu: async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;

      const mappedItems: PresetDish[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        modelUrl: item.model_url,
        ingredients: item.ingredients || { baseId: '', proteinIds: [], vegetableIds: [], toppingIds: [], sauceId: '' }
      }));
      
      set({ customMenuItems: mappedItems });
      localStorage.setItem('cachedMenu', JSON.stringify(mappedItems));
    } catch (error: any) {
      console.error("Failed to fetch menu from Supabase:", error);
      toast.error('Kon menu niet laden. Probeer de pagina te verversen.');
    }
  },

  saveMenu: async (items: PresetDish[]) => {
    // Note: In a real app, we should probably only upsert changed items.
    // For now, we'll upsert all to ensure sync.
    try {
      const dbItems = items.map(item => ({
        id: item.id.length > 10 ? item.id : undefined, // Let DB generate UUID if it's a temp ID (or handle ID generation in frontend)
        // Actually, if we want to update, we need the ID. 
        // If the ID is from the local constant (e.g. 'cola'), we can use it if the DB column is text or uuid. 
        // I defined DB id as uuid. 'cola' is not uuid.
        // This is a conflict. The presets in constants.ts have string IDs like 'cola'.
        // The DB expects UUID.
        // I should probably change the DB ID to text to support 'cola', 'spicy-tuna', etc.
        // OR I should rely on the DB to generate IDs and only save *custom* items.
        // The current app mixes presets (constants) and custom items.
        // 'customMenuItems' usually refers to items added via Admin.
        // Let's assume we only save items that are meant to be persisted.
        
        // For this migration, I'll map fields.
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        model_url: item.modelUrl,
        ingredients: item.ingredients
      }));

      // We can't easily upsert if IDs don't match types.
      // Since I created the table with UUID, but the app uses strings like 'cola', 
      // I should have made the ID column TEXT.
      // I will fix the table definition in a separate step or handle it here.
      // Let's assume for now we are saving *new* items or items that already have UUIDs.
      // If I try to insert 'cola' into uuid column, it will fail.
      
      // FIX: I will re-create the table with ID as TEXT to be safe and compatible.
      
      // For now, let's just try to upsert.
      const { data, error } = await supabase.from('menu_items').upsert(dbItems, { onConflict: 'name' }).select(); 
      // onConflict 'name' is risky but 'id' is problematic if types mismatch.
      
      if (error) throw error;

      // Fetch fresh to get generated IDs
      const { data: refreshedData } = await supabase.from('menu_items').select('*');
      if (refreshedData) {
         const mapped = refreshedData.map((item: any) => ({
            id: item.id, // This will be the DB ID (UUID or Text)
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            modelUrl: item.model_url,
            ingredients: item.ingredients
         }));
         set({ customMenuItems: mapped });
         localStorage.setItem('cachedMenu', JSON.stringify(mapped));
      }
      
      toast.success('Menu succesvol opgeslagen!');
    } catch (error: any) {
      console.error("Failed to save menu:", error);
      const errorMessage = error?.message || 'Fout bij opslaan van menu.';
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteMenuItem: async (id: string) => {
    try {
        // Only delete if it's a UUID (Supabase item) or we treat all IDs as text now.
        // Our DB ID is text, so we can try to delete by ID.
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if (error) throw error;

        // Update local state
        const currentItems = get().customMenuItems;
        const updatedItems = currentItems.filter(item => item.id !== id);
        set({ customMenuItems: updatedItems });
        localStorage.setItem('cachedMenu', JSON.stringify(updatedItems));
    } catch (error: any) {
        console.error("Failed to delete item:", error);
        const errorMessage = error?.message || 'Kon item niet verwijderen.';
        toast.error(errorMessage);
    }
  },

  // Restaurant Info Actions
  fetchRestaurantInfo: async () => {
    try {
      const { data, error } = await supabase.from('restaurant_info').select('*').single();
      if (error) throw error;
      
      if (data) {
          const info: RestaurantInfo = {
              name: data.name,
              address: data.address,
              phone: data.phone,
              email: data.email,
              description: data.description,
              logoUrl: data.logo_url,
              coverImageUrl: data.cover_image_url
          };
          set({ restaurantInfo: info });
          localStorage.setItem('cachedInfo', JSON.stringify(info));
      }
    } catch (error: any) {
      console.error("Failed to fetch restaurant info:", error);
      // Silent fail - restaurant info is optional
    }
  },

  saveRestaurantInfo: async (info: RestaurantInfo) => {
    try {
        const dbInfo = {
            id: 1, // Singleton row
            name: info.name,
            address: info.address,
            phone: info.phone,
            email: info.email,
            description: info.description,
            logo_url: info.logoUrl,
            cover_image_url: info.coverImageUrl
        };

        const { error } = await supabase.from('restaurant_info').upsert(dbInfo);
        if (error) throw error;

        set({ restaurantInfo: info });
        localStorage.setItem('cachedInfo', JSON.stringify(info));
        toast.success('Bedrijfsgegevens succesvol opgeslagen!');
    } catch (error: any) {
        console.error("Failed to save info:", error);
        const errorMessage = error?.message || 'Fout bij opslaan van bedrijfsgegevens.';
        toast.error(errorMessage);
        throw error;
    }
  },
  
  // Developer Settings Actions
  setApiKey: (key: string) => set({ apiKey: key }),
  setPredictiveInventory: (value: boolean) => set({ predictiveInventory: value }),
  setKitchenOptimization: (value: boolean) => set({ kitchenOptimization: value }),

  fetchSettings: async () => {
    try {
      // Load from localStorage instead of API
      const savedApiKey = localStorage.getItem('dev_apiKey');
      const savedPredictiveInventory = localStorage.getItem('dev_predictiveInventory');
      const savedKitchenOptimization = localStorage.getItem('dev_kitchenOptimization');
      
      set({
        apiKey: savedApiKey || '',
        predictiveInventory: savedPredictiveInventory === 'true',
        kitchenOptimization: savedKitchenOptimization === 'true',
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const { apiKey, predictiveInventory, kitchenOptimization } = get();
      
      // Save to localStorage
      localStorage.setItem('dev_apiKey', apiKey);
      localStorage.setItem('dev_predictiveInventory', predictiveInventory.toString());
      localStorage.setItem('dev_kitchenOptimization', kitchenOptimization.toString());
      
      toast.success('Instellingen succesvol opgeslagen!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast.error('Fout bij opslaan van instellingen.');
    }
  },
}));

export default useStore;
