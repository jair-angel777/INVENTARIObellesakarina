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
  FileText,
  Building,
  User
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
  
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [showModal, setShowModal] = useState<string | null>(null);

  // Forms states
  const [providerForm, setProviderForm] = useState({ nombre: '', email: '', telefono: '', direccion: '', categoria: '' });
  const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '', color: 'bg-[#FF9100]', icono: 'Package' });
  const [locationForm, setLocationForm] = useState({ nombre: '', tipo: 'ALMACEN' });
  const [productForm, setProductForm] = useState({ 
    nombre: '', precio: '', costo: '', categoria_id: '', proveedor_id: '', ubicacion_id: '', stock_inicial: '', stock_minimo: '5', imagen: '' 
  });
  const [movementForm, setMovementForm] = useState({
     tipo: 'TRASLADO_ALMACEN', // O PEDIDO_PROVEEDOR
     producto_id: '', cantidad: '', origen_id: '', destino_id: '', notas: ''
  });

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
      if (prodRes.ok) setProducts(await prodRes.json());
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
        fetchWithAuth(`${apiUrl}/movements`) // Historial de movimientos
      ]);
      if (provRes.ok) setProviders(await provRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (e) { console.error(e); }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/locations`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(locationForm)
    });
    if (res.ok) {
      setLocationForm({ nombre: '', tipo: 'ALMACEN' });
      setShowModal(null);
      loadData();
    }
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/suppliers`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(providerForm)
    });
    if (res.ok) {
      setProviderForm({ nombre: '', email: '', telefono: '', direccion: '', categoria: '' });
      setShowModal(null);
      loadAuxiliaryData();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/categories`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm)
    });
    if (res.ok) {
      setCategoryForm({ nombre: '', descripcion: '', color: 'bg-orange-500', icono: 'Package' });
      setShowModal(null);
      loadAuxiliaryData();
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    const res = await fetchWithAuth(`${apiUrl}/products`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: productForm.nombre,
        precio: parseFloat(productForm.precio),
        costo: parseFloat(productForm.costo) || 0,
        categoria: productForm.categoria_id,
        proveedor_id: productForm.proveedor_id,
        stock_minimo: parseInt(productForm.stock_minimo) || 5,
        stock: parseInt(productForm.stock_inicial) || 0,
        imagen: productForm.imagen
      })
    });
    if (res.ok) {
      if (productForm.ubicacion_id && productForm.stock_inicial) {
        // En una implementación más robusta, el backend crearía la entrada en stock_ubicacion
      }
      setProductForm({ nombre: '', precio: '', costo: '', categoria_id: '', proveedor_id: '', ubicacion_id: '', stock_inicial: '', stock_minimo: '5', imagen: '' });
      setShowModal(null);
      loadData();
    }
  };

  const handleCreateMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    
    // Obtenemos el nombre del producto para guardarlo en la DB
    const selectedProd = products.find(p => p.id === movementForm.producto_id);
    const nombre_producto = selectedProd ? selectedProd.nombre : "Producto Genérico";

    const res = await fetchWithAuth(`${apiUrl}/movements`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...movementForm,
        nombre_producto,
        cantidad: parseInt(movementForm.cantidad),
        usuario_pedido_id: "65243168aaca5e53e77f98b1", // Placeholder temporal
        solicitado_nombre: "Usuario Gerente"
      })
    });
    if (res.ok) {
      setMovementForm({ tipo: 'TRASLADO_ALMACEN', producto_id: '', cantidad: '', origen_id: '', destino_id: '', notas: '' });
      setShowModal(null);
      loadAuxiliaryData();
    }
  };

  const toggleLocation = (id: string) => {
    setActiveLocations(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = showLowStockOnly ? p.stock <= (p.stock_minimo || 5) : true;
    return matchesSearch && matchesStock;
  });

  const getVisualizingText = () => {
    if (activeLocations.length === locations.length && locations.length > 0) return "Todas las tablas";
    if (activeLocations.length === 0) return "Ninguna tabla";
    return locations.filter(l => activeLocations.includes(l.id)).map(l => l.nombre).join(" + ");
  };

  // Listado de modales centrados puros para registro
  const singleColumnModals = ['add-product', 'providers', 'categories', 'advanced-search', 'add-location', 'order-warehouse', 'order-provider', 'order-specific'];
  const isSingleCol = showModal && singleColumnModals.includes(showModal);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-stone-900 overflow-hidden relative">
      
      {/* HEADER */}
      <header className="h-20 bg-[#FF9100] flex items-center justify-between px-8 shrink-0 relative z-10 shadow-lg">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-xl flex items-center justify-center text-white transition-all shadow-sm border border-white/30">
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
             <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", showLeftSidebar ? "bg-white text-[#FF9100]" : "text-white hover:bg-white/10")}>
                Panel Izq.
             </button>
             <div className="w-px h-4 bg-white/20" />
             <button onClick={() => setShowRightSidebar(!showRightSidebar)} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", showRightSidebar ? "bg-white text-[#FF9100]" : "text-white hover:bg-white/10")}>
                Panel Der.
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR */}
        {showLeftSidebar && (
          <aside className="w-68 bg-white p-6 flex flex-col gap-8 shrink-0 border-r-2 border-stone-100 overflow-y-auto duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
           <div className="bg-[#FDFBF7] p-5 rounded-2xl border-l-[6px] border-[#FF9100] shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Visualizando:</p>
              <p className="text-sm font-black text-[#FF9100] mt-1 leading-tight">{getVisualizingText()}</p>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Almacén:</p>
                  <button onClick={() => { setLocationForm({...locationForm, tipo: 'ALMACEN'}); setShowModal('add-location'); }} className="p-1 text-[#FF9100] hover:bg-[#FF9100] hover:text-white transition-colors rounded border border-[#FF9100]/20 bg-[#FDFBF7]" title="Crear Almacén">
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
                {locations.filter(l => l.tipo === 'ALMACEN').map(loc => (
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all border", activeLocations.includes(loc.id) ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md" : "bg-[#FDFBF7] text-stone-600 border-stone-200")}>
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
                   <button onClick={() => { setLocationForm({...locationForm, tipo: 'TIENDA'}); setShowModal('add-location'); }} className="p-1 text-[#FF9100] hover:bg-[#FF9100] hover:text-white transition-colors rounded border border-[#FF9100]/20 bg-[#FDFBF7]" title="Crear Tienda">
                    <Plus size={14} strokeWidth={3} />
                   </button>
                </div>
                {locations.filter(l => l.tipo === 'TIENDA').map(loc => (
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all border", activeLocations.includes(loc.id) ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md" : "bg-[#FDFBF7] text-stone-600 border-stone-200")}>
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
        <main className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto relative z-10 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
               {[
                 { label: "Total productos", val: products.length },
                 { label: "Alertas de stock", val: products.filter(p => p.stock <= (p.stock_minimo || 5)).length },
                 { label: "Valor inventario", val: `S/ ${products.reduce((acc, p) => acc + (p.precio * p.stock), 0).toLocaleString()}` }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[140px] shadow-sm border-b-8 border-stone-200 border-b-[#FF9100]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FF9100] mb-2">{stat.label}</p>
                    <h4 className="text-4xl font-black italic tracking-tighter text-stone-800">{stat.val}</h4>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm flex-1 flex flex-col min-h-[500px] overflow-hidden border border-stone-100">
               <div className="px-10 py-8 border-b border-stone-100 flex justify-between items-center bg-[#FDFBF7]/50">
                  <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF9100]" size={20} />
                    <input type="text" placeholder="Consultar inventario..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-2 border-stone-100 text-xs font-bold focus:border-[#FF9100] shadow-sm outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="bg-[#FF9100] px-8 py-3 rounded-xl border-b-4 border-orange-600">
                    <span className="text-lg font-black italic text-white tracking-widest">PRODUCTOS</span>
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
                         <tr><td colSpan={5} className="py-20 text-center font-bold text-lg text-stone-300">Cargando inventario...</td></tr>
                      ) : filteredProducts.map((p) => {
                        const isLowStock = p.stock <= (p.stock_minimo || 5);
                        return (
                          <tr key={p.id} className="group bg-white hover:bg-[#FDFBF7] transition-all relative">
                            <td className="px-10 py-6 rounded-l-2xl border-b border-stone-100">
                              <div className="flex items-center gap-4">
                                {p.imagen && <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover shadow-sm bg-stone-100" />}
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                     <span className={cn("text-lg font-black tracking-tighter", isLowStock ? "text-[#FF9100]" : "text-stone-800")}>{p.nombre}</span>
                                     {isLowStock && <AlertTriangle size={14} className="text-[#FF9100] animate-bounce" fill="currentColor" />}
                                  </div>
                                  {p.proveedor_id && <span className="text-[9px] font-black uppercase text-stone-400">Proveedor ID: {p.proveedor_id.slice(-4)}</span>}
                                </div>
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
                            <td className="px-10 py-6 rounded-r-2xl border-b border-stone-100 text-right">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-2.5 bg-white border border-stone-200 text-stone-400 hover:text-[#FF9100] hover:border-[#FF9100] rounded-xl transition-all shadow-sm">
                                    <Edit size={16} strokeWidth={2.5} />
                                  </button>
                                  <button className="p-2.5 bg-white border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all shadow-sm">
                                    <Trash2 size={16} strokeWidth={2.5} />
                                  </button>
                                  <button onClick={() => handleQuickOrder(p)} className="px-4 py-2.5 bg-[#FF9100] text-white flex items-center gap-1.5 text-[9px] font-black uppercase rounded-xl transition-all hover:bg-orange-600">
                                     <ShoppingCart size={16} strokeWidth={2.5} /><span>Pedir</span>
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

        {/* RIGHT SIDEBAR ACTIONS */}
        {showRightSidebar && (
          <aside className="w-24 bg-white p-4 flex flex-col items-center gap-6 shrink-0 border-l-2 border-stone-100 overflow-y-auto">
           <div className="bg-[#FDFBF7] px-2 py-4 rounded-xl text-center w-full border border-stone-100">
              <p className="text-[8px] font-black uppercase leading-tight text-stone-400 font-sans">ACCIONES</p>
           </div>
           
           <div className="flex flex-col gap-5 items-center">
              {[
                { id: 'add-product', color: 'bg-emerald-500', icon: <Package size={24} />, title: 'Agregar Producto', action: () => setShowModal('add-product') },
                { id: 'providers', color: 'bg-[#B0E0E6]', icon: <User size={24}/>, title: 'Crear Proveedor', action: () => setShowModal('providers') },
                { id: 'categories', color: 'bg-[#90EE90]', icon: <Layers size={24} />, title: 'Crear Categoría', action: () => setShowModal('categories') },
                { id: 'filter-stock', color: showLowStockOnly ? 'bg-orange-600' : 'bg-orange-300', icon: <AlertTriangle size={24} />, title: 'Visualizar Stock Bajo', action: () => setShowLowStockOnly(!showLowStockOnly) },
                { id: 'advanced-search', color: 'bg-[#FF8C00]', icon: <Search size={24} />, title: 'Búsqueda Avanzada', action: () => setShowModal('advanced-search') },
                { id: 'order-warehouse', color: 'bg-[#D2691E]', icon: <Building size={24} />, title: 'Pedido Interno Almacén', action: () => setShowModal('order-warehouse') },
                { id: 'order-provider', color: 'bg-stone-500', icon: <Truck size={24}/>, title: 'Pedido a Proveedor Externo', action: () => setShowModal('order-provider') },
                { id: 'movements', color: 'bg-[#B22222]', icon: <ArrowLeftRight size={24} />, title: 'Historial de Movimientos', action: () => setShowModal('movements') }
              ].map((btn) => (
                <button key={btn.id} onClick={btn.action} className={cn("w-14 h-14 rounded-full border-4 border-white shadow-lg hover:scale-110 active:scale-90 transition-all text-white flex items-center justify-center", btn.color)} title={btn.title}>
                  {btn.icon}
                </button>
              ))}
           </div>
          </aside>
        )}
      </div>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
           {/* Dinámico: O panel central único (Single-Col) o panel doble */}
           <div className={cn("bg-white rounded-[3rem] shadow-2xl flex relative overflow-hidden animate-in zoom-in-95 duration-300", isSingleCol ? "w-full max-w-xl h-auto" : "w-full max-w-6xl h-[85vh]")}>
              <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 w-10 h-10 bg-stone-100 text-stone-500 flex items-center justify-center rounded-2xl hover:bg-[#FF9100] hover:text-white transition-all z-[110]">
                <X size={20} strokeWidth={3} />
              </button>
              
              <div className="flex w-full flex-col md:flex-row">
                 {/* LEFT/MAIN FORM */}
                 <div className={cn("bg-white border-stone-100 flex flex-col", isSingleCol ? "w-full p-12" : "w-[40%] bg-[#FDFBF7] p-16 border-r-2")}>
                    <h3 className="text-3xl font-black text-[#FF9100] uppercase tracking-tighter mb-8">
                      {showModal.split("-").join(" ")}
                    </h3>
                    
                    {/* ADD PRODUCT FORM - 1 Columna */}
                    {showModal === 'add-product' && (
                       <form onSubmit={handleCreateProduct} className="space-y-4">
                          <input required value={productForm.nombre} onChange={e=>setProductForm({...productForm, nombre: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Nombre completo del producto" />
                          
                          <select required value={productForm.proveedor_id} onChange={e=>setProductForm({...productForm, proveedor_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner text-stone-600">
                             <option value="">Selecciona Proveedor Asociado...</option>
                             {providers.map(prov => <option key={prov.id} value={prov.id}>{prov.nombre}</option>)}
                          </select>

                          <div className="flex gap-4">
                             <input required value={productForm.precio} onChange={e=>setProductForm({...productForm, precio: e.target.value})} className="w-1/2 p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Precio S/" type="number" step="0.01" />
                             <input value={productForm.costo} onChange={e=>setProductForm({...productForm, costo: e.target.value})} className="w-1/2 p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Costo S/" type="number" step="0.01" />
                          </div>

                          <select required value={productForm.categoria_id} onChange={e=>setProductForm({...productForm, categoria_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner text-stone-600">
                             <option value="">Selecciona Categoría...</option>
                             {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>

                          <select required value={productForm.ubicacion_id} onChange={e=>setProductForm({...productForm, ubicacion_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner text-stone-600">
                             <option value="">Registrar Sede/Ubicación de Primer Ingreso...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                          </select>
                          
                          <div className="flex gap-4">
                             <input required value={productForm.stock_inicial} onChange={e=>setProductForm({...productForm, stock_inicial: e.target.value})} className="w-1/2 p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Stock Inicial" type="number" />
                             <input required value={productForm.stock_minimo} onChange={e=>setProductForm({...productForm, stock_minimo: e.target.value})} className="w-1/2 p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Stock Mínimo (Alerta)" type="number" />
                          </div>

                          <input value={productForm.imagen} onChange={e=>setProductForm({...productForm, imagen: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner text-xs" placeholder="URL Imagen (ej. enlace cloudinary.com)" type="url" />

                          <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">Crear Producto</button>
                       </form>
                    )}

                    {/* NUEVO PROVEEDOR FORM - 1 Columna */}
                    {showModal === 'providers' && (
                       <form onSubmit={handleCreateProvider} className="space-y-4">
                         <input required value={providerForm.nombre} onChange={e => setProviderForm({...providerForm, nombre: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Razón Social / Nombre" />
                         <input value={providerForm.email} onChange={e => setProviderForm({...providerForm, email: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Email Contacto" />
                         <input value={providerForm.telefono} onChange={e => setProviderForm({...providerForm, telefono: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Teléfono" />
                         <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">Crear Proveedor</button>
                       </form>
                    )}

                    {/* NUEVA CATEGORIA FORM - 1 Columna */}
                    {showModal === 'categories' && (
                       <form onSubmit={handleCreateCategory} className="space-y-4">
                         <input required value={categoryForm.nombre} onChange={e => setCategoryForm({...categoryForm, nombre: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Nombre de Categoría" />
                         <input value={categoryForm.descripcion} onChange={e => setCategoryForm({...categoryForm, descripcion: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Descripción breve" />
                         <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">Añadir Categoría</button>
                       </form>
                    )}
                    
                    {/* NUEVA UBICACION FORM - 1 Columna */}
                    {showModal === 'add-location' && (
                       <form onSubmit={handleCreateLocation} className="space-y-4">
                         <input required value={locationForm.nombre} onChange={e => setLocationForm({...locationForm, nombre: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder={`Nombre del nuevo ${locationForm.tipo.toLowerCase()}`} />
                         <div className="flex gap-2">
                           <button type="button" onClick={()=>setLocationForm({...locationForm, tipo: 'ALMACEN'})} className={cn("flex-1 p-4 rounded-xl font-black text-xs", locationForm.tipo==='ALMACEN'? "bg-[#FF9100] text-white" : "bg-[#FDFBF7] text-stone-500 border border-stone-200")}>ES ALMACÉN</button>
                           <button type="button" onClick={()=>setLocationForm({...locationForm, tipo: 'TIENDA'})} className={cn("flex-1 p-4 rounded-xl font-black text-xs", locationForm.tipo==='TIENDA'? "bg-[#FF9100] text-white" : "bg-[#FDFBF7] text-stone-500 border border-stone-200")}>ES TIENDA</button>
                         </div>
                         <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">Crear Ubicación</button>
                       </form>
                    )}

                    {/* PEDIDO A ALMACEN (MOVIMIENTO INTERNO) - 1 Columna */}
                    {showModal === 'order-warehouse' && (
                       <form onSubmit={(e)=>{ setMovementForm(m=>({...m, tipo:'TRASLADO_ALMACEN'})); handleCreateMovement(e); }} className="space-y-4">
                         <p className="text-sm font-bold text-stone-500 mb-2">Solicitar envío de mercadería desde un Almacén a una Tienda (o entre Almacenes).</p>
                         <select required value={movementForm.producto_id} onChange={e=>setMovementForm({...movementForm, producto_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600">
                             <option value="">Selecciona el Producto...</option>
                             {products.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock Total: {p.stock})</option>)}
                         </select>
                         <input required value={movementForm.cantidad} onChange={e=>setMovementForm({...movementForm, cantidad: e.target.value})} type="number" className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold" placeholder="Cantidad Necesitada" />
                         <select required value={movementForm.origen_id} onChange={e=>setMovementForm({...movementForm, origen_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600">
                             <option value="">Almacén/Tienda de Origen...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                         </select>
                         <select required value={movementForm.destino_id} onChange={e=>setMovementForm({...movementForm, destino_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600">
                             <option value="">Tienda/Almacén de Destino...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                         </select>
                         <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">Generar Orden Interna</button>
                       </form>
                    )}

                    {/* PEDIDO A PROVEEDOR EXTERNO - 1 Columna */}
                    {showModal === 'order-provider' && (
                       <form onSubmit={(e)=>{ setMovementForm(m=>({...m, tipo:'PEDIDO_PROVEEDOR'})); handleCreateMovement(e); }} className="space-y-4">
                         <p className="text-sm font-bold text-stone-500 mb-2">Generar orden de compra hacia un Proveedor Externo para reabastecer stock.</p>
                         <select required value={movementForm.producto_id} onChange={e=>setMovementForm({...movementForm, producto_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600">
                             <option value="">Producto a Reabastecer...</option>
                             {products.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                         </select>
                         <input required value={movementForm.cantidad} onChange={e=>setMovementForm({...movementForm, cantidad: e.target.value})} type="number" className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold" placeholder="Cantidad a Comprar" />
                         <select required value={movementForm.destino_id} onChange={e=>setMovementForm({...movementForm, destino_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600">
                             <option value="">Almacén/Tienda de Recepción...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                         </select>
                         <input value={movementForm.notas} onChange={e=>setMovementForm({...movementForm, notas: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold" placeholder="Notas Adicionales (Opcional)" />
                         <button type="submit" className="w-full py-5 bg-stone-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-black shadow-md">Lanzar Orden al Proveedor</button>
                       </form>
                    )}

                    {/* MOVEMENTS HISTORIAL - LEFT INFO (Dual Col) */}
                    {showModal === 'movements' && (
                       <div className="space-y-8">
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                             <p className="text-[10px] font-black uppercase text-stone-400 mb-2">Resumen Operativo</p>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-stone-600">Pendientes</span>
                                <span className="text-2xl font-black text-[#FF9100]">
                                   {orders.filter(o => o.status === 'PENDIENTE' || o.estado === 'PENDIENTE').length}
                                </span>
                             </div>
                          </div>
                          <p className="text-sm text-stone-500 font-bold">Monitoriza las solicitudes internas y externas aquí.</p>
                       </div>
                    )}
                 </div>

                 {/* BANDJEJA DE ENTRADAS - SOLO SE MUESTRA SI NO ES SINGLE COL */}
                 {!isSingleCol && (
                   <div className="w-[60%] p-16 bg-white overflow-hidden flex flex-col">
                      <h4 className="text-2xl font-black text-stone-800 mb-8 uppercase tracking-widest">Registros de Actividad</h4>
                      <div className="flex-1 overflow-auto rounded-[2rem] border border-stone-100 p-4 bg-[#FDFBF7]">
                         <table className="w-full text-left border-separate border-spacing-y-2">
                           <thead className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                             <tr>
                               <th className="px-4 py-2 border-b border-stone-200">Referencia / Info</th>
                               <th className="px-4 py-2 border-b border-stone-200">Status</th>
                               <th className="px-4 py-2 text-right border-b border-stone-200">Doc. PDF</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y-4 divide-transparent">
                             {orders.map((item: any) => {
                               const isReceived = item.status === 'RECIBIDO' || item.estado === 'RECIBIDO';
                               const statusName = item.status || item.estado || 'Activo';
                               return (
                               <tr key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
                                 <td className="px-4 py-5 rounded-l-xl">
                                    <p className="font-bold text-stone-800">{item.nombre_producto || `Pedido #${item.id.slice(-4)}`} <span className="text-stone-400 text-xs">x{item.cantidad}</span></p>
                                    <div className="flex gap-4 mt-1">
                                       <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">Tipo: {item.tipo}</p>
                                       {item.recibido_nombre && (
                                          <p className="text-[8px] text-[#FF9100] font-bold uppercase tracking-widest">
                                             Confirmado: {item.recibido_nombre}
                                          </p>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-4 py-5">
                                    <button 
                                      disabled={isReceived}
                                      onClick={() => handleUpdateMovementStatus(item.id, 'RECIBIDO')}
                                      className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border",
                                        isReceived ? "bg-stone-50 border-stone-200 text-stone-400" : "bg-orange-50 border-orange-200 text-[#FF9100] hover:bg-[#FF9100] hover:text-white"
                                      )}
                                    >
                                       {isReceived ? 'Confirmado' : 'Marcar Recibido'}
                                    </button>
                                 </td>
                                 <td className="px-4 py-5 rounded-r-xl text-right">
                                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => generateBoleta(item)} className="p-2 bg-stone-100 text-stone-500 rounded-lg md hover:bg-stone-200 transition-all font-bold text-xs" title="Boleta PDF">
                                        <Download size={16} /> PDF
                                      </button>
                                    </div>
                                 </td>
                               </tr>
                             )})}
                           </tbody>
                         </table>
                      </div>
                   </div>
                 )}

              </div>
           </div>
        </div>
      )}
    </div>
  );
}
