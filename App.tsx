
import React, { useState, useEffect } from 'react';
import { Ingredient, CustomDish, ChefAnalysis, StaffGuide, PresetDish, AppView, CartItem, Order, OrderStatus, UserRole } from './types';
import { CUISINES } from './constants';
import IngredientCategory from './components/IngredientCategory';
import DishPreview from './components/SushiPreview';
import MenuPage from './components/MenuPage';
import ARView from './components/ARView';
import Landing from './components/Landing';
import Cart from './components/Cart';
import Navigation from './components/Navigation';
import OrderTracker from './components/OrderTracker';
import ReviewForm from './components/ReviewForm';
import AdminPanel from './components/AdminPanel';
import KitchenDisplay from './components/KitchenDisplay';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import Contact from './components/Contact';
import DeveloperSettings from './components/DeveloperSettings';
import ToastContainer from './components/ToastContainer';
import useStore from './store/store';
import { generateDishVisualization, generateDishAnalysis, generateStaffTraining } from './services/geminiService';
import { ArrowLeft, User } from 'lucide-react';

const App: React.FC = () => {
  const { 
    isAuthenticated, 
    currentUser,
    login, 
    logout, 
    customMenuItems, 
    fetchMenu, 
    saveMenu,
    restaurantInfo,
    fetchRestaurantInfo,
    saveRestaurantInfo,
    apiKey,
    fetchSettings
  } = useStore();

  const isAdminUrl = window.location.pathname === '/admin' || window.location.hash === '#admin';
  const isKitchenUrl = window.location.pathname === '/kitchen' || window.location.hash === '#kitchen';
  const isDeveloperUrl = window.location.pathname === '/developer' || window.location.hash === '#developer';
  
  // Determine initial view based on URL and Auth
  const getInitialView = (): AppView => {
      if (isAdminUrl) return 'admin';
      if (isKitchenUrl) return 'kitchen';
      if (isDeveloperUrl) return 'developer';
      return 'landing';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView());
  const [currentCuisineId, setCurrentCuisineId] = useState<string>('sushi');

  const cuisine = {
    ...CUISINES[currentCuisineId],
    presets: [...CUISINES[currentCuisineId].presets, ...customMenuItems]
  };

  useEffect(() => {
    fetchMenu();
    fetchRestaurantInfo();
    fetchSettings(); // Load API key from localStorage
  }, [fetchMenu, fetchRestaurantInfo, fetchSettings]);

  // If user logs in/out, update view accordingly
  useEffect(() => {
    if (isAuthenticated && currentUser) {
        if (currentUser.role === 'admin' && currentView === 'admin') {
            // Stay on admin
        } else if (currentUser.role === 'kitchen' && currentView === 'kitchen') {
            // Stay on kitchen
        } else if (currentUser.role === 'customer' && (currentView === 'admin' || currentView === 'landing')) {
             setCurrentView('customer-dashboard');
        }
    }
  }, [isAuthenticated, currentUser, currentView]);


  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Order Management State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Sync orders with localStorage and across tabs
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  // Dish Builder State
  const [dish, setDish] = useState<CustomDish>({
    base: null,
    proteins: [],
    vegetables: [],
    toppings: [],
    sauce: null,
    portionSize: cuisine.portionSizes[2]
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ChefAnalysis | null>(null);
  const [staffGuide, setStaffGuide] = useState<StaffGuide | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset dish when cuisine changes
  useEffect(() => {
    setDish({
      base: null,
      proteins: [],
      vegetables: [],
      toppings: [],
      sauce: null,
      portionSize: cuisine.portionSizes[2]
    });
    setGeneratedImage(null);
    setAnalysis(null);
    setStaffGuide(null);
  }, [currentCuisineId, cuisine.portionSizes]);

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  const [selectedPreset, setSelectedPreset] = useState<PresetDish | null>(null);
  const [selectedMenuItems, setSelectedMenuItems] = useState<Set<string>>(new Set());

  const handleToggleMenuItemSelection = (presetId: string) => {
    setSelectedMenuItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(presetId)) {
        newSet.delete(presetId);
      } else {
        newSet.add(presetId);
      }
      return newSet;
    });
  };

  const handleAddPresetToCart = (preset: PresetDish) => {
    const newItem: CartItem = {
      id: Date.now().toString() + Math.random(),
      dishName: preset.name,
      description: preset.description,
      price: preset.price,
      quantity: 1,
      isCustom: false,
      image: preset.image || undefined,
      details: preset.description
    };
    setCart(prev => [...prev, newItem]);
  };

  const handleProceedToOrder = () => {
    // Add all selected items to cart
    const selectedPresets = cuisine.presets.filter(preset => selectedMenuItems.has(preset.id));
    
    const newCartItems: CartItem[] = selectedPresets.map(preset => ({
      id: Date.now().toString() + Math.random(),
      dishName: preset.name,
      description: preset.description,
      price: preset.price,
      quantity: 1,
      isCustom: false,
      image: preset.image || undefined,
      details: preset.description
    }));

    setCart(prev => [...prev, ...newCartItems]);
    setSelectedMenuItems(new Set()); // Clear selection
    setCurrentView('cart'); // Navigate to cart
  };

  const handleAddToCart = (item?: CartItem) => {
    if (item) {
      setCart(prev => [...prev, item]);
      setCartCount(prev => prev + 1);
      return;
    }

    if (!analysis) return;

    let details = '';
    if (selectedPreset) {
         details = selectedPreset.description;
    } else {
         details = [
            dish.base?.name,
            ...dish.proteins.map(p => p.name),
            ...dish.vegetables.map(v => v.name),
          ].filter(Boolean).join(', ');
    }

    const newItem: CartItem = {
      id: Date.now().toString(),
      dishName: analysis.name,
      description: analysis.description,
      price: analysis.priceEstimate,
      quantity: 1,
      isCustom: !selectedPreset,
      image: generatedImage || undefined,
      details: details
    };

    setCart(prev => [...prev, newItem]);
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08,
      status: 'received',
      timestamp: Date.now(),
      tableNumber: Math.floor(Math.random() * 20) + 1
    };

    setOrders(prev => [...prev, newOrder]);
    setCurrentOrderId(newOrder.id);
    setCart([]);
    setCurrentView('order-tracker');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const handleToggleItemComplete = (orderId: string, itemId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return order;
    }));
  };

  const handlePresetSelect = (preset: PresetDish) => {
    // If preset has an uploaded image OR a 3D model, show it directly in AR
    if (preset.image || preset.modelUrl) {
      setGeneratedImage(preset.image || null);
      setSelectedPreset(preset); 
      setAnalysis({
        name: preset.name,
        description: preset.description,
        pairing: 'Zie menu voor suggesties',
        caloriesEstimate: 'Variabel',
        priceEstimate: preset.price
      });
      setShowAR(true);
      return;
    }

    // Otherwise, load ingredients into builder
    const ingredients = cuisine.ingredients;
    const base = ingredients.find(i => i.id === preset.ingredients.baseId) || null;
    const proteins = ingredients.filter(i => preset.ingredients.proteinIds.includes(i.id));
    const vegetables = ingredients.filter(i => preset.ingredients.vegetableIds.includes(i.id));
    const toppings = ingredients.filter(i => preset.ingredients.toppingIds.includes(i.id));
    const sauce = ingredients.find(i => i.id === preset.ingredients.sauceId) || null;

    setDish({
      base,
      proteins,
      vegetables,
      toppings,
      sauce,
      portionSize: cuisine.portionSizes[2]
    });
    
    setSelectedPreset(preset);
    setGeneratedImage(null);
    setAnalysis(null);

    setCurrentView('builder');
    window.scrollTo(0, 0);
  };

  const handleGenerate = async () => {
    if (!dish.base) {
      setError("Please select a base.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const [imageResult, textResult, guideResult] = await Promise.all([
        generateDishVisualization(dish, cuisine, apiKey),
        generateDishAnalysis(dish, cuisine, apiKey),
        generateStaffTraining(dish, cuisine, apiKey)
      ]);

      if (imageResult) setGeneratedImage(imageResult);
      if (textResult) setAnalysis(textResult);
      if (guideResult) setStaffGuide(guideResult);

    } catch (e: any) {
      console.error("Generation error:", e);
      const errorMessage = e?.message || "Failed to generate. Try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIngredientToggle = (ingredient: Ingredient) => {
    if (generatedImage) {
      setGeneratedImage(null);
      setAnalysis(null);
      setSelectedPreset(null);
    }

    setDish(prev => {
      const newDish = { ...prev };
      switch (ingredient.type) {
        case 'Base':
            newDish.base = newDish.base?.id === ingredient.id ? null : ingredient;
            break;
        case 'Sauce':
            newDish.sauce = newDish.sauce?.id === ingredient.id ? null : ingredient;
            break;
        case 'Protein':
            if (newDish.proteins.some(p => p.id === ingredient.id)) {
                newDish.proteins = newDish.proteins.filter(p => p.id !== ingredient.id);
            } else {
                if (newDish.proteins.length < 2) newDish.proteins.push(ingredient);
            }
            break;
        case 'Vegetable':
             if (newDish.vegetables.some(v => v.id === ingredient.id)) {
                newDish.vegetables = newDish.vegetables.filter(v => v.id !== ingredient.id);
            } else {
                if (newDish.vegetables.length < 3) newDish.vegetables.push(ingredient);
            }
            break;
        case 'Topping':
             if (newDish.toppings.some(t => t.id === ingredient.id)) {
                newDish.toppings = newDish.toppings.filter(t => t.id !== ingredient.id);
            } else {
                if (newDish.toppings.length < 3) newDish.toppings.push(ingredient);
            }
            break;
      }
      return newDish;
    });
  };

  // View Routing with Authentication
  if (currentView === 'landing') {
    return <Landing cuisine={cuisine} onStart={() => setCurrentView('menu')} restaurantInfo={restaurantInfo} />;
  }

  // Protected Routes - Admin Panel
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <Login />;
    }
    if (currentUser?.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Toegang Geweigerd</h2>
            <p className="text-gray-400 mb-6">Je hebt geen toegang tot het admin panel.</p>
            <button onClick={() => setCurrentView('landing')} className="px-6 py-2 bg-sushi-gold text-black font-bold rounded-lg">
              Terug naar start
            </button>
          </div>
        </div>
      );
    }
    return (
      <AdminPanel 
        existingItems={cuisine.presets} 
        restaurantInfo={restaurantInfo}
        onSaveMenu={saveMenu} 
        onDeleteItem={useStore.getState().deleteMenuItem}
        onSaveInfo={saveRestaurantInfo}
        onOpenKitchen={() => setCurrentView('kitchen')}
        onLogout={logout}
      />
    );
  }

  // Protected Routes - Kitchen Display
  if (currentView === 'kitchen') {
    if (!isAuthenticated) {
      return <Login />;
    }
    if (!['admin', 'kitchen'].includes(currentUser?.role || '')) {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Toegang Geweigerd</h2>
            <p className="text-gray-400 mb-6">Je hebt geen toegang tot de keuken display.</p>
            <button onClick={() => setCurrentView('landing')} className="px-6 py-2 bg-sushi-gold text-black font-bold rounded-lg">
              Terug naar start
            </button>
          </div>
        </div>
      );
    }
    return (
      <KitchenDisplay 
        orders={orders}
        onUpdateStatus={handleUpdateOrderStatus}
        onToggleItemComplete={handleToggleItemComplete}
        onBack={() => setCurrentView('admin')}
      />
    );
  }

  // Protected Routes - Customer Dashboard
  if (currentView === 'customer-dashboard') {
    if (!isAuthenticated) {
      return <Login />;
    }
    if (currentUser?.role !== 'customer') {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Toegang Geweigerd</h2>
            <p className="text-gray-400 mb-6">Alleen klanten hebben toegang tot deze pagina.</p>
            <button onClick={() => setCurrentView('landing')} className="px-6 py-2 bg-sushi-gold text-black font-bold rounded-lg">
              Terug naar start
            </button>
          </div>
        </div>
      );
    }
    return (
      <CustomerDashboard 
        username={currentUser?.username || 'Guest'}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />
    );
  }

  // Developer Settings - Admin Only
  if (currentView === 'developer') {
    if (!isAuthenticated) {
      return <Login />;
    }
    if (currentUser?.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Toegang Geweigerd</h2>
            <p className="text-gray-400 mb-6">Alleen admin heeft toegang tot developer settings.</p>
            <button onClick={() => setCurrentView('landing')} className="px-6 py-2 bg-sushi-gold text-black font-bold rounded-lg">
              Terug naar start
            </button>
          </div>
        </div>
      );
    }
    return (
      <>
        <Navigation currentView={currentView} cartCount={cartCount} onNavigate={setCurrentView} />
        <DeveloperSettings />
      </>
    );
  }

  if (currentView === 'cart') {
    return (
      <Cart 
        items={cart} 
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
        onUpdateQuantity={(id, q) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i))}
        onCheckout={handleCheckout}
        onBack={() => setCurrentView('menu')}
      />
    );
  }

  if (currentView === 'order-tracker') {
    const order = orders.find(o => o.id === currentOrderId);
    return <OrderTracker order={order} onComplete={() => setCurrentView('review')} />;
  }

  if (currentView === 'review') {
    return <ReviewForm onSubmit={(rating, text) => {
      console.log(rating, text);
      setCurrentView('landing');
    }} />;
  }



  // Render new Contact view
  if (currentView === 'contact') {
      return (
          <>
            <Contact restaurantInfo={restaurantInfo} onBack={() => setCurrentView('menu')} />
            <Navigation currentView={currentView} cartCount={cartCount} onNavigate={setCurrentView} />
          </>
      );
  }

  // Main App Layout (Menu & Builder)
  return (
    <div className="min-h-screen bg-[#121212] pb-20 text-gray-100 font-sans">
      {/* Top Bar - Only show if not in contact view (handled above) */}
      <div className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-3">
             {currentView === 'builder' && (
                 <button onClick={() => setCurrentView('menu')} className="p-1 rounded-full hover:bg-gray-800">
                     <ArrowLeft size={20} />
                 </button>
             )}
             <h1 className="text-xl font-serif font-bold text-sushi-rice">
                 {currentView === 'builder' ? 'Stel Zelf Samen' : (restaurantInfo?.name || cuisine.label)}
             </h1>
         </div>
         
         <div className="flex items-center gap-3">
             <button 
                onClick={() => setCurrentView('customer-dashboard')} 
                className="p-2 bg-gray-800 rounded-full text-sushi-gold border border-gray-700"
             >
                 <User size={20} />
             </button>
         </div>
      </div>

      {/* Content */}
      <div className={currentView === 'menu' ? "w-full" : "p-4 max-w-md mx-auto"}>
         {currentView === 'menu' && (
             <div className="animate-in fade-in">
                 <MenuPage 
                    presets={cuisine.presets} 
                    onSelectPreset={handlePresetSelect} 
                    onOpenBuilder={() => setCurrentView('builder')}
                    onAddToCart={handleAddPresetToCart}
                    selectedItems={selectedMenuItems}
                    onToggleSelection={handleToggleMenuItemSelection}
                    onProceedToOrder={handleProceedToOrder}
                 />
             </div>
         )}

         {currentView === 'builder' && (
             <div className="space-y-6 animate-in slide-in-from-right">
                 <DishPreview 
                    imageData={generatedImage}
                    chefAnalysis={analysis}
                    staffGuide={staffGuide}
                    isLoading={isGenerating}
                    hasIngredients={!!dish.base}
                    onGenerate={handleGenerate}
                    onOpenAR={() => setShowAR(true)}
                    onAddToOrder={() => handleAddToCart()}
                 />

                 {error && (
                     <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm text-center border border-red-800">
                         {error}
                     </div>
                 )}

                 <div className="space-y-8 pb-8">
                     <IngredientCategory 
                        category="Base" 
                        ingredients={cuisine.ingredients} 
                        selectedIds={dish.base ? [dish.base.id] : []}
                        onToggle={handleIngredientToggle}
                     />
                     <IngredientCategory 
                        category="Protein" 
                        ingredients={cuisine.ingredients} 
                        selectedIds={dish.proteins.map(p => p.id)}
                        onToggle={handleIngredientToggle}
                     />
                     <IngredientCategory 
                        category="Vegetable" 
                        ingredients={cuisine.ingredients} 
                        selectedIds={dish.vegetables.map(v => v.id)}
                        onToggle={handleIngredientToggle}
                     />
                      <IngredientCategory 
                        category="Sauce" 
                        ingredients={cuisine.ingredients} 
                        selectedIds={dish.sauce ? [dish.sauce.id] : []}
                        onToggle={handleIngredientToggle}
                     />
                      <IngredientCategory 
                        category="Topping" 
                        ingredients={cuisine.ingredients} 
                        selectedIds={dish.toppings.map(t => t.id)}
                        onToggle={handleIngredientToggle}
                     />
                 </div>
             </div>
         )}
      </div>

      {/* AR Overlay */}
      {showAR && (
        <ARView
          imageData={generatedImage || undefined}
          modelUrl={selectedPreset?.modelUrl}
          usdzUrl={selectedPreset?.usdzUrl}
          analysis={analysis}
          ingredients={analysis ? '' : 'Custom Creation'}
          onClose={() => {
            setShowAR(false);
          }}
          onAddToOrder={analysis ? () => handleAddToCart() : undefined}
        />
      )}

      <Navigation currentView={currentView} cartCount={cartCount} onNavigate={setCurrentView} />
      <ToastContainer />
    </div>
  );
};

export default App;
