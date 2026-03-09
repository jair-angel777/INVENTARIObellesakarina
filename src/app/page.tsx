"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, Star, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFF0F5] to-[#FFE4E1] font-sans text-stone-800 selection:bg-rose-200">
      {/* Header / Navbar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/60 border-b border-rose-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-rose-400 to-pink-500 text-white p-2 rounded-xl shadow-lg shadow-rose-200">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600 tracking-tight">
              Bellezas Karina
            </h1>
          </div>
          <nav>
            <Link 
              href="/login"
              className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white text-rose-600 text-sm font-semibold rounded-full border border-rose-200 hover:border-rose-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              Acceso al Sistema
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 text-rose-700 text-sm font-semibold mb-8 border border-rose-200/50 shadow-sm">
          <Star size={16} className="fill-rose-500 text-rose-500" />
          <span>Especialistas en belleza y cuidado personal</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter text-stone-900 drop-shadow-sm">
          Resalta tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Belleza Natural</span>
        </h2>
        
        <p className="max-w-2xl text-lg md:text-xl text-stone-600 mb-16 leading-relaxed font-light">
          Ofrecemos la mejor selección de cosméticos, cuidado facial y accesorios para realzar tu estilo único. Calidad y elegancia en cada detalle.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="group bg-white/60 backdrop-blur-lg border border-white/40 p-8 rounded-[2rem] shadow-xl shadow-rose-900/5 hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Maquillaje Premium</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              Descubre nuestra amplia gama de productos de las mejores marcas para un acabado perfecto y duradero.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/60 backdrop-blur-lg border border-white/40 p-8 rounded-[2rem] shadow-xl shadow-rose-900/5 hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-500 hover:-translate-y-2 transform md:-translate-y-6">
             <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Cuidado Facial</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              Tratamientos especializados y rutinas de skincare para mantener tu piel radiante, hidratada y joven.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/60 backdrop-blur-lg border border-white/40 p-8 rounded-[2rem] shadow-xl shadow-rose-900/5 hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-500 hover:-translate-y-2">
             <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Star size={28} />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Accesorios Exclusivos</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              Complementa tu look con accesorios de belleza diseñados para brindarte estilo y funcionalidad en tu día a día.
            </p>
          </div>
        </div>
      </main>

      {/* Decorative Blur Backgrounds Overlay */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-300/30 blur-[120px] rounded-full mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-300/30 blur-[120px] rounded-full mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>
    </div>
  );
}
