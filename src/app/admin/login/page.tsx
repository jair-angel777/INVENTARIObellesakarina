"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, LogIn, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
    const { login: setAuth } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        usuario: "",
        password: ""
    });

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app';
    const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.usuario,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('bellesas_token', data.token);
                setAuth(data.user.rol);
                router.push("/dashboard");
            } else {
                setError(data.error || "Error al iniciar sesión");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError("Falla de conexión con el servidor");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1212] flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 bg-[#2D1616] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Decorative background blast */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 rounded-full blur-[80px]" />
                
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </Link>

                <div className="text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-rose-600/20 text-rose-500 mb-6 border border-rose-500/30">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Acceso Administrativo</h2>
                    <p className="text-white/40 mt-3 font-medium text-sm leading-relaxed px-4">
                        Panel de Gestión y Control de Inventarios para personal autorizado.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-500/20 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 ml-1 uppercase tracking-widest">Usuario Staff</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Ingrese su usuario"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/50 transition-all text-white placeholder:text-white/20"
                                    value={formData.usuario}
                                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 ml-1 uppercase tracking-widest">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/50 transition-all text-white placeholder:text-white/20 tabular-nums"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-rose-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-rose-900/20 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={22} strokeWidth={2.5} />
                                Acceder al Panel
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest pt-4">
                        BellesasKarina Security © 2026
                    </p>
                </form>
            </div>
        </div>
    );
}
