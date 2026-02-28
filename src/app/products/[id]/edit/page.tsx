"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-600" size={48} />
            </div>
        );
    }

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
                        <h1 className="text-2xl font-bold text-stone-900">Editar Producto</h1>
                        <p className="text-stone-500 text-sm font-medium">
                            {product ? `Modifica los detalles de ${product.nombre}` : "Buscando detalles..."}
                        </p>
                    </div>
                </header>

                {!product ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <h2 className="text-xl font-bold text-stone-500">Producto no encontrado</h2>
                        <button onClick={() => router.push("/dashboard")} className="text-orange-600 hover:underline">
                            Volver al Dashboard
                        </button>
                    </div>
                ) : (
                    <ProductForm initialData={product} isEdit={true} />
                )}
            </div>
        </div>
    );
}
