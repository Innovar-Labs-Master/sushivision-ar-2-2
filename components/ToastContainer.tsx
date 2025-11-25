import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { toast, Toast, ToastType } from '../utils/toast';

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-700';
      case 'error':
        return 'bg-red-900/90 border-red-700';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-700';
      case 'info':
        return 'bg-blue-900/90 border-blue-700';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {toasts.map(toastItem => (
        <div
          key={toastItem.id}
          className={`
            ${getBgColor(toastItem.type)}
            border rounded-lg p-4 shadow-lg
            flex items-start gap-3
            animate-in slide-in-from-right fade-in
          `}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toastItem.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">
              {toastItem.message}
            </p>
          </div>
          
          <button
            onClick={() => toast.remove(toastItem.id)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            aria-label="Sluiten"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

