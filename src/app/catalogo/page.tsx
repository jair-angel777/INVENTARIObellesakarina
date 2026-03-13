"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, Filter, ChevronDown, Check, Star, X } from "lucide-react";

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  sku: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function CatalogoPage() {
   const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Normalización de la URL de API v3.6
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app';
  const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('bellesas_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('bellesas_cart', JSON.stringify(cart));
  }, [cart]);

   const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutStatus(null);
    try {
      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_nombre: 'Cliente Web',
          total: cartTotal,
          metodo_pago: 'EFECTIVO', // Default for now
          detalles: cart.map(item => ({
            producto_id: item.id,
            nombre_producto: item.nombre,
            cantidad: item.quantity,
            precio_unitario: item.precio,
            subtotal: item.precio * item.quantity
          }))
        })
      });

      if (res.ok) {
        setCheckoutStatus({ type: 'success', msg: '¡Compra realizada con éxito!' });
        setCart([]);
        setTimeout(() => {
          setIsCartOpen(false);
          setCheckoutStatus(null);
        }, 3000);
      } else {
        const data = await res.json();
        setCheckoutStatus({ type: 'error', msg: data.error || 'Error al procesar la compra' });
      }
    } catch (error) {
      console.error(error);
      setCheckoutStatus({ type: 'error', msg: 'Error de conexión' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Obtener categorías únicas
  const categories = ["Todas", ...Array.from(new Set(products.map(p => p.categoria).filter(Boolean)))];

  // Filtrado de productos
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Todas" || p.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900">
      {/* Top Notice Bar */}
      <div className="bg-rose-600 text-white text-[10px] md:text-xs py-2 px-4 text-center font-bold tracking-[0.2em] uppercase">
        Envíos gratis en pedidos superiores a S/150 a nivel nacional
      </div>

      {/* Header */}
      <header className={`sticky top-0 w-full z-40 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 text-stone-900">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex-1 flex justify-center lg:justify-start">
            <Link href="/" className="flex flex-col items-center lg:items-start group">
              <h1 className="text-2xl md:text-3xl font-serif font-black tracking-tighter uppercase leading-none text-stone-900 group-hover:text-rose-600 transition-colors">
                Bellesas
              </h1>
              <span className="text-[8px] md:text-[9px] tracking-[0.3em] font-bold uppercase text-stone-500 mt-1">Karina Paris</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center space-x-8 flex-1">
            <Link href="/catalogo" className="text-xs font-bold tracking-[0.15em] text-rose-600 uppercase">Catálogo</Link>
            <Link href="/#marcas" className="text-xs font-bold tracking-[0.15em] text-stone-500 hover:text-rose-600 uppercase transition-colors">Marcas</Link>
            <Link href="/#nosotros" className="text-xs font-bold tracking-[0.15em] text-stone-500 hover:text-rose-600 uppercase transition-colors">Nosotros</Link>
          </nav>

          <div className="flex items-center justify-end space-x-4 flex-1">
            <div className="hidden md:flex relative group">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-48 bg-stone-100 border-none rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all group-focus-within:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            </div>
            
             <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-900 hover:text-rose-600 transition-colors"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tight text-stone-900">
            Catálogo <span className="italic text-rose-500">Exclusivo</span>
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-sm md:text-base font-light">
            Descubre nuestra selección premium de productos de belleza. Todo lo que necesitas para realzar tu esencia natural.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar / Filters (Desktop) */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 sticky top-28">
            {/* Mobile Search - Visible only on mobile */}
            <div className="md:hidden relative mb-6">
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-rose-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-4 flex items-center gap-2">
                <Filter size={14} />
                Categorías
              </h3>
              <div className="space-y-1">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                      selectedCategory === cat 
                        ? "bg-rose-50 text-rose-600 font-bold" 
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span className="capitalize">{cat || "Sin categoría"}</span>
                    {selectedCategory === cat && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <div className="mb-6 flex justify-between items-center text-sm text-stone-500 border-b border-stone-200 pb-4">
              <p>Mostrando <span className="font-bold text-stone-900">{filteredProducts.length}</span> productos</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="bg-stone-200 aspect-[4/5] rounded-2xl w-full" />
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-4 bg-stone-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group flex flex-col h-full bg-white rounded-[2rem] p-4 border border-stone-100 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/5] bg-stone-50 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                      {product.imagen ? (
                        <img 
                          src={product.imagen} 
                          alt={product.nombre}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                             // Fallback in case image URL is broken
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Imagen no disponible</span>
                        </div>
                      )}
                      {/* Fallback element */}
                      <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-stone-300 bg-stone-50">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Sin Imagen</span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                         <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="w-full bg-stone-900/90 backdrop-blur-md text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg disabled:opacity-50 disabled:bg-stone-400"
                        >
                          {product.stock <= 0 ? 'Agotado' : 'Agregar al Bolso'}
                        </button>
                      </div>
                      
                      {/* Stock Badge */}
                      {product.stock <= 0 && (
                        <div className="absolute top-3 left-3 bg-red-500/90 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                          Agotado
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-grow">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1.5 line-clamp-1">{product.categoria || "Beauté"}</span>
                      <h3 className="text-lg font-serif font-medium text-stone-900 leading-tight mb-2 flex-grow">{product.nombre}</h3>
                      
                      <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                        <span className="text-xs text-stone-400 ml-1">(0)</span>
                      </div>

                      <div className="flex items-end justify-between mt-auto">
                        <span className="text-xl font-medium tracking-tight text-stone-900">
                          S/ {product.precio ? product.precio.toFixed(2) : "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-stone-50 border border-stone-100 rounded-3xl">
                <Search className="mx-auto text-stone-300 mb-4" size={48} strokeWidth={1} />
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-2">No se encontraron productos</h3>
                <p className="text-stone-500 text-sm">Intenta ajustar los filtros o tu término de búsqueda.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setSelectedCategory("Todas"); }}
                  className="mt-6 px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-rose-600 transition-colors"
                >
                  Limpiar Búsqueda
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER PUSH - Simpler version for subpages */}
      <footer className="bg-stone-900 text-white pt-16 pb-8 rounded-t-[3rem] mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <Link href="/" className="flex flex-col items-center md:items-start group">
               <h2 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none text-white group-hover:text-rose-500 transition-colors">
                 Bellesas
               </h2>
               <span className="text-[9px] tracking-[0.3em] font-bold uppercase text-stone-400 mt-1">Karina Paris</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-widest uppercase text-stone-400">
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-stone-800">
            <p className="text-[10px] text-stone-500 max-w-2xl mx-auto mb-2 leading-relaxed">
              Las marcas mencionadas son propiedad de sus respectivos dueños. Este es un catálogo de un distribuidor independiente.
            </p>
            <p className="text-[10px] text-stone-600">
              © {new Date().getFullYear()} Bellesas Karina. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      {/* BAG DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-rose-600" />
                <h2 className="text-xl font-serif font-bold uppercase tracking-tight">Tu Bolso</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={20} className="text-stone-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Tu bolso está vacío</p>
                  <button onClick={() => setIsCartOpen(false)} className="px-6 py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-colors">
                    Explorar Productos
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-300 font-bold uppercase text-center p-2">Sin imagen</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-bold text-stone-900 leading-tight uppercase line-clamp-2">{item.nombre}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider mb-2">{item.categoria || 'Beauté'}</span>
                      <div className="flex justify-between items-center mt-auto pb-1">
                        <div className="flex items-center gap-3 bg-stone-50 px-3 py-1 rounded-lg border border-stone-100">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-stone-400 hover:text-rose-600">-</button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-stone-400 hover:text-rose-600">+</button>
                        </div>
                        <span className="text-sm font-medium text-stone-900">S/ {(item.precio * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-stone-100 bg-stone-50/50 space-y-6">
                {checkoutStatus && (
                  <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95 ${checkoutStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {checkoutStatus.type === 'success' ? <Check size={16} /> : <X size={16} />}
                    {checkoutStatus.msg}
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-500 uppercase tracking-widest font-bold">
                    <span>Subtotal</span>
                    <span>S/ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-900 font-black uppercase tracking-tighter italic">
                    <span>Total Estimado</span>
                    <span className="text-lg">S/ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  disabled={isCheckingOut || checkoutStatus?.type === 'success'}
                  onClick={handleCheckout}
                  className="w-full bg-rose-600 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 hover:bg-stone-900 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Check size={16} />}
                  {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
                </button>
                <p className="text-[8px] text-stone-400 text-center uppercase tracking-widest font-bold">
                  * Pago contra entrega disponible en Lima Metropolitana
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
