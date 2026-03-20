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
import { fetchWithAuth } from "@/lib/api";

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
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        categoria: ""
    });

    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    // Normalización de la URL de API v3.6
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app';
    const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/suppliers`);
            const data = await res.json();
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setAlertInfo(null);
        try {
            const method = editingSupplier ? 'PATCH' : 'POST';
            const url = editingSupplier ? `${API_URL}/suppliers/${editingSupplier.id}` : `${API_URL}/suppliers`;
            
            const res = await fetchWithAuth(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setAlertInfo({ type: 'success', message: editingSupplier ? '¡Proveedor actualizado!' : '¡Proveedor registrado!' });
                setForm({ nombre: "", email: "", telefono: "", direccion: "", categoria: "" });
                setEditingSupplier(null);
                setTimeout(() => {
                    setShowModal(false);
                    setAlertInfo(null);
                }, 1500);
                fetchSuppliers();
            } else {
                const data = await res.json();
                setAlertInfo({ type: 'error', message: data.error || 'Error al guardar' });
            }
        } catch (error) {
            setAlertInfo({ type: 'error', message: 'Falla de conexión' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSupplier = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar este proveedor?")) return;
        
        try {
            const res = await fetchWithAuth(`${API_URL}/suppliers/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchSuppliers();
            } else {
                const data = await res.json();
                alert(data.error || "Error al eliminar");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openEditModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setForm({
            nombre: supplier.nombre,
            email: supplier.email || "",
            telefono: supplier.telefono || "",
            direccion: supplier.direccion || "",
            categoria: supplier.categoria || ""
        });
        setShowModal(true);
        setActiveMenuId(null);
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
                                        <div className="relative">
                                            <button 
                                                onClick={() => setActiveMenuId(activeMenuId === supplier.id ? null : supplier.id)}
                                                className="bg-stone-50 p-2 rounded-xl text-stone-300 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                            
                                            {/* Action Dropdown */}
                                            {activeMenuId === supplier.id && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setActiveMenuId(null)}
                                                    />
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                        <button 
                                                            onClick={() => openEditModal(supplier)}
                                                            className="w-full text-left px-4 py-3 text-sm font-bold text-stone-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                                        >
                                                            <Edit3 size={16} />
                                                            Editar Datos
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteSupplier(supplier.id)}
                                                            className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </>
                                            )}
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

                                    <div className="pt-6 border-t border-stone-50 flex items-center justify-between group-hover:border-blue-100 transition-colors mt-auto">
                                        <Link
                                            href={`/dashboard/suppliers/new-order?supplierId=${supplier.id}`}
                                            className="text-stone-900 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors bg-stone-50 px-4 py-2 rounded-full"
                                        >
                                            Generar Pedido
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Card para añadir nuevo */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="border-2 border-dashed border-stone-200 rounded-[3rem] p-8 flex flex-col items-center justify-center text-stone-300 hover:border-blue-400 hover:text-blue-500 transition-all hover:bg-blue-50/30 group min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={32} />
                            </div>
                            <span className="font-black uppercase text-xs tracking-widest">Nuevo Proveedor</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Creación */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-stone-100">
                        <div className="bg-blue-600 p-8 text-white relative">
                             <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingSupplier(null);
                                    setForm({ nombre: "", email: "", telefono: "", direccion: "", categoria: "" });
                                }}
                                className="absolute top-6 right-6 hover:rotate-90 transition-transform"
                            >
                                <Plus className="rotate-45" size={24} />
                            </button>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                                {editingSupplier ? 'Editar Proveedor' : 'Registrar Proveedor'}
                            </h2>
                            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">
                                {editingSupplier ? 'Actualizar Información' : 'Nuevo Contacto Comercial'}
                            </p>
                        </div>

                        <form onSubmit={handleCreateSupplier} className="p-8 space-y-5">
                            {alertInfo && (
                                <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-bounce ${alertInfo.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    <div className={`w-2 h-2 rounded-full ${alertInfo.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {alertInfo.message}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                                        <input
                                            required
                                            className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors font-bold text-sm"
                                            placeholder="Ej: Inversiones Karinas S.A.C"
                                            value={form.nombre}
                                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Categoría</label>
                                            <input
                                                className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors font-bold text-sm text-blue-600"
                                                placeholder="Ej: Calzado"
                                                value={form.categoria}
                                                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Teléfono</label>
                                            <input
                                                className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors font-bold text-sm"
                                                placeholder="987 654 321"
                                                value={form.telefono}
                                                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors font-bold text-sm"
                                            placeholder="contacto@proveedor.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Dirección Física</label>
                                        <input
                                            className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors font-bold text-sm"
                                            placeholder="Av. Principal 123, Lima"
                                            value={form.direccion}
                                            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={saving}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20 disabled:opacity-50 mt-4 h-14 flex items-center justify-center"
                            >
                                 {saving ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (editingSupplier ? "Actualizar Proveedor" : "Guardar Proveedor")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
