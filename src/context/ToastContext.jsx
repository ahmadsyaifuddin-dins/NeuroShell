// src/context/ToastContext.jsx
import { createContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove setelah 3 detik
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* TOAST CONTAINER (FIXED POSITION) */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// SUB-COMPONENT: UI ITEM PER TOAST
function ToastItem({ message, type, onClose }) {
    // Tentukan Style berdasarkan Tipe
    const styles = {
        success: {
            border: 'border-neuro-green',
            bg: 'bg-neuro-black',
            text: 'text-neuro-green',
            shadow: 'shadow-[0_0_20px_rgba(0,255,65,0.3)]',
            icon: <CheckCircle size={18} />
        },
        error: {
            border: 'border-neuro-red',
            bg: 'bg-neuro-black',
            text: 'text-neuro-red',
            shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
            icon: <AlertOctagon size={18} />
        },
        warning: {
            border: 'border-yellow-500',
            bg: 'bg-neuro-black',
            text: 'text-yellow-500',
            shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
            icon: <AlertTriangle size={18} />
        }
    };

    const style = styles[type] || styles.success;

    return (
        <div className={`pointer-events-auto min-w-[300px] max-w-sm flex items-center gap-3 p-4 rounded border ${style.border} ${style.bg} ${style.shadow} animate-slideIn backdrop-blur-md`}>
            <div className={`${style.text}`}>
                {style.icon}
            </div>
            <div className="flex-1">
                <p className={`text-xs font-bold font-mono ${style.text}`}>
                    {type === 'error' ? '>> SYSTEM ERROR' : '>> SYSTEM NOTIFICATION'}
                </p>
                <p className="text-sm font-bold text-white font-mono mt-1">
                    {message}
                </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition">
                <X size={16} />
            </button>
        </div>
    );
}