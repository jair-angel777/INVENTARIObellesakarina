"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Package, 
  AlertCircle, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  MoreVertical,
  ArrowRight,
  Loader2,
  Filter,
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function InventoryV4() {
  const [products, setProducts] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ nombre: "", direccion: "", tipo: "ALMACEN" });

  useEffect(() => {
    fetchInitialData();
  }, [selectedLocation]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      
      const locRes = await fetchWithAuth(`${apiUrl}/locations`);
      if (locRes.ok) setLocations(await locRes.json());

      const prodUrl = selectedLocation === "all" ? `${apiUrl}/products` : `${apiUrl}/products?locationId=${selectedLocation}`;
      const prodRes = await fetchWithAuth(prodUrl);
      if (prodRes.ok) setProducts(await prodRes.json());
      
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLocation)
      });
      if (res.ok) {
        setShowLocationModal(false);
        fetchInitialData();
      }
    } catch (error) {
        console.error(error);
    }
  };

  const currentLoc = locations.find(l => l.id === selectedLocation);
  const isTienda = currentLoc?.tipo === "TIENDA";
  
  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: products.length,
    lowStock: products.filter(p => {
        const threshold = isTienda ? 1 : (p.stock_minimo || 5);
        return p.stock <= threshold;
    }).length,
    value: products.reduce((acc, p) => acc + (p.precio * (p.stock || 0)), 0)
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header v4 (PDF Adapted) */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-serif font-black text-[#121212]">Control de Existencias</h2>
             <div className="px-3 py-1 bg-verde/10 text-verde text-[10px] font-black uppercase tracking-widest rounded-full border border-verde/20">
                v4.0 Sistema Oficial
             </div>
          </div>
          <p className="text-[#121212]/50 text-sm font-medium">Bellesas Karinas — {selectedLocation === 'all' ? 'Vista Global Consolidada' : `Sede: ${currentLoc?.nombre}`}</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center bg-white border border-[#121212]/10 rounded-2xl p-1.5 shadow-sm">
              <button 
                onClick={() => setSelectedLocation("all")}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  selectedLocation === "all" ? "bg-[#121212] text-white shadow-xl" : "text-[#121212]/40 hover:text-[#121212]"
                )}
              >
                <Eye size={16} className={selectedLocation === "all" ? "text-celeste" : ""} />
                Global
              </button>
              {locations.map(loc => (
                <button 
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    selectedLocation === loc.id ? "bg-[#121212] text-white shadow-xl" : "text-[#121212]/40 hover:text-[#121212]"
                  )}
                >
                  <MapPin size={16} className={selectedLocation === loc.id ? "text-verde" : ""} />
                  {loc.nombre}
                </button>
              ))}
              <div className="w-px h-6 bg-[#121212]/10 mx-2" />
              <button 
                onClick={() => setShowLocationModal(true)}
                className="p-2 bg-white text-[#121212] hover:bg-[#121212] hover:text-white border border-[#121212]/10 rounded-xl transition-all shadow-sm"
                title="Nueva Sede (+)"
              >
                <Plus size={20} />
              </button>
           </div>
        </div>
      </header>

      {/* Stats Bar (Colorful PDF Version) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-celeste text-white p-7 rounded-[2.5rem] shadow-xl shadow-celeste/20 flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-inner relative z-10">
               <Package size={28} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Total SKUs</p>
               <h3 className="text-3xl font-serif font-black">{loading ? "..." : stats.total}</h3>
            </div>
         </div>
         <div className={cn(
           "p-7 rounded-[2.5rem] transition-all flex items-center gap-6 relative overflow-hidden group",
           stats.lowStock > 0 ? "bg-naranja text-white shadow-xl shadow-naranja/20" : "bg-white border border-[#121212]/5 text-[#121212] shadow-sm"
         )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner relative z-10",
              stats.lowStock > 0 ? "bg-white/20 text-white" : "bg-[#FDFBF7] text-naranja"
            )}>
               <AlertCircle size={28} className={stats.lowStock > 0 ? "animate-bounce" : ""} />
            </div>
            <div className="relative z-10">
               <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", stats.lowStock > 0 ? "text-white/60" : "text-[#121212]/30")}>Stock Crítico (!)</p>
               <h3 className="text-3xl font-serif font-black">{loading ? "..." : stats.lowStock}</h3>
            </div>
         </div>
         <div className="bg-primary text-white p-7 rounded-[2.5rem] shadow-xl shadow-primary/20 flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-all duration-700" />
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-accent border border-white/5 shadow-inner relative z-10">
               <TrendingUp size={28} />
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Valor de Inventario</p>
               <h3 className="text-3xl font-serif font-black">S/ {loading ? "..." : stats.value.toLocaleString()}</h3>
            </div>
         </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[3rem] border border-[#121212]/5 shadow-2xl shadow-[#121212]/5 overflow-hidden relative">
        <div className="p-8 border-b border-[#121212]/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20 group-focus-within:text-celeste transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Búsqueda rápida de productos..."
                className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-celeste/10 focus:border-celeste transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#FDFBF7] text-[#121212]/40 hover:text-naranja border border-[#121212]/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                 <Filter size={16} /> Filtros (Naranja)
              </button>
              <Link 
                href="/dashboard/inventory/new"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#121212] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-celeste hover:text-white transition-all shadow-lg active:scale-95"
              >
                 <Plus size={16} /> Alta de Producto
              </Link>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FDFBF7]/80 text-[#121212]/40 text-[9px] uppercase font-black tracking-[0.25em] border-b border-[#121212]/5">
                <th className="px-10 py-6">Producto & Referencia</th>
                <th className="px-8 py-6 text-center">Clase (Verde)</th>
                <th className="px-8 py-6 text-center">Nivel de Stock</th>
                <th className="px-8 py-5 text-right">Precio / Valor</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#121212]/5">
               {loading ? (
                 <tr>
                    <td colSpan={5} className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <Loader2 className="animate-spin text-celeste" size={40} />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#121212]/30">Consultando Almacén Central...</p>
                       </div>
                    </td>
                 </tr>
               ) : filteredProducts.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="py-24 text-center text-[#121212]/20 font-serif italic text-2xl">
                       "Sin registros que coincidan"
                    </td>
                 </tr>
               ) : filteredProducts.map((p) => {
                 const threshold = isTienda ? 1 : (p.stock_minimo || 5);
                 const isLow = p.stock <= threshold;
                 
                 return (
                   <tr key={p.id} className="group hover:bg-[#FDFBF7] transition-all duration-300">
                     <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 bg-[#FDFBF7] rounded-[1.25rem] border border-[#121212]/5 overflow-hidden group-hover:border-celeste/30 group-hover:shadow-xl group-hover:shadow-celeste/5 transition-all duration-500">
                              {p.imagen ? <img src={p.imagen} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#121212]/10"><Package size={28} strokeWidth={1} /></div>}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-serif font-black text-xl text-[#121212] tracking-tight">{p.nombre}</p>
                                {isLow && (
                                  <div className="w-6 h-6 bg-naranja text-white rounded-full flex items-center justify-center text-[10px] font-black animate-pulse shadow-lg shadow-naranja/40" title="¡STOCK CRÍTICO!">
                                    !
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/20 flex items-center gap-2 italic">
                                 <span className="text-[#121212] not-italic">{p.sku || 'REF:---'}</span>
                                 • VERIFICADO POR ADMIN
                              </p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-7 text-center">
                        <span className="px-5 py-2 bg-verde/10 border border-verde/20 text-verde text-[9px] font-black uppercase tracking-[0.15em] rounded-full shadow-sm">
                          {p.categoria || 'Sin clase'}
                        </span>
                     </td>
                     <td className="px-8 py-7 text-center">
                        <div className="flex flex-col items-center">
                           <span className={cn(
                             "px-5 py-2.5 rounded-[1rem] text-[11px] font-black tracking-widest transition-all shadow-sm flex items-center gap-3",
                             isLow ? "bg-naranja text-white shadow-naranja/30" : "bg-[#121212] text-white"
                           )}>
                              {p.stock} <span className="opacity-40 text-[9px]">UND</span>
                              {isLow && (
                                <button 
                                  title="Pedido Automático (PDF logic)"
                                  className="ml-1 p-1.5 bg-white/20 hover:bg-white rounded-lg transition-all text-white hover:text-naranja"
                                >
                                   <ArrowRight size={14} />
                                </button>
                              )}
                           </span>
                        </div>
                     </td>
                     <td className="px-8 py-7 text-right">
                        <p className="text-xl font-serif font-black text-[#121212]">S/ {p.precio.toFixed(2)}</p>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 opacity-40">CARGO: S/ {(p.precio * p.stock).toLocaleString()}</p>
                     </td>
                     <td className="px-10 py-7 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                           <button className="p-3.5 bg-white border border-[#121212]/5 text-[#121212]/30 hover:text-celeste hover:border-celeste/20 rounded-xl transition-all shadow-lg hover:shadow-celeste/5">
                              <Edit size={20} />
                           </button>
                           <button className="p-3.5 bg-white border border-[#121212]/5 text-[#121212]/40 hover:text-rose-500 hover:border-rose-100 rounded-xl transition-all shadow-lg hover:shadow-rose-100/5">
                              <Trash2 size={20} />
                           </button>
                        </div>
                        <MoreVertical size={20} className="ml-auto text-[#121212]/5 group-hover:opacity-0 transition-all" />
                     </td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-[#FDFBF7]/50 border-t border-[#121212]/5 flex items-center justify-between">
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]/30">Sincronización Regional Activa • Bellesas Karina System 2026</p>
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                 <CheckCircle2 size={14} /> Base de datos OK
              </span>
           </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121212]/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-[#121212]/10 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-[#121212]/5 flex justify-between items-center">
                 <h3 className="text-2xl font-serif font-bold">Nueva Sede</h3>
                 <button onClick={() => setShowLocationModal(false)} className="p-2 hover:bg-[#121212]/5 rounded-xl transition-all">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleAddLocation} className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-1.5 font-bold uppercase tracking-[0.1em] text-[10px] text-[#121212]/50">
                       <label>Nombre de la Sede</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-[#121212]/5 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 transition-all font-sans text-[#121212]" 
                         placeholder="Ej: Almacén Norte o Tienda Larcomar"
                         value={newLocation.nombre}
                         onChange={(e) => setNewLocation({...newLocation, nombre: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5 font-bold uppercase tracking-[0.1em] text-[10px] text-[#121212]/50">
                       <label>Tipo de Sede</label>
                       <select 
                         className="w-full bg-[#121212]/5 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 transition-all font-sans text-[#121212]"
                         value={newLocation.tipo}
                         onChange={(e) => setNewLocation({...newLocation, tipo: e.target.value})}
                       >
                          <option value="ALMACEN">Almacén (Warehouse)</option>
                          <option value="TIENDA">Tienda (Retail Store)</option>
                       </select>
                    </div>
                    <div className="space-y-1.5 font-bold uppercase tracking-[0.1em] text-[10px] text-[#121212]/50">
                       <label>Dirección Física</label>
                       <input 
                         type="text" 
                         className="w-full bg-[#121212]/5 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 transition-all font-sans text-[#121212]" 
                         placeholder="Ingresa la dirección exacta"
                         value={newLocation.direccion}
                         onChange={(e) => setNewLocation({...newLocation, direccion: e.target.value})}
                       />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-[#121212] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#121212]/90 transition-all shadow-xl">
                    Crear Nueva Sede
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
