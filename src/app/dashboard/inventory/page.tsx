"use client";

import React, { useState, useEffect } from "react";
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
      
      {/* Header v4 */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-serif font-black text-[#121212]">Control de Existencias</h2>
             <div className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#D4AF37]/20">
                v4.0 Premium
             </div>
          </div>
          <p className="text-[#121212]/50 text-sm font-medium">Bellesas Karinas — {selectedLocation === 'all' ? 'Vista Global Consolidada' : `Sede: ${currentLoc?.nombre}`}</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center bg-white border border-[#121212]/10 rounded-2xl p-1 shadow-sm">
              <button 
                onClick={() => setSelectedLocation("all")}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  selectedLocation === "all" ? "bg-[#121212] text-white shadow-lg" : "text-[#121212]/40 hover:text-[#121212]"
                )}
              >
                Global
              </button>
              {locations.map(loc => (
                <button 
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                    selectedLocation === loc.id ? "bg-[#121212] text-white shadow-lg" : "text-[#121212]/40 hover:text-[#121212]"
                  )}
                >
                  <MapPin size={14} className={selectedLocation === loc.id ? "text-[#D4AF37]" : ""} />
                  {loc.nombre}
                </button>
              ))}
              <button 
                onClick={() => setShowLocationModal(true)}
                className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all ml-1"
                title="Agregar Sede"
              >
                <Plus size={20} />
              </button>
           </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-[#121212]/5 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212] shadow-inner">
               <Package size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Stock Total</p>
               <h3 className="text-2xl font-serif font-bold">{loading ? "..." : stats.total} <span className="text-xs font-sans font-medium text-[#121212]/40 uppercase ml-1">SKUs</span></h3>
            </div>
         </div>
         <div className={cn(
           "p-6 rounded-[2rem] border transition-all flex items-center gap-6",
           stats.lowStock > 0 ? "bg-rose-50 border-rose-100 shadow-rose-900/5 shadow-xl" : "bg-white border-[#121212]/5 shadow-sm"
         )}>
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
              stats.lowStock > 0 ? "bg-rose-100 text-rose-600" : "bg-[#FDFBF7] text-[#121212]"
            )}>
               <AlertCircle size={24} className={stats.lowStock > 0 ? "animate-pulse" : ""} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Stock Bajo</p>
               <h3 className={cn("text-2xl font-serif font-bold", stats.lowStock > 0 ? "text-rose-600" : "")}>{loading ? "..." : stats.lowStock}</h3>
            </div>
         </div>
         <div className="bg-[#121212] p-6 rounded-[2rem] shadow-2xl flex items-center gap-6">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-white/10">
               <TrendingUp size={24} />
            </div>
            <div className="text-white">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Valor Activo</p>
               <h3 className="text-2xl font-serif font-bold">S/ {loading ? "..." : stats.value.toLocaleString()}</h3>
            </div>
         </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-[2.5rem] border border-[#121212]/5 shadow-xl overflow-hidden relative">
        <div className="p-8 border-b border-[#121212]/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20" size={18} />
              <input 
                type="text"
                placeholder="Buscar por nombre, SKU o categoría..."
                className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FDFBF7] text-[#121212]/60 hover:text-[#121212] border border-[#121212]/5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
                 <Filter size={16} /> Filtros
              </button>
              <Link 
                href="/products/new"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#121212]/90 transition-all shadow-lg"
              >
                 <Plus size={16} /> Agregar Producto
              </Link>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FDFBF7]/50 text-[#121212]/40 text-[10px] uppercase font-black tracking-[0.2em] border-b border-[#121212]/5">
                <th className="px-8 py-5">Información General</th>
                <th className="px-8 py-5 text-center">Categoría</th>
                <th className="px-8 py-5 text-center">Existencias</th>
                <th className="px-8 py-5 text-right">Precio / Valor</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#121212]/5">
              {loading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
                         <p className="text-xs font-bold uppercase tracking-widest text-[#121212]/30">Sincronizando base de datos...</p>
                      </div>
                   </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-[#121212]/20 font-serif italic text-xl">
                      No se encontraron resultados para tu búsqueda
                   </td>
                </tr>
              ) : filteredProducts.map((p) => {
                const threshold = isTienda ? 1 : (p.stock_minimo || 5);
                const isLow = p.stock <= threshold;
                
                return (
                  <tr key={p.id} className="group hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl border border-[#121212]/5 overflow-hidden group-hover:border-[#D4AF37]/30 transition-all">
                             {p.imagen ? <img src={p.imagen} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#121212]/20"><Package size={24} /></div>}
                          </div>
                          <div>
                             <p className="font-serif font-bold text-lg text-[#121212] leading-none mb-1">{p.nombre}</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-[#121212]/5 rounded">{p.sku || 'N/A'}</span>
                                • {p.proveedor_id ? 'Original Verified' : 'Standard'}
                             </p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-4 py-1.5 bg-[#FDFBF7] border border-[#121212]/5 text-[#121212]/60 text-[10px] font-black uppercase tracking-widest rounded-full">
                         {p.categoria || 'Sin clase'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center">
                          <span className={cn(
                            "px-4 py-2 rounded-2xl text-xs font-black tracking-widest transition-all shadow-sm flex items-center gap-2",
                            isLow ? "bg-rose-500 text-white shadow-rose-900/20" : "bg-[#121212]/5 text-[#121212]"
                          )}>
                             {p.stock} <span className="opacity-60 text-[9px] font-bold">UNIDS</span>
                             {isLow && (
                               <button 
                                 title="Realizar pedido rápido"
                                 className="ml-1 p-1 bg-white/20 hover:bg-white rounded-lg transition-all text-white hover:text-rose-500"
                               >
                                  <AlertCircle size={14} />
                               </button>
                             )}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <p className="text-lg font-serif font-bold text-[#121212]">S/ {p.precio.toFixed(2)}</p>
                       <p className="text-[10px] font-bold text-[#121212]/30 uppercase tracking-widest mt-0.5">S/ {(p.precio * p.stock).toLocaleString()} Total</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-3 bg-white border border-[#121212]/5 text-[#121212]/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 rounded-xl transition-all shadow-sm">
                             <Edit size={18} />
                          </button>
                          <button className="p-3 bg-white border border-[#121212]/5 text-[#121212]/40 hover:text-rose-500 hover:border-rose-100 rounded-xl transition-all shadow-sm">
                             <Trash2 size={18} />
                          </button>
                       </div>
                       <MoreVertical size={18} className="ml-auto text-[#121212]/10 group-hover:hidden" />
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
