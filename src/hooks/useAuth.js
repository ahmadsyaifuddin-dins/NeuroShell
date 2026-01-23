import { useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('neuro_access_token') === 'GRANTED';
    });

    const login = () => {
        localStorage.setItem('neuro_access_token', 'GRANTED');
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('neuro_access_token');
        setIsAuthenticated(false);
    };

    return { isAuthenticated, login, logout };
}