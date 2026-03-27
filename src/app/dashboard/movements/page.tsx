"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeftRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Plus,
  Search,
  ChevronRight,
  MoreVertical,
  MapPin,
  Calendar,
  X,
  FileText,
  Trash2,
  Edit3,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function MovementsV4() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalType, setModalType] = useState<"PROVEEDOR" | "ALMACEN">("PROVEEDOR");
  const [searchTerm, setSearchTerm] = useState("");

  const [orderForm, setOrderForm] = useState({
    productoId: "",
    cantidad: "",
    sedeOrigenId: "",
    sedeDestinoId: "",
    notas: ""
  });

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/movements`);
      if (res.ok) setMovements(await res.json());
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/movements/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus })
      });
      if (res.ok) fetchMovements();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header (PDF Actions) */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-serif font-black text-[#121212]">Panel de Movimientos</h2>
             <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                Logística v4
             </div>
          </div>
          <p className="text-[#121212]/50 text-sm font-medium">Bellesas Karinas — Control de Tránsito y Recepciones</p>
        </div>

        <div className="flex flex-wrap gap-4">
           <button 
             onClick={() => { setModalType("PROVEEDOR"); setShowOrderModal(true); }}
             className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/30 active:scale-95"
           >
              <Truck size={18} className="text-celeste" /> Pedido Proveedor (Azul)
           </button>
           <button 
             onClick={() => { setModalType("ALMACEN"); setShowOrderModal(true); }}
             className="flex items-center gap-3 px-8 py-4 bg-naranja text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-naranja/30 active:scale-95"
           >
              <ArrowLeftRight size={18} /> Pedido Almacén (Naranja)
           </button>
        </div>
      </header>

      {/* Stats row (PDF Context) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Pendientes", val: movements.filter(m => m.estado === 'PENDIENTE').length, icon: <Clock />, color: "bg-naranja" },
           { label: "Recibidos", val: movements.filter(m => m.estado === 'RECIBIDO').length, icon: <CheckCircle2 />, color: "bg-verde" },
           { label: "En Tránsito", val: "02", icon: <Truck />, color: "bg-celeste" },
           { label: "Finalizados", val: "140", icon: <CheckCircle2 />, color: "bg-primary" },
         ].map((stat, i) => (
           <div key={i} className="bg-white border border-[#121212]/5 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-5">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                 {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30">{stat.label}</p>
                 <h4 className="text-xl font-serif font-black">{stat.val}</h4>
              </div>
           </div>
         ))}
      </div>

      {/* TIMELINE / MOVEMENTS TABLE */}
      <div className="bg-white rounded-[3rem] border border-[#121212]/5 shadow-2xl shadow-[#121212]/5 overflow-hidden relative">
         <div className="p-8 border-b border-[#121212]/5 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="relative w-full md:w-96 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  placeholder="Filtrar movimientos..."
                  className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]/20">Auto-Refresco: Activo</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[#FDFBF7]/80 text-[#121212]/40 text-[9px] uppercase font-black tracking-[0.25em] border-b border-[#121212]/5">
                     <th className="px-10 py-6">Operación & Origen</th>
                     <th className="px-8 py-6">Producto</th>
                     <th className="px-8 py-6 text-center">Cant.</th>
                     <th className="px-8 py-6">Responsables (PDF)</th>
                     <th className="px-10 py-6 text-right">Acción de Estado</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#121212]/5">
                  {loading ? (
                    <tr><td colSpan={5} className="py-24 text-center text-[#121212]/20 font-black uppercase tracking-widest italic animate-pulse tracking-[0.5em]"><Loader2 className="animate-spin mx-auto mb-4" /> Consultando Archivos...</td></tr>
                  ) : movements.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="py-24 text-center italic text-[#121212]/30 font-serif text-2xl">
                          "Sin movimientos activos"
                       </td>
                    </tr>
                  ) : movements.map(m => (
                    <tr key={m.id} className="group hover:bg-[#FDFBF7] transition-all duration-300">
                       <td className="px-10 py-7">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                               m.tipo === "PEDIDO_PROVEEDOR" ? "bg-primary/10 text-primary" : "bg-naranja/10 text-naranja"
                             )}>
                                {m.tipo === "PEDIDO_PROVEEDOR" ? <Truck size={20} /> : <ArrowLeftRight size={20} />}
                             </div>
                             <div>
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#121212]">{m.tipo.replace("_", " ")}</p>
                                <p className="text-[9px] font-black text-[#121212]/20 uppercase tracking-widest mt-1 italic">Desde: {m.origen_id ? 'Almacén Central' : 'Proveedor Externo'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-7">
                          <p className="text-lg font-serif font-black text-[#121212] tracking-tighter capitalize">{m.nombre_producto || 'Cargando...'}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/20 mt-1">ID Ref: {m.id.slice(-6).toUpperCase()}</p>
                       </td>
                       <td className="px-8 py-7 text-center">
                          <span className="text-xl font-serif font-black text-[#121212]">{m.cantidad}</span>
                          <span className="text-[9px] font-bold text-[#121212]/30 uppercase ml-2">unid</span>
                       </td>
                       <td className="px-8 py-7">
                          <div className="flex flex-col gap-1">
                             <p className="text-[10px] font-bold text-[#121212]">Ord: <span className="text-primary">Admin Gerente</span></p>
                             {m.estado === 'RECIBIDO' && (
                               <p className="text-[10px] font-bold text-[#121212]">Rec: <span className="text-verde">Personal Tienda</span></p>
                             )}
                          </div>
                       </td>
                       <td className="px-10 py-7 text-right">
                          {m.estado === 'PENDIENTE' ? (
                            <button 
                              onClick={() => handleUpdateStatus(m.id, 'RECIBIDO')}
                              className="px-6 py-3 bg-[#121212] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-verde transition-all shadow-xl shadow-[#121212]/10"
                            >
                               Confirmar Recibo
                            </button>
                          ) : (
                            <div className="flex items-center justify-end gap-2 text-verde">
                               <CheckCircle2 size={16} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Recibido Coréctamente</span>
                            </div>
                          )}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-8 bg-[#FDFBF7]/50 border-t border-[#121212]/5 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]/30 italic">Protocolo de Recepción v4 • Bellesas Karina Paris</p>
            <div className="flex gap-4">
               <button className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Ver Auditoría Completa</button>
            </div>
         </div>
      </div>

      {/* ACTION WINDOW: SPLIT VIEW (PDF REQUIREMENT) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass-overlay animate-in fade-in duration-300">
           <div className={cn("split-window animate-in zoom-in-95 duration-500 border-2", modalType === 'PROVEEDOR' ? 'border-primary/20' : 'border-naranja/20')}>
              
              {/* Left Side: Order Form */}
              <div className="split-left bg-white">
                 <div className="mb-10">
                    <h3 className="text-2xl font-serif font-black text-[#121212]">{modalType === 'PROVEEDOR' ? 'Pedido Específico' : 'Pedido de Almacén'}</h3>
                    <p className={cn("text-[9px] font-black uppercase tracking-widest mt-1", modalType === 'PROVEEDOR' ? 'text-primary' : 'text-naranja')}>Modulo de Reposición (PDF Style)</p>
                 </div>

                 <form className="space-y-6">
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Producto a Solicitar</label>
                          <select className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-xs font-bold focus:ring-4 focus:ring-primary/5 transition-all outline-none">
                             <option>Cargando catálogo...</option>
                          </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Cantidad</label>
                             <input type="number" className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-xs font-bold transition-all" placeholder="Cant." />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Sede Destino</label>
                             <select className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-xs font-bold transition-all">
                                <option>Almacén Central</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <button type="button" className={cn("w-full py-5 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl", modalType === 'PROVEEDOR' ? 'bg-primary shadow-primary/20' : 'bg-naranja shadow-naranja/20')}>
                       Generar Orden de Movimiento
                    </button>
                 </form>
              </div>

              {/* Right Side: History / Context */}
              <div className="split-right bg-[#FDFBF7]/50 relative">
                 <div className="flex justify-between items-center mb-10 sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md pb-4 z-10">
                    <h4 className="text-xl font-serif font-black italic">Historial de {modalType === 'PROVEEDOR' ? 'Proveedor' : 'Interno'}</h4>
                    <button onClick={() => setShowOrderModal(false)} className="p-3 bg-white border border-[#121212]/5 rounded-2xl text-[#121212]/20 hover:text-[#121212] transition-all">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    {movements.filter(m => (modalType === 'PROVEEDOR' ? m.tipo === 'PEDIDO_PROVEEDOR' : m.tipo !== 'PEDIDO_PROVEEDOR')).slice(0, 5).map(m => (
                       <div key={m.id} className="bg-white p-6 rounded-3xl border border-[#121212]/5 group hover:border-primary/10 transition-all shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                             <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/20 italic">{new Date(m.fecha).toLocaleDateString()}</p>
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-2 text-[#121212]/20 hover:text-primary"><FileText size={16} /></button>
                                <button className="p-2 text-[#121212]/20 hover:text-rose-500"><Trash2 size={16} /></button>
                             </div>
                          </div>
                          <p className="text-sm font-serif font-black text-[#121212]">{m.nombre_producto || 'Cargando...'}</p>
                          <div className="mt-4 pt-4 border-t border-[#121212]/5 flex justify-between items-center">
                             <span className="text-[10px] font-black text-verde uppercase tracking-widest">{m.estado}</span>
                             <button className="text-[9px] font-black uppercase text-primary tracking-widest hover:underline">Enviar a Movimientos</button>
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
