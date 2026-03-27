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
  Filter
} from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header (PDF "Acción Verde") */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-serif font-black text-[#121212]">Gestión de Categorías</h2>
             <div className="px-3 py-1 bg-verde/10 text-verde text-[10px] font-black uppercase tracking-widest rounded-full border border-verde/20">
                Módulo Verde
             </div>
          </div>
          <p className="text-[#121212]/50 text-sm font-medium">Bellesas Karinas — Organización de Catálogo Maestro</p>
        </div>

        <button 
          onClick={() => setShowManager(true)}
          className="flex items-center gap-3 px-8 py-4 bg-verde text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-verde/30 active:scale-95"
        >
           <Plus size={18} /> Nueva Categoría
        </button>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-verde/10 rounded-2xl flex items-center justify-center text-verde shadow-inner">
               <Layers size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Clases Activas</p>
               <h3 className="text-2xl font-serif font-black">{categories.length}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212]/20 shadow-inner">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Estandarización</p>
               <h3 className="text-2xl font-serif font-black">100%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212]/20 shadow-inner">
               <Filter size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Segmentos</p>
               <h3 className="text-2xl font-serif font-black">Múltiples</h3>
            </div>
         </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {loading ? (
            [1,2,3,4].map(i => <div key={i} className="h-48 bg-[#121212]/5 rounded-[2.5rem] animate-pulse" />)
         ) : filtered.map(cat => (
           <div key={cat.id} className="group bg-white border border-[#121212]/5 rounded-[2.5rem] p-8 hover:border-verde/30 hover:shadow-2xl hover:shadow-verde/5 transition-all duration-500 relative overflow-hidden flex flex-col">
              <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-verde/10 text-verde rounded-2xl flex items-center justify-center border border-verde/5 group-hover:bg-verde group-hover:text-white transition-all duration-500">
                    <Tag size={20} />
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setFormData(cat); setIsEditing(cat.id); setShowManager(true); }} className="p-2 opacity-20 group-hover:opacity-100 hover:text-verde transition-all">
                       <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 opacity-20 group-hover:opacity-100 hover:text-rose-500 transition-all">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <h3 className="text-xl font-serif font-black text-[#121212] tracking-tight">{cat.nombre}</h3>
              <p className="text-[10px] text-[#121212]/40 font-medium leading-relaxed italic mt-2 line-clamp-2">
                 {cat.descripcion || "Sin descripción establecida para esta categoría."}
              </p>
           </div>
         ))}
      </div>

      {/* ACTION WINDOW: SPLIT VIEW (PDF REQUIREMENT) */}
      {showManager && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay animate-in fade-in duration-300">
           <div className="split-window animate-in zoom-in-95 duration-500 border-2 border-verde/20">
              
              {/* Left Side: Adding/Editing Form */}
              <div className="split-left bg-white">
                 <div className="mb-10">
                    <h3 className="text-2xl font-serif font-black text-[#121212]">{isEditing ? 'Editar Clase' : 'Nueva Clase'}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-verde mt-1">Formulario de Clasificación</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Nombre de la Categoría</label>
                          <input 
                            required
                            type="text"
                            placeholder="Ej: Fragancias Premium"
                            className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-xs font-bold focus:ring-4 focus:ring-verde/10 focus:border-verde outline-none transition-all"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Descripción descriptiva</label>
                          <textarea 
                            placeholder="Breve explicación de los productos..."
                            className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-xs font-bold focus:ring-4 focus:ring-verde/10 focus:border-verde outline-none transition-all h-32 resize-none"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                          />
                       </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-verde text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:brightness-110 transition-all shadow-xl shadow-verde/20">
                       {isEditing ? 'Actualizar Clase' : 'Sincronizar Categoría'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(null); setFormData({ nombre: "", descripcion: "", color: "bg-verde" }); }} className="w-full py-4 text-[#121212]/40 font-black uppercase text-[9px] tracking-widest hover:text-[#121212] transition-all">
                        Cancelar
                      </button>
                    )}
                 </form>
              </div>

              {/* Right Side: Full Table */}
              <div className="split-right bg-[#FDFBF7]/50 relative">
                 <div className="flex justify-between items-center mb-10 sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md pb-4 z-10">
                    <div className="relative group flex-1 mr-4">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20 group-focus-within:text-verde transition-colors" />
                       <input 
                         type="text" 
                         placeholder="Filtro rápido..." 
                         className="w-full bg-white border border-[#121212]/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-verde/20 transition-all shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                    <button onClick={() => setShowManager(false)} className="p-3 bg-white border border-[#121212]/5 rounded-2xl text-[#121212]/20 hover:text-[#121212] transition-all shadow-sm">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    {filtered.map(c => (
                       <div key={c.id} className="bg-white p-5 rounded-3xl border border-[#121212]/5 flex items-center justify-between group hover:border-verde/20 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-verde/10 text-verde rounded-xl flex items-center justify-center">
                                <Tag size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-serif font-black text-[#121212]">{c.nombre}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-[#121212]/30 italic">{c.id.slice(-6).toUpperCase()}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setFormData(c); setIsEditing(c.id); }} className="p-2 text-[#121212]/10 hover:text-verde transition-colors">
                                <Edit3 size={16} />
                             </button>
                             <button onClick={() => handleDelete(c.id)} className="p-2 text-[#121212]/10 hover:text-rose-500 transition-colors">
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
