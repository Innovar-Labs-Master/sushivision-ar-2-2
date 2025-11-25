
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, Upload, Camera, X, Info, Image as ImageIcon, Tag, FileText, DollarSign, Box, ArrowLeft, ChefHat, LogOut, Store, LayoutTemplate } from 'lucide-react';
import { PresetDish, RestaurantInfo } from '../types';
import ARView from './ARView';
import useStore from '../store/store';
import { validateMenuItem, validateRestaurantInfo, validateImageFile, validateModelFile } from '../utils/validation';
import { toast } from '../utils/toast';

interface MenuItemForm {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string | null;
    imageFile: File | null;
    modelUrl?: string;
    usdzUrl?: string;
}

interface AdminPanelProps {
    existingItems: PresetDish[];
    restaurantInfo: RestaurantInfo | null;
    onSaveMenu: (items: PresetDish[]) => void;
    onDeleteItem: (id: string) => void;
    onSaveInfo: (info: RestaurantInfo) => void;
    onOpenKitchen: () => void;
    onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ existingItems, restaurantInfo, onSaveMenu, onDeleteItem, onSaveInfo, onOpenKitchen, onLogout }) => {
    const { predictiveInventory } = useStore();
    const [menuItems, setMenuItems] = useState<PresetDish[]>(existingItems || []);
    const [activeTab, setActiveTab] = useState<'menu' | 'info' | 'ai'>('menu');
    
    // Restaurant Info State
    const [infoForm, setInfoForm] = useState<RestaurantInfo>({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        logoUrl: undefined,
        coverImageUrl: undefined
    });

    useEffect(() => {
        setMenuItems(existingItems || []);
    }, [existingItems]);

    useEffect(() => {
        if (restaurantInfo) {
            setInfoForm(restaurantInfo);
        }
    }, [restaurantInfo]);

    const [isAdding, setIsAdding] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // AR Preview State
    const [showAR, setShowAR] = useState(false);
    const [selectedPreviewItem, setSelectedPreviewItem] = useState<PresetDish | null>(null);

    const [formData, setFormData] = useState<MenuItemForm>({
        name: '',
        description: '',
        price: 0,
        category: 'sushi',
        image: null,
        imageFile: null
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file
            const validation = validateImageFile(file);
            if (!validation.isValid) {
                validation.errors.forEach(error => toast.error(error));
                e.target.value = ''; // Reset input
                return;
            }

            // In a real app, upload to Supabase Storage here
            // For now, we'll keep using base64 for preview, but ideally:
            // const { data, error } = await supabase.storage.from('images').upload(`menu/${Date.now()}_${file.name}`, file);
            // if (data) const url = supabase.storage.from('images').getPublicUrl(data.path);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result as string,
                    imageFile: file
                }));
                toast.success('Foto geladen');
            };
            reader.onerror = () => {
                toast.error('Fout bij laden van foto');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInfoImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverImageUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInfoForm(prev => ({
                    ...prev,
                    [field]: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = async () => {
        if (!formData.name || !formData.description || (!formData.image && !formData.modelUrl)) {
            alert('Vul naam, beschrijving en minstens een foto OF 3D model in');
            return;
        }

        // Ideally upload image to Supabase Storage first if imageFile exists
        let imageUrl = formData.image;
        
        const newItem: PresetDish = {
            id: `custom-${Date.now()}`, // Temporary ID, DB will generate real one if we insert
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            image: imageUrl || undefined,
            modelUrl: formData.modelUrl,
            usdzUrl: formData.usdzUrl,
            ingredients: {
                baseId: '',
                proteinIds: [],
                vegetableIds: [],
                toppingIds: [],
                sauceId: ''
            }
        };

        setMenuItems(prev => [...prev, newItem]);

        // Reset form
        setFormData({
            name: '',
            description: '',
            price: 0,
            category: 'sushi',
            image: null,
            imageFile: null,
            modelUrl: undefined,
            usdzUrl: undefined
        });
        setIsAdding(false);
    };

    const handleDeleteItem = (id: string) => {
        if (confirm('Weet je zeker dat je dit gerecht wilt verwijderen?')) {
            setMenuItems(prev => prev.filter(item => item.id !== id));
            onDeleteItem(id);
        }
    };

    const handleSaveMenu = async () => {
        await onSaveMenu(menuItems);
    };

    const handleSaveRestaurantInfo = async () => {
        await onSaveInfo(infoForm);
    };

    const handleOpenAR = (item: PresetDish) => {
        setSelectedPreviewItem(item);
        setShowAR(true);
    };

    const [showPhotoTips, setShowPhotoTips] = useState(false);
    const [showModelTips, setShowModelTips] = useState(false);

    return (
        <div className="min-h-screen bg-[#121212] text-gray-100 p-6 pb-24">

            {/* AR Preview Overlay */}
            {showAR && selectedPreviewItem && (
                <ARView
                    imageData={selectedPreviewItem.image || ''}
                    modelUrl={selectedPreviewItem.modelUrl}
                    usdzUrl={selectedPreviewItem.usdzUrl}
                    analysis={{
                        name: selectedPreviewItem.name,
                        description: selectedPreviewItem.description,
                        pairing: 'Admin Preview Mode',
                        caloriesEstimate: 'N/A',
                        priceEstimate: selectedPreviewItem.price
                    }}
                    ingredients="Admin Preview Item"
                    onClose={() => setShowAR(false)}
                />
            )}

            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50 rounded-xl mb-8 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">🔒 Admin Panel</h1>
                        <p className="text-sm text-gray-400">Beheer je restaurant</p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href="/"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 text-sm font-medium text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Menu
                        </a>
                        <button
                            onClick={onOpenKitchen}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 text-sm font-medium text-white transition-colors"
                        >
                            <ChefHat size={18} />
                            Keuken
                        </button>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <LogOut size={18} />
                            Uit
                        </button>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="max-w-7xl mx-auto flex gap-6 mt-6 border-b border-gray-700">
                    <button 
                        onClick={() => setActiveTab('menu')}
                        className={`pb-3 font-medium transition-colors ${activeTab === 'menu' ? 'text-sushi-gold border-b-2 border-sushi-gold' : 'text-gray-400 hover:text-white'}`}
                    >
                        Menu Items
                    </button>
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'info' ? 'text-sushi-gold border-b-2 border-sushi-gold' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Store size={16} />
                        Restaurant Info
                    </button>
                    {predictiveInventory && (
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`pb-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'text-sushi-gold border-b-2 border-sushi-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ChefHat size={16} />
                            AI Dashboards
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {activeTab === 'ai' && (
                    <div className="max-w-4xl mx-auto mt-8 bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ChefHat className="text-sushi-gold" />
                            Predictive Inventory
                        </h2>
                        <p className="text-gray-400 mt-2">(Placeholder for AI-powered inventory forecasts based on sales data, events, and weather.)</p>
                    </div>
                )}
                {activeTab === 'info' ? (
                    // --- RESTAURANT INFO TAB ---
                    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Store className="text-sushi-gold" />
                                Bedrijfsgegevens
                            </h2>
                            <button
                                onClick={handleSaveRestaurantInfo}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
                            >
                                <Save size={18} />
                                Opslaan
                            </button>
                        </div>
                        
                        <div className="space-y-8">
                             {/* Images Section */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleInfoImageUpload(e, 'logoUrl')}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-sushi-gold hover:bg-gray-700/50 transition-all overflow-hidden"
                                        >
                                            {infoForm.logoUrl ? (
                                                <img src={infoForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                                    <span className="text-xs text-gray-400">Upload Logo</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                        <LayoutTemplate size={16} /> Cover Afbeelding (Home)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleInfoImageUpload(e, 'coverImageUrl')}
                                            className="hidden"
                                            id="cover-upload"
                                        />
                                        <label
                                            htmlFor="cover-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-sushi-gold hover:bg-gray-700/50 transition-all overflow-hidden relative group"
                                        >
                                            {infoForm.coverImageUrl ? (
                                                <>
                                                    <img src={infoForm.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold">Wijzig Cover</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                                    <span className="text-xs text-gray-400">Upload Home Achtergrond</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-4 border-t border-gray-700 pt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Naam Restaurant</label>
                                    <input
                                        type="text"
                                        value={infoForm.name}
                                        onChange={(e) => setInfoForm({...infoForm, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Slogan / Welkomsttekst</label>
                                    <textarea
                                        value={infoForm.description}
                                        onChange={(e) => setInfoForm({...infoForm, description: e.target.value})}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Adres</label>
                                    <input
                                        type="text"
                                        value={infoForm.address}
                                        onChange={(e) => setInfoForm({...infoForm, address: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Telefoon</label>
                                        <input
                                            type="text"
                                            value={infoForm.phone}
                                            onChange={(e) => setInfoForm({...infoForm, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={infoForm.email}
                                            onChange={(e) => setInfoForm({...infoForm, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- MENU TAB ---
                    previewMode ? (
                        // Preview Mode
                        <div className="space-y-6">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setPreviewMode(false)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <Eye size={18} />
                                    Terug naar Bewerken
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.map(item => (
                                    <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg group hover:border-sushi-gold transition-colors">
                                        {item.image ? (
                                            <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {item.modelUrl && (
                                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                                        <Box size={12} className="text-sushi-gold" />
                                                        3D
                                                    </div>
                                                )}
                                            </div>
                                        ) : item.modelUrl ? (
                                            <div className="aspect-[4/3] bg-gray-900 flex flex-col items-center justify-center text-sushi-gold border-b border-gray-700">
                                                <Box size={48} />
                                                <span className="text-xs mt-2 font-bold">3D ONLY</span>
                                            </div>
                                        ) : null}
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-sushi-gold">€{item.price.toFixed(2)}</span>
                                                <button
                                                    onClick={() => handleOpenAR(item)}
                                                    className="px-4 py-2 bg-sushi-gold text-black font-bold rounded-lg text-sm hover:bg-yellow-400 transition-colors flex items-center gap-2"
                                                >
                                                    <Camera size={16} />
                                                    Test in AR
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Edit Mode
                        <div className="space-y-8">
                            <div className="flex justify-end gap-3 mb-4">
                                <button
                                    onClick={() => setPreviewMode(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <Eye size={18} />
                                    Preview Modus
                                </button>
                                <button
                                    onClick={handleSaveMenu}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <Save size={18} />
                                    Menu Opslaan
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Totaal Gerechten</p>
                                    <p className="text-3xl font-bold text-white mt-2">{menuItems.length}</p>
                                </div>
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Met Foto's</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {menuItems.filter(i => i.image).length}
                                    </p>
                                </div>
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Met 3D Model</p>
                                    <p className="text-3xl font-bold text-sushi-gold mt-2">
                                        {menuItems.filter(i => i.modelUrl).length}
                                    </p>
                                </div>
                            </div>

                            {/* Add New Item Button */}
                            {!isAdding && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full py-4 bg-gradient-to-r from-sushi-gold to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 rounded-xl flex items-center justify-center gap-2 font-bold text-black shadow-lg transition-all transform hover:scale-[1.01]"
                                >
                                    <Plus size={20} />
                                    Nieuw Gerecht Toevoegen
                                </button>
                            )}

                            {/* Add Item Form */}
                            {isAdding && (
                                <div className="bg-gray-800 rounded-xl p-6 border-2 border-sushi-gold shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <Plus size={24} className="text-sushi-gold" />
                                        Nieuw Gerecht
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
                                                <span>Foto (Optioneel bij 3D)</span>
                                                <button
                                                    onClick={() => setShowPhotoTips(true)}
                                                    className="text-xs text-sushi-gold flex items-center gap-1 hover:underline"
                                                >
                                                    <Info size={12} />
                                                    Foto Tips
                                                </button>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.image ? 'border-sushi-gold bg-gray-900' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}`}
                                                >
                                                    {formData.image ? (
                                                        <div className="relative w-full h-full p-2 group">
                                                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                                <p className="text-white font-medium">Klik om te wijzigen</p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setFormData(prev => ({ ...prev, image: null, imageFile: null }));
                                                                }}
                                                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg z-10"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <p className="text-sm text-gray-300 mb-1">
                                                                <span className="font-semibold text-sushi-gold">Klik om te uploaden</span> of sleep hierheen
                                                            </p>
                                                            <p className="text-xs text-gray-500">PNG, JPG (transparante achtergrond aanbevolen)</p>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* 3D Model Upload (GLB/GLTF) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
                                                    <span>3D Model (Web/Android)</span>
                                                    <button
                                                        onClick={() => setShowModelTips(true)}
                                                        className="text-xs text-blue-400 flex items-center gap-1 hover:underline"
                                                    >
                                                        <Info size={12} />
                                                        3D Hulp
                                                    </button>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept=".glb,.gltf"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setFormData(prev => ({ ...prev, modelUrl: reader.result as string }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="hidden"
                                                        id="model-upload"
                                                    />
                                                    <label
                                                        htmlFor="model-upload"
                                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.modelUrl ? 'border-sushi-gold bg-sushi-gold/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}`}
                                                    >
                                                        {formData.modelUrl ? (
                                                            <div className="text-center">
                                                                <div className="w-10 h-10 bg-sushi-gold rounded-full flex items-center justify-center mx-auto mb-2 text-black">
                                                                    <Box size={20} />
                                                                </div>
                                                                <span className="text-sm font-medium text-sushi-gold">Model Gereed!</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setFormData(prev => ({ ...prev, modelUrl: undefined }));
                                                                    }}
                                                                    className="text-xs text-red-400 hover:text-red-300 mt-1 block w-full"
                                                                >
                                                                    Verwijder
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                                                <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                                                <p className="text-xs text-gray-300 font-medium">Upload .GLB / .GLTF</p>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>

                                            {/* iOS Model Upload (USDZ) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
                                                    <span>iOS Model (iPhone)</span>
                                                    <span className="text-xs text-gray-500">Optioneel</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept=".usdz"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setFormData(prev => ({ ...prev, usdzUrl: reader.result as string }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="hidden"
                                                        id="usdz-upload"
                                                    />
                                                    <label
                                                        htmlFor="usdz-upload"
                                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.usdzUrl ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}`}
                                                    >
                                                        {formData.usdzUrl ? (
                                                            <div className="text-center">
                                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                                                                    <Box size={20} />
                                                                </div>
                                                                <span className="text-sm font-medium text-blue-400">USDZ Gereed!</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setFormData(prev => ({ ...prev, usdzUrl: undefined }));
                                                                    }}
                                                                    className="text-xs text-red-400 hover:text-red-300 mt-1 block w-full"
                                                                >
                                                                    Verwijder
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                                                <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                                                <p className="text-xs text-gray-300 font-medium">Upload .USDZ</p>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <Tag size={16} className="inline mr-1" />
                                                Naam Gerecht *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="bijv. Spicy Tuna Roll"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <FileText size={16} className="inline mr-1" />
                                                Beschrijving *
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Korte appetijelijke beschrijving..."
                                                rows={3}
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                            />
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                <DollarSign size={16} className="inline mr-1" />
                                                Prijs (€) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.price}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                placeholder="12.50"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sushi-gold focus:outline-none focus:ring-1 focus:ring-sushi-gold transition-all"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={handleAddItem}
                                                className="flex-1 py-3 bg-sushi-gold hover:bg-yellow-400 rounded-lg font-bold text-black transition-colors"
                                            >
                                                Toevoegen
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAdding(false);
                                                    setFormData({
                                                        name: '',
                                                        description: '',
                                                        price: 0,
                                                        category: 'sushi',
                                                        image: null,
                                                        imageFile: null,
                                                        modelUrl: undefined,
                                                        usdzUrl: undefined
                                                    });
                                                }}
                                                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white transition-colors"
                                            >
                                                Annuleren
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Existing Items */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                    <Box size={20} className="text-gray-400" />
                                    Bestaande Gerechten ({menuItems.length})
                                </h2>
                                <div className="space-y-4">
                                    {menuItems.map(item => (
                                        <div key={item.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex gap-4 hover:border-gray-600 transition-colors">
                                            {item.image && (
                                                <div className="relative">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-24 h-24 object-cover rounded-lg bg-gray-900"
                                                    />
                                                    {item.modelUrl && (
                                                        <div className="absolute -top-2 -right-2 bg-sushi-gold text-black p-1 rounded-full shadow-md" title="Heeft 3D model">
                                                            <Box size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-white">{item.name}</h3>
                                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="text-lg font-bold text-sushi-gold">€{item.price.toFixed(2)}</p>
                                                    {item.usdzUrl && (
                                                        <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded border border-blue-800">
                                                            iOS Ready
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="px-4 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-lg h-fit flex items-center gap-2 transition-colors border border-red-900/50"
                                            >
                                                <Trash2 size={16} />
                                                Verwijder
                                            </button>
                                        </div>
                                    ))}
                                    {menuItems.length === 0 && (
                                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                                            <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                                            <p>Nog geen gerechten toegevoegd</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
