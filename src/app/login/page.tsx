"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
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
                // Éxito: Guardar sesión y redirigir
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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative">
            <div className="absolute top-8 left-8">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-stone-400 hover:text-rose-600 transition-colors text-xs font-black uppercase tracking-widest group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Inicio
                </Link>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-orange-100 shadow-xl shadow-orange-900/5">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <User size={32} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Bienvenido</h2>
                    <p className="text-stone-500 mt-3 font-medium text-sm leading-relaxed px-4">
                        Inicia sesión para acceder a tus pedidos y beneficios exclusivos de Bellesas Karina.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-shake">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Nombre de Usuario</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Ingrese su usuario"
                                    className="w-full bg-stone-50 border border-orange-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all text-stone-800"
                                    value={formData.usuario}
                                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/40 transition-all text-stone-800 tabular-nums"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <Link href="#" className="text-xs font-bold text-rose-600 hover:underline">¿Olvidaste tu contraseña?</Link>
                        <Link href="/register" className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors">Crear Cuenta</Link>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-stone-900/10 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={22} strokeWidth={2.5} />
                                Iniciar Sesión
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest pt-4">
                        BellesasKarina © 2026
                    </p>
                    <div className="pt-6 border-t border-stone-100 mt-6 flex justify-center">
                        <Link href="/admin/login" className="text-[10px] font-bold text-stone-300 hover:text-stone-900 transition-colors uppercase tracking-[0.2em]">
                            Acceso Staff
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
