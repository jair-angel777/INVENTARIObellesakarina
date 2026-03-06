"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Truck,
    Plus,
    Search,
    Mail,
    Phone,
    MapPin,
    ChevronLeft,
    MoreVertical,
    Trash2,
    Edit3,
    ArrowRight
} from "lucide-react";

interface Supplier {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    categoria: string;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const res = await fetch(`${apiUrl}/suppliers`);
            const data = await res.json();
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest"
                        >
                            <ChevronLeft size={16} />
                            Volver
                        </Link>
                        <div>
                            <h1 className="text-5xl font-black text-stone-900 italic uppercase tracking-tighter leading-none">
                                Directorio de <br />
                                <span className="text-blue-600">Proveedores</span>
                            </h1>
                            <p className="text-stone-400 font-bold uppercase text-xs tracking-[0.2em] mt-4">
                                Gestión de Contactos Comerciales y Logística
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar proveedor..."
                                className="bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-6 w-full sm:w-80 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link
                            href="/dashboard/suppliers/new-order"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                        >
                            <Plus size={20} />
                            Nuevo Pedido
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="bg-stone-100 h-64 rounded-[3rem]" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuppliers.map(supplier => (
                            <div
                                key={supplier.id}
                                className="group bg-white border border-stone-100 rounded-[3rem] p-8 hover:shadow-2xl hover:shadow-blue-900/5 transition-all hover:-translate-y-2 flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />

                                <div className="relative z-10 space-y-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <Truck size={30} />
                                        </div>
                                        <div className="bg-stone-50 p-2 rounded-xl text-stone-300">
                                            <MoreVertical size={20} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black text-stone-900 uppercase italic tracking-tight">{supplier.nombre}</h3>
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{supplier.categoria || "General"}</span>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3 text-stone-500 text-xs font-bold">
                                            <Mail size={16} className="text-stone-300" />
                                            {supplier.email || "Sin correo"}
                                        </div>
                                        <div className="flex items-center gap-3 text-stone-500 text-xs font-bold">
                                            <Phone size={16} className="text-stone-300" />
                                            {supplier.telefono || "Sin teléfono"}
                                        </div>
                                        <div className="flex items-center gap-3 text-stone-500 text-xs font-bold">
                                            <MapPin size={16} className="text-stone-300" />
                                            <span className="truncate">{supplier.direccion || "Sin dirección"}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-stone-50 flex items-center justify-between group-hover:border-blue-100 transition-colors">
                                        <Link
                                            href={`/dashboard/suppliers/new-order?supplierId=${supplier.id}`}
                                            className="text-stone-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors"
                                        >
                                            Generar Pedido
                                            <ArrowRight size={14} />
                                        </Link>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-stone-300 hover:text-blue-500 transition-colors"><Edit3 size={18} /></button>
                                            <button className="p-2 text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Card para añadir nuevo */}
                        <button className="border-2 border-dashed border-stone-200 rounded-[3rem] p-8 flex flex-col items-center justify-center text-stone-300 hover:border-blue-400 hover:text-blue-500 transition-all hover:bg-blue-50/30 group min-h-[300px]">
                            <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={32} />
                            </div>
                            <span className="font-black uppercase text-xs tracking-widest">Nuevo Proveedor</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
