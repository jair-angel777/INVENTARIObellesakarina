"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
    ChevronLeft,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app';
    const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await fetchWithAuth(`${API_URL}/sales`);
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

    const totalIncome = sales.reduce((acc, s) => acc + s.total, 0);
    const totalTransactions = sales.length;

    // Simplificación: últimos 30 días vs anteriores
    // Para una demo, solo mostraremos los totales y una lista de ventas recientes

    const recentSales = sales.slice(0, 10);

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 relative">
            {/* Overlay de Bloqueo */}
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-3xl flex items-center justify-center mb-6">
                    <BarChart3 size={40} />
                </div>
                <h2 className="text-3xl font-black text-stone-900 italic uppercase tracking-tighter mb-2">Sección Restringida</h2>
                <p className="text-stone-500 max-w-xs font-medium">Esta función está temporalmente deshabilitada por mantenimiento o falta de permisos.</p>
                <Link href="/dashboard" className="mt-8 px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                    Volver al Panel
                </Link>
            </div>

            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <header className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest"
                    >
                        <ChevronLeft size={16} /> Volver
                    </Link>
                    <h1 className="text-5xl font-black text-stone-900 italic uppercase tracking-tighter leading-none">
                        Reportes & <br />
                        <span className="text-rose-600">Analíticas</span>
                    </h1>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                <DollarSign size={28} />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
                                <ArrowUpRight size={16} /> +12%
                            </div>
                        </div>
                        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest mb-1">Ingresos Totales</p>
                        <h3 className="text-4xl font-black text-stone-900 italic tracking-tighter">{formatCurrency(totalIncome)}</h3>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <TrendingUp size={28} />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
                                <ArrowUpRight size={16} /> +5%
                            </div>
                        </div>
                        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest mb-1">Transacciones</p>
                        <h3 className="text-4xl font-black text-stone-900 italic tracking-tighter">{totalTransactions}</h3>
                    </div>

                    <div className="bg-rose-900 p-8 rounded-[2.5rem] text-white shadow-xl hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between">
                        <div>
                            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2">Generar PDF</h4>
                            <p className="text-rose-200 text-xs font-bold leading-relaxed">Descarga un reporte detallado del mes actual para contabilidad.</p>
                        </div>
                        <button className="mt-6 bg-white text-rose-900 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-rose-50 transition-colors">
                            Descargar Ahora
                        </button>
                    </div>
                </div>

                {/* Recent Sales Table */}
                <div className="bg-white border border-stone-100 rounded-[3rem] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-stone-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-stone-900 uppercase italic tracking-tight">Ventas Recientes</h3>
                        <div className="flex items-center gap-2 text-stone-400 text-xs font-bold">
                            <Calendar size={16} /> Últimos 7 días
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-widest border-b border-stone-50">
                                    <th className="px-8 py-5">ID Venta</th>
                                    <th className="px-8 py-5">Cliente</th>
                                    <th className="px-8 py-5">Fecha</th>
                                    <th className="px-8 py-5">Método</th>
                                    <th className="px-8 py-5 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-20 text-center animate-pulse text-stone-300 font-bold">Cargando datos...</td></tr>
                                ) : sales.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-stone-300 font-bold uppercase italic">No hay ventas registradas</td></tr>
                                ) : recentSales.map(sale => (
                                    <tr key={sale.id} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="px-8 py-5 font-black text-stone-400 text-xs">#{sale.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-5 font-bold text-stone-900">{sale.cliente_nombre || "Cliente General"}</td>
                                        <td className="px-8 py-5 text-stone-500 text-xs font-medium">{new Date(sale.fecha).toLocaleDateString()}</td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-stone-100 rounded-full text-[9px] font-black text-stone-600 uppercase tracking-widest">
                                                {sale.metodo_pago || "Efectivo"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-stone-900">{formatCurrency(sale.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
