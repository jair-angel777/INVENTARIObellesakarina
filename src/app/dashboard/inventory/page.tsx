"use client";

import React, { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowLeft,
  Package,
  ShoppingCart,
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
  
  // Left/Right toggles
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  
  // Filtering logic
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals state
  const [showModal, setShowModal] = useState<string | null>(null);

  // Form states (simplified for UI logic)
  const [providerForm, setProviderForm] = useState({ nombre: '', email: '', telefono: '' });
  const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '' });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadAuxiliaryData();
  }, []);

  const handleQuickOrder = (p: any) => {
    setSelectedProduct(p);
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

  const toggleLocation = (id: string) => {
    setActiveLocations(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = showLowStockOnly ? p.stock <= 1 : true;
    return matchesSearch && matchesStock;
  });

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock <= 1).length,
    value: products.reduce((acc, p) => acc + (p.precio * p.stock), 0)
  };

  // Nombres activos para la tarjeta "Visualizando"
  const getVisualizingText = () => {
    if (activeLocations.length === locations.length) return "Todas las tablas";
    if (activeLocations.length === 0) return "Ninguna tabla";
    // Muestra los nombres de las ubicaciones activas unidas
    return locations.filter(l => activeLocations.includes(l.id)).map(l => l.nombre).join(" + ");
  };

  return (
    // STRICT COLOR PALETTE: Blanco, Crema (#FDFBF7), Naranja (#FF9100)
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-stone-900 overflow-hidden relative">
      
      {/* HEADER - Naranja */}
      <header className="h-20 bg-[#FF9100] flex items-center justify-between px-8 shrink-0 relative z-10 shadow-lg">
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-xl flex items-center justify-center text-white transition-all shadow-sm active:scale-95 border border-white/30"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              Control de Inventario
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl border border-white/20">
             <button 
               onClick={() => setShowLeftSidebar(!showLeftSidebar)}
               className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", showLeftSidebar ? "bg-white text-[#FF9100]" : "text-white hover:bg-white/10")}
               title={showLeftSidebar ? "Ocultar panel izquierdo" : "Mostrar panel izquierdo"}
             >
                Panel Izq.
             </button>
             <div className="w-px h-4 bg-white/20" />
             <button 
               onClick={() => setShowRightSidebar(!showRightSidebar)}
               className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", showRightSidebar ? "bg-white text-[#FF9100]" : "text-white hover:bg-white/10")}
               title={showRightSidebar ? "Ocultar panel derecho" : "Mostrar panel derecho"}
             >
                Panel Der.
             </button>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/20 rounded-xl border border-white/20">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white">Sincronizado</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR - Crema / Blanco / Naranja */}
        {showLeftSidebar && (
          <aside className="w-68 bg-white p-6 flex flex-col gap-8 shrink-0 border-r-2 border-stone-100 overflow-y-auto animate-in slide-in-from-left duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
           <div className="bg-[#FDFBF7] p-5 rounded-2xl border-l-[6px] border-[#FF9100] shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Visualizando:</p>
              <p className="text-sm font-black text-[#FF9100] mt-1 leading-tight">
                {getVisualizingText()}
              </p>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Almacén:</p>
                  {/* Botón pequeño para crear sede de tipo almacén */}
                  <button onClick={() => setShowModal('add-location')} className="p-1 bg-[#FDFBF7] text-[#FF9100] rounded hover:bg-[#FF9100] hover:text-white transition-colors border border-[#FF9100]/20" title="Crear Almacén">
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
                {locations.filter(l => l.tipo === 'ALMACEN').map(loc => (
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all border", activeLocations.includes(loc.id) ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md" : "bg-[#FDFBF7] text-stone-600 border-stone-200 hover:border-[#FF9100]/50")}>
                    <div className={cn("p-1.5 rounded-lg", activeLocations.includes(loc.id) ? "bg-white/20 text-white" : "bg-white text-stone-400")}>
                      {activeLocations.includes(loc.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter truncate">{loc.nombre}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Tiendas:</p>
                   {/* Botón pequeño para crear sede de tipo tienda */}
                   <button onClick={() => setShowModal('add-location')} className="p-1 bg-[#FDFBF7] text-[#FF9100] rounded hover:bg-[#FF9100] hover:text-white transition-colors border border-[#FF9100]/20" title="Crear Tienda">
                    <Plus size={14} strokeWidth={3} />
                   </button>
                </div>
                {locations.filter(l => l.tipo === 'TIENDA').map(loc => (
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all border", activeLocations.includes(loc.id) ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md" : "bg-[#FDFBF7] text-stone-600 border-stone-200 hover:border-[#FF9100]/50")}>
                    <div className={cn("p-1.5 rounded-lg", activeLocations.includes(loc.id) ? "bg-white/20 text-white" : "bg-white text-stone-400")}>
                      {activeLocations.includes(loc.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter truncate">{loc.nombre}</span>
                  </button>
                ))}
              </div>
           </div>
         </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-[#FDFBF7] p-8 flex flex-col gap-8 overflow-y-auto relative z-10 transition-all duration-300">
            {/* CARDS SUPERIORES: Blanco, Crema y Naranja */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
               {[
                 { label: "Total de productos", val: stats.total, borderColor: "border-stone-200 text-stone-800" },
                 { label: "Total stock bajo", val: stats.lowStock, borderColor: "border-stone-200 text-stone-800" },
                 { label: "Valor inventario", val: `S/ ${stats.value.toLocaleString()}`, borderColor: "border-stone-200 text-stone-800" }
               ].map((stat, i) => (
                 <div key={i} className={cn("bg-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[140px] shadow-sm border-b-8 hover:shadow-md transition-shadow", stat.borderColor)}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FF9100] mb-2">{stat.label}</p>
                    <h4 className="text-4xl font-black italic tracking-tighter">{stat.val}</h4>
                 </div>
               ))}
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="bg-white rounded-[3rem] shadow-sm flex-1 flex flex-col min-h-[500px] overflow-hidden border border-stone-100">
               <div className="px-10 py-8 border-b border-stone-100 flex justify-between items-center bg-[#FDFBF7]/50">
                  <div className="relative w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF9100]" size={20} />
                    <input type="text" placeholder="Consultar directamente..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-2 border-stone-100 text-xs font-bold focus:border-[#FF9100] outline-none shadow-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="bg-[#FF9100] px-8 py-3 rounded-xl shadow-sm border-b-4 border-orange-600">
                    <span className="text-lg font-black italic text-white tracking-widest leading-none">TABLA</span>
                  </div>
               </div>

               <div className="overflow-auto flex-1 px-4">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead className="sticky top-0 z-20">
                      <tr className="bg-[#FDFBF7] text-stone-500 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-10 py-5 rounded-l-2xl border-y border-l border-stone-100">Producto</th>
                        <th className="px-8 py-5 border-y border-stone-100">Categoría</th>
                        <th className="px-8 py-5 text-center border-y border-stone-100">Stock</th>
                        <th className="px-8 py-5 border-y border-stone-100">Estado</th>
                        <th className="px-10 py-5 rounded-r-2xl border-y border-r border-stone-100 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                         <tr><td colSpan={5} className="py-20 text-center font-bold text-lg text-stone-300 animate-pulse">Cargando inventario...</td></tr>
                      ) : filteredProducts.map((p) => {
                        const isLowStock = p.stock <= 1;
                        return (
                          <tr key={p.id} className="group bg-white hover:bg-[#FDFBF7] transition-all relative">
                            <td className="px-10 py-6 rounded-l-2xl border-b border-stone-100">
                              <div className="flex items-center gap-3">
                                <span className={cn("text-lg font-black tracking-tighter", isLowStock ? "text-[#FF9100]" : "text-stone-800")}>{p.nombre}</span>
                                {isLowStock && <AlertTriangle size={16} className="text-[#FF9100] animate-bounce" fill="currentColor" />}
                              </div>
                            </td>
                            <td className="px-8 py-6 border-b border-stone-100">
                               <span className="text-[10px] font-black uppercase px-3 py-1 bg-white border border-stone-200 text-stone-500 rounded-md">{p.categoria || "S/C"}</span>
                            </td>
                            <td className="px-8 py-6 text-center border-b border-stone-100">
                              <span className={cn("text-2xl font-black", isLowStock ? "text-[#FF9100]" : "text-stone-800")}>{p.stock}</span>
                            </td>
                            <td className="px-8 py-6 border-b border-stone-100">
                              <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", isLowStock ? "bg-orange-100 text-orange-600" : "bg-stone-100 text-stone-500")}>
                                {isLowStock ? "Bajo" : "OK"}
                              </div>
                            </td>
                            {/* ACCIONES (Editar, Eliminar, Pedir) */}
                            <td className="px-10 py-6 rounded-r-2xl border-b border-stone-100 text-right">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {/* Botón Editar */}
                                  <button 
                                    className="p-2.5 bg-white border border-stone-200 text-stone-400 hover:text-[#FF9100] hover:border-[#FF9100] rounded-xl transition-all shadow-sm" 
                                    title="Editar Producto"
                                    onClick={() => setShowModal('edit-product')}
                                  >
                                    <Edit size={16} strokeWidth={2.5} />
                                  </button>
                                  {/* Botón Eliminar */}
                                  <button 
                                    className="p-2.5 bg-white border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all shadow-sm" 
                                    title="Eliminar Producto"
                                  >
                                    <Trash2 size={16} strokeWidth={2.5} />
                                  </button>
                                  {/* Botón Pedir Stock */}
                                  <button 
                                    onClick={() => handleQuickOrder(p)}
                                    className="px-4 py-2.5 bg-[#FF9100] text-white flex items-center gap-1.5 text-[9px] font-black uppercase rounded-xl transition-all shadow-sm hover:bg-orange-600" 
                                    title="Pedir más unidades"
                                  >
                                     <Truck size={16} strokeWidth={2.5} />
                                     <span>Pedir</span>
                                  </button>
                               </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
            </div>
        </main>

        {/* RIGHT SIDEBAR - Iconos Originales en fondo Blanco/Crema */}
        {showRightSidebar && (
          <aside className="w-24 bg-white p-4 flex flex-col items-center gap-6 shrink-0 border-l-2 border-stone-100 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
           <div className="bg-[#FDFBF7] px-2 py-4 rounded-xl text-center w-full border border-stone-100">
              <p className="text-[8px] font-black uppercase leading-tight text-stone-400 font-sans">ACCIONES</p>
           </div>
           
           <div className="flex flex-col gap-5 items-center">
              {[
                { id: 'add-product', color: 'bg-emerald-500', icon: <Package size={24} />, title: 'Agregar Nuevo Producto', action: () => setShowModal('add-product') },
                { id: 'providers', color: 'bg-[#B0E0E6]', icon: <Truck size={24} />, title: 'Gestionar Proveedores', action: () => setShowModal('providers') },
                { id: 'categories', color: 'bg-[#90EE90]', icon: <Layers size={24} />, title: 'Gestionar Categorías', action: () => setShowModal('categories') },
                // Botón Switch Filtro Stock (Naranja Fuerte si está activo)
                { id: 'filter-stock', color: showLowStockOnly ? 'bg-orange-600' : 'bg-orange-300', icon: <AlertTriangle size={24} />, title: 'Filtro: Solo ver Stock Bajo', action: () => setShowLowStockOnly(!showLowStockOnly) },
                // Lupa para busqueda avanzada
                { id: 'advanced-search', color: 'bg-[#FF8C00]', icon: <Search size={24} />, title: 'Búsqueda Avanzada', action: () => setShowModal('advanced-search') },
                { id: 'order-warehouse', color: 'bg-[#D2691E]', icon: <ShoppingCart size={24} />, title: 'Pedido a Almacén Central', action: () => setShowModal('order-warehouse') },
                { id: 'movements', color: 'bg-[#B22222]', icon: <ArrowLeftRight size={24} />, title: 'Historial de Movimientos', action: () => setShowModal('movements') }
              ].map((btn) => (
                <button 
                  key={btn.id} 
                  onClick={btn.action} 
                  className={cn("w-14 h-14 rounded-full border-4 border-white shadow-lg hover:scale-110 active:scale-90 transition-all text-white flex items-center justify-center", btn.color)}
                  title={btn.title}
                >
                  {btn.icon}
                </button>
              ))}
           </div>
          </aside>
        )}

      </div>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] shadow-2xl flex relative overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-stone-100">
              <button onClick={() => setShowModal(null)} className="absolute top-8 right-8 w-12 h-12 bg-stone-100 text-stone-500 flex items-center justify-center rounded-2xl hover:bg-[#FF9100] hover:text-white transition-all z-[110]">
                <X size={24} strokeWidth={3} />
              </button>
              
              <div className="flex w-full">
                 {/* LEFT FORM/INFO */}
                 <div className="w-[40%] bg-[#FDFBF7] p-16 flex flex-col border-r-2 border-stone-100">
                    <h3 className="text-3xl font-black text-[#FF9100] uppercase tracking-tighter mb-10">
                      {showModal.split("-").join(" ")}
                    </h3>
                    
                    {showModal === 'advanced-search' && (
                       <div className="space-y-6">
                          <p className="text-sm font-bold text-stone-500 mb-6">Mini interfaz exclusiva para buscar un producto por múltiples campos con exactitud.</p>
                          <input className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Buscar por Nombre" />
                          <input className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Buscar por Código / ID" />
                          <input className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Buscar por Categoría" />
                          <input className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Buscar por Precio Máximo" />
                          <button className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-6 transition-all hover:bg-orange-600 shadow-md">Aplicar Filtros</button>
                       </div>
                    )}

                    {showModal === 'add-product' && (
                       <div className="space-y-4">
                          <input className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Nombre completo" required />
                          <div className="flex gap-4">
                             <input className="w-1/2 p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Precio S/" type="number" step="0.01" />
                             <input className="w-1/2 p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Costo S/" type="number" step="0.01" />
                          </div>
                          <select className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm text-stone-500">
                             <option value="">Seleccionar Categoría...</option>
                             {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>
                          <select className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm text-stone-500">
                             <option value="">Localización Inicial...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                          </select>
                          <button className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-6 transition-all hover:bg-orange-600 shadow-md">Crear Producto Final</button>
                       </div>
                    )}

                    {showModal === 'movements' && (
                       <div className="space-y-8">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                             <p className="text-[10px] font-black uppercase text-stone-400 mb-2">Resumen Operativo</p>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-stone-600">Pendientes</span>
                                <span className="text-2xl font-black text-[#FF9100]">
                                   {orders.filter(o => o.status === 'PENDIENTE').length}
                                </span>
                             </div>
                          </div>
                          <p className="text-sm text-stone-500 font-bold">Aquí puedes monitorear y recibir pedidos de almacén y proveedores.</p>
                       </div>
                    )}
                    
                    {showModal === 'providers' && (
                       <form onSubmit={handleCreateProvider} className="space-y-6">
                         <input value={providerForm.nombre} onChange={e => setProviderForm({...providerForm, nombre: e.target.value})} className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Razón Social" required />
                         <input value={providerForm.email} onChange={e => setProviderForm({...providerForm, email: e.target.value})} className="w-full p-4 rounded-xl bg-white border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-sm" placeholder="Email" />
                         <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-6 transition-all hover:bg-orange-600 shadow-md">Guardar</button>
                       </form>
                    )}

                    {showModal === 'order-specific' && selectedProduct && (
                       <div className="space-y-6">
                          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                             <p className="text-[10px] font-black uppercase text-[#FF9100] mb-4">Pedido manual para:</p>
                             <h4 className="text-2xl font-black text-stone-800 leading-none mb-1">{selectedProduct.nombre}</h4>
                             <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-2">{selectedProduct.categoria || 'Sin Categoría'}</p>
                          </div>
                          <button onClick={() => setShowModal('movements')} className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-8 shadow-md hover:bg-orange-600">Confirmar Pedido Urgente</button>
                       </div>
                    )}
                 </div>

                 {/* RIGHT TABLE/LIST */}
                 <div className="w-[60%] p-16 bg-white overflow-hidden flex flex-col">
                    <h4 className="text-2xl font-black text-stone-400 mb-8 uppercase tracking-widest">
                       {showModal === 'movements' ? 'Historial de Movimientos' : 'Bandeja de Entradas'}
                    </h4>
                    
                    <div className="flex-1 overflow-auto rounded-[2rem] border border-stone-100 p-4 bg-[#FDFBF7]">
                       <table className="w-full text-left border-separate border-spacing-y-2">
                         <thead className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                           <tr>
                             <th className="px-4 py-2 border-b border-stone-200">Referencia / Info</th>
                             <th className="px-4 py-2 border-b border-stone-200">Status</th>
                             <th className="px-4 py-2 text-right border-b border-stone-200">Boleta</th>
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
                                        <p className="text-[8px] text-[#FF9100] font-bold uppercase tracking-widest">
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
                                      "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border",
                                      item.status === 'RECIBIDO' ? "bg-stone-50 border-stone-200 text-stone-400" : "bg-orange-50 border-orange-200 text-[#FF9100] hover:bg-[#FF9100] hover:text-white"
                                    )}
                                  >
                                     {item.status || 'Activo'}
                                  </button>
                               </td>
                               <td className="px-4 py-5 rounded-r-xl text-right">
                                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => generateBoleta(item)}
                                      className="p-2 bg-stone-100 text-stone-500 rounded-lg md hover:bg-stone-200 transition-all" 
                                      title="Descargar Boleta PDF"
                                    >
                                      <Download size={16} strokeWidth={2.5} />
                                    </button>
                                    <button className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all">
                                      <Trash2 size={16} strokeWidth={2.5}/>
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
