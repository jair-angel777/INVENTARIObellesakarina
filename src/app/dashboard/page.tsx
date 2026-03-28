"use client";

import React from "react";
import Link from "next/link";
import { Package, ShoppingBag, BarChart3, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MainDashboard() {
  const sections = [
    {
      title: "ALMACEN",
      subtitle: "control de stock y productos",
      href: "/dashboard/inventory", // We'll point this to the new inventory UI
      icon: <Package size={32} />,
      color: "bg-[#4A76C0]",
      shadow: "shadow-[#4A76C0]/20"
    },
    {
      title: "VENTAS",
      subtitle: "registro de transacciones",
      href: "/ventas",
      icon: <ShoppingBag size={32} />,
      color: "bg-[#4A76C0]",
      shadow: "shadow-[#4A76C0]/20"
    },
    {
      title: "REPORTES",
      subtitle: "análisis de datos y estadísticas",
      href: "/dashboard/reports",
      icon: <BarChart3 size={32} />,
      color: "bg-[#4A76C0]",
      shadow: "shadow-[#4A76C0]/20"
    }
  ];

  return (
    <div className="min-h-[85vh] bg-[#FFB800] rounded-[3rem] p-12 relative overflow-hidden transition-all duration-700 animate-in fade-in zoom-in-95">
      {/* Premium Background Textures */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      {/* Header Container */}
      <header className="flex justify-between items-start mb-20 relative z-10">
        <div className="bg-[#4A76C0] px-8 py-4 rounded-xl shadow-2xl border border-white/10">
          <h1 className="text-4xl font-serif font-black text-white tracking-tighter uppercase italic leading-none">
            Bellesas Karinas
          </h1>
        </div>
        
        <Link 
          href="/" 
          className="bg-transparent border-4 border-[#4A76C0] p-4 rounded-xl text-[#4A76C0] hover:bg-[#4A76C0] hover:text-white transition-all transform hover:-translate-x-2 shadow-lg"
          title="Regresar"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </Link>
      </header>

      {/* Main Buttons Section */}
      <main className="max-w-4xl mx-auto flex flex-col gap-10 relative z-10">
        {sections.map((section, idx) => (
          <Link
            key={idx}
            href={section.href}
            className={cn(
              "group relative overflow-hidden",
              "flex items-center justify-center gap-6",
              "py-12 px-8 rounded-2xl transition-all duration-500",
              section.color,
              "text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]",
              "hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98]",
              "border border-white/10"
            )}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col items-center text-center">
               <h2 className="text-3xl font-serif font-black tracking-widest uppercase italic">
                  {section.title}
               </h2>
               <div className="flex items-center gap-3 mt-2">
                  <span className="h-[2px] w-8 bg-white/30" />
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                    {section.subtitle}
                  </p>
                  <span className="h-[2px] w-8 bg-white/30" />
               </div>
            </div>

            {/* Hover Arrow Icon */}
            <div className="absolute right-12 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
               <ArrowLeft className="rotate-180" size={32} />
            </div>
          </Link>
        ))}
      </main>

      {/* Decorative Branding */}
      <footer className="absolute bottom-12 left-12 opacity-20 hidden lg:block">
         <p className="text-xs font-black uppercase tracking-[0.5em] text-black">
           Protocolo de Gestión v5 • Bellesas Karina Paris
         </p>
      </footer>
    </div>
  );
}
