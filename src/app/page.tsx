"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, ArrowRight, ShieldCheck, Star, Zap, ChevronRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

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
      <header 
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Icon */}
            <div className="flex items-center gap-4 lg:hidden z-10">
              <button aria-label="Menu" className="text-stone-900 hover:text-rose-600 transition-colors">
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
              <Link href="#catalogo" className="text-xs font-bold tracking-widest text-stone-900 hover:text-rose-600 transition-colors uppercase relative group py-2">
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
              
              {/* Acceso Inventario */}
              <Link 
                href="/login" 
                aria-label="Acceso Inventario"
                className="text-stone-900 hover:text-rose-600 transition-colors flex items-center gap-2 group"
                title="Acceso al Sistema de Inventario"
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
        {/* HERO SECTION - El "Puente" */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900">
          {/* Fondo animado abstracto (Sustituto Premium de la Imagen) */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 opacity-80" />
            {/* Círculos decorativos con blur para dar efecto glassmorphism */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 text-center md:text-left space-y-8 animate-in slide-in-from-bottom duration-1000 fill-mode-both">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                <Star size={14} className="text-amber-400" />
                Belleza Auténtica, Marcas Globales
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white tracking-tighter leading-[1.1]">
                Realza tu <br />
                <span className="italic text-rose-400">esencia.</span>
              </h2>
              <p className="text-base md:text-xl text-stone-300 font-light max-w-xl mx-auto md:mx-0 leading-relaxed">
                El destino definitivo para descubrir lo mejor en cosmética multimarca. Calidad garantizada en cada producto que eliges.
              </p>
              
              {/* Botones Puente (Catálogo e Inventario) */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link 
                  href="#catalogo" 
                  className="w-full sm:w-auto px-10 py-4 bg-white text-stone-900 text-sm font-black uppercase tracking-widest hover:bg-rose-50 transition-all hover:-translate-y-1 shadow-2xl flex items-center justify-center gap-3 rounded-full"
                >
                  <ShoppingBag size={18} />
                  Ir al Catálogo
                </Link>
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border-2 border-white/30 text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all hover:-translate-y-1 rounded-full flex items-center justify-center gap-3 backdrop-blur-sm"
                >
                  <ShieldCheck size={18} />
                  Sistema de Inventario
                </Link>
              </div>
            </div>

            {/* Espacio para Imagen Dinámica o Composición */}
            <div className="flex-1 hidden md:flex justify-center relative animate-in slide-in-from-right duration-1000 delay-300 fill-mode-both">
               <div className="w-[80%] aspect-[3/4] bg-stone-800 rounded-t-[100px] rounded-b-[200px] border border-white/10 shadow-2xl overflow-hidden relative group">
                  {/* Placeholder elegante */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 font-bold uppercase tracking-widest text-xs border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">
                      [ Fotografía Editorial Propia ]
                    </span>
                  </div>
                  {/* Etiqueta Flotante */}
                  <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl flex items-center gap-4 group-hover:-translate-y-2 transition-transform duration-500">
                      <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <Zap className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold uppercase tracking-widest">Nuevos Ingresos</p>
                        <p className="text-stone-300 text-xs">Descubre la colección 2026</p>
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
            <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-100 aspect-[4/5] relative transition-transform hover:-translate-y-2 duration-500">
               <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
                 <span className="text-stone-400 font-medium tracking-widest uppercase text-[10px] border border-stone-300 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
                    [ Imagen: Skin Care ]
                 </span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-20" />
               <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                  <h4 className="text-2xl font-serif font-medium text-white mb-2">Cuidado de la Piel</h4>
                  <p className="text-sm text-stone-300 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Rutinas completas para un rostro radiante.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">Explorar <ArrowRight size={14}/></span>
               </div>
            </div>

            {/* Categ 2 */}
            <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-200 aspect-[4/5] relative transition-transform hover:-translate-y-2 duration-500">
               <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
                 <span className="text-stone-400 font-medium tracking-widest uppercase text-[10px] border border-stone-300 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
                    [ Imagen: Maquillaje ]
                 </span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-20" />
               <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                  <h4 className="text-2xl font-serif font-medium text-white mb-2">Maquillaje</h4>
                  <p className="text-sm text-stone-300 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Bases, labiales y todo para resaltar tu belleza.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">Explorar <ArrowRight size={14}/></span>
               </div>
            </div>

            {/* Categ 3 */}
            <div className="group cursor-pointer rounded-[2rem] overflow-hidden bg-stone-100 aspect-[4/5] relative transition-transform hover:-translate-y-2 duration-500">
               <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
                 <span className="text-stone-400 font-medium tracking-widest uppercase text-[10px] border border-stone-300 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
                    [ Imagen: Cabello ]
                 </span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent z-20" />
               <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                  <h4 className="text-2xl font-serif font-medium text-white mb-2">Cuidado Capilar</h4>
                  <p className="text-sm text-stone-300 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Tratamientos, shampoos y estilización.</p>
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
                 <li><Link href="#" className="hover:text-rose-400 transition-colors">Catálogo de Productos</Link></li>
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
                 href="/login" 
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

