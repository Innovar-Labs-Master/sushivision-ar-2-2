
import React, { useState } from 'react';
import { CartItem } from '../types';
import { Trash2, CreditCard, Wallet, CheckCircle2, ArrowLeft, Store, Truck } from 'lucide-react';

interface Props {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}

const Cart: React.FC<Props> = ({ items, onRemove, onUpdateQuantity, onCheckout, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    zip: '',
    city: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    // For pickup: only name and phone required
    if (orderType === 'pickup') {
      if (!deliveryDetails.name.trim()) {
        newErrors.name = true;
        isValid = false;
      }
      if (!deliveryDetails.phone.trim()) {
        newErrors.phone = true;
        isValid = false;
      }
    } else {
      // For delivery: all fields required
      Object.entries(deliveryDetails).forEach(([key, value]) => {
        if (!(value as string).trim()) {
          newErrors[key] = true;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = () => {
    if (!validateForm()) {
      // Scroll to top of form or show error toast
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onCheckout();
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6">
          <Wallet className="text-gray-600" size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Your order is empty</h2>
        <p className="text-gray-400 mb-8">Start adding delicious dishes to your tab.</p>
        <button
          onClick={onBack}
          className="px-8 py-3 bg-sushi-gold text-black font-bold rounded-lg hover:brightness-110 transition-all"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] pb-32 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Current Order</h1>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.dishName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <CheckCircle2 />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white truncate">{item.dishName}</h3>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 my-1">{item.details}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sushi-gold font-mono">€{item.price.toFixed(2)}</span>
                  <div className="flex items-center gap-2 bg-gray-800 rounded-lg border border-gray-700">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-l-lg"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-white min-w-[2ch] text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Type Selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-sushi-gold rounded-full"></span>
            Kies Afhaal of Levering
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOrderType('pickup')}
              className={`p-4 rounded-xl border-2 transition-all ${orderType === 'pickup'
                ? 'border-sushi-gold bg-sushi-gold/10 text-white'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
            >
              <Store size={32} className={`mx-auto mb-2 ${orderType === 'pickup' ? 'text-sushi-gold' : ''}`} />
              <p className="font-bold">Afhalen</p>
              <p className="text-xs mt-1 opacity-75">Ter plaatse ophalen</p>
            </button>

            <button
              onClick={() => setOrderType('delivery')}
              className={`p-4 rounded-xl border-2 transition-all ${orderType === 'delivery'
                ? 'border-sushi-gold bg-sushi-gold/10 text-white'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
            >
              <Truck size={32} className={`mx-auto mb-2 ${orderType === 'delivery' ? 'text-sushi-gold' : ''}`} />
              <p className="font-bold">Levering</p>
              <p className="text-xs mt-1 opacity-75">Thuisbezorgd</p>
            </button>
          </div>
        </div>

        {/* Customer Details Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-sushi-gold rounded-full"></span>
            {orderType === 'pickup' ? 'Jouw Gegevens' : 'Bezorggegevens'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Naam *</label>
              <input
                type="text"
                name="name"
                value={deliveryDetails.name}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:outline-none focus:border-sushi-gold transition-colors`}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Telefoonnummer *</label>
              <input
                type="tel"
                name="phone"
                value={deliveryDetails.phone}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:outline-none focus:border-sushi-gold transition-colors`}
                placeholder="+31 6 12345678"
              />
            </div>

            {orderType === 'delivery' && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Adres *</label>
                  <input
                    type="text"
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:outline-none focus:border-sushi-gold transition-colors`}
                    placeholder="Straat & Nummer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Postcode *</label>
                    <input
                      type="text"
                      name="zip"
                      value={deliveryDetails.zip}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${errors.zip ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:outline-none focus:border-sushi-gold transition-colors`}
                      placeholder="1234 AB"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Plaats *</label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryDetails.city}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${errors.city ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:outline-none focus:border-sushi-gold transition-colors`}
                      placeholder="Amsterdam"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={deliveryDetails.email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-white focus:outline-none focus:border-sushi-gold transition-colors`}
                    placeholder="john@example.com"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary & Payment */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="text-3xl font-serif font-bold text-white">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing Payment...</span>
            ) : (
              <>
                <CreditCard size={20} />
                Pay ${total.toFixed(2)}
              </>
            )}
          </button>

          <div className="flex gap-2 justify-center pt-2">
            <button className="p-3 bg-black rounded-lg border border-gray-700 w-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="font-bold text-white flex items-center gap-1"><span className="text-white fill-white"></span> Pay</span>
            </button>
            <button className="p-3 bg-black rounded-lg border border-gray-700 w-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="font-bold text-white flex items-center gap-1"><span className="text-blue-500">G</span> Pay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
