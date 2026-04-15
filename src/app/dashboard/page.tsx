"use client";

import React from "react";
import Link from "next/link";
import { Package, ShoppingBag, BarChart3, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MainDashboard() {
  const sections = [
    {
      title: "ALMACEN",
      subtitle: "gestión de inventario y stock",
      href: "/dashboard/inventory",
      icon: <Package size={48} />,
      color: "bg-white",
      hoverIcon: "text-[#FF9100]"
    },
    {
      title: "VENTAS",
      subtitle: "punto de venta y caja",
      href: "/ventas",
      icon: <ShoppingBag size={48} />,
      color: "bg-white",
      hoverIcon: "text-[#FF9100]"
    },
    {
      title: "REPORTES",
      subtitle: "estadísticas de negocio",
      href: "/dashboard/reports",
      icon: <BarChart3 size={48} />,
      color: "bg-white",
      hoverIcon: "text-[#FF9100]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 sm:p-8 lg:p-24 relative overflow-hidden font-sans">
      
      {/* Header Container */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 relative z-10 gap-6 sm:gap-0">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
           <h1 className="text-4xl sm:text-5xl font-black text-[#121212] tracking-tighter uppercase leading-none">
             Bellesas <span className="text-[#FF9100]">Karinas</span>
           </h1>
           <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] font-black uppercase text-[#121212]/40 mt-3 ml-1">Sistema de Gestión de Inventario</p>
        </div>
        
        <Link 
          href="/" 
          className="bg-white border-2 sm:border-4 border-[#FF9100] p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[#FF9100] hover:bg-[#FF9100] hover:text-white transition-all shadow-lg active:scale-95"
          title="Regresar"
        >
          <ArrowLeft size={24} sm:size={28} strokeWidth={3} />
        </Link>
      </header>

      {/* Main Grid Section */}
      <main className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
        {sections.map((section, idx) => (
          <Link
            key={idx}
            href={section.href}
            className={cn(
              "group relative overflow-hidden",
              "flex flex-col items-center justify-center text-center",
              "aspect-[4/5] p-10 rounded-[2.5rem] transition-all duration-300",
              "bg-white border-4 border-[#121212]/5",
              "shadow-xl hover:border-[#FF9100] hover:shadow-2xl hover:-translate-y-2",
              "active:scale-95"
            )}
          >
            <div className="w-24 h-24 bg-[#FDFBF7] text-[#121212]/20 rounded-3xl flex items-center justify-center mb-10 transition-all duration-300 group-hover:bg-[#FF9100]/10 group-hover:text-[#FF9100]">
               {section.icon}
            </div>

            <div className="space-y-4">
               <h2 className="text-3xl font-black tracking-tighter uppercase text-[#121212] group-hover:text-[#FF9100] transition-colors">
                  {section.title}
               </h2>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#121212]/30 max-w-[150px] leading-relaxed mx-auto italic">
                 {section.subtitle}
               </p>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-20 relative z-10 text-center opacity-30">
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#121212]">
           Panel de Control Principal • Bellesas Karinas 2026
         </p>
      </footer>
    </div>
  );
}
