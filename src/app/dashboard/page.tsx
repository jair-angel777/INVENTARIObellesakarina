"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Scan,
  CheckCircle2,
  Clock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
        const res = await fetchWithAuth(`${apiUrl}/products`);
        if (res.ok) {
          const products = await res.json();
          const low = products.filter((p: any) => p.stock <= (p.stock_minimo || 5)).length;
          const value = products.reduce((acc: number, p: any) => acc + (p.precio * (p.stock || 0)), 0);
          
          setStats({
            totalProducts: products.length,
            lowStock: low,
            inventoryValue: value
          });
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleScan = async (code: string) => {
    // Logic for scanning already in place, but let's keep it simple for now
    console.log("Scanned:", code);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px]">Resumen Ejecutivo</p>
          <h2 className="text-4xl font-serif font-bold text-[#121212]">Bienvenido de nuevo</h2>
          <p className="text-[#121212]/50 text-sm">Gestionando <span className="text-[#121212] font-semibold">Bellesas Karina</span> para el periodo 2026.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#121212]/90 transition-all shadow-lg hover:shadow-[#121212]/20">
              <Plus size={16} /> Nuevo Producto
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#121212]/10 text-[#121212] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all">
              <Scan size={16} /> Escanear
           </button>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Products */}
        <div className="group bg-white p-8 rounded-[2.5rem] border border-[#121212]/5 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212] border border-[#121212]/5">
                 <Package size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Productos Totales</p>
                 <h3 className="text-4xl font-serif font-bold mt-1">{loading ? "..." : stats.totalProducts}</h3>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                 <TrendingUp size={12} /> +12% este mes
              </div>
           </div>
        </div>

        {/* Low Stock */}
        <div className="group bg-white p-8 rounded-[2.5rem] border border-[#121212]/5 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10 space-y-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                stats.lowStock > 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-[#FDFBF7] text-[#121212] border-[#121212]/5"
              )}>
                 <AlertTriangle size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40">Stock Crítico</p>
                 <h3 className={cn(
                   "text-4xl font-serif font-bold mt-1",
                   stats.lowStock > 0 ? "text-rose-600" : ""
                 )}>{loading ? "..." : stats.lowStock}</h3>
              </div>
              <p className="text-[10px] font-bold text-[#121212]/40 uppercase tracking-widest">Revisión necesaria</p>
           </div>
           <button className="absolute bottom-8 right-8 w-10 h-10 bg-[#121212] rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
              <ArrowRight size={18} />
           </button>
        </div>

        {/* Total Value */}
        <div className="group bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all duration-500 relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10 space-y-4 text-white">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-white/10">
                 <h4 className="text-xl font-serif font-black">S/</h4>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Valor del Portafolio</p>
                 <h3 className="text-4xl font-serif font-bold mt-1">
                   {loading ? "..." : stats.inventoryValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                 </h3>
              </div>
              <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" /> Activo Actual
              </p>
           </div>
        </div>

      </div>

      {/* Secondary Row: Activity & Quick Scan */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Recent Activity */}
        <section className="lg:col-span-3 bg-white border border-[#121212]/5 rounded-[2.5rem] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-serif font-bold">Actividad Reciente</h4>
              <button className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:underline transition-all">Ver historial completo</button>
           </div>
           
           <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-[#121212]/5 hover:bg-[#FDFBF7] transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] flex items-center justify-center text-[#121212]/40 border border-[#121212]/5 group-hover:text-[#D4AF37] transition-colors">
                      <Clock size={18} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-[#121212]">Pedido de Almacén recibido</p>
                      <p className="text-[10px] text-[#121212]/40 uppercase tracking-widest font-bold mt-0.5">Tienda Central • Por Maria Garcia</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-[#121212]/60">Hace 2 horas</p>
                      <span className="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Completado</span>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Quick Access Sidebar Card */}
        <section className="lg:col-span-2 space-y-6">
           
           {/* Scan Area */}
           <div className="bg-[#D4AF37] p-8 rounded-[2.5rem] text-[#121212] flex flex-col items-center text-center space-y-6 shadow-xl shadow-[#D4AF37]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                 <Scan size={120} />
              </div>
              <div className="relative z-10 w-full">
                 <h4 className="text-2xl font-serif font-black leading-tight">Acceso Rápido por Código</h4>
                 <p className="text-[11px] font-bold uppercase tracking-widest text-[#121212]/60 mt-2">Usa el escáner para consultas rápidas</p>
              </div>
              <div className="relative z-10 w-full aspect-video bg-[#121212] rounded-[2rem] flex items-center justify-center group-hover:shadow-2xl transition-all">
                 <Scan size={48} className="text-[#D4AF37] animate-pulse" />
              </div>
              <button className="relative z-10 w-full py-4 bg-[#121212] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all">
                Activar Cámara
              </button>
           </div>

           {/* Quick Link */}
           <div className="bg-white border border-[#121212]/10 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-[#D4AF37] transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#FDFBF7] rounded-[1rem] flex items-center justify-center text-[#D4AF37] border border-[#121212]/5">
                    <CheckCircle2 size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-[#121212]">Reporte Diario</p>
                    <p className="text-[10px] text-[#121212]/40 font-bold uppercase tracking-widest">Generar ahora</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-[#121212]/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
           </div>

        </section>
      </div>

    </div>
  );
}
