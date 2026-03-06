"use client";

import React from "react";
import Link from "next/link";
import {
    Package,
    ShoppingCart,
    Layers,
    ArrowLeftRight,
    BarChart3,
    Settings,
    LayoutDashboard,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectionPanel() {
    const menuItems = [
        {
            title: "Inventario",
            description: "Control de stock y productos",
            icon: <Package size={32} />,
            href: "/dashboard/inventory",
            color: "bg-orange-500",
            hoverColor: "hover:bg-orange-600",
            lightColor: "bg-orange-100",
            textColor: "text-orange-700",
            label: "STONKS"
        },
        {
            title: "Ventas",
            description: "Registro de transacciones",
            icon: <ShoppingCart size={32} />,
            href: "#",
            color: "bg-yellow-500",
            hoverColor: "hover:bg-yellow-600",
            lightColor: "bg-yellow-100",
            textColor: "text-yellow-700",
            label: "ETC"
        },
        {
            title: "Categorías",
            description: "Organización de catálogo",
            icon: <Layers size={32} />,
            href: "#",
            color: "bg-amber-400",
            hoverColor: "hover:bg-amber-500",
            lightColor: "bg-amber-100",
            textColor: "text-amber-700",
            label: "ETC"
        },
        {
            title: "Movimientos",
            description: "Historial de entradas y salidas",
            icon: <ArrowLeftRight size={32} />,
            href: "#",
            color: "bg-red-500",
            hoverColor: "hover:bg-red-600",
            lightColor: "bg-red-100",
            textColor: "text-red-700",
            label: "ETC"
        },
        {
            title: "Reportes",
            description: "Análisis y estadísticas",
            icon: <BarChart3 size={32} />,
            href: "#",
            color: "bg-rose-900",
            hoverColor: "hover:bg-rose-950",
            lightColor: "bg-rose-100",
            textColor: "text-rose-900",
            label: "ETC",
            dark: true
        },
        {
            title: "Ajustes",
            description: "Configuración del sistema",
            icon: <Settings size={32} />,
            href: "#",
            color: "bg-[#E6D5B8]",
            hoverColor: "hover:bg-[#D4C4A8]",
            lightColor: "bg-[#F3EAD8]",
            textColor: "text-stone-700",
            label: "ETC"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 selection:bg-orange-500/30">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
                            <LayoutDashboard size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
                                Panel de Control
                            </h1>
                            <p className="text-stone-500 font-medium tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                BellesasKarina — General Manager
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 group"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                    </Link>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "group relative overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/5",
                                item.href === "#" ? "cursor-not-allowed opacity-80" : "active:scale-95"
                            )}
                        >
                            {/* Background Pattern Hint */}
                            <div className={cn(
                                "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
                                item.color
                            )} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn(
                                        "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                                        item.dark ? "bg-rose-900 text-white" : `${item.lightColor} ${item.textColor}`
                                    )}>
                                        {item.icon}
                                    </div>
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] transition-all",
                                        item.dark
                                            ? "bg-rose-100 text-rose-900"
                                            : `${item.color} text-white shadow-lg shadow-black/5`
                                    )}>
                                        {item.label}
                                    </span>
                                </div>

                                <div className="mt-auto">
                                    <h3 className="text-2xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-stone-500 text-sm font-medium leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Arrow Indication */}
                                <div className="mt-8 flex items-center gap-2 text-stone-300 group-hover:text-orange-500 group-hover:translate-x-2 transition-all">
                                    <div className="h-px w-12 bg-current" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Abrir</span>
                                </div>
                            </div>

                            {/* Decorative Corner Element */}
                            <div className={cn(
                                "absolute bottom-0 right-0 w-24 h-24 translate-x-12 translate-y-12 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-150 group-hover:-translate-x-0 group-hover:-translate-y-0",
                                item.color
                            )} />
                        </Link>
                    ))}
                </div>

                {/* Footer Info */}
                <footer className="pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-400 text-sm font-medium">
                    <p>© 2026 BellesasKarina System — v2.0.0-Gold</p>
                    <div className="flex gap-6">
                        <span className="hover:text-stone-600 transition-colors cursor-help">Centro de Ayuda</span>
                        <span className="hover:text-stone-600 transition-colors cursor-help">Logs de Auditoría</span>
                    </div>
                </footer>
            </div>

            {/* Global Aesthetics */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
}
