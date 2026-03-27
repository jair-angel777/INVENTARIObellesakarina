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
  ArrowRight,
  X,
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function SuppliersV4() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  
  const [orderForm, setOrderForm] = useState({
    cantidad: "",
    notas: ""
  });

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

  const filteredSuppliers = suppliers.filter(s =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openOrderModal = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowOrderModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px]">Socios Estratégicos</p>
          <h2 className="text-4xl font-serif font-bold text-[#121212]">Directorio de Proveedores</h2>
          <p className="text-[#121212]/50 text-sm">Gestionando <span className="text-[#121212] font-semibold">{suppliers.length} vinculaciones</span> activas.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20" size={18} />
              <input 
                type="text"
                placeholder="Buscar proveedor..."
                className="bg-white border border-[#121212]/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 transition-all w-full lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#121212]/90 transition-all shadow-lg">
              <Plus size={16} /> Nuevo Aliado
           </button>
        </div>
      </header>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-[#121212]/5 rounded-[2.5rem] animate-pulse" />)
        ) : filteredSuppliers.map(s => (
          <div key={s.id} className="group bg-white border border-[#121212]/5 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212] shadow-sm border border-[#121212]/5 group-hover:border-[#D4AF37]/30 transition-all">
                     <Truck size={24} />
                  </div>
                  <button className="p-2 text-[#121212]/20 hover:text-[#121212] transition-colors">
                     <MoreVertical size={20} />
                  </button>
               </div>

               <div className="mb-6">
                  <h3 className="text-2xl font-serif font-bold text-[#121212]">{s.nombre}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mt-1">{s.categoria || "Suministros Generales"}</p>
               </div>

               <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-sm text-[#121212]/60 font-medium">
                     <Mail size={16} className="text-[#121212]/20" /> {s.email || "No especificado"}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#121212]/60 font-medium">
                     <Phone size={16} className="text-[#121212]/20" /> {s.telefono || "No registrado"}
                  </div>
               </div>

               <div className="pt-6 mt-6 border-t border-[#121212]/5 flex items-center justify-between">
                  <button 
                    onClick={() => openOrderModal(s)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#121212] group-hover:text-[#D4AF37] transition-all"
                  >
                     Crear Pedido <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-[#FDFBF7] rounded-xl text-[#121212]/20 hover:text-[#121212] transition-all">
                        <Edit3 size={16} />
                     </button>
                     <button className="p-2 hover:bg-rose-50 rounded-xl text-[#121212]/20 hover:text-rose-500 transition-all">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Split-Screen Order Modal (v4 Key Feature) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
           <div className="fixed inset-0 bg-[#121212]/60 backdrop-blur-md" onClick={() => setShowOrderModal(false)} />
           
           <div className="relative bg-[#FDFBF7] w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-500">
              
              {/* Left Side: Order Form */}
              <div className="flex-1 p-8 lg:p-12 border-r border-[#121212]/5 overflow-y-auto">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h3 className="text-3xl font-serif font-bold text-[#121212]">Pedido de Reabastecimiento</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mt-1">Proveedor: {selectedSupplier?.nombre}</p>
                    </div>
                    <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-[#121212]/5 rounded-xl transition-all lg:hidden">
                       <X size={20} />
                    </button>
                 </div>

                 <form className="space-y-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40 ml-1">Producto a Solicitar</label>
                          <select className="w-full bg-white border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all">
                             <option>Seleccionar producto catalogado...</option>
                             {/* ... list of products from this supplier if applicable ... */}
                          </select>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40 ml-1">Cantidad (Unidades)</label>
                             <input 
                               type="number" 
                               className="w-full bg-white border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all" 
                               placeholder="Ej: 50"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40 ml-1">Sede de Destino</label>
                             <select className="w-full bg-white border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all">
                                <option>Almacén Central</option>
                             </select>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40 ml-1">Notas Adicionales</label>
                          <textarea 
                            className="w-full bg-white border border-[#121212]/10 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/50 transition-all h-32 resize-none"
                            placeholder="Instrucciones de entrega, embalaje, etc."
                          />
                       </div>
                    </div>

                    <button className="w-full py-5 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#121212]/90 transition-all shadow-xl shadow-[#121212]/20 flex items-center justify-center gap-3">
                       <Truck size={18} className="text-[#D4AF37]" />
                       Emitir Orden de Compra
                    </button>
                 </form>
              </div>

              {/* Right Side: Order History / Context */}
              <div className="w-full lg:w-[400px] bg-[#121212] p-8 lg:p-12 text-white overflow-y-auto hidden lg:block">
                 <div className="flex justify-between items-start mb-10">
                    <h4 className="text-xl font-serif font-bold italic">Últimas Interacciones</h4>
                    <button onClick={() => setShowOrderModal(false)} className="p-2 text-white/40 hover:text-white transition-all">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="space-y-8">
                    {[1, 2].map(i => (
                      <div key={i} className="relative pl-8 border-l border-white/10 space-y-2">
                         <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/40" />
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">12 MAR 2026</p>
                         <h5 className="font-bold text-sm">Pedido #2293 Recibido</h5>
                         <p className="text-xs text-white/40 leading-relaxed font-medium italic">"120 unidades de Labial Premium Rose, entregadas en Almacén Sur sin observaciones."</p>
                         <div className="flex items-center gap-2 text-emerald-500 pt-2 font-black uppercase text-[8px] tracking-widest">
                            <CheckCircle2 size={12} /> Archivo de Auditoría OK
                         </div>
                      </div>
                    ))}

                    <div className="pt-8 mt-8 border-t border-white/5">
                       <div className="bg-white/5 rounded-3xl p-6 space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                                <History size={20} />
                             </div>
                             <div>
                                <p className="text-xs font-bold uppercase tracking-widest">Resumen Histórico</p>
                                <p className="text-[9px] text-white/30 uppercase font-black">Periodo Actual</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[8px] font-black uppercase text-white/30 mb-1">Total Pedidos</p>
                                <p className="text-xl font-serif font-bold">14</p>
                             </div>
                             <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-[8px] font-black uppercase text-white/30 mb-1">Eficiencia</p>
                                <p className="text-xl font-serif font-bold text-emerald-400">98%</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-start gap-3">
                       <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                       <p className="text-[10px] font-medium text-rose-200/60 leading-relaxed italic">
                          "Recuerda verificar el stock actual antes de emitir pedidos duplicados."
                       </p>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
