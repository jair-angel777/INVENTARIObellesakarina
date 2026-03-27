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
  Zap,
  Loader2
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
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [clienteNombre, setClienteNombre] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/products?nombre=${searchTerm}`);
      if (res.ok) setProducts(await res.json());
    } catch (error) {
       console.error(error);
    } finally {
       setLoadingProducts(false);
    }
  };

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      setError("Producto sin stock disponible");
      setTimeout(() => setError(""), 3000);
      return;
    }
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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.producto_id === id) {
        const newQty = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQty, subtotal: newQty * item.precio };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.producto_id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleFinalize = async () => {
    if (cart.length === 0) return;
    setLoadingSale(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_nombre: clienteNombre || "Cliente General",
          total,
          metodo_pago: metodoPago,
          detalles: cart.map(i => ({ producto_id: i.producto_id, cantidad: i.cantidad, precio_unitario: i.precio, nombre_producto: i.nombre }))
        })
      });
      if (res.ok) {
        setSuccess(true);
        setCart([]);
        setClienteNombre("");
        fetchProducts();
      } else {
        const data = await res.json();
        setError(data.mensaje || "Error en la transacción");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoadingSale(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121212] flex flex-col font-sans selection:bg-celeste/30">
      
      {/* Header v4 (PDF Style) */}
      <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-[#121212]/5 sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-12 h-12 bg-[#121212] text-celeste rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95"
            >
               <ArrowLeft size={24} />
            </button>
            <div>
               <h1 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none">Bellesas <span className="text-accent underline decoration-celeste underline-offset-4">Karina</span></h1>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#121212]/40 mt-1">Punto de Venta Oficial v4</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-white border border-[#121212]/5 rounded-2xl shadow-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest text-[#121212]/50 italic text-center">Terminal Autorizada <br/> por Gerencia</span>
            </div>
         </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 lg:p-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* LEFT: Product Catalog */}
         <section className="xl:col-span-4 space-y-6 flex flex-col h-[calc(100vh-12rem)]">
            <div className="relative group shrink-0">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#121212]/30 group-focus-within:text-celeste transition-colors" size={20} />
               <input 
                 type="text"
                 placeholder="Buscar por Nombre o SKU..."
                 className="w-full bg-white border-2 border-[#121212]/5 rounded-[2rem] py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-celeste focus:ring-4 focus:ring-celeste/10 transition-all shadow-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <div className="flex-1 bg-white/40 rounded-[3rem] border border-[#121212]/5 p-6 overflow-y-auto space-y-4 custom-scrollbar">
               {loadingProducts ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-30"><Loader2 className="animate-spin" size={40} /></div>
               ) : products.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <Package size={64} strokeWidth={1} />
                    <p className="font-serif italic text-xl mt-4">"No hay productos en catálogo"</p>
                 </div>
               ) : products.map(p => (
                 <button 
                   key={p.id}
                   onClick={() => addToCart(p)}
                   disabled={p.stock <= 0}
                   className="w-full bg-white p-4 rounded-[2rem] border border-[#121212]/5 hover:border-celeste/30 hover:shadow-xl hover:shadow-celeste/5 transition-all text-left flex items-center gap-4 group disabled:opacity-40 disabled:grayscale"
                 >
                    <div className="w-16 h-16 bg-[#FDFBF7] rounded-[1.25rem] border border-[#121212]/5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                       {p.imagen ? <img src={p.imagen} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#121212]/10"><Package size={24} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-serif font-black text-lg text-[#121212] tracking-tighter truncate leading-none mb-1">{p.nombre}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/30">Stock: <span className={cn(p.stock < 5 ? 'text-naranja' : 'text-verde')}>{p.stock} UNID</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-base font-serif font-black text-[#121212]">S/ {p.precio.toFixed(2)}</p>
                       <div className="w-8 h-8 bg-celeste/10 text-celeste rounded-xl flex items-center justify-center mt-1 group-hover:bg-celeste group-hover:text-white transition-all">
                          <Plus size={16} />
                       </div>
                    </div>
                 </button>
               ))}
            </div>
         </section>

         {/* CENTER: Current Order (Registry) */}
         <section className="xl:col-span-5 flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex-1 bg-white rounded-[4rem] border-2 border-[#121212]/5 shadow-2xl overflow-hidden flex flex-col">
               <div className="p-10 border-b border-[#121212]/5 flex justify-between items-center bg-white/50 backdrop-blur-md">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 bg-primary text-celeste rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShoppingBag size={28} />
                     </div>
                     <div>
                        <h2 className="text-3xl font-serif font-black text-[#121212] tracking-tighter">Registro de Venta</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#121212]/30">Artículos en Boleta: {cart.length}</p>
                     </div>
                  </div>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest">Vaciar</button>
                  )}
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 italic space-y-4">
                       <Zap size={80} className="text-accent" strokeWidth={1} />
                       <h3 className="text-2xl font-serif font-black">"Lista de cobro vacía"</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed mt-2">Selecciona productos a la izquierda <br/> para comenzar la transacción</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.producto_id} className="flex items-center gap-6 group">
                         <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl border border-[#121212]/5 overflow-hidden shrink-0">
                            {item.imagen ? <img src={item.imagen} className="w-full h-full object-cover" /> : <Package size={24} />}
                         </div>
                         <div className="flex-1">
                            <p className="font-serif font-black text-xl text-[#121212] tracking-tighter leading-none">{item.nombre}</p>
                            <p className="text-[9px] font-black uppercase text-[#121212]/30 mt-1">S/ {item.precio.toFixed(2)} c/u</p>
                         </div>
                         <div className="flex items-center bg-[#FDFBF7] rounded-[1.25rem] border border-[#121212]/5 p-1.5 shadow-sm">
                            <button onClick={() => updateQuantity(item.producto_id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white text-[#121212]/30 hover:text-rose-500 rounded-lg transition-all"><Minus size={14} /></button>
                            <span className="w-10 text-center font-serif font-black text-sm">{item.cantidad}</span>
                            <button onClick={() => updateQuantity(item.producto_id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white text-[#121212]/30 hover:text-verde rounded-lg transition-all"><Plus size={14} /></button>
                         </div>
                         <div className="text-right min-w-[100px]">
                            <p className="text-xl font-serif font-black text-[#121212]">S/ {item.subtotal.toFixed(2)}</p>
                         </div>
                         <button onClick={() => removeFromCart(item.producto_id)} className="p-3 text-[#121212]/5 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    ))
                  )}
               </div>

               <div className="p-10 bg-[#121212] text-white">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Base Imponible / Total</span>
                     <span className="text-4xl font-serif font-black text-celeste">S/ {total.toFixed(2)}</span>
                  </div>
               </div>
            </div>
         </section>

         {/* RIGHT: Payment & Client */}
         <section className="xl:col-span-3 space-y-10 animate-in fade-in duration-1000">
            <div className="bg-white p-10 rounded-[3.5rem] border border-[#121212]/5 shadow-sm space-y-10">
               <div>
                  <h3 className="text-xl font-serif font-black text-[#121212]">Checkout Final</h3>
                  <div className="h-1 w-12 bg-celeste mt-2 rounded-full" />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40 ml-1">Identificar Cliente</label>
                  <div className="relative group">
                     <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#121212]/20 group-focus-within:text-celeste transition-colors" size={20} />
                     <input 
                       type="text" 
                       placeholder="Nombre (Opcional)"
                       className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-celeste/5 transition-all"
                       value={clienteNombre}
                       onChange={e => setClienteNombre(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/40 ml-1">Modalidad de Pago (PDF)</label>
                  <div className="grid grid-cols-1 gap-3">
                     {[
                       { id: "EFECTIVO", icon: <Banknote />, label: "Efectivo / Cash", desc: "Pago en ventanilla física" },
                       { id: "TARJETA", icon: <CreditCard />, label: "Tarjeta / POS", desc: "Visa, Mastercard, Amex" },
                       { id: "YAPE", icon: <QrCode />, label: "Transferencia Digital", desc: "Yape, Plin o QR" },
                     ].map(m => (
                       <button 
                         key={m.id}
                         onClick={() => setMetodoPago(m.id)}
                         className={cn(
                           "flex items-center gap-5 p-5 rounded-[2rem] border-2 transition-all text-left",
                           metodoPago === m.id ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white border-[#121212]/5 text-[#121212]/40 hover:bg-[#FDFBF7]"
                         )}
                       >
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", metodoPago === m.id ? 'bg-celeste text-primary' : 'bg-[#FDFBF7] text-[#121212]/20')}>
                             {React.cloneElement(m.icon as React.ReactElement, { size: 24 })}
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest">{m.label}</p>
                             <p className="text-[8px] opacity-40 uppercase font-black tracking-widest mt-0.5">{m.desc}</p>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>

               <button 
                 disabled={loadingSale || cart.length === 0}
                 onClick={handleFinalize}
                 className="w-full py-6 bg-[#121212] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-celeste transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-20 active:scale-95"
               >
                  {loadingSale ? <Loader2 className="animate-spin" size={18} /> : <>Sincronizar Venta <ChevronRight size={18} /></>}
               </button>
            </div>

            <div className="p-8 bg-verde/10 border border-verde/20 rounded-[2.5rem] flex items-start gap-4">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-verde shrink-0 shadow-sm">
                  <CheckCircle2 size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-verde mb-1 italic">Operativo Inteligente</p>
                  <p className="text-[10px] font-bold text-verde/60 leading-relaxed">
                     "El stock se descontará automáticamente de la TIENDA vinculada a esta terminal v4."
                  </p>
               </div>
            </div>
         </section>

      </main>

      {/* SUCCESS OVERLAY as per PDF design tips */}
      {success && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 glass-overlay animate-in fade-in duration-500">
           <div className="bg-white p-16 rounded-[4rem] text-center space-y-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-500 max-w-sm w-full">
              <div className="w-28 h-28 bg-verde/10 text-verde rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                 <div className="absolute inset-0 bg-verde/20 rounded-full animate-ping" />
                 <CheckCircle2 size={56} strokeWidth={3} className="relative z-10" />
              </div>
              <div className="space-y-3">
                 <h3 className="text-4xl font-serif font-black text-[#121212] tracking-tighter">¡Venta Éxitosa!</h3>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#121212]/30 italic">Cloud Sync Completada v4</p>
              </div>
              <button onClick={() => setSuccess(false)} className="w-full py-5 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-celeste transition-all shadow-lg active:scale-95">Continuar Vendiendo</button>
           </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-10 right-10 z-[200] bg-rose-500 p-8 rounded-[3rem] text-white shadow-2xl flex items-center gap-5 animate-in slide-in-from-right-10 duration-500 border-4 border-white/20">
           <AlertCircle size={28} />
           <p className="font-black text-[10px] uppercase tracking-[0.2em]">{error}</p>
        </div>
      )}
    </div>
  );
}
