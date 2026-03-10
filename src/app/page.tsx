"use client";

import React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      {/* Top Bar (Promo / Announcement) */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        ENVÍO GRATIS EN PEDIDOS SUPERIORES A $50. DESCUBRE NUESTRAS OFERTAS EXCLUSIVAS.
      </div>

      {/* Main Header / Navbar */}
      <header className="sticky top-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Menu / Mobile */}
            <div className="flex items-center gap-4 lg:hidden">
              <button aria-label="Menu" className="text-black hover:text-gray-600 transition-colors">
                <Menu strokeWidth={1.5} size={28} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start lg:w-1/4">
              <Link href="/" className="flex items-center flex-col">
                 <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight uppercase leading-none text-black">
                   Bellesas
                 </h1>
                 <span className="text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase text-gray-500 mt-1">Karina Paris</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex justify-center space-x-8 lg:w-2/4">
              <Link href="#" className="text-sm font-semibold tracking-wider text-black hover:text-red-700 transition-colors uppercase py-2 border-b-2 border-transparent hover:border-red-700">
                Maquillaje
              </Link>
              <Link href="#" className="text-sm font-semibold tracking-wider text-black hover:text-red-700 transition-colors uppercase py-2 border-b-2 border-transparent hover:border-red-700">
                Skin Care
              </Link>
              <Link href="#" className="text-sm font-semibold tracking-wider text-black hover:text-red-700 transition-colors uppercase py-2 border-b-2 border-transparent hover:border-red-700">
                Cabello
              </Link>
              <Link href="#" className="text-sm font-semibold tracking-wider text-gray-600 hover:text-red-700 transition-colors uppercase py-2">
                Descubre
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center justify-end space-x-6 lg:w-1/4">
              <button aria-label="Search" className="text-black hover:text-gray-600 transition-colors hidden sm:block">
                <Search strokeWidth={1.5} size={24} />
              </button>
              
              {/* Login / Admin Link */}
              <Link 
                href="/login" 
                aria-label="Account / Admin Login"
                className="text-black hover:text-red-700 transition-colors flex items-center gap-1 group"
                title="Acceso al Sistema (Administración)"
              >
                <User strokeWidth={1.5} size={24} className="group-hover:scale-110 transition-transform" />
                <span className="hidden xl:block text-xs font-medium uppercase tracking-wider group-hover:underline">Cuenta</span>
              </Link>
              
              <button aria-label="Cart" className="text-black hover:text-gray-600 transition-colors relative">
                <ShoppingBag strokeWidth={1.5} size={24} />
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        {/*
          HERO BANNER SECTION
          Referencia: Estilo clásico de marca de belleza. Imagen grande de fondo, texto impactante superpuesto y botón de acción (CTA).
        */}
        <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-100 flex items-center justify-center overflow-hidden">
          {/* Placeholder para la imagen de "Hero" (ej: modelo usando producto) */}
          <div className="absolute inset-0 bg-neutral-200 flex items-center w-full h-full">
               <div className="w-full h-full bg-gradient-to-r from-neutral-300 to-neutral-200 flex items-center justify-center">
                   <span className="text-neutral-400 font-medium tracking-widest uppercase text-sm md:text-base border border-neutral-300 px-6 py-2">
                      [ Imagen Hero / Banner Principal ]
                   </span>
               </div>
          </div>
          
          {/* Contenido superpuesto en el Hero Banner */}
          <div className="relative z-10 text-center px-4 max-w-2xl bg-white/80 md:bg-transparent p-6 md:p-0 backdrop-blur-sm md:backdrop-blur-none rounded-xl md:rounded-none">
            <h2 className="text-4xl md:text-6xl font-serif font-medium text-black mb-4 tracking-tight leading-tight">
              Tú lo Vales.
            </h2>
            <p className="text-sm md:text-lg text-gray-800 mb-8 font-light max-w-xl mx-auto">
              Descubre nuestra nueva colección de sueros revitalizantes y maquillaje de larga duración diseñados para resaltar tu luz propia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="#" 
                className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
              >
                Comprar Ahora
              </Link>
              <Link 
                href="#" 
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-black border border-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Descubrir Más
              </Link>
            </div>
          </div>
        </section>

        {/* 
          CATEGORY GRID SECTION (Novedades o "Shop by Category")
          Referencia: Bloques grandes y limpios para presentar categorías de producto de manera visual y directa.
        */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-serif font-medium tracking-tight mb-2">Comprar por Categoría</h3>
            <div className="w-16 h-0.5 bg-red-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categ 1 */}
            <div className="group cursor-pointer relative overflow-hidden bg-neutral-100 aspect-[4/5] flex flex-col items-center justify-center text-center p-6 transition-all hover:bg-neutral-200">
               <span className="text-neutral-400 font-medium tracking-widest uppercase text-xs border border-neutral-300 px-4 py-1 mb-6">
                  [ Imagen Categoría 1 ]
               </span>
               <h4 className="text-xl font-serif font-medium mb-2 group-hover:underline decoration-red-700 underline-offset-4">Labios Impactantes</h4>
               <p className="text-sm text-gray-600 mb-4">Color intenso e hidratación profunda</p>
               <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5">Ver Productos</span>
            </div>

            {/* Categ 2 */}
            <div className="group cursor-pointer relative overflow-hidden bg-neutral-100 aspect-[4/5] flex flex-col items-center justify-center text-center p-6 transition-all hover:bg-neutral-200">
               <span className="text-neutral-400 font-medium tracking-widest uppercase text-xs border border-neutral-300 px-4 py-1 mb-6">
                  [ Imagen Categoría 2 ]
               </span>
               <h4 className="text-xl font-serif font-medium mb-2 group-hover:underline decoration-red-700 underline-offset-4">Piel Perfecta</h4>
               <p className="text-sm text-gray-600 mb-4">Bases de cobertura impecable y ligera</p>
               <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5">Ver Productos</span>
            </div>

            {/* Categ 3 */}
            <div className="group cursor-pointer relative overflow-hidden bg-neutral-100 aspect-[4/5] flex flex-col items-center justify-center text-center p-6 transition-all hover:bg-neutral-200">
               <span className="text-neutral-400 font-medium tracking-widest uppercase text-xs border border-neutral-300 px-4 py-1 mb-6">
                  [ Imagen Categoría 3 ]
               </span>
               <h4 className="text-xl font-serif font-medium mb-2 group-hover:underline decoration-red-700 underline-offset-4">Mirada Definida</h4>
               <p className="text-sm text-gray-600 mb-4">Máscaras y delineadores a prueba de todo</p>
               <span className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5">Ver Productos</span>
            </div>
          </div>
        </section>

        {/* 
          FEATURED PRODUCT / SPLIT BANNER SECTION
          Referencia: Dividir la pantalla 50/50 (Imagen vs Texto) para destacar características específicas de una línea o campaña.
        */}
        <section className="w-full flex flex-col lg:flex-row bg-black text-white overflow-hidden my-8">
           {/* Lado Imagen */}
           <div className="lg:w-1/2 w-full h-[50vh] lg:h-auto bg-neutral-800 flex items-center justify-center">
               <span className="text-neutral-500 font-medium tracking-widest uppercase text-sm border border-neutral-600 px-6 py-2">
                  [ Imagen Producto Destacado ]
               </span>
           </div>
           
           {/* Lado Texto */}
           <div className="lg:w-1/2 w-full p-12 md:p-24 flex flex-col justify-center items-start">
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Innovación Científica</span>
             <h3 className="text-3xl md:text-5xl font-serif font-medium mb-6 leading-tight">
               El Poder del Ácido Hialurónico Puro
             </h3>
             <p className="text-gray-300 mb-8 font-light text-lg">
               Restaura el volumen de tu piel, reduce líneas de expresión y mantén una hidratación profunda por 24 horas. Pruébalo y siente la diferencia al instante.
             </p>
             <Link 
                href="#" 
                className="px-8 py-3.5 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Conoce el Suero
                <ArrowRight size={18} />
              </Link>
           </div>
        </section>

        {/* 
          VIRTUAL TRY ON / TECHNOLOGY TEASER
          Referencia: A L'Oreal le gusta destacar herramientas de AR o diagnóstico en línea.
        */}
        <section className="py-20 px-4 text-center bg-gray-50 border-t border-gray-200">
           <div className="max-w-3xl mx-auto">
             <h3 className="text-3xl font-serif font-medium mb-4">Prueba de Maquillaje Virtual</h3>
             <p className="text-gray-600 mb-8 max-w-xl mx-auto">
               Encuentra tu tono ideal desde la comodidad de tu casa usando nuestra herramienta de realidad aumentada. Usa la cámara de tu teléfono y pruébate cientos de productos en tiempo real.
             </p>
             <button className="px-8 py-3.5 border-2 border-black text-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
               Probar Ahora
             </button>
           </div>
        </section>

      </main>

      {/* 
        FOOTER
        Referencia: Footer limpio, organizado en columnas con enlaces de ayuda y redes sociales, base negra/oscura.
      */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="md:col-span-1">
               <h4 className="font-bold uppercase text-sm tracking-wider mb-4 border-b border-gray-200 pb-2">Atención al Cliente</h4>
               <ul className="space-y-3 text-sm text-gray-600">
                 <li><Link href="#" className="hover:text-black hover:underline">Contáctanos</Link></li>
                 <li><Link href="#" className="hover:text-black hover:underline">Envíos y Devoluciones</Link></li>
                 <li><Link href="#" className="hover:text-black hover:underline">Preguntas Frecuentes</Link></li>
                 <li><Link href="#" className="hover:text-black hover:underline">Garantía de Producto</Link></li>
               </ul>
            </div>

            <div className="md:col-span-1">
               <h4 className="font-bold uppercase text-sm tracking-wider mb-4 border-b border-gray-200 pb-2">Acerca de Bellesas Karina</h4>
               <ul className="space-y-3 text-sm text-gray-600">
                 <li><Link href="#" className="hover:text-black hover:underline">Nuestra Historia</Link></li>
                 <li><Link href="#" className="hover:text-black hover:underline">Compromiso Sustentable</Link></li>
                 <li><Link href="#" className="hover:text-black hover:underline">Trabaja con Nosotros</Link></li>
                 <li className="pt-2">
                    {/* Botón directo al Login administrativo (Discreto) */}
                    <Link href="/login" className="text-red-700 font-bold hover:underline flex items-center gap-1">
                      <User size={14} /> Acceso Administrativo
                    </Link>
                 </li>
               </ul>
            </div>

            <div className="md:col-span-2">
               <h4 className="font-bold uppercase text-sm tracking-wider mb-4">Boletín Exclusivo</h4>
               <p className="text-sm text-gray-600 mb-4">
                 Suscríbete para recibir noticias de lanzamientos, ofertas exclusivas y consejos de belleza personalizados.
               </p>
               <form className="flex">
                 <input 
                   type="email" 
                   placeholder="Tu correo electrónico" 
                   className="flex-grow px-4 py-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                 />
                 <button 
                   type="submit" 
                   className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                 >
                   Suscribir
                 </button>
               </form>
               <p className="text-[10px] text-gray-400 mt-3">
                 Al darte de alta, aceptas nuestra Política de Privacidad y Términos de Uso.
               </p>
            </div>

          </div>

          <div className="text-center pt-8 border-t border-gray-200">
            <Link href="/" className="inline-block mb-4">
               <h2 className="text-xl font-serif font-bold tracking-tight uppercase leading-none text-gray-400">
                 Bellesas
               </h2>
               <span className="text-[8px] tracking-[0.2em] font-medium uppercase text-gray-400 mt-1 block">Karina</span>
            </Link>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Bellesas Karina. Todos los derechos reservados.
              <span className="block mt-1">Este es un sitio de demostración sin fines comerciales.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
