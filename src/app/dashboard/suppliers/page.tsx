"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Plus,
  Search,
  Mail,
  Phone,
  Trash2,
  Edit3,
  X,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function SuppliersV4() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManager, setShowManager] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: "", 
    contacto: "", 
    telefono: "", 
    email: "", 
    categoria: "" 
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/suppliers`);
      if (res.ok) setSuppliers(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const url = isEditing ? `${apiUrl}/suppliers/${isEditing}` : `${apiUrl}/suppliers`;
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ nombre: "", contacto: "", telefono: "", email: "", categoria: "" });
        setIsEditing(null);
        fetchSuppliers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proveedor?")) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    try {
      const res = await fetchWithAuth(`${apiUrl}/suppliers/${id}`, { method: "DELETE" });
      if (res.ok) fetchSuppliers();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header (PDF "Acción Celeste") */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-serif font-black text-[#121212]">Directorio de Proveedores</h2>
             <div className="px-3 py-1 bg-celeste/10 text-celeste text-[10px] font-black uppercase tracking-widest rounded-full border border-celeste/20">
                Módulo Celeste
             </div>
          </div>
          <p className="text-[#121212]/50 text-sm font-medium">Bellesas Karinas — Gestión Integral de Abastecimiento</p>
        </div>

        <button 
          onClick={() => setShowManager(true)}
          className="flex items-center gap-3 px-8 py-4 bg-celeste text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-celeste/30 active:scale-95"
        >
           <Plus size={18} /> Gestionar Proveedores
        </button>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Total Aliados", val: suppliers.length, color: "bg-celeste", icon: <Truck /> },
           { label: "Suministros OK", val: "94%", color: "bg-verde", icon: <CheckCircle2 /> },
           { label: "Categorías", val: 8, color: "bg-primary", icon: <Plus /> },
           { label: "Pendientes", val: 0, color: "bg-naranja", icon: <AlertCircle /> }
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-[#121212]/5 shadow-sm flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", s.color)}>
                 {React.cloneElement(s.icon as React.ReactElement<any>, { size: 20 })}
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30">{s.label}</p>
                 <h4 className="text-xl font-serif font-black">{s.val}</h4>
              </div>
           </div>
         ))}
      </div>

      {/* Main Grid for quick view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
           <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-celeste" size={40} /></div>
         ) : filteredSuppliers.map(s => (
           <div key={s.id} className="bg-white rounded-[2.5rem] p-8 border border-[#121212]/5 hover:border-celeste/30 hover:shadow-2xl hover:shadow-celeste/5 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-celeste/10 text-celeste rounded-2xl flex items-center justify-center group-hover:bg-celeste group-hover:text-white transition-all duration-500">
                    <Truck size={24} />
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setFormData(s); setIsEditing(s.id); setShowManager(true); }} className="p-2 bg-[#FDFBF7] text-[#121212]/40 hover:text-celeste rounded-xl transition-all">
                       <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 bg-[#FDFBF7] text-[#121212]/40 hover:text-rose-500 rounded-xl transition-all">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <h3 className="text-xl font-serif font-black text-[#121212] mb-1">{s.nombre}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/20 mb-6">{s.categoria || "SUMINISTROS"}</p>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-xs font-bold text-[#121212]/60">
                    <Mail size={14} className="text-celeste" /> {s.email || "No registrado"}
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-[#121212]/60">
                    <Phone size={14} className="text-celeste" /> {s.telefono || "Sin teléfono"}
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* ACTION WINDOW: SPLIT VIEW (PDF REQUIREMENT) */}
      {showManager && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay animate-in fade-in duration-300">
           <div className="split-window animate-in zoom-in-95 duration-500 border-2 border-celeste/20">
              
              {/* Left Side: Adding/Editing Form */}
              <div className="split-left bg-white relative">
                 <div className="mb-10">
                    <h3 className="text-2xl font-serif font-black text-[#121212]">{isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-celeste mt-1">Módulo de Entrada de Datos</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                       {[
                         { label: "Nombre Comercial", name: "nombre", type: "text", placeholder: "Ej: Paris Cosmetics" },
                         { label: "Categoría", name: "categoria", type: "text", placeholder: "Maquillaje, Fragancias, etc." },
                         { label: "Correo Electrónico", name: "email", type: "email", placeholder: "contacto@empresa.com" },
                         { label: "Teléfono de Contacto", name: "telefono", type: "text", placeholder: "+51 987..." },
                         { label: "Persona de Contacto", name: "contacto", type: "text", placeholder: "Nombre del representante" }
                       ].map(f => (
                         <div key={f.name} className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">{f.label}</label>
                            <input 
                              required={f.name === 'nombre'}
                              type={f.type}
                              placeholder={f.placeholder}
                              className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-xs font-bold focus:ring-4 focus:ring-celeste/10 focus:border-celeste outline-none transition-all"
                              value={(formData as any)[f.name]}
                              onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                            />
                         </div>
                       ))}
                    </div>

                    <button type="submit" className="w-full py-5 bg-celeste text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:brightness-110 transition-all shadow-xl shadow-celeste/20 flex items-center justify-center gap-3">
                       {isEditing ? 'Guardar Cambios' : 'Registrar Aliado'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(null); setFormData({ nombre: "", contacto: "", telefono: "", email: "", categoria: "" }); }} className="w-full py-4 text-[#121212]/40 font-black uppercase text-[9px] tracking-widest hover:text-[#121212] transition-all">
                        Cancelar Edición
                      </button>
                    )}
                 </form>
              </div>

              {/* Right Side: Full Table */}
              <div className="split-right bg-[#FDFBF7]/50 relative">
                 <div className="flex justify-between items-center mb-10 sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md pb-4 z-10">
                    <div className="relative group flex-1 mr-4">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20 group-focus-within:text-celeste transition-colors" />
                       <input 
                         type="text" 
                         placeholder="Buscar en tiempo real..." 
                         className="w-full bg-white border border-[#121212]/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-celeste/20 transition-all shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                    <button onClick={() => setShowManager(false)} className="p-3 bg-white border border-[#121212]/5 rounded-2xl text-[#121212]/20 hover:text-[#121212] transition-all shadow-sm">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    {filteredSuppliers.map(s => (
                       <div key={s.id} className="bg-white p-5 rounded-3xl border border-[#121212]/5 flex items-center justify-between group hover:border-celeste/20 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-celeste">
                                <Truck size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-serif font-black text-[#121212]">{s.nombre}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-[#121212]/30">{s.email || 'SIN CORREO'}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setFormData(s); setIsEditing(s.id); }} className="p-2 text-[#121212]/10 hover:text-celeste transition-colors">
                                <Edit3 size={16} />
                             </button>
                             <button onClick={() => handleDelete(s.id)} className="p-2 text-[#121212]/10 hover:text-rose-500 transition-colors">
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

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
