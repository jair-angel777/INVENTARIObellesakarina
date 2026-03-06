'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'GERENTE' | 'EMPLEADO';

interface AuthContextType {
    userRole: Role | null;
    isManager: boolean;
    login: (role: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userRole, setUserRole] = useState<Role | null>(null);

    useEffect(() => {
        const savedRole = localStorage.getItem('user_role') as Role;
        if (savedRole) setUserRole(savedRole);
    }, []);

    const login = (role: Role) => {
        localStorage.setItem('user_role', role);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.removeItem('user_role');
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{
            userRole,
            isManager: userRole === 'GERENTE',
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

// Helper para ocultar contenido según rol
export function Guard({ roles, children, fallback = null }: { roles: Role[], children: React.ReactNode, fallback?: React.ReactNode }) {
    const { userRole } = useAuth();
    if (!userRole || !roles.includes(userRole)) return fallback;
    return <>{children}</>;
}
