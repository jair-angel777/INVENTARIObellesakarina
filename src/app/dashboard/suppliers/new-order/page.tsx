"use client";

import { OrderForm } from "@/components/OrderForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewOrderPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al Panel
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-stone-900 italic uppercase tracking-tighter">Nueva Solicitud</h1>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Generador de Boletas v2.0</p>
                    </div>
                </div>

                <OrderForm />
            </div>
        </div>
    );
}
