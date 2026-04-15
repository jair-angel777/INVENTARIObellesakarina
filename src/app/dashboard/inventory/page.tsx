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
  User,
  Table,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";
import { generateBoleta } from "@/lib/pdf";
import Link from "next/link";
import Script from "next/script";

export default function InventoryPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showLeftSidebar, setShowLeftSidebar] = useState(false); // Hide by default on mobile
  const [showRightSidebar, setShowRightSidebar] = useState(false); // Hide by default on mobile
  const [showTablesPanel, setShowTablesPanel] = useState(false);
  
  // Use a hook or effect to detect screen size and set sidebars
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLarge = window.innerWidth >= 1024;
      setShowLeftSidebar(isLarge);
      setShowRightSidebar(isLarge);
    }
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [showModal, setShowModal] = useState<string | null>(null);
  const [isComparisonActive, setIsComparisonActive] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'SIDE_BY_SIDE' | 'COMPARE'>('SIDE_BY_SIDE');

  // Forms states
  const [providerForm, setProviderForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', direccion: '', categoria: '' });
  const [categoryForm, setCategoryForm] = useState({ nombre: '', descripcion: '', color: 'bg-[#FF9100]', icono: 'Package' });
  const [locationForm, setLocationForm] = useState({ nombre: '', tipo: 'ALMACEN' });
  const [productForm, setProductForm] = useState({ 
    nombre: '', precio: '', costo: '', categoria_id: '', proveedor_id: '', ubicacion_id: '', stock_inicial: '', stock_minimo: '5', imagen: '' 
  });
  const [movementForm, setMovementForm] = useState({
     tipo: 'TRASLADO_ALMACEN', // O PEDIDO_PROVEEDOR
     producto_id: '', cantidad: '', origen_id: '', destino_id: '', notas: '',
     costo_unitario: '', subtotal: 0, solicitado_nombre: 'Usuario Gerente', proveedor_id: ''
  });

  const [saleProductForm, setSaleProductForm] = useState({
    producto_id: '', cantidad: '', destino_id: ''
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleUploadClick = () => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.cloudinary) {
        // @ts-ignore
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "dimv8kos8",
                uploadPreset: "bellesas_preset",
                sources: ["local", "url", "camera"],
                language: "es",
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    setProductForm(prev => ({ ...prev, imagen: result.info.secure_url }));
                }
            }
        );
        widget.open();
    }
  };

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
      setProviderForm({ nombre: '', empresa: '', email: '', telefono: '', direccion: '', categoria: '' });
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
    
    const method = selectedProduct ? "PATCH" : "POST";
    const url = selectedProduct ? `${apiUrl}/products/${selectedProduct.id}` : `${apiUrl}/products`;

    const res = await fetchWithAuth(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: productForm.nombre,
        precio: parseFloat(productForm.precio),
        costo: parseFloat(productForm.costo) || 0,
        categoria: productForm.categoria_id,
        proveedor_id: productForm.proveedor_id,
        stock_minimo: parseInt(productForm.stock_minimo) || 5,
        stock: parseInt(productForm.stock_inicial) || 0,
        ubicacion_id: productForm.ubicacion_id,
        imagen: productForm.imagen
      })
    });
    if (res.ok) {
      setProductForm({ nombre: '', precio: '', costo: '', categoria_id: '', proveedor_id: '', ubicacion_id: '', stock_inicial: '', stock_minimo: '5', imagen: '' });
      setSelectedProduct(null);
      setShowModal(null);
      loadData();
    }
  };

  const handleEditProduct = (p: any) => {
    setSelectedProduct(p);
    setProductForm({
      nombre: p.nombre,
      precio: p.precio.toString(),
      costo: (p.costo || 0).toString(),
      categoria_id: p.categoria || '',
      proveedor_id: p.proveedor_id || '',
      ubicacion_id: '', // La edición no cambia el stock inicial
      stock_inicial: p.stock.toString(),
      stock_minimo: (p.stock_minimo || 5).toString(),
      imagen: p.imagen || ''
    });
    setShowModal('add-product');
  };

  const handleDeleteProduct = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${nombre}"?`)) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
      const res = await fetchWithAuth(`${apiUrl}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        alert("Error al eliminar el producto.");
      }
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
      const data = await res.json();
      setMovementForm({ tipo: 'TRASLADO_ALMACEN', producto_id: '', cantidad: '', origen_id: '', destino_id: '', notas: '', costo_unitario: '', subtotal: 0, solicitado_nombre: 'Usuario Gerente', proveedor_id: '' });
      setShowModal(null);
      loadAuxiliaryData();
      
      // Si es pedido a proveedor, sugerir descarga de PDF
      if (movementForm.tipo === 'PEDIDO_PROVEEDOR') {
         if (confirm("Orden generada con éxito. ¿Deseas descargar la Boleta de Pedido en PDF ahora mismo?")) {
            generateBoleta(data);
         }
      }
    }
  };

  const handleCreateSaleMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
    
    const selectedProd = products.find(p => p.id === saleProductForm.producto_id);
    const nombre_producto = selectedProd ? selectedProd.nombre : "Producto Genérico";

    // Buscar el primer almacén disponible como origen
    const sourceWarehouse = locations.find(l => l.tipo === 'ALMACEN');
    if (!sourceWarehouse) return alert("Error: No se encontró un Almacén de origen configurado.");

    const res = await fetchWithAuth(`${apiUrl}/movements`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: 'TRASLADO_ALMACEN',
        producto_id: saleProductForm.producto_id,
        nombre_producto,
        cantidad: parseInt(saleProductForm.cantidad),
        origen_id: sourceWarehouse.id,
        destino_id: saleProductForm.destino_id,
        usuario_pedido_id: "65243168aaca5e53e77f98b1",
        solicitado_nombre: "Usuario Gerente",
        estado: 'PENDIENTE' // Sale como pendiente para que se confirme en tienda
      })
    });

    if (res.ok) {
      setSaleProductForm({ producto_id: '', cantidad: '', destino_id: '' });
      setShowModal(null);
      loadAuxiliaryData();
      alert("Traslado a tienda registrado. El stock se actualizará cuando se confirme la recepción en la tabla de registros.");
    }
  };

  const handleDeleteLocation = async (e: React.MouseEvent, id: string, nombre: string) => {
    e.stopPropagation(); // Prevenir que se active el toggleLocation
    const password = prompt(`ADVERTENCIA: Vas a eliminar permanentemente ALMACÉN/TIENDA "${nombre}".\n\nIngresa la contraseña de autorización:`);
    if (password === 'gerente123') {
       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
       const res = await fetchWithAuth(`${apiUrl}/locations/${id}`, { method: 'DELETE' });
       if (res.ok) {
          alert("Sede eliminada satisfactoriamente.");
          loadData();
       } else {
          alert("Error al eliminar la sede.");
       }
    } else if (password !== null) {
       alert("Contraseña incorrecta. Operación cancelada.");
    }
  };

  const toggleLocation = (id: string) => {
    setActiveLocations(prev => {
      if (prev.includes(id)) return prev.filter(l => l !== id);
      if (prev.length >= 2) {
        alert("Solo puedes seleccionar un máximo de 2 tablas para comparar.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.nombre : (id || "S/C");
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
  const singleColumnModals = ['add-product', 'providers', 'categories', 'advanced-search', 'add-location', 'order-warehouse', 'order-provider', 'order-specific', 'products-to-sale'];
  const isSingleCol = showModal && singleColumnModals.includes(showModal);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-stone-900 overflow-hidden relative">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
      
      {/* HEADER */}
      <header className="h-20 bg-[#FF9100] flex items-center justify-between px-8 shrink-0 relative z-10 shadow-lg">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-xl flex items-center justify-center text-white transition-all shadow-sm border border-white/30">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase leading-none">
              Control <span className="hidden sm:inline">de Inventario</span>
            </h1>
          </div>
        </div>

          <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl border border-white/20">
             <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className={cn("px-2 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase transition-all", showLeftSidebar ? "bg-white text-[#FF9100]" : "text-white hover:bg-white/10")}>
                {showLeftSidebar ? "Ocultar Filtros" : "Filtros"}
             </button>
             <div className="w-px h-4 bg-white/20" />
             <button onClick={() => setShowRightSidebar(!showRightSidebar)} className={cn("px-2 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase transition-all", showRightSidebar ? "bg-white text-[#FF9100]" : "text-white hover:bg-white/10")}>
                {showRightSidebar ? "Cerrar Panel" : "Acciones"}
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white p-6 flex flex-col gap-8 shrink-0 border-r-2 border-stone-100 overflow-y-auto duration-300 shadow-xl transition-transform lg:relative lg:translate-x-0 lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          showLeftSidebar ? "translate-x-0" : "-translate-x-full"
        )}>
           <div className="flex justify-between items-center lg:hidden mb-4">
              <p className="text-xs font-black uppercase text-[#FF9100]">Filtros de Sede</p>
              <button onClick={() => setShowLeftSidebar(false)} className="p-2 bg-stone-100 rounded-lg text-stone-400"><X size={18}/></button>
           </div>
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
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all border group relative", activeLocations.includes(loc.id) ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md" : "bg-[#FDFBF7] text-stone-600 border-stone-200")}>
                    <div className={cn("p-1.5 rounded-lg", activeLocations.includes(loc.id) ? "bg-white/20 text-white" : "bg-white text-stone-400")}>
                      {activeLocations.includes(loc.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter truncate flex-1 text-left">{loc.nombre}</span>
                    <div onClick={(e) => handleDeleteLocation(e, loc.id, loc.nombre)} className={cn("p-1.5 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2", activeLocations.includes(loc.id) ? "text-white/80" : "text-stone-400")} title="Eliminar Almacén">
                       <Trash2 size={14} />
                    </div>
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
                  <button key={loc.id} onClick={() => toggleLocation(loc.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all border group relative", activeLocations.includes(loc.id) ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md" : "bg-[#FDFBF7] text-stone-600 border-stone-200")}>
                    <div className={cn("p-1.5 rounded-lg", activeLocations.includes(loc.id) ? "bg-white/20 text-white" : "bg-white text-stone-400")}>
                      {activeLocations.includes(loc.id) ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter truncate flex-1 text-left">{loc.nombre}</span>
                    <div onClick={(e) => handleDeleteLocation(e, loc.id, loc.nombre)} className={cn("p-1.5 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2", activeLocations.includes(loc.id) ? "text-white/80" : "text-stone-400")} title="Eliminar Tienda">
                       <Trash2 size={14} />
                    </div>
                  </button>
                ))}
              </div>
           </div>
         </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-8 flex flex-col gap-6 sm:gap-8 overflow-y-auto relative z-10 transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 shrink-0">
               {[
                 { label: "Total productos", val: products.length },
                 { label: "Alertas de stock", val: products.filter(p => p.stock <= (p.stock_minimo || 5)).length },
                 { label: "Valor inventario", val: `S/ ${products.reduce((acc, p) => acc + (p.precio * p.stock), 0).toLocaleString()}` }
               ].map((stat, i) => (
                 <div key={i} className={cn("bg-white p-6 sm:p-8 rounded-[2rem] flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] shadow-sm border-b-8 border-stone-200 border-b-[#FF9100]", i === 2 && "sm:col-span-2 lg:col-span-1")}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FF9100] mb-2">{stat.label}</p>
                    <h4 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-stone-800">{stat.val}</h4>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-sm flex-1 flex flex-col min-h-[500px] overflow-hidden border border-stone-100">
               <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-stone-100 flex flex-col xl:flex-row justify-between items-center bg-[#FDFBF7]/50 gap-6">
                  <div className="relative w-full xl:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF9100]" size={20} />
                    <input type="text" placeholder="Consultar inventario..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-2 border-stone-100 text-xs font-bold focus:border-[#FF9100] shadow-sm outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {activeLocations.length === 2 && (
                      <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 w-full sm:w-auto">
                        <button onClick={() => setIsComparisonActive(false)} className={cn("flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", !isComparisonActive ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600")}>Side-by-Side</button>
                        <button onClick={() => setIsComparisonActive(true)} className={cn("flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", isComparisonActive ? "bg-[#FF9100] text-white shadow-sm" : "text-stone-400 hover:text-stone-600")}>Comparar</button>
                      </div>
                    )}
                    <div className="bg-[#FF9100] px-6 sm:px-8 py-3 rounded-xl border-b-4 border-orange-600 w-full sm:w-auto text-center">
                      <span className="text-sm sm:text-lg font-black italic text-white tracking-widest uppercase flex flex-col">
                        <span>RESUMEN DE STOCK</span>
                        <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.3em] opacity-80">(ALMACÉN + TIENDAS)</span>
                      </span>
                    </div>
                  </div>
               </div>

               <div className="overflow-auto flex-1 p-4 sm:p-6">
                  {activeLocations.length === 2 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                       {activeLocations.map((locId, idx) => {
                          const location = locations.find(l => l.id === locId);
                          const locProducts = products.map(p => ({
                            ...p,
                            locStock: p.stock_por_ubicacion.find((s: any) => s.ubicacion_id === locId)?.stock || 0
                          })).filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

                          const otherLocId = activeLocations[idx === 0 ? 1 : 0];
                          
                          // Algorithm: Identify common/unique for highlights
                          const finalProducts = [...locProducts].sort((a, b) => {
                             if (!isComparisonActive) return 0;
                             const aInBoth = a.stock_por_ubicacion.find((s: any) => s.ubicacion_id === otherLocId);
                             const bInBoth = b.stock_por_ubicacion.find((s: any) => s.ubicacion_id === otherLocId);
                             if (aInBoth && !bInBoth) return -1;
                             if (!aInBoth && bInBoth) return 1;
                             return 0;
                          });

                          return (
                            <div key={locId} className="flex flex-col gap-4">
                               <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex justify-between items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9100]">{location?.nombre}</span>
                                  <span className="text-[10px] font-bold text-stone-400">{finalProducts.filter(p => p.locStock > 0).length} Productos en stock</span>
                               </div>
                               <div className="flex-1 overflow-auto">
                                  <table className="w-full text-left border-separate border-spacing-y-2">
                                    <tbody>
                                      {finalProducts.map(p => {
                                        const otherStock = p.stock_por_ubicacion.find((s: any) => s.ubicacion_id === otherLocId)?.stock;
                                        const existsInOther = otherStock !== undefined;
                                        
                                        let borderColor = "border-stone-100";
                                        if (isComparisonActive) {
                                          if (!existsInOther) borderColor = "border-black border-2";
                                          else if (p.locStock > 0 && otherStock > 0) borderColor = "border-green-500 border-2 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
                                          else borderColor = "border-red-500 border-2 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
                                        }

                                        return (
                                          <tr key={p.id} className={cn("bg-white rounded-xl transition-all border", borderColor)}>
                                            <td className="p-4 rounded-l-xl">
                                              <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                                                  {p.imagen ? <img src={p.imagen} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-stone-300" />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                  <span className="text-[11px] font-black uppercase truncate leading-tight">{p.nombre}</span>
                                                  <span className="text-[8px] font-bold text-[#FF9100] uppercase">{getCategoryName(p.categoria)}</span>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="p-4 text-center">
                                              <span className="text-lg font-black">{p.locStock}</span>
                                            </td>
                                            <td className="p-4 text-right rounded-r-xl">
                                              <div className="flex justify-end gap-1">
                                                <button onClick={() => handleEditProduct(p)} className="p-1.5 text-stone-300 hover:text-[#FF9100] transition-colors"><Edit size={14} /></button>
                                                <button onClick={() => handleDeleteProduct(p.id, p.nombre)} className="p-1.5 text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                               </div>
                            </div>
                          )
                       })}
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1">
                      {/* Desktop Table */}
                      <div className="hidden md:block">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                          <thead className="sticky top-0 z-20">
                            <tr className="bg-[#FDFBF7] text-stone-500 text-[10px] font-black uppercase tracking-widest">
                              <th className="px-10 py-5 rounded-l-2xl border-y border-l border-stone-100">Producto</th>
                              <th className="px-8 py-5 border-y border-stone-100">Categoría</th>
                              <th className="px-5 py-5 text-center border-y border-stone-100 bg-emerald-50/30 text-emerald-600">Almacén</th>
                              <th className="px-5 py-5 text-center border-y border-stone-100 bg-rose-50/30 text-rose-500">Tienda</th>
                              <th className="px-8 py-5 text-center border-y border-stone-100 font-bold text-stone-800 scale-110">Total</th>
                              <th className="px-10 py-5 rounded-r-2xl border-y border-r border-stone-100 text-right">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                               <tr><td colSpan={6} className="py-20 text-center font-bold text-lg text-stone-300">Cargando inventario...</td></tr>
                            ) : filteredProducts.map((p) => {
                              const isLowStock = p.stock <= (p.stock_minimo || 5);
                              return (
                                <tr key={p.id} className="group bg-white hover:bg-[#FDFBF7] transition-all relative">
                                  <td className="px-10 py-6 rounded-l-2xl border-b border-stone-100">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-stone-300" />}
                                      </div>
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                           <span className={cn("text-lg font-black tracking-tighter", isLowStock ? "text-[#FF9100]" : "text-stone-800")}>{p.nombre}</span>
                                           {isLowStock && <AlertTriangle size={14} className="text-[#FF9100] animate-bounce" fill="currentColor" />}
                                        </div>
                                        {p.proveedor_id && <span className="text-[9px] font-black uppercase text-stone-400">ID: {p.id.slice(-6)}</span>}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6 border-b border-stone-100">
                                     <span className="text-[10px] font-black uppercase px-3 py-1 bg-white border border-stone-200 text-stone-500 rounded-md">{getCategoryName(p.categoria)}</span>
                                  </td>
                                  <td className="px-8 py-6 text-center border-b border-stone-100">
                                    <span className="text-xl font-bold text-emerald-600">{p.stock_almacen || 0}</span>
                                  </td>
                                  <td className="px-8 py-6 text-center border-b border-stone-100">
                                    <span className="text-xl font-bold text-rose-400">{p.stock_tienda || 0}</span>
                                  </td>
                                  <td className="px-8 py-6 text-center border-b border-stone-100 bg-[#FDFBF7]">
                                    <span className={cn("text-2xl font-black", isLowStock ? "text-[#FF9100]" : "text-stone-800")}>{p.stock}</span>
                                  </td>
                                  <td className="px-10 py-6 rounded-r-2xl border-b border-stone-100 text-right">
                                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditProduct(p)} className="p-2.5 bg-white border border-stone-200 text-stone-400 hover:text-[#FF9100] hover:border-[#FF9100] rounded-xl transition-all shadow-sm">
                                          <Edit size={16} strokeWidth={2.5} />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(p.id, p.nombre)} className="p-2.5 bg-white border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-all shadow-sm">
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

                      {/* Mobile Card List */}
                      <div className="md:hidden flex flex-col gap-4">
                        {loading ? (
                           <p className="py-20 text-center font-bold text-stone-300">Cargando...</p>
                        ) : filteredProducts.map((p) => {
                          const isLowStock = p.stock <= (p.stock_minimo || 5);
                          return (
                            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                                  {p.imagen ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-stone-300" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                     <h4 className={cn("text-base font-black tracking-tight truncate", isLowStock ? "text-[#FF9100]" : "text-stone-800")}>{p.nombre}</h4>
                                     {isLowStock && <AlertTriangle size={14} className="text-[#FF9100] animate-bounce" fill="currentColor" />}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black uppercase bg-stone-50 px-2 py-0.5 rounded border border-stone-100 text-stone-400">{getCategoryName(p.categoria)}</span>
                                    <span className="text-[8px] font-bold text-stone-400 uppercase italic">ID: {p.id.slice(-6)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-emerald-50/50 p-2 rounded-xl text-center">
                                  <p className="text-[8px] font-black text-emerald-600 uppercase mb-0.5">Almacén</p>
                                  <span className="text-lg font-black text-emerald-700">{p.stock_almacen || 0}</span>
                                </div>
                                <div className="bg-rose-50/50 p-2 rounded-xl text-center">
                                  <p className="text-[8px] font-black text-rose-500 uppercase mb-0.5">Tienda</p>
                                  <span className="text-lg font-black text-rose-600">{p.stock_tienda || 0}</span>
                                </div>
                                <div className="bg-[#FF9100]/10 p-2 rounded-xl text-center border border-[#FF9100]/20">
                                  <p className="text-[8px] font-black text-[#FF9100] uppercase mb-0.5">Total</p>
                                  <span className="text-xl font-black text-[#FF9100]">{p.stock}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 border-t border-stone-50">
                                <button onClick={() => handleEditProduct(p)} className="flex-1 py-3 bg-stone-50 text-stone-400 font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-2 border border-stone-100">
                                  <Edit size={14} /> Editar
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id, p.nombre)} className="p-3 bg-rose-50 text-rose-400 rounded-xl border border-rose-100">
                                  <Trash2 size={16} />
                                </button>
                                <button onClick={() => handleQuickOrder(p)} className="flex-[1.5] py-3 bg-[#FF9100] text-white font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-2 shadow-sm">
                                  <ShoppingCart size={14} /> Pedir stock
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
               </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR ACTIONS */}
        <aside className={cn(
          "fixed inset-y-0 right-0 z-40 flex shrink-0 items-stretch font-sans transition-transform duration-300 lg:relative lg:translate-x-0",
          showRightSidebar ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Tablas Panel (Data Viewer Slide out) - Relative to drawer on mobile */}
          <div className={cn(
            "bg-[#FDFBF7] border-r border-stone-100 overflow-hidden transition-all duration-500 ease-in-out flex flex-col h-full",
            showTablesPanel ? "w-[300px] sm:w-[440px] opacity-100 shadow-xl" : "w-0 opacity-0"
          )}>
            <div className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 w-[300px] sm:w-[440px] h-full overflow-y-auto overflow-x-hidden">
               <div className="flex flex-col gap-1 border-b-2 border-[#B0E0E6]/20 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B0E0E6]">Gestión Avanzada</p>
                  <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-stone-800 uppercase">Consultas</h3>
               </div>
               
               {/* Mini Tabla Proveedores */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={14} className="text-[#B0E0E6]" /> Proveedores
                     </h4>
                     <button onClick={() => setShowModal('providers')} className="text-[9px] font-black uppercase text-[#B0E0E6] hover:underline underline-offset-4">
                        Ver/Nuevo
                     </button>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-stone-100 p-2 overflow-hidden overflow-x-auto shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-[#FDFBF7] text-[8px] font-black uppercase text-stone-400">
                           <tr>
                              <th className="p-3">Empresa</th>
                              <th className="p-3">Contacto</th>
                              <th className="p-3 text-right">Tlf</th>
                           </tr>
                        </thead>
                        <tbody className="text-[10px] font-bold text-stone-600">
                           {providers.slice(0, 5).map(p => (
                              <tr key={p.id} className="border-b border-stone-50 last:border-0 hover:bg-[#FDFBF7] transition-all">
                                 <td className="p-3 uppercase truncate max-w-[80px] sm:max-w-[100px]">{p.empresa || "---"}</td>
                                 <td className="p-3 truncate max-w-[60px] sm:max-w-[80px]">{p.nombre}</td>
                                 <td className="p-3 text-right tabular-nums">{p.telefono || "S/T"}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Mini Tabla Categorías */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={14} className="text-[#90EE90]" /> Categorías
                     </h4>
                     <button onClick={() => setShowModal('categories')} className="text-[9px] font-black uppercase text-[#90EE90] hover:underline underline-offset-4">
                        Ver/Nuevo
                     </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {categories.map(c => (
                        <div key={c.id} className="bg-white p-3 sm:p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col gap-1 border-l-4 border-l-[#90EE90] hover:scale-105 transition-transform cursor-default">
                           <p className="text-[9px] font-black uppercase text-stone-800 leading-none">{c.nombre}</p>
                           <p className="text-[8px] font-bold text-stone-400 italic">ID: {c.id.slice(-4)}</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="mt-auto bg-stone-900 p-6 rounded-3xl text-white shadow-xl">
                  <p className="text-[10px] font-bold opacity-60 uppercase mb-2">Ayuda Rápida</p>
                  <p className="text-[11px] font-medium leading-relaxed italic border-l-2 border-[#B0E0E6] pl-4">
                     Consulta datos maestros sin salir del inventario. Usa los botones superiores para añadir.
                  </p>
               </div>
            </div>
          </div>

          {/* Main Action Strip */}
          <div className="w-20 sm:w-24 p-4 flex flex-col items-center gap-6 overflow-y-auto bg-white border-l h-full">
            <button onClick={() => setShowRightSidebar(false)} className="lg:hidden p-2 text-stone-400"><X size={20}/></button>
            <div className="bg-[#FDFBF7] px-2 py-4 rounded-xl text-center w-full border border-stone-100">
              <p className="text-[8px] font-black uppercase leading-tight text-stone-400 font-sans">ACCIONES</p>
            </div>
            
            <div className="flex flex-col gap-5 items-center">
                {[
                  { id: 'add-product', color: 'bg-emerald-500', icon: <Plus size={24} />, title: 'Agregar al Almacén', action: () => { setSelectedProduct(null); setProductForm({ nombre: '', precio: '', costo: '', categoria_id: '', proveedor_id: '', ubicacion_id: '', stock_inicial: '', stock_minimo: '5', imagen: '' }); setShowModal('add-product'); } },
                  { id: 'products-to-sale', color: 'bg-rose-500', icon: <ShoppingCart size={24} />, title: 'Productos a la Venta', action: () => setShowModal('products-to-sale') },
                  { id: 'tablas', color: showTablesPanel ? 'bg-[#B0E0E6]' : 'bg-[#B0E0E6]/50', icon: <Table size={24} />, title: 'Gestión de Tablas de Datos', action: () => setShowTablesPanel(!showTablesPanel) },
                  { id: 'compare', color: isComparisonActive ? 'bg-[#FF9100]' : 'bg-stone-300', icon: <ArrowLeftRight size={24} />, title: 'Activar Comparación', action: () => activeLocations.length === 2 ? setIsComparisonActive(!isComparisonActive) : alert("Selecciona 2 tablas para comparar") },
                  { id: 'filter-stock', color: showLowStockOnly ? 'bg-orange-600' : 'bg-orange-300', icon: <AlertTriangle size={24} />, title: 'Visualizar Stock Bajo', action: () => setShowLowStockOnly(!showLowStockOnly) },
                  { id: 'order-warehouse', color: 'bg-[#D2691E]', icon: <Building size={24} />, title: 'Pedido Interno Almacén', action: () => setShowModal('order-warehouse') },
                  { id: 'order-provider', color: 'bg-stone-500', icon: <Truck size={24}/>, title: 'Pedido a Proveedor Externo', action: () => setShowModal('order-provider') },
                  { id: 'movements', color: 'bg-[#B22222]', icon: <ArrowLeftRight size={24} />, title: 'Historial de Movimientos', action: () => setShowModal('movements') }
                ].map((btn) => (
                  <button key={btn.id} onClick={btn.action} className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 sm:border-4 border-white shadow-lg hover:scale-110 active:scale-90 transition-all text-white flex items-center justify-center", btn.color)} title={btn.title}>
                    {btn.icon}
                  </button>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-8 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
           {/* Dinámico: O panel central único (Single-Col) o panel doble */}
           <div className={cn("bg-white rounded-3xl sm:rounded-[3rem] shadow-2xl flex relative overflow-hidden animate-in zoom-in-95 duration-300 w-full", isSingleCol ? "max-w-xl h-auto max-h-[90vh]" : "max-w-6xl h-full sm:h-[85vh]")}>
              <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 w-10 h-10 bg-stone-100 text-stone-500 flex items-center justify-center rounded-2xl hover:bg-[#FF9100] hover:text-white transition-all z-[110]">
                <X size={20} strokeWidth={3} />
              </button>
              
              <div className="flex w-full flex-col lg:flex-row overflow-y-auto">
                 {/* LEFT/MAIN FORM */}
                 <div className={cn("bg-white border-stone-100 flex flex-col shrink-0", isSingleCol ? "w-full p-6 sm:p-12" : "w-full lg:w-[40%] bg-[#FDFBF7] p-8 sm:p-16 border-b-2 lg:border-b-0 lg:border-r-2")}>
                    <h3 className="text-3xl font-black text-[#FF9100] uppercase tracking-tighter mb-8">
                      {selectedProduct ? "Editar Producto" : showModal.split("-").join(" ")}
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

                          {!selectedProduct && (
                            <>
                              <select required value={productForm.ubicacion_id} onChange={e=>setProductForm({...productForm, ubicacion_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner text-stone-600">
                                <option value="">Registrar Sede/Ubicación de Primer Ingreso...</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                              </select>
                              
                              <div className="flex gap-4">
                                <input required value={productForm.stock_inicial} onChange={e=>setProductForm({...productForm, stock_inicial: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Stock Inicial" type="number" />
                              </div>
                            </>
                          )}
                          <div className="flex gap-4">
                             <input required value={productForm.stock_minimo} onChange={e=>setProductForm({...productForm, stock_minimo: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Stock Mínimo (Alerta)" type="number" />
                          </div>

                          <div className="flex gap-2 items-center">
                             <input value={productForm.imagen} onChange={e=>setProductForm({...productForm, imagen: e.target.value})} className="flex-1 p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner text-xs" placeholder="URL de la imagen devuelta por Cloudinary..." type="url" />
                             <button type="button" onClick={handleUploadClick} className="px-6 py-4 bg-stone-800 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black rounded-xl transition-all h-full whitespace-nowrap shadow-sm">
                               Subir Imgn
                             </button>
                          </div>

                          <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">
                            {selectedProduct ? "Guardar Cambios" : "Crear Producto"}
                          </button>
                       </form>
                    )}

                    {/* NUEVO PROVEEDOR FORM - 1 Columna */}
                    {showModal === 'providers' && (
                       <form onSubmit={handleCreateProvider} className="space-y-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Nombre del Representante / Contacto</label>
                           <input required value={providerForm.nombre} onChange={e => setProviderForm({...providerForm, nombre: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Ej: Juan Pérez" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-stone-400 ml-2">Nombre de la Empresa / Razón Social</label>
                           <input required value={providerForm.empresa} onChange={e => setProviderForm({...providerForm, empresa: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 outline-none focus:border-[#FF9100] font-bold shadow-inner" placeholder="Ej: Distribuidora Karina S.A.C." />
                         </div>
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
                         <select required value={movementForm.origen_id} onChange={e=>setMovementForm({...movementForm, origen_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                              <option value="">Selecciona Almacén de ORIGEN...</option>
                              {locations.filter(l => l.tipo === 'ALMACEN').map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                          </select>
                          <select required value={movementForm.destino_id} onChange={e=>setMovementForm({...movementForm, destino_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                              <option value="">Selecciona Tienda de DESTINO...</option>
                              {locations.filter(l => l.tipo === 'TIENDA').map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                          </select>
                         <button type="submit" className="w-full py-5 bg-[#FF9100] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-orange-600 shadow-md">Generar Orden Interna</button>
                       </form>
                    )}

                    {/* PEDIDO A PROVEEDOR EXTERNO - Rediseño Profesional */}
                    {showModal === 'order-provider' && (
                       <form onSubmit={(e)=>{ setMovementForm(m=>({...m, tipo:'PEDIDO_PROVEEDOR'})); handleCreateMovement(e); }} className="space-y-4">
                         <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 mb-4">
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Cálculo de Inversión</p>
                            <div className="flex justify-between items-end">
                               <h4 className="text-3xl font-black text-orange-700 tracking-tighter">
                                  S/ {(parseFloat(movementForm.costo_unitario) * parseInt(movementForm.cantidad) || 0).toLocaleString()}
                               </h4>
                               <span className="text-[10px] font-bold text-orange-400">Subtotal Estimado</span>
                            </div>
                         </div>

                         <select required value={movementForm.proveedor_id} onChange={e=>setMovementForm({...movementForm, proveedor_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                             <option value="">¿A qué Proveedor le compras?</option>
                             {providers.map(prov => <option key={prov.id} value={prov.id}>{prov.empresa || prov.nombre}</option>)}
                         </select>

                         <select required value={movementForm.producto_id} onChange={e=>setMovementForm({...movementForm, producto_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                             <option value="">Producto a Reabastecer...</option>
                             {products.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                         </select>

                         <div className="flex gap-4">
                            <div className="w-1/2 space-y-1">
                               <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Cantidad</label>
                               <input required value={movementForm.cantidad} onChange={e=>setMovementForm({...movementForm, cantidad: e.target.value})} type="number" className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold outline-none focus:border-[#FF9100]" placeholder="0" />
                            </div>
                            <div className="w-1/2 space-y-1">
                               <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Costo Unitario S/</label>
                               <input required value={movementForm.costo_unitario} onChange={e=>setMovementForm({...movementForm, costo_unitario: e.target.value})} type="number" step="0.01" className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold outline-none focus:border-[#FF9100]" placeholder="0.00" />
                            </div>
                         </div>

                         <select required value={movementForm.destino_id} onChange={e=>setMovementForm({...movementForm, destino_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                             <option value="">Almacén/Tienda de Recepción...</option>
                             {locations.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                         </select>
                         
                         <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Firma / Autorizado por:</label>
                            <input required value={movementForm.solicitado_nombre} onChange={e=>setMovementForm({...movementForm, solicitado_nombre: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold outline-none focus:border-[#FF9100]" placeholder="Nombre del Gerente" />
                         </div>

                         <button type="submit" className="w-full py-5 bg-stone-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:bg-black shadow-lg transition-all active:scale-[0.98]">
                            Lanzar Orden y Generar Boleta
                         </button>
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
                    {/* PRODUCTOS A LA VENTA (ACCESSO RÁPIDO) */}
                    {showModal === 'products-to-sale' && (
                       <form onSubmit={handleCreateSaleMovement} className="space-y-4">
                          <p className="text-sm font-bold text-stone-500 mb-2 italic">Selecciona un producto del Almacén para ponerlo disponible en una Tienda.</p>
                          
                          <div className="space-y-1">
                             <label className="text-[9px] font-black uppercase text-stone-400 ml-2">¿Qué producto moverás?</label>
                             <select required value={saleProductForm.producto_id} onChange={e=>setSaleProductForm({...saleProductForm, producto_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                                 <option value="">Selecciona el Producto...</option>
                                 {products.map(p => <option key={p.id} value={p.id}>{p.nombre} (Libre: {p.stock_almacen})</option>)}
                             </select>
                          </div>

                          <div className="flex gap-4">
                             <div className="flex-1 space-y-1">
                                <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Cantidad a Venta</label>
                                <input required value={saleProductForm.cantidad} onChange={e=>setSaleProductForm({...saleProductForm, cantidad: e.target.value})} type="number" className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold outline-none focus:border-[#FF9100]" placeholder="0" />
                             </div>
                             <div className="flex-1 space-y-1">
                                <label className="text-[9px] font-black uppercase text-stone-400 ml-2">Tienda de Destino</label>
                                <select required value={saleProductForm.destino_id} onChange={e=>setSaleProductForm({...saleProductForm, destino_id: e.target.value})} className="w-full p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 font-bold text-stone-600 outline-none focus:border-[#FF9100]">
                                    <option value="">¿A qué Tienda?</option>
                                    {locations.filter(l => l.tipo === 'TIENDA').map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                </select>
                             </div>
                          </div>

                          <button type="submit" className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-6 hover:bg-rose-600 shadow-md transition-all active:scale-[0.98]">
                             Cargar a Tienda
                          </button>
                       </form>
                    )}

                 </div>

                 {/* BANDJEJA DE ENTRADAS - SOLO SE MUESTRA SI NO ES SINGLE COL */}
                 {!isSingleCol && (
                   <div className="w-full lg:w-[60%] p-8 sm:p-16 bg-white overflow-hidden flex flex-col">
                      <h4 className="text-xl sm:text-2xl font-black text-stone-800 mb-6 sm:mb-8 uppercase tracking-widest">Actividad</h4>
                      <div className="flex-1 overflow-auto rounded-[2rem] border border-stone-100 p-3 sm:p-4 bg-[#FDFBF7]">
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
