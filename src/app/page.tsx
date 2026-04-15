"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ArrowRight, ShieldCheck, Star, Zap, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-stone-900 selection:bg-rose-500 selection:text-white">
      {/* Top Notice Bar */}
      <div className="bg-rose-600 text-white text-xs py-2.5 px-4 text-center font-bold tracking-widest uppercase relative z-50">
        <span className="animate-pulse inline-block mr-2">✦</span>
        Envíos gratis en pedidos superiores a S/150 a nivel nacional
        <span className="animate-pulse inline-block ml-2">✦</span>
      </div>

      {/* Main Navigation */}
      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-500",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        <div className={cn(
          "absolute top-0 left-0 w-[80%] h-full bg-white shadow-2xl transition-transform duration-500 flex flex-col p-8",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex flex-col">
              <h2 className="text-2xl font-serif font-black tracking-tighter uppercase leading-none text-stone-900">
                Bellesas
              </h2>
              <span className="text-[8px] tracking-[0.3em] font-bold uppercase text-stone-500 mt-1">Karina Paris</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-stone-100 rounded-full text-stone-500"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6">
            <Link href="/catalogo" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase">
              Catálogo
            </Link>
            <Link href="#marcas" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase">
              Marcas
            </Link>
            <Link href="#nosotros" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase">
              Nosotros
            </Link>
          </nav>
          
          <div className="mt-auto pt-8 border-t border-stone-100 flex flex-col gap-4">
             <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-stone-900 font-bold uppercase tracking-widest text-xs">
                <div className="bg-stone-100 p-2 rounded-full"><User size={20} /></div>
                Acceso Clientes
             </Link>
             <Link href="/admin/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-rose-600 font-bold uppercase tracking-widest text-xs">
                <div className="bg-rose-50 p-2 rounded-full"><ShieldCheck size={20} /></div>
                Acceso Staff
             </Link>
          </div>
        </div>
      </div>

      <header 
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Icon */}
            <div className="flex items-center gap-4 lg:hidden z-10">
              <button 
                aria-label="Menu" 
                className="text-stone-900 hover:text-rose-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu strokeWidth={1.5} size={28} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start lg:w-1/4 z-10">
              <Link href="/" className="flex flex-col items-center group">
                 <h1 className="text-3xl font-serif font-black tracking-tighter uppercase leading-none text-stone-900 group-hover:text-rose-600 transition-colors">
                   Bellesas
                 </h1>
                 <span className="text-[9px] tracking-[0.3em] font-bold uppercase text-stone-500 mt-1">Karina Paris</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex justify-center space-x-10 lg:w-2/4">
              <Link href="/catalogo" className="text-xs font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase relative group py-2">
                Catálogo
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="#marcas" className="text-xs font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase relative group py-2">
                Marcas
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="#nosotros" className="text-xs font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase relative group py-2">
                Nosotros
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center justify-end space-x-6 lg:w-1/4 z-10">
              <button aria-label="Search" className="text-stone-900 hover:text-rose-600 transition-colors hidden sm:block">
                <Search strokeWidth={1.5} size={22} />
              </button>
              
              {/* Acceso Clientes */}
              <Link 
                href="/login" 
                aria-label="Acceso Clientes"
                className="text-stone-900 hover:text-rose-600 transition-colors flex items-center gap-2 group"
                title="Acceso Clientes"
              >
                <div className="bg-stone-100 p-2 rounded-full group-hover:bg-rose-50 transition-colors">
                  <User strokeWidth={1.5} size={20} />
                </div>
                <span className="hidden xl:block text-xs font-bold uppercase tracking-widest">Login</span>
              </Link>
              
              {/* Cart */}
              <button aria-label="Cart" className="text-stone-900 hover:text-rose-600 transition-colors relative group">
                <div className="bg-stone-100 p-2 rounded-full group-hover:bg-rose-50 transition-colors">
                  <ShoppingBag strokeWidth={1.5} size={20} />
                </div>
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        {/* HERO SECTION - El "Puente" (Basado en la referencia) */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1212] via-[#2D1616] to-[#4A1520]">
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
            
            {/* Lado Izquierdo - Texto (Alineado a la izquierda según la imagen) */}
            <div className="flex-1 text-center lg:text-left space-y-8 lg:pr-8">
              
              {/* Etiqueta superior */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4">
                <Star size={12} className="text-amber-200" />
                Belleza Auténtica. Marcas Globales
              </div>
              
              {/* Título Principal (Serif, blanco y cursiva rosa/oro) */}
              <h2 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-serif text-white tracking-tighter leading-[0.9] font-medium">
                Realza tu <br />
                <span className="italic text-rose-400 font-normal">esencia.</span>
              </h2>
              
              {/* Subtítulo */}
              <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed mt-6">
                El destino definitivo para descubrir lo mejor en cosmética multimarca. Calidad garantizada en cada producto que eliges.
              </p>
              
              {/* Botones */}
              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 pt-4">
                <Link 
                  href="/catalogo" 
                  className="w-full sm:w-auto px-10 py-5 bg-white text-stone-900 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] hover:bg-stone-100 transition-all rounded-full flex items-center justify-center gap-2 shadow-2xl shadow-rose-950/20"
                >
                  <span className="text-lg leading-none">🛒</span>
                  Ver Colección
                </Link>
                <Link 
                  href="#nosotros" 
                  className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-white/30 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all rounded-full flex items-center justify-center gap-2"
                >
                  Descubrir Más
                </Link>
              </div>
            </div>

            {/* Lado Derecho - Composición de Imágenes (El marco de media luna) */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative mt-12 lg:mt-0">
               {/* Contenedor con borde curvo (Arch) similar a la referencia */}
               <div className="w-full max-w-[500px] aspect-[4/3] sm:aspect-square lg:aspect-[4/5] bg-[#3B2828] rounded-[2rem] sm:rounded-tl-[150px] sm:rounded-bl-[150px] sm:rounded-tr-[40px] sm:rounded-br-[40px] overflow-hidden relative shadow-2xl shadow-black/50 border-4 border-[#4A1520]">
                  
                  {/* Imagen de fondo / Placeholder principal (Modelo o Productos) */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-transparent z-10 opacity-60" />
                  
                  {/* Para la demostración, usamos un gradiente rico en lugar de la imagen que no se pudo descargar */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />

                  {/* Etiqueta Flotante sobre la imagen (como en la referencia) */}
                  <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-10 z-20 w-[90%] sm:w-auto">
                    <div className="bg-[#1A1212]/90 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-xl">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-inner">
                        <Zap className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">Nuevos Ingresos</p>
                        <p className="text-stone-400 text-[9px] sm:text-[10px]">Revisa la colección 2026</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS / TRUST BAR */}
        <section className="bg-white border-b border-stone-200 py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4 text-center md:text-left">
              <div className="bg-rose-50 p-4 rounded-full text-rose-600"><CheckCircle2 size={24} strokeWidth={2}/></div>
              <div>
                <h4 className="font-bold text-sm tracking-wide uppercase">Productos 100% Originales</h4>
                <p className="text-xs text-stone-500 mt-1">Garantía de calidad en todas las marcas</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-center md:text-left">
              <div className="bg-rose-50 p-4 rounded-full text-rose-600"><ShoppingBag size={24} strokeWidth={2}/></div>
              <div>
                <h4 className="font-bold text-sm tracking-wide uppercase">Catálogo Multimarca</h4>
                <p className="text-xs text-stone-500 mt-1">Las mejores opciones en un solo lugar</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-center md:text-left">
              <div className="bg-rose-50 p-4 rounded-full text-rose-600"><ShieldCheck size={24} strokeWidth={2}/></div>
              <div>
                <h4 className="font-bold text-sm tracking-wide uppercase">Compra Segura</h4>
                <p className="text-xs text-stone-500 mt-1">Tus datos están protegidos siempre</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN NOSOTROS */}
        <section id="nosotros" className="py-32 bg-[#FAF8F5] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-60 animate-pulse" />
                <div className="relative z-10 space-y-8">
                  <header>
                    <span className="text-rose-600 font-bold uppercase tracking-[0.3em] text-[10px]">Nuestra Historia</span>
                    <h3 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mt-4 text-stone-900 leading-tight">
                      Curaduría de <br />
                      <span className="italic text-rose-500">Belleza Global</span>
                    </h3>
                  </header>
                  
                  <div className="space-y-6 text-stone-600 leading-relaxed font-light text-lg">
                    <p>
                      <strong>Bellesas Karina</strong> nace de la pasión por acercar las marcas de cosmética más exclusivas del mundo a tu puerta. No somos solo una tienda; somos un destino de confianza para quienes buscan resultados reales y calidad garantizada.
                    </p>
                    <p>
                      Nuestra fundadora, <strong>Karina Paris</strong>, seleccionó cada marca de nuestro catálogo bajo una premisa simple: la belleza auténtica comienza con productos de calidad superior. Desde los rincones más innovadores de Europa hasta los favoritos globales, traemos lo mejor para ti.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6">
                    <div>
                      <h4 className="text-3xl font-serif font-bold text-stone-900">20+</h4>
                      <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">Marcas Exclusivas</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-serif font-bold text-stone-900">100%</h4>
                      <p className="text-xs uppercase tracking-widest text-stone-400 mt-1">Originalidad</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1512496011212-32c70115b615?q=80&w=1000&auto=format&fit=crop" 
                    alt="Bellesas Karina Store" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white p-4 rounded-3xl shadow-xl -rotate-6 hidden sm:block">
                   <div className="w-full h-full border border-stone-100 rounded-2xl flex flex-col items-center justify-center text-center p-4">
                      <ShieldCheck size={32} className="text-rose-600 mb-2" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-900">Sello de Autenticidad</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS (Placeholder para el futuro catálogo) */}
        <section id="catalogo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-rose-600 font-bold uppercase tracking-[0.2em] text-xs">Comprar por categoría</span>
              <h3 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mt-2">Nuestras Selecciones</h3>
            </div>
            <Link href="#" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-rose-600 transition-colors group">
              Ver Todo el Catálogo
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Categ 1 */}
            <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-100 aspect-[4/5] relative transition-transform hover:-translate-y-2 duration-500 bg-[url('/cuidado.jpg.png')] bg-cover bg-center">
               
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-20" />
               <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                  <h4 className="text-2xl font-serif font-medium text-white mb-2">Cuidado de la Piel</h4>
                  <p className="text-sm text-stone-300 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Rutinas completas para un rostro radiante.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">Explorar <ArrowRight size={14}/></span>
               </div>
            </div>

            {/* Categ 2 */}
            <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-200 aspect-[4/5] relative transition-transform hover:-translate-y-2 duration-500 bg-[url('/sueros.jpg.png')] bg-cover bg-center">
               
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-20" />
               <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                  <h4 className="text-2xl font-serif font-medium text-white mb-2">Sueros y Tratamientos</h4>
                  <p className="text-sm text-stone-300 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Potencia tu belleza con fórmulas avanzadas.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">Explorar <ArrowRight size={14}/></span>
               </div>
            </div>

            {/* Categ 3 */}
            <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-100 aspect-[4/5] relative transition-transform hover:-translate-y-2 duration-500 bg-[url('/maquilllaje.jpg.png')] bg-cover bg-center">
               
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-20" />
               <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                  <h4 className="text-2xl font-serif font-medium text-white mb-2">Maquillaje</h4>
                  <p className="text-sm text-stone-300 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Bases, labiales y todo para resaltar tu estilo.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">Explorar <ArrowRight size={14}/></span>
               </div>
            </div>
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-stone-900 text-sm font-bold uppercase tracking-widest rounded-full">
              Ver Todo el Catálogo
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER - Con enlaces legales */}
      <footer className="bg-stone-900 text-white pt-24 pb-12 rounded-t-[3rem] mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Branding */}
            <div className="lg:col-span-1 space-y-6">
              <Link href="/" className="flex flex-col items-start">
                 <h2 className="text-3xl font-serif font-black tracking-tighter uppercase leading-none text-white">
                   Bellesas
                 </h2>
                 <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-stone-400 mt-1">Karina Paris</span>
              </Link>
              <p className="text-stone-400 text-sm leading-relaxed">
                Tu destino para encontrar cosméticos multimarca de alta calidad. Selección cuidadosa para resaltar tu belleza natural.
              </p>
            </div>

            {/* Enlaces de Tienda */}
            <div>
               <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6 text-stone-200">Tienda</h4>
               <ul className="space-y-4 text-sm text-stone-400">
                 <li><Link href="/catalogo" className="hover:text-rose-400 transition-colors">Catálogo de Productos</Link></li>
                 <li><Link href="#" className="hover:text-rose-400 transition-colors">Novedades</Link></li>
                 <li><Link href="#" className="hover:text-rose-400 transition-colors">Ofertas Especiales</Link></li>
                 <li><Link href="#" className="hover:text-rose-400 transition-colors">Marcas Disponibles</Link></li>
               </ul>
            </div>

            {/* Legal y Ayuda */}
            <div>
               <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6 text-stone-200">Legal y Ayuda</h4>
               <ul className="space-y-4 text-sm text-stone-400">
                 <li><Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                 <li><Link href="#" className="hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
               </ul>
            </div>

            {/* Acceso Staff */}
            <div>
               <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6 text-stone-200">Administración</h4>
               <p className="text-sm text-stone-400 mb-6">
                 Acceso exclusivo para personal autorizado de Bellesas Karina.
               </p>
               <Link 
                 href="/admin/login" 
                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
               >
                 <ShieldCheck size={16} /> Entrar al Sistema
               </Link>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 text-center flex flex-col items-center gap-4">
            <p className="text-xs text-stone-500 max-w-3xl leading-relaxed">
              <strong>Descargo de responsabilidad de marcas comerciales:</strong> Las marcas, logotipos y nombres de productos mencionados en este sitio web 
              pertenecen a sus respectivos propietarios. Bellesas Karina es un distribuidor minorista independiente y no está directamente 
              asociado, patrocinado ni respaldado por los titulares de las marcas originales, a menos que se indique explícitamente lo contrario.
            </p>
            <p className="text-xs text-stone-600 font-medium">
              © {new Date().getFullYear()} Bellesas Karina. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

