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
    LogOut,
    Users,
    Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Guard } from "@/context/AuthContext";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { fetchWithAuth } from "@/lib/api";
import { X, Search, DollarSign, Package as PackageIcon, Info } from "lucide-react";

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
            label: "STONKS",
            bloqueado: false
        },
        {
            title: "Ventas",
            description: "Registro de transacciones",
            icon: <ShoppingCart size={32} />,
            href: "/ventas",
            color: "bg-yellow-500",
            hoverColor: "hover:bg-yellow-600",
            lightColor: "bg-yellow-100",
            textColor: "text-yellow-700",
            label: "ETC",
            bloqueado: false
        },
        {
            title: "Proveedores",
            description: "Gestión de contactos comerciales",
            icon: <Truck size={32} />,
            href: "/dashboard/suppliers",
            color: "bg-blue-600",
            hoverColor: "hover:bg-blue-700",
            lightColor: "bg-blue-50",
            textColor: "text-blue-700",
            label: "NUEVO",
            bloqueado: false
        },
        {
            title: "Movimientos",
            description: "Historial de entradas y salidas",
            icon: <ArrowLeftRight size={32} />,
            href: "/dashboard/suppliers/orders",
            color: "bg-red-500",
            hoverColor: "hover:bg-red-600",
            lightColor: "bg-red-100",
            textColor: "text-red-700",
            label: "PEDIDOS",
            bloqueado: false
        },
        {
            title: "Empleados",
            description: "Control de personal y accesos",
            icon: <Users size={32} />,
            href: "/dashboard/employees",
            color: "bg-indigo-600",
            hoverColor: "hover:bg-indigo-700",
            lightColor: "bg-indigo-50",
            textColor: "text-indigo-700",
            label: "NUEVO",
            bloqueado: false
        },
        {
            title: "Reportes",
            description: "Análisis y estadísticas",
            icon: <BarChart3 size={32} />,
            href: "/dashboard/reports",
            color: "bg-rose-900",
            hoverColor: "hover:bg-rose-950",
            lightColor: "bg-rose-100",
            textColor: "text-rose-900",
            label: "ESTADÍSTICAS",
            dark: true,
            bloqueado: true
        },
        {
            title: "Ajustes",
            description: "Configuración del sistema",
            icon: <Settings size={32} />,
            href: "/dashboard/settings",
            color: "bg-[#E6D5B8]",
            hoverColor: "hover:bg-[#D4C4A8]",
            lightColor: "bg-[#F3EAD8]",
            textColor: "text-stone-700",
            label: "PERFIL",
            bloqueado: true
        },
        {
            title: "Categorías",
            description: "Organización de catálogo",
            icon: <Layers size={32} />,
            href: "/dashboard/categories",
            color: "bg-emerald-600",
            hoverColor: "hover:bg-emerald-700",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-700",
            label: "GESTIÓN",
            bloqueado: false
        }
    ];

    const [scannedProduct, setScannedProduct] = React.useState<any>(null);
    const [scanning, setScanning] = React.useState(false);

    const handleScan = async (code: string) => {
        setScanning(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
            // Buscamos productos que coincidan con el SKU
            const res = await fetchWithAuth(`${apiUrl}/products`);
            if (res.ok) {
                const products = await res.json();
                const product = products.find((p: any) => p.sku === code || p.id === code);

                if (product) {
                    setScannedProduct(product);
                } else {
                    console.log("Producto no encontrado:", code);
                    // Opcional: Mostrar un toast o alerta discreta
                }
            }
        } catch (error) {
            console.error("Error al buscar producto escaneado:", error);
        } finally {
            setScanning(false);
        }
    };

    return (
        <Guard roles={['GERENTE', 'EMPLEADO']}>
            <BarcodeScanner onScan={handleScan} />

            {/* Modal de Producto Escaneado */}
            {scannedProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-300">
                        <div className="relative h-64 bg-stone-100">
                            {scannedProduct.imagen ? (
                                <img
                                    src={scannedProduct.imagen}
                                    alt={scannedProduct.nombre}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                    <PackageIcon size={64} strokeWidth={1} />
                                </div>
                            )}
                            <button
                                onClick={() => setScannedProduct(null)}
                                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-stone-900 hover:bg-white transition-colors shadow-lg"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-4">
                                <span className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
                                    Escaneado: {scannedProduct.sku}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
                                    {scannedProduct.nombre}
                                </h2>
                                <p className="text-stone-500 font-medium">{scannedProduct.categoria}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Precio</p>
                                    <p className="text-2xl font-black text-orange-900 flex items-center">
                                        <span className="text-sm mr-1">S/</span>
                                        {scannedProduct.precio.toFixed(2)}
                                    </p>
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl border",
                                    scannedProduct.stock <= (scannedProduct.stock_minimo || 5)
                                        ? "bg-red-50 border-red-100"
                                        : "bg-emerald-50 border-emerald-100"
                                )}>
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest mb-1",
                                        scannedProduct.stock <= (scannedProduct.stock_minimo || 5) ? "text-red-600" : "text-emerald-600"
                                    )}>Stock Actual</p>
                                    <p className={cn(
                                        "text-2xl font-black flex items-center",
                                        scannedProduct.stock <= (scannedProduct.stock_minimo || 5) ? "text-red-900" : "text-emerald-900"
                                    )}>
                                        {scannedProduct.stock}
                                        <span className="text-xs ml-2 font-bold uppercase opacity-60">unids</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href={`/dashboard/inventory?edit=${scannedProduct.id}`}
                                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-2xl font-bold text-center transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Editar Producto
                                </Link>
                                <button
                                    onClick={() => setScannedProduct(null)}
                                    className="px-6 py-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-bold transition-all"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 selection:bg-orange-500/30">
                <div className="max-w-7xl mx-auto space-y-12">
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

                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="p-3 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95 group"
                                title="Ir al Inicio"
                            >
                                <LayoutDashboard size={24} />
                            </Link>
                            <Link
                                href="/"
                                className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 group"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                            </Link>
                        </div>
                    </header>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.bloqueado ? "#" : item.href}
                                className={cn(
                                    "group relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 transition-all h-full flex flex-col",
                                    item.bloqueado ?
                                        "cursor-not-allowed opacity-60 grayscale"
                                        : "hover:-translate-y-2 hover:shadow-2xl active:scale-95",
                                    item.href === "#" && !item.bloqueado ? "cursor-not-allowed opacity-90" : ""

                                )}
                            >
                                <div className={cn(
                                    "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
                                    item.color
                                )} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                                            item.dark ? "bg-rose-900 text-white" : `${item.lightColor} ${item.textColor}`
                                        )}>
                                            {item.icon}
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black tracking-[0.15em] transition-all",
                                            item.bloqueado ? "bg-stone-100 text-stone-500" : (item.dark ? "bg-rose-100 text-rose-900" : `${item.lightColor} text-white`)
                                        )}>
                                            {item.bloqueado ? "En trabajo" : item.label}
                                        </span>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-xl font-bold text-stone-900 mb-1 group-hover:text-orange-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-stone-500 text-xs font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 text-stone-300 group-hover:text-orange-500 group-hover:translate-x-2 transition-all">
                                        <div className="h-px w-8 bg-current" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Abrir</span>
                                    </div>
                                </div>
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
            </div>
        </Guard>
    );
}
