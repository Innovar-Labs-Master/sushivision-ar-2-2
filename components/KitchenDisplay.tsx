import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle2, ChefHat, Bell, Utensils, ArrowLeft } from 'lucide-react';
import useStore from '../store/store';

interface Props {
    orders: Order[];
    onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
    onToggleItemComplete: (orderId: string, itemId: string) => void;
    onBack: () => void;
}

const KitchenDisplay: React.FC<Props> = ({ orders, onUpdateStatus, onToggleItemComplete, onBack }) => {
    const { kitchenOptimization } = useStore();
    const activeOrders = orders.filter(o => o.status !== 'ready').sort((a, b) => a.timestamp - b.timestamp);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'received': return 'bg-red-900/50 text-red-200 border-red-800';
            case 'preparing': return 'bg-yellow-900/50 text-yellow-200 border-yellow-800';
            case 'quality_check': return 'bg-blue-900/50 text-blue-200 border-blue-800';
            case 'ready': return 'bg-green-900/50 text-green-200 border-green-800';
            default: return 'bg-gray-800 text-gray-400';
        }
    };

    const getNextStatus = (current: OrderStatus): OrderStatus | null => {
        if (current === 'received') return 'preparing';
        if (current === 'preparing') return 'quality_check';
        if (current === 'quality_check') return 'ready';
        return null;
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ChefHat className="text-sushi-gold" size={32} />
                        Kitchen Display System
                    </h1>
                </div>
                <div className="flex gap-4 text-sm font-mono">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                        <span>Live Orders: {activeOrders.length}</span>
                    </div>
                    <div className="text-gray-400">
                        {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {kitchenOptimization && (
                    <div className="rounded-xl border-2 border-purple-500/50 bg-purple-950/20 overflow-hidden flex flex-col">
                        <div className="p-4 bg-purple-900/30">
                            <h3 className="font-bold text-lg text-purple-200">Geoptimaliseerde Taak</h3>
                            <p className="text-xs text-purple-400">Gegroepeerd door AI</p>
                        </div>
                        <div className="p-4 space-y-2">
                            <p className="font-semibold text-white">Maak nu: 5x Spicy Tuna Roll</p>
                            <p className="text-xs text-gray-400">Voor bestellingen: #1234, #1236, #1237</p>
                        </div>
                    </div>
                )}

                {activeOrders.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500 opacity-50">
                        <Utensils size={64} className="mb-4" />
                        <p className="text-xl">Geen actieve bestellingen</p>
                        <p className="text-sm">Klaar om te koken!</p>
                    </div>
                )}

                {activeOrders.map(order => (
                    <div key={order.id} className={`rounded-xl border-2 overflow-hidden flex flex-col ${order.status === 'received' ? 'border-red-500/50 bg-red-950/10 animate-in fade-in slide-in-from-bottom-4' :
                            'border-gray-700 bg-gray-800'
                        }`}>
                        {/* Order Header */}
                        <div className={`p-4 flex justify-between items-start border-b border-gray-700 ${order.status === 'received' ? 'bg-red-900/20' : 'bg-gray-900/50'
                            }`}>
                            <div>
                                <h3 className="font-bold text-lg">Bestelling #{order.id.slice(-4)}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                    <Clock size={12} />
                                    <span>{formatTime(order.timestamp)}</span>
                                    {order.tableNumber && (
                                        <span className="bg-gray-700 px-1.5 py-0.5 rounded text-white">T{order.tableNumber}</span>
                                    )}
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Order Items with Checkboxes */}
                        <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-3 items-start">
                                    <input
                                        type="checkbox"
                                        checked={item.completed || false}
                                        onChange={() => onToggleItemComplete(order.id, item.id)}
                                        className="mt-1 w-5 h-5 rounded border-gray-600 text-sushi-gold focus:ring-sushi-gold focus:ring-offset-gray-900 cursor-pointer"
                                    />
                                    <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                        {item.quantity}x
                                    </div>
                                    <div className={item.completed ? 'opacity-50 line-through' : ''}>
                                        <p className="font-medium text-white">{item.dishName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.details}</p>
                                        {item.isCustom && (
                                            <span className="text-[10px] text-sushi-gold border border-sushi-gold/30 px-1 rounded ml-1">CUSTOM</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-gray-700 bg-gray-900/30 mt-auto">
                            {getNextStatus(order.status) ? (
                                <button
                                    onClick={() => onUpdateStatus(order.id, getNextStatus(order.status)!)}
                                    className="w-full py-3 bg-sushi-gold hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>Volgende Fase</span>
                                    <ArrowLeft className="rotate-180" size={16} />
                                </button>
                            ) : (
                                <div className="text-center text-green-400 font-bold flex items-center justify-center gap-2 py-2">
                                    <CheckCircle2 size={20} />
                                    Bestelling Klaar
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KitchenDisplay;
