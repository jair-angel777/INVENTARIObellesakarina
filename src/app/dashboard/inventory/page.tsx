"use client";

import React, { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  User,
  Settings,
  Package,
  ShoppingCart,
  BarChart3,
  Layers,
  Truck,
  ArrowLeftRight,
  Download,
  Trash2,
  Edit,
  X,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";
import { generateBoleta } from "@/lib/pdf";
import Link from "next/link";

export default function InventoryPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals state
  const [showModal, setShowModal] = useState<string | null>(null);

  // Form states
  const [providerForm, setProviderForm] = useState({ nombre: '', email: '', telefono: '' });
  const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '' });
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // For quick order

  useEffect(() => {
    loadData();
    loadAuxiliaryData();
  }, []);

  const handleQuickOrder = (p: any) => {
    setSelectedProduct(p);
    // Determine if it's a provider order (from Warehouse) or warehouse order (from Store)
    // For now, let's open the 'order-specific' modal
    setShowModal('order-specific');
  };

  const handleUpdateMovementStatus = async (id: string, estado: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/movements/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado, recibido_nombre: "Usuario Admin" }) 
    });
    if (res.ok) {
       loadAuxiliaryData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const locRes = await fetchWithAuth(`${apiUrl}/locations`);
      if (locRes.ok) {
        const locData = await locRes.json();
        setLocations(locData);
        setActiveLocations(locData.map((l: any) => l.id));
      }

      const prodRes = await fetchWithAuth(`${apiUrl}/products`);
      if (prodRes.ok) {
        setProducts(await prodRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuxiliaryData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    try {
      const [provRes, catRes, ordRes] = await Promise.all([
        fetchWithAuth(`${apiUrl}/suppliers`),
        fetchWithAuth(`${apiUrl}/categories`),
        fetchWithAuth(`${apiUrl}/orders`)
      ]);
      if (provRes.ok) setProviders(await provRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (e) { console.error(e); }
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(providerForm)
    });
    if (res.ok) {
      setProviderForm({ nombre: '', email: '', telefono: '' });
      loadAuxiliaryData();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm)
    });
    if (res.ok) {
      setCategoryForm({ nombre: '', descripcion: '' });
      loadAuxiliaryData();
    }
  };

  const toggleLocation = (id: string) => {
    setActiveLocations(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: filteredProducts.length,
    lowStock: filteredProducts.filter(p => {
        return p.stock <= 1; 
    }).length,
    value: filteredProducts.reduce((acc, p) => acc + (p.precio * p.stock), 0)
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#FFB800] flex flex-col font-sans text-stone-900 overflow-hidden">
      
      {/* HEADER */}
      <header className="h-20 bg-[#FFB800] flex items-center justify-between px-8 shrink-0">
        <div className="bg-[#4A76C0] px-6 py-2 rounded-lg shadow-xl border border-white/20">
          <h1 className="text-2xl font-serif font-black text-white tracking-tighter uppercase italic leading-none">
            Bellesas Karinas
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#4A76C0] px-6 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
            ALMACEN - control de stock y productos
          </div>
          <div className="bg-[#4A76C0]/60 px-6 py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
            Vista Usuario
          </div>
          <Link href="/dashboard" className="bg-transparent border-4 border-[#4A76C0] p-3 rounded-xl text-[#4A76C0] hover:bg-[#4A76C0] hover:text-white transition-all shadow-lg">
             <ArrowLeft size={24} strokeWidth={3} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#76C176] p-6 flex flex-col gap-6 shrink-0 border-r-4 border-black/5 overflow-y-auto">
           <div className="bg-white p-4 rounded-2xl shadow-2xl border border-black/5">
              <p className="text-[10px] font-black uppercase tracking-tighter text-stone-400">VISUALISANDO:</p>
              <p className="text-xs font-black text-[#4A76C0] mt-1">
                {activeLocations.length === locations.length ? "Todas las tablas" : activeLocations.length === 0 ? "Ninguna" : "Tablas seleccionadas"}
              </p>
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                <div className="bg-white px-3 py-1 rounded inline-block">
                  <p className="text-[10px] font-black uppercase text-[#76C176]">Almacén:</p>
                </div>
                {locations.filter(l => l.tipo === 'ALMACEN').map(loc => (
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl shadow-md border-2", activeLocations.includes(loc.id) ? "bg-[#4A76C0] text-white border-white/20" : "bg-white/40 text-[#4A76C0] border-transparent hover:bg-white/60")}>
                    <div className="bg-white/90 p-1.5 rounded-lg text-[#4A76C0]">
                      {activeLocations.includes(loc.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter truncate">{loc.nombre}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <div className="bg-white px-3 py-1 rounded inline-block">
                   <p className="text-[10px] font-black uppercase text-[#76C176]">Tiendas:</p>
                </div>
                {locations.filter(l => l.tipo === 'TIENDA').map(loc => (
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl shadow-md border-2", activeLocations.includes(loc.id) ? "bg-[#4A76C0] text-white border-white/20" : "bg-white/40 text-[#4A76C0] border-transparent hover:bg-white/60")}>
                    <div className="bg-white/90 p-1.5 rounded-lg text-[#4A76C0]">
                      {activeLocations.includes(loc.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter truncate">{loc.nombre}</span>
                  </button>
                ))}
              </div>
           </div>

           <button onClick={() => setShowModal('add-location')} className="mt-auto w-full aspect-square bg-[#4A76C0] rounded-3xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-2xl border-4 border-white/20 group">
              <Plus size={48} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" />
           </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-[#F39C12] p-8 flex flex-col gap-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
               {[
                 { label: "Total de productos", val: stats.total },
                 { label: "Total stock bajo", val: stats.lowStock },
                 { label: "Valor inventario", val: `S/ ${stats.value.toLocaleString()}` }
               ].map((stat, i) => (
                 <div key={i} className="bg-[#4A76C0] p-8 rounded-[2.5rem] text-white text-center flex flex-col items-center justify-center min-h-[160px] shadow-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">{stat.label}</p>
                    <h4 className="text-3xl font-serif font-black italic tracking-tighter">{stat.val}</h4>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl flex-1 flex flex-col min-h-[500px] overflow-hidden border-8 border-[#4A76C0]/10">
               <div className="px-10 py-8 border-b-2 border-stone-100 flex justify-between items-center bg-stone-50/30">
                  <div className="relative w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
                    <input type="text" placeholder="Consultar inventario..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#F8F9FA] border border-stone-200 text-xs font-bold focus:border-[#4A76C0] outline-none shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="bg-[#4A76C0] px-8 py-3 rounded-xl">
                    <span className="text-lg font-serif font-black italic text-white tracking-widest leading-none">TABLA</span>
                  </div>
               </div>

               <div className="overflow-auto flex-1 px-4">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead className="sticky top-0 z-20">
                      <tr className="bg-[#4A76C0] text-white text-[10px] font-black uppercase tracking-widest">
                        <th className="px-10 py-5 rounded-l-2xl">Producto</th>
                        <th className="px-8 py-5">Categoría</th>
                        <th className="px-8 py-5 text-center">Stock</th>
                        <th className="px-8 py-5">Estado</th>
                        <th className="px-10 py-5 rounded-r-2xl text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                         <tr><td colSpan={5} className="py-20 text-center font-serif text-2xl text-stone-300 animate-pulse">Cargando...</td></tr>
                      ) : filteredProducts.map((p) => {
                        const isLowStock = p.stock <= 1;
                        return (
                          <tr key={p.id} className="group bg-stone-50/50 hover:bg-[#FDFBF7] transition-all relative">
                            <td className="px-10 py-6 rounded-l-2xl border-l border-y border-stone-100">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-serif font-black text-[#4A76C0] tracking-tighter">{p.nombre}</span>
                                {isLowStock && <AlertTriangle size={16} className="text-rose-500 animate-bounce" fill="currentColor" />}
                              </div>
                            </td>
                            <td className="px-8 py-6 border-y border-stone-100">
                               <span className="text-[10px] font-black uppercase px-3 py-1 bg-stone-200 text-stone-500 rounded-md">{p.categoria || "S/C"}</span>
                            </td>
                            <td className="px-8 py-6 text-center border-y border-stone-100">
                              <span className={cn("text-2xl font-serif font-black", isLowStock ? "text-rose-500" : "text-[#121212]/80")}>{p.stock}</span>
                            </td>
                            <td className="px-8 py-6 border-y border-stone-100">
                              <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", isLowStock ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600")}>
                                {isLowStock ? "Bajo" : "OK"}
                              </div>
                            </td>
                            <td className="px-10 py-6 rounded-r-2xl border-r border-y border-stone-100 text-right">
                               <button 
                                 onClick={() => handleQuickOrder(p)}
                                 className="px-6 py-3 bg-[#121212] text-white text-[9px] font-black uppercase rounded-xl opacity-0 group-hover:opacity-100 shadow-xl transition-all hover:bg-[#4A76C0]" 
                                 title="Pedir"
                               >
                                  <Truck size={16} />
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
            </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-24 bg-[#76C176] p-4 flex flex-col items-center gap-6 shrink-0 border-l-4 border-black/5 overflow-y-auto">
           <div className="bg-white px-2 py-4 rounded-xl text-center w-full shadow-2xl border border-black/5">
              <p className="text-[8px] font-black uppercase leading-tight text-stone-400">ACCIONES <br/> USUARIO</p>
           </div>
           
           <div className="flex flex-col gap-5 items-center">
              {[
                { id: 'providers', color: 'bg-[#B0E0E6]', icon: <Truck size={24} /> },
                { id: 'categories', color: 'bg-[#90EE90]', icon: <Layers size={24} /> },
                { id: 'filter-stock', color: 'bg-[#F4A460]', icon: <AlertTriangle size={24} /> },
                { id: 'filter-general', color: 'bg-[#FF8C00]', icon: <Search size={24} /> },
                { id: 'order-warehouse', color: 'bg-[#D2691E]', icon: <ShoppingCart size={24} /> },
                { id: 'order-specific', color: 'bg-[#191970]', icon: <FileText size={24} /> },
                { id: 'movements', color: 'bg-[#B22222]', icon: <ArrowLeftRight size={24} /> }
              ].map((btn) => (
                <button key={btn.id} onClick={() => setShowModal(btn.id)} className={cn("w-14 h-14 rounded-full border-4 border-white shadow-2xl hover:scale-110 active:scale-90 transition-all text-white flex items-center justify-center", btn.color)}>
                  {btn.icon}
                </button>
              ))}
           </div>
        </aside>

      </div>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className={cn(
             "bg-white w-full max-w-6xl h-[85vh] rounded-[4rem] shadow-2xl flex relative overflow-hidden animate-in zoom-in-95 duration-500 border-8",
             showModal === 'movements' ? 'border-[#B22222]/30' : 'border-white/20'
           )}>
              <button onClick={() => setShowModal(null)} className="absolute top-8 right-8 p-4 bg-stone-100 text-stone-500 rounded-full hover:bg-rose-500 hover:text-white transition-all z-[110] shadow-xl">
                <X size={24} />
              </button>
              
              <div className="flex w-full">
                 {/* LEFT FORM/INFO */}
                 <div className="w-[40%] bg-stone-50 p-16 flex flex-col border-r-4 border-stone-100">
                    <h3 className="text-4xl font-serif font-black text-[#4A76C0] uppercase italic tracking-tighter mb-10">
                      {showModal.split("-").join(" ")}
                    </h3>
                    
                    {showModal === 'movements' && (
                       <div className="space-y-8">
                          <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-stone-50">
                             <p className="text-[10px] font-black uppercase text-stone-400 mb-2">Resumen Operativo</p>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-stone-600">Pendientes</span>
                                <span className="text-2xl font-serif font-black text-[#B22222]">
                                   {orders.filter(o => o.status === 'PENDIENTE').length}
                                </span>
                             </div>
                          </div>
                          <p className="text-sm text-stone-500 italic">Aquí puedes monitorear y recibir pedidos de almacén y proveedores.</p>
                       </div>
                    )}
                    
                    {showModal === 'providers' && (
                       <form onSubmit={handleCreateProvider} className="space-y-6">
                         <input value={providerForm.nombre} onChange={e => setProviderForm({...providerForm, nombre: e.target.value})} className="w-full p-4 rounded-2xl bg-white border-2 border-stone-100 outline-none focus:border-[#4A76C0] font-bold shadow-inner" placeholder="Razón Social" required />
                         <input value={providerForm.email} onChange={e => setProviderForm({...providerForm, email: e.target.value})} className="w-full p-4 rounded-2xl bg-white border-2 border-stone-100 outline-none focus:border-[#4A76C0] font-bold shadow-inner" placeholder="Email" />
                         <button type="submit" className="w-full py-6 bg-[#4A76C0] text-white rounded-[2rem] font-black uppercase text-xs mt-6 transition-all shadow-xl">Guardar</button>
                       </form>
                    )}

                    {showModal === 'order-specific' && selectedProduct && (
                       <div className="space-y-6">
                          <div className="bg-white p-8 rounded-3xl border-2 border-[#191970]/10 shadow-xl">
                             <p className="text-[10px] font-black uppercase text-[#191970] mb-4">Pedido para:</p>
                             <h4 className="text-2xl font-serif font-black text-[#191970] italic italic leading-none mb-1">{selectedProduct.nombre}</h4>
                             <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-2">{selectedProduct.categoria || 'Sin Categoría'}</p>
                          </div>
                          <button onClick={() => setShowModal('movements')} className="w-full py-6 bg-[#191970] text-white rounded-[2rem] font-black uppercase text-xs mt-8 shadow-2xl">Confirmar Pedido</button>
                       </div>
                    )}
                 </div>

                 {/* RIGHT TABLE/LIST */}
                 <div className="w-[60%] p-16 bg-white overflow-hidden flex flex-col">
                    <h4 className="text-2xl font-serif font-black text-stone-300 italic mb-8">
                       {showModal === 'movements' ? 'Historial de Movimientos' : 'Listado General'}
                    </h4>
                    
                    <div className="flex-1 overflow-auto rounded-[2rem] border-4 border-stone-50 p-4 bg-stone-50/20">
                       <table className="w-full text-left border-separate border-spacing-y-2">
                         <thead className="text-[10px] font-black uppercase tracking-widest text-[#4A76C0] border-b">
                           <tr>
                             <th className="px-4 py-2">Referencia / Info</th>
                             <th className="px-4 py-2">Status</th>
                             <th className="px-4 py-2 text-right">Boleta</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y-4 divide-transparent">
                           {(showModal === 'movements' ? orders : 
                             showModal === 'providers' ? providers : 
                             showModal === 'categories' ? categories : []).map((item: any) => (
                             <tr key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
                               <td className="px-4 py-5 rounded-l-xl">
                                  <p className="font-bold text-stone-800">{item.nombre || `Pedido #${item.id.slice(-4)}`}</p>
                                  <div className="flex gap-4 mt-1">
                                     <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">
                                        Por: {item.solicitado_nombre || item.email || 'Admin'}
                                     </p>
                                     {item.recibido_nombre && (
                                        <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">
                                           Recibido: {item.recibido_nombre}
                                        </p>
                                     )}
                                  </div>
                               </td>
                               <td className="px-4 py-5">
                                  <button 
                                    disabled={item.status === 'RECIBIDO'}
                                    onClick={() => handleUpdateMovementStatus(item.id, 'RECIBIDO')}
                                    className={cn(
                                      "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md transition-all shadow-sm active:scale-95",
                                      item.status === 'RECIBIDO' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600 hover:bg-emerald-500 hover:text-white"
                                    )}
                                  >
                                     {item.status || 'Activo'}
                                  </button>
                               </td>
                               <td className="px-4 py-5 rounded-r-xl text-right">
                                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => generateBoleta(item)}
                                      className="p-2.5 bg-[#4A76C0]/10 text-[#4A76C0] rounded-lg hover:bg-[#4A76C0] hover:text-white transition-all shadow-sm" 
                                      title="Descargar Boleta PDF"
                                    >
                                      <Download size={16} strokeWidth={3} />
                                    </button>
                                    <button className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                      <Trash2 size={16} strokeWidth={3}/>
                                    </button>
                                  </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
