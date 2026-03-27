"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  ArrowLeftRight,
  BarChart3,
  Layers,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Guard } from "@/context/AuthContext";

const menuItems = [
  { name: "Almacén", icon: <Package size={20} />, href: "/dashboard/inventory", color: "var(--naranja)" },
  { name: "Ventas", icon: <ShoppingCart size={20} />, href: "/ventas", color: "var(--primary)" },
  { name: "Proveedores", icon: <Truck size={20} />, href: "/dashboard/suppliers", color: "var(--celeste)" },
  { name: "Movimientos", icon: <ArrowLeftRight size={20} />, href: "/dashboard/movements", color: "var(--primary)" },
  { name: "Reportes", icon: <BarChart3 size={20} />, href: "/dashboard/reports", color: "var(--accent)" },
  { name: "Categorías", icon: <Layers size={20} />, href: "/dashboard/categories", color: "var(--verde)" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Guard roles={['GERENTE', 'EMPLEADO']}>
      <div className="min-h-screen bg-[#FDFBF7] text-[#121212] flex">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#121212]/5 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col p-8">
            
            {/* Logo */}
            <div className="flex flex-col mb-12">
               <h2 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none text-[#121212]">
                 Bellesas
               </h2>
               <span className="text-[9px] tracking-[0.3em] font-black uppercase text-[#D4AF37] mt-1">Karina Paris</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-3">
              <Link 
                href="/dashboard"
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                  pathname === "/dashboard" ? "bg-[#121212] text-white shadow-xl shadow-[#121212]/10" : "hover:bg-[#121212]/5 text-[#121212]/60 hover:text-[#121212]"
                )}
              >
                <LayoutDashboard size={20} />
                <span className="font-bold text-sm uppercase tracking-widest">Dashboard</span>
              </Link>
              
              <div className="pt-6 pb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#121212]/20 px-4 italic">Boceto Oficial</span>
              </div>

              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    style={{ 
                      backgroundColor: isActive ? item.color : 'transparent',
                      color: isActive ? 'white' : 'var(--foreground)'
                    }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group border border-transparent",
                      !isActive && "hover:border-[#121212]/10"
                    )}
                  >
                    <span className={cn(
                      "transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-white" : "text-[#121212]/40 group-hover:text-[#121212]"
                    )} style={{ color: isActive ? 'white' : 'inherit' }}>
                      {item.icon}
                    </span>
                    <span className={cn("font-bold text-xs uppercase tracking-widest", !isActive && "text-[#121212]/60")}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-8 mt-8 border-t border-[#121212]/5 space-y-1">
              <Link 
                 href="/dashboard/settings"
                 className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[#121212]/40 hover:text-[#121212] hover:bg-[#121212]/5 transition-all"
              >
                 <Settings size={20} />
                 <span className="text-xs font-bold uppercase tracking-widest">Ajustes</span>
              </Link>
              <button 
                 className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all"
              >
                 <LogOut size={20} />
                 <span className="text-xs font-bold uppercase tracking-widest">Salir</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header */}
          <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-[#121212]/5 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-[#121212] hover:bg-[#121212]/5 rounded-xl transition-all"
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="hidden sm:block">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 mb-0.5 ml-1">Sistema de Control</p>
               <h1 className="text-xl font-serif font-black text-[#121212]">
                 Bellesas Karinas — <span className="italic text-[#D4AF37]">Inventory v4</span>
               </h1>
            </div>

            <div className="flex items-center gap-4">
               <button className="p-2.5 text-[#121212]/40 hover:text-[#121212] transition-all relative glass bg-[#121212]/5 rounded-xl">
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white" />
               </button>
               
               <div className="h-8 w-px bg-[#121212]/10 mx-2" />
               
               <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                  <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Gerencia</p>
                     <p className="text-[9px] font-bold text-[#D4AF37] opacity-60">Vista Usuario</p>
                  </div>
                  <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-[#121212] border border-[#121212]/5 shadow-sm group-hover:border-[#D4AF37] transition-all duration-300">
                     <User size={18} />
                  </div>
               </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </Guard>
  );
}
