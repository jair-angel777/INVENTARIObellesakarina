"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Search, 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  QrCode,
  CheckCircle2,
  Package,
  AlertCircle,
  ChevronRight,
  User,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

interface SaleItem {
  producto_id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  imagen?: string;
  sku?: string;
}

export default function VentasV4() {
  const router = useRouter();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [clienteNombre, setClienteNombre] = useState("");

  const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.producto_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.producto_id === product.id 
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio }
          : item
        );
      }
      return [...prev, {
        producto_id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        subtotal: product.precio,
        imagen: product.imagen,
        sku: product.sku
      }];
    });
  };

  const handleFinalize = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_nombre: clienteNombre || "Cliente General",
          total,
          metodo_pago: metodoPago,
          detalles: cart.map(i => ({ ...i, nombre_producto: i.nombre }))
        })
      });
      if (res.ok) {
        setSuccess(true);
        setCart([]);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("Error en la transacción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121212] flex flex-col font-sans selection:bg-[#D4AF37]/30">
      
      {/* Premium Header */}
      <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-[#121212]/5 sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-12 h-12 bg-[#121212] text-[#D4AF37] rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95"
            >
               <ArrowLeft size={24} />
            </button>
            <div className="hidden sm:block">
               <h1 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none">Bellesas <span className="text-[#D4AF37]">Karina</span></h1>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#121212]/40 mt-1">Terminal de Salida v4.0</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest animate-pulse">
               <div className="w-2 h-2 bg-emerald-500 rounded-full" /> En Línea
            </div>
         </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* Cart Section */}
         <section className="lg:col-span-2 space-y-8 animate-in slide-in-from-left-4 duration-700">
            <div className="bg-white rounded-[3rem] border border-[#121212]/5 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
               <div className="p-8 border-b border-[#121212]/5 bg-white/50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212]">
                        <ShoppingBag size={24} />
                     </div>
                     <h2 className="text-2xl font-serif font-bold">Carrito de Ventas</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 bg-[#FDFBF7] px-4 py-1.5 rounded-full border border-[#121212]/5">
                    {cart.length} Artículos
                  </span>
               </div>

               <div className="flex-1 p-4 lg:p-8">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 italic">
                       <Zap size={64} className="text-[#D4AF37]" strokeWidth={1} />
                       <p className="text-xl font-serif font-bold italic">La boleta está vacía actualmente</p>
                       <p className="text-xs font-bold uppercase tracking-widest">Escanea o busca productos para facturar</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {cart.map(item => (
                         <div key={item.producto_id} className="flex items-center gap-6 p-4 rounded-[2rem] border border-transparent hover:border-[#121212]/5 hover:bg-[#FDFBF7]/50 transition-all group">
                            <div className="w-20 h-20 bg-[#FDFBF7] rounded-[1.5rem] overflow-hidden border border-[#121212]/5 flex-shrink-0 group-hover:scale-105 transition-transform">
                               {item.imagen ? <img src={item.imagen} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#121212]/20"><Package size={32} /></div>}
                            </div>
                            <div className="flex-1">
                               <p className="text-lg font-serif font-bold text-[#121212]">{item.nombre}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 mt-1">SKU: {item.sku || "N/A"}</p>
                            </div>
                            <div className="flex items-center bg-white rounded-xl border border-[#121212]/5 p-1 shadow-sm">
                               <button className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 text-rose-500 rounded-lg transition-all"><Minus size={14} /></button>
                               <span className="w-10 text-center text-xs font-black">{item.cantidad}</span>
                               <button className="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 text-emerald-500 rounded-lg transition-all"><Plus size={14} /></button>
                            </div>
                            <div className="text-right min-w-[100px]">
                               <p className="text-xl font-serif font-bold text-[#121212]">S/ {item.subtotal.toFixed(2)}</p>
                               <p className="text-[9px] font-black uppercase text-[#121212]/30">Unit: S/ {item.precio.toFixed(2)}</p>
                            </div>
                            <button className="p-3 text-[#121212]/10 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
         </section>

         {/* Checkout Section */}
         <section className="space-y-8 animate-in slide-in-from-right-4 duration-700">
            <div className="bg-[#121212] text-white p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
               
               <div className="relative z-10">
                  <h3 className="text-xl font-serif font-bold italic text-[#D4AF37]">Resumen de Cobro</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">Venta Autorizada</p>
               </div>

               <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Identificación Cliente</label>
                     <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="text" 
                          placeholder="Nombre o DNI (Opcional)"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none"
                          value={clienteNombre}
                          onChange={e => setClienteNombre(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Modalidad de Pago</label>
                     <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "EFECTIVO", icon: <Banknote size={20} />, label: "Cash" },
                          { id: "TARJETA", icon: <CreditCard size={20} />, label: "Card" },
                          { id: "YAPE", icon: <QrCode size={20} />, label: "Digital" },
                        ].map(m => (
                          <button 
                            key={m.id}
                            onClick={() => setMetodoPago(m.id)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-3 p-4 rounded-[1.5rem] border transition-all active:scale-95",
                              metodoPago === m.id ? "bg-[#D4AF37] border-[#D4AF37] text-[#121212] shadow-lg shadow-[#D4AF37]/20" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                            )}
                          >
                             {m.icon}
                             <span className="text-[8px] font-black uppercase tracking-widest">{m.label}</span>
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 border-t border-white/10 space-y-6">
                     <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Total Final</p>
                        <h4 className="text-5xl font-serif font-black tracking-tighter">S/ {total.toFixed(2)}</h4>
                     </div>
                     <button 
                       disabled={loading || cart.length === 0}
                       onClick={handleFinalize}
                       className="w-full py-6 bg-[#D4AF37] text-[#121212] rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale"
                     >
                        Confirmar Transacción <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white border border-[#121212]/5 rounded-[2.5rem] space-y-4 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-[#D4AF37] border border-[#121212]/5">
                     <CheckCircle2 size={24} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/40">Integración de Stock</p>
                     <p className="text-xs font-bold text-[#121212]">Actualización Automática v4</p>
                  </div>
               </div>
               <p className="text-[10px] text-[#121212]/40 leading-relaxed font-medium italic">
                 "Al confirmar esta venta, el inventario se reducirá automáticamente de la sede seleccionada en la configuración de caja."
               </p>
            </div>
         </section>

      </main>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="bg-white p-12 rounded-[4rem] text-center space-y-8 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-500 max-w-sm w-full">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <CheckCircle2 size={48} strokeWidth={3} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-serif font-black text-[#121212]">Venta Exitosa</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30">Stock actualizado en tiempo real</p>
              </div>
              <button onClick={() => setSuccess(false)} className="w-full py-4 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-widest text-xs">Cerrar</button>
           </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-12 right-12 z-[200] bg-rose-500 p-6 rounded-[2rem] text-white shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-4 duration-500">
           <AlertCircle size={24} />
           <p className="font-bold text-sm uppercase tracking-widest">{error}</p>
        </div>
      )}
    </div>
  );
}
