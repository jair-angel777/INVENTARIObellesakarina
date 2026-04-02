"use client";

import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Tag, 
  X, 
  Loader2,
  CheckCircle2,
  Filter,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function CategoriesV4() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManager, setShowManager] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", color: "bg-verde" });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const url = isEditing ? `${apiUrl}/categories/${isEditing}` : `${apiUrl}/categories`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ nombre: "", descripcion: "", color: "bg-verde" });
        setIsEditing(null);
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    try {
      const res = await fetchWithAuth(`${apiUrl}/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = categories.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="w-12 h-12 bg-white border-4 border-[#FF9100] rounded-2xl flex items-center justify-center text-[#FF9100] hover:bg-[#FF9100] hover:text-white transition-all shadow-md active:scale-95"
            title="Regresar al Dashboard"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </Link>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-[#121212]">Categorías</h2>
            <p className="text-[#121212]/50 text-[10px] font-black uppercase tracking-widest">Organización de Catálogo</p>
          </div>
        </div>

        <button 
          onClick={() => setShowManager(true)}
          className="flex items-center gap-3 px-8 py-4 bg-[#FF9100] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 border-b-4 border-orange-700"
          title="Agregar nueva categoría"
        >
           <Plus size={18} strokeWidth={3} /> Nueva Categoría
        </button>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border-2 border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
               <Layers size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Activas</p>
               <h3 className="text-2xl font-black">{categories.length}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border-2 border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 shadow-inner">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Estandarización</p>
               <h3 className="text-2xl font-black">100%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border-2 border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 shadow-inner">
               <Filter size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Segmentos</p>
               <h3 className="text-2xl font-black">Múltiples</h3>
            </div>
         </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {loading ? (
            [1,2,3,4].map(i => <div key={i} className="h-48 bg-[#121212]/5 rounded-[2.5rem] animate-pulse" />)
         ) : filtered.map(cat => (
           <div key={cat.id} className="group bg-white border-2 border-[#121212]/5 rounded-[2.5rem] p-8 hover:border-[#FF9100]/30 hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col">
              <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Tag size={20} />
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setFormData(cat); setIsEditing(cat.id); setShowManager(true); }} className="p-2 text-stone-300 hover:text-[#FF9100] transition-all" title="Editar">
                       <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-stone-300 hover:text-rose-500 transition-all" title="Eliminar">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <h3 className="text-xl font-black text-[#121212] tracking-tight">{cat.nombre}</h3>
              <p className="text-[10px] text-[#121212]/40 font-bold leading-relaxed mt-2 line-clamp-2 italic">
                 {cat.descripcion || "Sin descripción establecida."}
              </p>
           </div>
         ))}
      </div>

      {/* MODAL / SPLIT VIEW */}
      {showManager && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] shadow-2xl flex relative overflow-hidden border-4 border-white">
              
              {/* Left Side */}
              <div className="w-[40%] bg-stone-50 p-12 flex flex-col border-r-2 border-stone-100">
                 <div className="mb-10">
                    <h3 className="text-2xl font-black text-[#121212]">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1">Gestión de Catálogo</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Nombre</label>
                          <input 
                            required
                            type="text"
                            placeholder="Ej: Fragancias"
                            className="w-full bg-white border-2 border-stone-100 rounded-2xl p-4 text-xs font-bold focus:border-[#FF9100] outline-none transition-all shadow-sm"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Descripción</label>
                          <textarea 
                            placeholder="Detalles..."
                            className="w-full bg-white border-2 border-stone-100 rounded-2xl p-4 text-xs font-bold focus:border-[#FF9100] outline-none transition-all h-32 resize-none shadow-sm"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                          />
                       </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-lg">
                       {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(null); setFormData({ nombre: "", descripcion: "", color: "bg-verde" }); }} className="w-full py-4 text-stone-400 font-black uppercase text-[9px] tracking-widest hover:text-stone-600 transition-all">
                        Cancelar
                      </button>
                    )}
                 </form>
              </div>

              {/* Right Side */}
              <div className="w-[60%] p-12 bg-white relative flex flex-col">
                 <div className="flex justify-between items-center mb-10 sticky top-0 bg-white pb-4 z-10">
                    <div className="relative flex-1 mr-4">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                       <input 
                         type="text" 
                         placeholder="Buscar..." 
                         className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold focus:outline-none focus:border-[#FF9100] transition-all"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                    <button onClick={() => setShowManager(false)} className="p-3 bg-stone-50 border-2 border-stone-100 rounded-2xl text-stone-300 hover:text-[#121212] transition-all">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="flex-1 overflow-auto space-y-4">
                    {filtered.map(c => (
                       <div key={c.id} className="bg-white p-5 rounded-3xl border-2 border-stone-50 flex items-center justify-between group hover:border-[#FF9100]/20 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Tag size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-[#121212]">{c.nombre}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-[#121212]/30 italic">{c.id.slice(-6).toUpperCase()}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setFormData(c); setIsEditing(c.id); }} className="p-2 text-stone-200 hover:text-emerald-600 transition-colors">
                                <Edit3 size={16} />
                             </button>
                             <button onClick={() => handleDelete(c.id)} className="p-2 text-stone-200 hover:text-rose-500 transition-colors">
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
