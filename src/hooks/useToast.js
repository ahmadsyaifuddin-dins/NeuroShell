// src/hooks/useToast.js
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    
    // Return object dengan fungsi shortcut
    return {
        showToast: context.addToast,
        success: (msg) => context.addToast(msg, 'success'),
        error: (msg) => context.addToast(msg, 'error'),
        warning: (msg) => context.addToast(msg, 'warning'),
    };
}