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
  Filter,
  Search,
  ChevronRight,
  MoreVertical,
  MapPin,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

export default function MovementsV4() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filteredMovements = movements.filter(m => filter === "all" || m.tipo === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px]">Logística & Trazabilidad</p>
          <h2 className="text-4xl font-serif font-bold text-[#121212]">Panel de Movimientos</h2>
          <p className="text-[#121212]/50 text-sm">Registro histórico de <span className="text-[#121212] font-semibold">entradas, salidas y traslados</span> inter-sedes.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#121212]/90 transition-all shadow-lg">
              <ArrowLeftRight size={16} /> Nuevo Traslado
           </button>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Pendientes", val: "04", icon: <Clock size={16} />, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/5" },
           { label: "Completados", val: "128", icon: <CheckCircle2 size={16} />, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "En Tránsito", val: "02", icon: <Truck size={16} />, color: "text-blue-600", bg: "bg-blue-50" },
           { label: "Alertas", val: "00", icon: <AlertCircle size={16} />, color: "text-rose-600", bg: "bg-rose-50" },
         ].map((stat, i) => (
           <div key={i} className="bg-white border border-[#121212]/5 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">{stat.label}</p>
                 <h4 className="text-2xl font-serif font-bold mt-1">{stat.val}</h4>
              </div>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                 {stat.icon}
              </div>
           </div>
         ))}
      </div>

      {/* Main Table / Timeline */}
      <div className="bg-white rounded-[2.5rem] border border-[#121212]/5 shadow-xl overflow-hidden min-h-[500px]">
         <div className="p-8 border-b border-[#121212]/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-1 shadow-inner">
               {["all", "PEDIDO_PROVEEDOR", "TRASLADO_ALMACEN"].map(f => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      filter === f ? "bg-[#121212] text-white shadow-lg" : "text-[#121212]/40 hover:text-[#121212]"
                    )}
                 >
                    {f === "all" ? "Todos" : f.replace("_", " ")}
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#121212]/20" size={16} />
                 <input type="text" placeholder="Filtrar por fecha..." className="bg-[#FDFBF7] border border-[#121212]/10 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold uppercase tracking-widest" />
              </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[#FDFBF7]/50 text-[#121212]/40 text-[10px] uppercase font-black tracking-[0.2em] border-b border-[#121212]/5">
                     <th className="px-8 py-5">Naturaleza & Referencia</th>
                     <th className="px-8 py-5">Destino / Origen</th>
                     <th className="px-8 py-5 text-center">Cantidad</th>
                     <th className="px-8 py-5">Responsable</th>
                     <th className="px-8 py-5 text-right">Estado Actual</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#121212]/5">
                  {loading ? (
                    <tr><td colSpan={5} className="py-20 text-center text-[#121212]/20 font-black uppercase tracking-widest italic animate-pulse tracking-[0.5em]">Consultando Archivos...</td></tr>
                  ) : filteredMovements.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-6">
                             <div className="w-20 h-20 bg-[#FDFBF7] rounded-[2rem] flex items-center justify-center text-[#121212]/10 border border-[#121212]/5">
                                <ArrowLeftRight size={40} />
                             </div>
                             <p className="font-serif italic text-[#121212]/30 text-xl font-bold italic">No se registran movimientos en el sistema v4</p>
                          </div>
                       </td>
                    </tr>
                  ) : filteredMovements.map(m => (
                    <tr key={m.id} className="group hover:bg-[#FDFBF7]/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className={cn(
                               "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-[#121212]/5",
                               m.tipo === "PEDIDO_PROVEEDOR" ? "bg-blue-50 text-blue-600" : "bg-[#D4AF37]/5 text-[#D4AF37]"
                             )}>
                                {m.tipo === "PEDIDO_PROVEEDOR" ? <ArrowDownLeft size={18} /> : <ArrowLeftRight size={18} />}
                             </div>
                             <div>
                                <p className="text-sm font-serif font-black text-[#121212] uppercase tracking-tighter leading-none mb-1">{m.nombre_producto}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30">{m.tipo.replace("_", " ")} • ID:{m.id.slice(-6).toUpperCase()}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <MapPin size={14} className="text-[#D4AF37]" />
                             <span className="text-xs font-bold text-[#121212]/60 uppercase tracking-widest italic">{m.destino_id ? "Sede Central" : "Externo"}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <span className="text-sm font-serif font-black text-[#121212]">{m.cantidad}</span>
                          <span className="text-[9px] font-bold text-[#121212]/30 uppercase ml-1">und</span>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-xs font-bold text-[#121212]">Admin User</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30 mt-0.5">Gerencia Premium</p>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em]",
                            m.estado === "RECIBIDO" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                          )}>
                             {m.estado}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-6 bg-[#FDFBF7]/50 border-t border-[#121212]/5 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212]/30">Historial de Auditoría en Tiempo Real</p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline">Imprimir Acta <ChevronRight size={12} /></button>
         </div>
      </div>

    </div>
  );
}
