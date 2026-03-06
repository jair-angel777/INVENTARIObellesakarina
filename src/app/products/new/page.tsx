"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-stone-900 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white rounded-xl text-stone-400 hover:text-orange-600 transition-colors border border-orange-200 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">Nuevo Producto</h1>
                        <p className="text-stone-500 text-sm font-medium">Añade un nuevo artículo al catálogo de BellesasKarina</p>
                    </div>
                </header>

                {/* Usamos el componente reutilizable aquí */}
                <ProductForm />
            </div>
        </div>
    );
}
