"use client";

import React from "react";
import Link from "next/link";
import { 
    Settings, 
    User, 
    Bell, 
    Shield, 
    ChevronLeft, 
    LogOut,
    Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
    const { userRole } = useAuth();

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 relative">
            {/* Overlay de Bloqueo */}
            <div className="absolute inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <Settings size={48} className="text-stone-300 mb-4 animate-pulse" />
                <h2 className="text-2xl font-black text-stone-800 uppercase tracking-tight">Acceso Privado</h2>
                <p className="text-stone-500 text-sm mt-2">Configuración no disponible en este momento.</p>
                <Link href="/dashboard" className="underline mt-6 font-bold text-stone-900">Regresar</Link>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <header className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest"
                    >
                        <ChevronLeft size={16} /> Volver
                    </Link>
                    <h1 className="text-5xl font-black text-stone-900 italic uppercase tracking-tighter leading-none">
                        Ajustes del <br />
                        <span className="text-stone-400">Sistema</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-2">
                        <button className="w-full flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-2xl text-stone-900 font-black uppercase text-xs tracking-widest shadow-sm">
                            <User size={18} className="text-stone-400" /> Mi Perfil
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-stone-100 rounded-2xl text-stone-400 font-black uppercase text-xs tracking-widest transition-colors">
                            <Bell size={18} /> Notificaciones
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-stone-100 rounded-2xl text-stone-400 font-black uppercase text-xs tracking-widest transition-colors">
                            <Shield size={18} /> Seguridad
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white border border-stone-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
                            <div className="flex items-center gap-6 pb-8 border-b border-stone-50">
                                <div className="w-20 h-20 bg-stone-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black italic">
                                    {userRole?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-stone-900">{userRole === 'GERENTE' ? 'Administrador' : 'Empleado'}</h2>
                                    <p className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black tracking-widest uppercase inline-block border border-blue-100">
                                        {userRole}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-stone-400 font-black uppercase text-[10px] tracking-[0.3em]">Información General</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Rol de Acceso</label>
                                        <div className="bg-stone-50 border border-stone-100 p-4 rounded-xl font-bold text-stone-800 flex items-center justify-between">
                                            {userRole}
                                            <Check size={16} className="text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Estado de Cuenta</label>
                                        <div className="bg-stone-50 border border-stone-100 p-4 rounded-xl font-bold text-emerald-600 flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            Activo y Verificado
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter text-xs hover:scale-105 transition-all shadow-xl shadow-stone-900/10">
                                    Guardar Cambios
                                </button>
                            </div>
                        </section>

                        <button className="w-full bg-red-50 hover:bg-red-100 border border-red-100 p-6 rounded-[2rem] flex items-center justify-center gap-4 text-red-600 font-black uppercase text-xs tracking-widest transition-all active:scale-95 group">
                            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            Cerrar Sesión Global
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
