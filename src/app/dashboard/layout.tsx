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
  { name: "Almacén", icon: <Package size={20} />, href: "/dashboard/inventory" },
  { name: "Ventas", icon: <ShoppingCart size={20} />, href: "/ventas" },
  { name: "Proveedores", icon: <Truck size={20} />, href: "/dashboard/suppliers" },
  { name: "Movimientos", icon: <ArrowLeftRight size={20} />, href: "/dashboard/movements" },
  { name: "Reportes", icon: <BarChart3 size={20} />, href: "/dashboard/reports" },
  { name: "Categorías", icon: <Layers size={20} />, href: "/dashboard/categories" },
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#121212] text-white transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col p-6">
            
            {/* Logo */}
            <div className="flex flex-col mb-12">
               <h2 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none text-white">
                 Bellesas
               </h2>
               <span className="text-[9px] tracking-[0.3em] font-bold uppercase text-[#D4AF37] mt-1">Karina Paris</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <Link 
                href="/dashboard"
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  pathname === "/dashboard" ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20" : "hover:bg-white/5 text-white/70 hover:text-white"
                )}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Panel General</span>
              </Link>
              
              <div className="pt-6 pb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 px-4">Gestión</span>
              </div>

              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                    pathname.startsWith(item.href) ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20" : "hover:bg-white/5 text-white/70 hover:text-white"
                  )}
                >
                  <span className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    pathname.startsWith(item.href) ? "text-white" : "text-[#D4AF37]"
                  )}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-8 mt-8 border-t border-white/10 space-y-1">
              <Link 
                 href="/dashboard/settings"
                 className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                 <Settings size={20} />
                 <span className="text-sm">Configuración</span>
              </Link>
              <button 
                 className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all font-medium"
              >
                 <LogOut size={20} />
                 <span className="text-sm">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header */}
          <header className="h-20 bg-white/70 backdrop-blur-md border-b border-[#121212]/5 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-[#121212] hover:bg-[#121212]/5 rounded-xl transition-all"
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="hidden sm:block">
               <h1 className="text-xl font-serif font-bold text-[#121212]">
                 Infraestructura Premium v4
               </h1>
            </div>

            <div className="flex items-center gap-4">
               <button className="p-2.5 text-[#121212]/40 hover:text-[#D4AF37] transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>
               
               <div className="h-8 w-px bg-[#121212]/10 mx-2" />
               
               <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-black uppercase tracking-widest text-[#121212]">Admin User</p>
                     <p className="text-[10px] font-bold text-[#D4AF37]">Gerente Regional</p>
                  </div>
                  <div className="w-10 h-10 bg-[#121212] rounded-xl flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37]/20 group-hover:scale-105 transition-all duration-300">
                     <User size={20} />
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
