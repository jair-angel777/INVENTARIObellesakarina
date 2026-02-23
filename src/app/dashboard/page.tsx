"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Package,
    AlertTriangle,
    TrendingUp,
    Trash2,
    Edit,
    MoreVertical,
    ChevronRight,
    Filter
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export default function InventoryDashboard() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("ESTAS SEGURO?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert("Error al intentar eliminar el producto");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se puede conectar con el servidor");
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                setProducts(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Failed to parse JSON. Server response was:", text);
                throw new Error("Invalid JSON response from server");
            }
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: products.length,
        lowStock: products.filter(p => (p.stock || 0) <= (p.stock_minimo || 5)).length,
        totalValue: products.reduce((acc, p) => acc + (Number(p.precio) * (p.stock || 0)), 0)
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-stone-900 p-4 md:p-8 selection:bg-orange-500/30">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                            BellesasKarina
                        </h1>
                        <p className="text-stone-500 mt-1 font-medium">Gestión de Inventario y Control de Stock</p>
                    </div>
                    <Link
                        href="/products/new"
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-900/20"
                    >
                        <Plus size={20} />
                        Nuevo Producto
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Productos"
                        value={stats.total}
                        icon={<Package className="text-orange-600" />}
                        subtitle="En el catálogo actual"
                    />
                    <StatCard
                        title="Stock Bajo"
                        value={stats.lowStock}
                        icon={<AlertTriangle className="text-amber-500" />}
                        subtitle="Requiere atención inmediata"
                        alert={stats.lowStock > 0}
                    />
                    <StatCard
                        title="Valor del Inventario"
                        value={formatCurrency(stats.totalValue)}
                        icon={<TrendingUp className="text-emerald-500" />}
                        subtitle="Precio de venta estimado"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-orange-200 shadow-sm backdrop-blur-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o categoría..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all text-stone-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl transition-colors border border-stone-200">
                            <Filter size={18} />
                            Filtros
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-orange-200 shadow-sm overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 text-stone-500 text-sm uppercase tracking-wider font-bold border-b border-orange-100">
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4 text-center">Categoría</th>
                                    <th className="px-6 py-4 text-center">Stock</th>
                                    <th className="px-6 py-4 text-right">Precio</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    [1, 2, 3].map(i => <LoadingRow key={i} />)
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                                            No se encontraron productos. Crea uno nuevo para empezar.
                                        </td>
                                    </tr>
                                ) : filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-orange-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-crema-dark flex items-center justify-center text-orange-600 border border-orange-200 overflow-hidden group-hover:border-orange-500/30 transition-colors">
                                                    {product.imagen ? (
                                                        <img src={product.imagen} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-stone-800">{product.nombre}</p>
                                                    <p className="text-xs text-stone-500">{product.sku || 'SIN SKU'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 bg-orange-50 rounded-full text-xs font-semibold text-orange-700 border border-orange-100">
                                                {product.categoria || 'Sin clase'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                                                    (product.stock || 0) <= (product.stock_minimo || 5)
                                                        ? "bg-amber-400/10 text-amber-500 ring-amber-500/20"
                                                        : "bg-emerald-400/10 text-emerald-500 ring-emerald-500/20"
                                                )}>
                                                    {product.stock || 0} unid.
                                                </span>
                                                {(product.stock || 0) <= (product.stock_minimo || 5) && (
                                                    <span className="text-[10px] text-amber-500 mt-1 animate-pulse">Stock Crítico</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-bold text-stone-800">
                                            {formatCurrency(product.precio)}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="p-2 hover:bg-orange-100 rounded-lg text-stone-400 hover:text-orange-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-stone-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <MoreVertical size={18} className="ml-auto text-stone-300 group-hover:hidden" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-stone-50/50 flex items-center justify-between text-sm text-stone-500 border-t border-orange-100">
                        <p>Mostrando <span className="font-bold text-stone-800">{filteredProducts.length}</span> de {products.length} productos</p>
                        <div className="flex gap-2">
                            <button disabled className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"><ChevronRight className="rotate-180" size={20} /></button>
                            <button disabled className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, subtitle, alert }: any) {
    return (
        <div className={cn(
            "bg-white p-6 rounded-3xl border border-orange-200 shadow-sm transition-all hover:border-orange-400 hover:shadow-md group",
            alert && "ring-1 ring-amber-500/20 border-amber-500/20"
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 group-hover:scale-110 transition-all">
                    {icon}
                </div>
                {alert && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
            </div>
            <div>
                <p className="text-stone-500 text-sm font-semibold">{title}</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-1 tabular-nums tracking-tight">{value}</h3>
                <p className="text-xs text-stone-400 mt-2">{subtitle}</p>
            </div>
        </div>
    );
}

function LoadingRow() {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-5"><div className="h-12 w-48 bg-stone-100 rounded-xl"></div></td>
            <td className="px-6 py-5 text-center"><div className="h-6 w-24 bg-stone-100 rounded-full mx-auto"></div></td>
            <td className="px-6 py-5 text-center"><div className="h-6 w-16 bg-stone-100 rounded-full mx-auto"></div></td>
            <td className="px-6 py-5 text-right"><div className="h-6 w-24 bg-stone-100 rounded-lg ml-auto"></div></td>
            <td className="px-6 py-5 text-right"><div className="h-6 w-12 bg-stone-100 rounded-lg ml-auto"></div></td>
        </tr>
    );
}
