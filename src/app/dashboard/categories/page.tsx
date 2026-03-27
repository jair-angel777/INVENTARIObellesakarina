"use client";

import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Tag, 
  CheckCircle2, 
  X, 
  Palette,
  MoreVertical,
  ChevronRight,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function CategoriesV4() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

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

  const filtered = categories.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px]">Arquitectura de Catálogo</p>
          <h2 className="text-4xl font-serif font-bold text-[#121212]">Gestión de Categorías</h2>
          <p className="text-[#121212]/50 text-sm">Organizando <span className="text-[#121212] font-semibold">{categories.length} clasificaciones</span> de productos.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20" size={18} />
              <input 
                type="text"
                placeholder="Buscar categoría..."
                className="bg-white border border-[#121212]/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 transition-all w-full lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={() => { setEditingCategory(null); setShowModal(true); }}
             className="flex items-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#121212]/90 transition-all shadow-lg"
           >
              <Plus size={16} /> Nueva Clase
           </button>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 4, 5].map(i => <div key={i} className="h-48 bg-[#121212]/5 rounded-[2.5rem] animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[#121212]/20 font-serif italic text-2xl">
             No hay categorías registradas en el sistema v4
          </div>
        ) : filtered.map(cat => (
          <div key={cat.id} className="group bg-white border border-[#121212]/5 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col">
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-1000",
              cat.color || "bg-[#121212]"
            )} />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
               <div className={cn(
                 "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                 cat.color || "bg-[#121212]"
               )}>
                  <Tag size={20} />
               </div>
               <button className="p-2 text-[#121212]/10 hover:text-[#121212] transition-colors">
                  <MoreVertical size={18} />
               </button>
            </div>

            <div className="relative z-10 space-y-2 flex-1">
               <h3 className="text-xl font-serif font-bold text-[#121212] tracking-tight">{cat.nombre}</h3>
               <p className="text-[10px] text-[#121212]/40 font-medium leading-relaxed italic">
                 {cat.descripcion || "Sin descripción descriptiva para esta categoría."}
               </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-[#121212]/5 flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-widest text-[#121212]/40">Cód: {cat.id.slice(-4).toUpperCase()}</span>
               <div className="flex gap-2">
                  <button onClick={() => { setEditingCategory(cat); setShowModal(true); }} className="p-2 hover:bg-[#FDFBF7] rounded-xl text-[#121212]/20 hover:text-[#D4AF37] transition-all">
                     <Edit3 size={14} />
                  </button>
                  <button className="p-2 hover:bg-rose-50 rounded-xl text-[#121212]/20 hover:text-rose-500 transition-all">
                     <Trash2 size={14} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Basic Modal (to keep it clean for now) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121212]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#FDFBF7] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-[#121212]/10 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-[#121212]/5 flex justify-between items-center bg-white/50">
                 <h3 className="text-2xl font-serif font-bold text-[#121212]">{editingCategory ? 'Editar' : 'Nueva'} Categoría</h3>
                 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#121212]/5 rounded-xl transition-all">
                    <X size={20} />
                 </button>
              </div>
              <form className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-1.5 font-black uppercase tracking-[0.1em] text-[9px] text-[#121212]/40 ml-1">
                       <label>Nombre de Categoría</label>
                       <input 
                         type="text" 
                         className="w-full bg-white border border-[#121212]/10 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 transition-all text-[#121212] font-bold" 
                         placeholder="Ej: Labiales, Fragancias, Accesorios"
                         defaultValue={editingCategory?.nombre}
                       />
                    </div>
                    <div className="space-y-1.5 font-black uppercase tracking-[0.1em] text-[9px] text-[#121212]/40 ml-1">
                       <label>Color de Identidad</label>
                       <div className="flex flex-wrap gap-3 p-1">
                          {["bg-emerald-500", "bg-rose-500", "bg-[#D4AF37]", "bg-blue-600", "bg-indigo-600", "bg-purple-600"].map(c => (
                            <button key={c} type="button" className={cn("w-8 h-8 rounded-full shadow-sm ring-offset-2 hover:scale-110 transition-all", c)} />
                          ))}
                       </div>
                    </div>
                    <div className="space-y-1.5 font-black uppercase tracking-[0.1em] text-[9px] text-[#121212]/40 ml-1">
                       <label>Descripción Corta</label>
                       <textarea 
                         className="w-full bg-white border border-[#121212]/10 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 transition-all h-24 resize-none text-[#121212]/60 font-medium"
                         placeholder="Escribe una breve descripción..."
                         defaultValue={editingCategory?.descripcion}
                       />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#121212]/90 transition-all shadow-xl shadow-[#121212]/20">
                    Sincronizar Categoría
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
