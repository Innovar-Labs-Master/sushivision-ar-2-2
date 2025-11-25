
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle2, ChefHat, Bell, Utensils, ArrowLeft } from 'lucide-react';

interface Props {
  order?: Order;
  onComplete: () => void;
}

const OrderTracker: React.FC<Props> = ({ order, onComplete }) => {
  // Fallback if no order is found (shouldn't happen in normal flow)
  if (!order) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <p>Order not found.</p>
        <button onClick={onComplete} className="ml-4 underline">Go Back</button>
      </div>
    );
  }

  const [timeLeft, setTimeLeft] = useState(15); // Mock timer for visual effect

  useEffect(() => {
    if (order.status === 'ready') {
      // Maybe trigger confetti or something?
    }
  }, [order.status]);

  const getStepColor = (stepStatus: OrderStatus) => {
    const stages: OrderStatus[] = ['received', 'preparing', 'quality_check', 'ready'];
    const currentIndex = stages.indexOf(order.status);
    const stepIndex = stages.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'bg-green-500 text-black border-green-500';
    if (stepIndex === currentIndex) return 'bg-sushi-gold text-black border-sushi-gold animate-pulse';
    return 'bg-gray-800 text-gray-500 border-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-12">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Order #{order.id.slice(-4)}</h2>
          <p className="text-gray-400">Table {order.tableNumber}</p>
        </div>

        {/* Timer Circle (Visual Only) */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-sushi-gold transition-all duration-1000 ease-linear"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - (['received', 'preparing', 'quality_check', 'ready'].indexOf(order.status) + 1) / 4)}
            />
          </svg>
          <div className="text-center z-10">
            <span className="block text-4xl font-mono font-bold text-white mb-2">
              {order.status === 'ready' ? 'ENJOY!' : 'COOKING'}
            </span>
            <span className="text-gray-400 uppercase tracking-widest text-xs">Status</span>
          </div>
        </div>

        {/* Status Steps */}
        <div className="w-full space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${getStepColor('received')}`}>
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold">Order Received</h4>
              <p className="text-xs text-gray-500">Kitchen has your ticket</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${getStepColor('preparing')}`}>
              <ChefHat size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold">Preparing</h4>
              <p className="text-xs text-gray-500">Chef is crafting your dish</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${getStepColor('quality_check')}`}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold">Quality Check</h4>
              <p className="text-xs text-gray-500">Final touches & plating</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${getStepColor('ready')}`}>
              <Utensils size={18} />
            </div>
            <div>
              <h4 className="text-white font-bold">Serving</h4>
              <p className="text-xs text-gray-500">Heading to your table</p>
            </div>
          </div>
        </div>

        {order.status === 'ready' && (
          <button
            onClick={onComplete}
            className="w-full py-4 bg-sushi-gold text-black font-bold rounded-xl hover:bg-yellow-400 transition-all animate-in fade-in slide-in-from-bottom-4"
          >
            Leave a Review
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
