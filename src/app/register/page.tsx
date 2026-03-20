"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, Mail, ChevronLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        nombre: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app";
    const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl.replace(/\/$/, "")}/api`;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setError(data.error || "Error al registrarse");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-stone-100 text-center space-y-6 max-w-md animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-stone-900">¡Bienvenido!</h2>
                    <p className="text-stone-500 font-bold text-sm">Tu cuenta ha sido creada con éxito. <br /> Redirigiéndote al inicio de sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row">
            {/* Left Side: Art/Vibe */}
            <div className="hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full translate-x-32 -translate-y-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full -translate-x-32 translate-y-32 blur-3xl opacity-50" />
                
                <div className="relative z-10 text-white max-w-md space-y-8">
                    <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
                        Únete a la <br />
                        <span className="text-blue-200 text-8xl">Belleza</span>
                    </h1>
                    <p className="text-blue-100 font-bold uppercase text-xs tracking-[0.3em]">
                        Crea tu cuenta para acceder a nuestro catálogo exclusivo y ofertas especiales.
                    </p>
                    <div className="pt-8 flex gap-4">
                        <div className="h-1 w-12 bg-white rounded-full" />
                        <div className="h-1 w-4 bg-white/30 rounded-full" />
                        <div className="h-1 w-4 bg-white/30 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <header className="space-y-4">
                        <Link href="/login" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest">
                            <ChevronLeft size={16} /> Volver al Login
                        </Link>
                        <h2 className="text-5xl font-black text-stone-900 italic uppercase tracking-tighter">Crear Cuenta</h2>
                        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                            Forma parte de BELLESA KARINA y gestiona tus pedidos fácilmente.
                        </p>
                    </header>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-bounce flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-600 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Tu nombre aquí"
                                        className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-sm"
                                        value={form.nombre}
                                        onChange={(e) => setForm({...form, nombre: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Usuario</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="usuario123"
                                        className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-sm"
                                        value={form.username}
                                        onChange={(e) => setForm({...form, username: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        className="w-full bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-sm"
                                        value={form.password}
                                        onChange={(e) => setForm({...form, password: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Registrarme
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <footer className="pt-10 text-center">
                        <p className="text-stone-400 font-bold uppercase text-[9px] tracking-[0.2em]">
                            Hecho con ❤️ por Bellesa Karina Team
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
