"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Layers,
    Plus,
    Search,
    Edit3,
    Trash2,
    ChevronLeft,
    Tag,
    Info,
    CheckCircle2,
    X,
    Palette
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

interface Category {
    id: string;
    nombre: string;
    descripcion?: string;
    color?: string;
    icono?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        color: "bg-blue-500",
        icono: "Package"
    });

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app';
    const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);
        try {
            const method = editingCategory ? 'PATCH' : 'POST';
            const url = editingCategory ? `${API_URL}/categories/${editingCategory.id}` : `${API_URL}/categories`;
            
            const res = await fetchWithAuth(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setAlert({ type: 'success', message: editingCategory ? 'Categoría actualizada' : 'Categoría creada' });
                setTimeout(() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setForm({ nombre: "", descripcion: "", color: "bg-blue-500", icono: "Package" });
                    setAlert(null);
                }, 1500);
                fetchCategories();
            } else {
                const data = await res.json();
                setAlert({ type: 'error', message: data.error || 'Error al guardar' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Error de conexión' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta categoría? Los productos asociados podrían quedar sin categoría.")) return;
        try {
            const res = await fetchWithAuth(`${API_URL}/categories/${id}`, { method: 'DELETE' });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        setForm({
            nombre: cat.nombre,
            descripcion: cat.descripcion || "",
            color: cat.color || "bg-blue-500",
            icono: cat.icono || "Package"
        });
        setShowModal(true);
    };

    const filtered = categories.filter(c => 
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const colors = [
        "bg-blue-500", "bg-emerald-500", "bg-rose-500", 
        "bg-amber-500", "bg-indigo-500", "bg-purple-500",
        "bg-orange-500", "bg-stone-500"
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest"
                        >
                            <ChevronLeft size={16} /> Volver
                        </Link>
                        <h1 className="text-5xl font-black text-stone-900 italic uppercase tracking-tighter leading-none">
                            Gestión de <br />
                            <span className="text-emerald-600">Categorías</span>
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                className="bg-white border border-stone-200 rounded-2xl py-4 pl-12 pr-6 w-full sm:w-80 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setForm({ nombre: "", descripcion: "", color: "bg-blue-500", icono: "Package" });
                                setShowModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                        >
                            <Plus size={20} /> Nueva Categoría
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(cat => (
                            <div key={cat.id} className="bg-white border border-stone-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${cat.color} opacity-5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700`} />
                                
                                <div className="relative z-10 flex items-start justify-between">
                                    <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                        <Tag size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(cat)} className="p-2 text-stone-300 hover:text-emerald-600 transition-colors"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-stone-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <h3 className="text-2xl font-black text-stone-900 uppercase italic tracking-tight">{cat.nombre}</h3>
                                    <p className="text-stone-400 text-xs font-bold leading-relaxed">
                                        {cat.descripcion || "Sin descripción proporcionada."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100 animate-in zoom-in-95 duration-300">
                        <div className="bg-emerald-600 p-8 text-white relative">
                            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 hover:rotate-90 transition-transform"><X size={24} /></button>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">{editingCategory ? "Editar" : "Crear"} Categoría</h2>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            {alert && (
                                <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${alert.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    <div className={`w-2 h-2 rounded-full ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {alert.message}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nombre</label>
                                    <input
                                        required
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors font-bold text-sm"
                                        value={form.nombre}
                                        onChange={e => setForm({...form, nombre: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Descripción</label>
                                    <textarea
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors font-bold text-sm min-h-[100px]"
                                        value={form.descripcion}
                                        onChange={e => setForm({...form, descripcion: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Color de Identidad</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setForm({...form, color: c})}
                                                className={`w-8 h-8 rounded-full ${c} ${form.color === c ? 'ring-4 ring-offset-2 ring-emerald-500' : ''} transition-all`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={saving}
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase italic tracking-tighter transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 h-14 flex items-center justify-center font-bold"
                            >
                                {saving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : "Guardar Categoría"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
