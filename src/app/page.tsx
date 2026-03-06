"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        usuario: "",
        password: ""
    });

    // Credenciales ficticias del Gerente General
    const CREDENCIALES_GERENTE = {
        usuario: "gerente",
        password: "123"
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulamos un retraso de red para que se vea profesional
        setTimeout(() => {
            if (
                formData.usuario === CREDENCIALES_GERENTE.usuario &&
                formData.password === CREDENCIALES_GERENTE.password
            ) {
                // Éxito: Redirigimos al Dashboard (NUEVA RUTA)
                router.push("/dashboard");
            } else {
                setError("Usuario o contraseña incorrectos");
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-orange-200 shadow-xl shadow-orange-900/5">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-stone-900">Seguridad</h2>
                    <p className="text-stone-500 mt-2">Acceso exclusivo: Gerente General</p>
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
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-stone-50 border border-orange-100 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all text-stone-800 tabular-nums"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={22} />
                                Entrar al Sistema
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-stone-400">
                        BellesasKarina © 2026 - Módulo de Seguridad Interno
                    </p>
                </form>
            </div>
        </div>
    );
}
