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
  User,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

interface SaleItem {
  producto_id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  medida: 'UNIDAD' | 'CAJA';
  unidades_por_caja: number;
  subtotal: number;
  imagen?: string;
  stock: number;
}

export default function Ventas() {
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

  const getCantidadReal = (qty: number, medida: string, unxCaja: number) => {
    return medida === 'CAJA' ? qty * (unxCaja || 1) : qty;
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
        return prev.map(item => {
          if (item.producto_id === product.id) {
             const newQty = item.cantidad + 1;
             const realQty = getCantidadReal(newQty, item.medida, item.unidades_por_caja);
             return { ...item, cantidad: newQty, subtotal: realQty * item.precio };
          }
          return item;
        });
      }
      return [...prev, {
        producto_id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        medida: 'UNIDAD',
        unidades_por_caja: product.unidades_por_caja || 1,
        subtotal: product.precio,
        imagen: product.imagen,
        stock: product.stock
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.producto_id === id) {
        const newQty = Math.max(1, item.cantidad + delta);
        const realQty = getCantidadReal(newQty, item.medida, item.unidades_por_caja);
        // Validar stock
        if (realQty > item.stock) {
           setError(`Stock insuficiente (Max: ${item.stock})`);
           setTimeout(() => setError(""), 3000);
           return item;
        }
        return { ...item, cantidad: newQty, subtotal: realQty * item.precio };
      }
      return item;
    }));
  };

  const changeMedida = (id: string, newMedida: 'UNIDAD'|'CAJA') => {
    setCart(prev => prev.map(item => {
      if (item.producto_id === id) {
        const realQty = getCantidadReal(item.cantidad, newMedida, item.unidades_por_caja);
        if (realQty > item.stock) {
           setError(`Stock insuficiente para cajas (Max: ${item.stock} unid)`);
           setTimeout(() => setError(""), 3000);
           return item;
        }
        return { ...item, medida: newMedida, subtotal: realQty * item.precio };
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
      
      const detallesTransformados = cart.map(i => {
         const cantidadReal = getCantidadReal(i.cantidad, i.medida, i.unidades_por_caja);
         return {
            producto_id: i.producto_id,
            cantidad: cantidadReal,
            precio_unitario: i.precio,
            nombre_producto: i.nombre
         };
      });

      const res = await fetchWithAuth(`${apiUrl}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_nombre: clienteNombre || "Cliente General",
          total,
          metodo_pago: metodoPago,
          detalles: detallesTransformados
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

  const formatStock = (stock: number, p: any) => {
     const unidX = p.unidades_por_caja || 1;
     if (unidX <= 1) return stock.toString();
     const cajas = Math.floor(stock / unidX);
     const unidades = stock % unidX;
     if (cajas > 0 && unidades > 0) return `${cajas} Cj + ${unidades} Un`;
     if (cajas > 0) return `${cajas} Cj`;
     return `${unidades} Un`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col font-sans">
      
      {/* Header Simple */}
      <header className="h-20 bg-white border-b border-stone-200 sticky top-0 z-50 px-6 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 bg-stone-100 text-stone-500 rounded-xl flex items-center justify-center hover:bg-[#FF9100] hover:text-white transition-all"
            >
               <ArrowLeft size={20} />
            </button>
            <div>
               <h1 className="text-xl font-black text-[#FF9100] uppercase tracking-tighter">Punto de Venta</h1>
               <p className="text-[10px] font-bold text-stone-400">Caja Registradora Principal</p>
            </div>
         </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* LEFT: Product Catalog */}
         <section className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
            <div className="p-4 border-b border-stone-100 bg-[#FDFBF7]">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Buscar producto..."
                    className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[#FF9100] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
               {loadingProducts ? (
                 <div className="h-full flex flex-col items-center justify-center text-stone-400"><Loader2 className="animate-spin mb-2" size={30} /> Cargando...</div>
               ) : products.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-stone-300">
                    <Package size={48} />
                    <p className="font-bold mt-2">No hay productos</p>
                 </div>
               ) : products.map(p => (
                 <button 
                   key={p.id}
                   onClick={() => addToCart(p)}
                   disabled={p.stock <= 0}
                   className="w-full bg-white p-3 rounded-2xl border border-stone-100 hover:border-[#FF9100] hover:shadow-md transition-all text-left flex items-center gap-4 disabled:opacity-50"
                 >
                    <div className="w-14 h-14 bg-stone-50 rounded-xl overflow-hidden shrink-0">
                       {p.imagen ? <img src={p.imagen} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300"><Package size={20} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-black text-sm text-stone-800 truncate">{p.nombre}</p>
                       <p className="text-[10px] font-bold text-stone-400 mt-0.5">Stock: <span className={cn(p.stock < 5 ? 'text-rose-500' : 'text-emerald-500')}>{formatStock(p.stock, p)}</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-[#FF9100]">S/ {p.precio.toFixed(2)}</p>
                    </div>
                 </button>
               ))}
            </div>
         </section>

         {/* RIGHT: Cart & Payment */}
         <section className="flex flex-col h-[calc(100vh-8rem)] gap-6">
            
            {/* Cart Items */}
            <div className="flex-1 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col overflow-hidden">
               <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-[#FDFBF7]">
                  <h2 className="text-lg font-black text-stone-800">Boleta de Venta</h2>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">Vaciar</button>
                  )}
               </div>

               <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-300">
                       <ShoppingBag size={48} />
                       <p className="font-bold mt-2 text-sm">Lista vacía</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.producto_id} className="flex flex-col gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                         <div className="flex items-start justify-between gap-2">
                             <div className="flex-1 min-w-0">
                                <p className="font-black text-sm text-stone-800 leading-tight">{item.nombre}</p>
                                <p className="text-[10px] font-bold text-stone-400 mt-1">S/ {item.precio.toFixed(2)} x unid.</p>
                             </div>
                             <button onClick={() => removeFromCart(item.producto_id)} className="text-stone-300 hover:text-rose-500 p-1"><Trash2 size={16} /></button>
                         </div>
                         
                         <div className="flex items-center justify-between mt-2">
                             <div className="flex items-center gap-3">
                                <div className="flex items-center bg-white rounded-xl border border-stone-200 p-1">
                                   <button onClick={() => updateQuantity(item.producto_id, -1)} className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-[#FF9100]"><Minus size={14} /></button>
                                   <span className="w-6 text-center font-black text-sm">{item.cantidad}</span>
                                   <button onClick={() => updateQuantity(item.producto_id, 1)} className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-[#FF9100]"><Plus size={14} /></button>
                                </div>
                                {(item.unidades_por_caja > 1) && (
                                   <select 
                                     value={item.medida} 
                                     onChange={(e) => changeMedida(item.producto_id, e.target.value as any)}
                                     className="bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-xl px-2 py-1.5 outline-none focus:border-[#FF9100]"
                                   >
                                      <option value="UNIDAD">Unidades</option>
                                      <option value="CAJA">Cajas</option>
                                   </select>
                                )}
                             </div>
                             <p className="text-base font-black text-[#FF9100]">S/ {item.subtotal.toFixed(2)}</p>
                         </div>
                      </div>
                    ))
                  )}
               </div>

               <div className="p-5 bg-stone-800 text-white flex justify-between items-center rounded-b-3xl">
                  <span className="text-xs font-black uppercase tracking-widest text-stone-300">Total a Pagar</span>
                  <span className="text-3xl font-black text-[#FF9100]">S/ {total.toFixed(2)}</span>
               </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-1 block">Cliente (Opcional)</label>
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                     <input 
                       type="text" 
                       placeholder="Nombre del cliente"
                       className="w-full bg-[#FDFBF7] border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-[#FF9100]"
                       value={clienteNombre}
                       onChange={e => setClienteNombre(e.target.value)}
                     />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Método de Pago</label>
                  <div className="flex gap-2">
                     {[
                       { id: "EFECTIVO", icon: <Banknote size={16}/>, label: "Efectivo" },
                       { id: "TARJETA", icon: <CreditCard size={16}/>, label: "Tarjeta" },
                       { id: "YAPE", icon: <QrCode size={16}/>, label: "Digital" },
                     ].map(m => (
                       <button 
                         key={m.id}
                         onClick={() => setMetodoPago(m.id)}
                         className={cn(
                           "flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all",
                           metodoPago === m.id ? "bg-[#FF9100] border-[#FF9100] text-white shadow-md" : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                         )}
                       >
                          {m.icon}
                          <span className="text-[10px] font-black uppercase">{m.label}</span>
                       </button>
                     ))}
                  </div>
               </div>

               <button 
                 disabled={loadingSale || cart.length === 0}
                 onClick={handleFinalize}
                 className="w-full py-4 bg-stone-800 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {loadingSale ? <Loader2 className="animate-spin" size={16} /> : <>Confirmar Venta <CheckCircle2 size={16} /></>}
               </button>
            </div>

         </section>
      </main>

      {/* SUCCESS OVERLAY */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white p-10 rounded-3xl text-center space-y-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle2 size={40} />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-stone-800 mb-1">¡Venta Exitosa!</h3>
                 <p className="text-[10px] font-bold text-stone-400 uppercase">Stock actualizado en tienda</p>
              </div>
              <button onClick={() => setSuccess(false)} className="w-full py-4 bg-[#FF9100] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-md">Nueva Venta</button>
           </div>
        </div>
      )}

      {/* ERROR TOAST */}
      {error && (
        <div className="fixed bottom-6 right-6 z-[100] bg-rose-500 p-4 rounded-xl text-white shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <AlertCircle size={20} />
           <p className="font-bold text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
