"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    LayoutDashboard, 
    ArrowLeft, 
    ShoppingCart, 
    Calendar, 
    User, 
    CreditCard, 
    ChevronDown, 
    Package,
    TrendingUp,
    DollarSign,
    ShoppingBag
} from "lucide-react";

interface SaleDetail {
    id: string;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface Sale {
    id: string;
    fecha: string;
    cliente_nombre: string;
    total: number;
    metodo_pago: string;
    detalles: SaleDetail[];
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedSale, setExpandedSale] = useState<string | null>(null);

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app').replace(/\/$/, '') + '/api';

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/sales`);
            if (res.ok) {
                const data = await res.json();
                setSales(data);
            }
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalItems = sales.reduce((acc, sale) => acc + sale.detalles.reduce((a, d) => a + d.cantidad, 0), 0);

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans text-stone-900">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/dashboard"
                            className="w-10 h-10 bg-white border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Historial de Ventas</h1>
                            <p className="text-stone-500 text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Registro de transacciones del catálogo
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                <DollarSign size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-none mb-1">Ingresos Totales</p>
                                <p className="text-lg font-bold text-stone-900 leading-none">S/ {totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                                <ShoppingBag size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-none mb-1">Items Vendidos</p>
                                <p className="text-lg font-bold text-stone-900 leading-none">{totalItems}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sales List */}
                <div className="bg-white rounded-[2rem] border border-stone-200 shadow-xl shadow-stone-900/5 overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 opacity-40">
                             <div className="w-8 h-8 border-4 border-stone-200 border-t-orange-500 rounded-full animate-spin" />
                             <p className="text-[10px] font-black uppercase tracking-widest">Cargando transacciones...</p>
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="p-20 text-center space-y-4 opacity-40 grayscale">
                            <ShoppingCart size={48} className="mx-auto" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-widest">No hay ventas registradas aún</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-stone-50/50 border-b border-stone-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Fecha</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Cliente</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Método</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Total</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 text-right">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {sales.map((sale) => (
                                        <React.Fragment key={sale.id}>
                                            <tr className="hover:bg-stone-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar size={16} className="text-stone-300" />
                                                        <span className="text-sm font-medium text-stone-600">
                                                            {new Date(sale.fecha).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 font-bold text-xs uppercase tracking-tighter">
                                                            {sale.cliente_nombre?.charAt(0) || 'C'}
                                                        </div>
                                                        <span className="text-sm font-bold text-stone-900">{sale.cliente_nombre || 'Consumidor Final'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard size={14} className="text-stone-400" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                                                            {sale.metodo_pago}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-black text-rose-600 italic">S/ {sale.total.toFixed(2)}</span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
                                                        className="p-2 hover:bg-white border border-transparent hover:border-stone-200 rounded-xl transition-all group-hover:scale-110 active:scale-95"
                                                    >
                                                        <ChevronDown size={18} className={`text-stone-400 transition-transform duration-300 ${expandedSale === sale.id ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedSale === sale.id && (
                                                <tr className="bg-stone-50/50">
                                                    <td colSpan={5} className="px-8 py-8 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-inner mx-4">
                                                            <div className="flex items-center gap-2 mb-6">
                                                                <Package size={16} className="text-rose-500" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">Productos en esta venta</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {sale.detalles.map((detalle) => (
                                                                    <div key={detalle.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="w-6 h-6 bg-stone-100 text-stone-500 rounded flex items-center justify-center text-[10px] font-bold">
                                                                                {detalle.cantidad}x
                                                                            </span>
                                                                            <span className="text-xs font-bold text-stone-700">{detalle.nombre_producto}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-8">
                                                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">S/ {detalle.precio_unitario.toFixed(2)} /u</span>
                                                                            <span className="text-sm font-bold text-stone-900 italic">S/ {detalle.subtotal.toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-6 pt-6 border-t border-stone-100 flex justify-end gap-10 bg-white">
                                                                <div className="text-right">
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Monto Neto</p>
                                                                    <p className="text-xl font-black text-rose-500 italic">S/ {sale.total.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <footer className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400 pt-8 border-t border-stone-200">
                    <p>BellesasKarina — Sistema de Ventas Digital</p>
                    <div className="flex gap-4">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span>Actualizado en tiempo real</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
