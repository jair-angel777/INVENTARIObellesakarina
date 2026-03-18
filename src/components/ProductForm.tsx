"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Package,
    Tag,
    DollarSign,
    Layout,
    Hash,
    Image as ImageIcon,
    Truck,
    UploadCloud
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import Script from "next/script";

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || "",
        categoria: initialData?.categoria || "",
        precio: initialData?.precio?.toString() || "",
        costo: initialData?.costo?.toString() || "",
        stock: initialData?.stock?.toString() || "0",
        stock_minimo: initialData?.stock_minimo?.toString() || "5",
        sku: initialData?.sku || "",
        imagen: initialData?.imagen || "",
        proveedor_id: initialData?.proveedor_id || ""
    });

    const [proveedores, setProveedores] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
                const res = await fetchWithAuth(`${apiUrl}/suppliers`);
                if (res.ok) {
                    const data = await res.json();
                    setProveedores(data);
                }
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };
        fetchProveedores();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
        const url = isEdit ? `${apiUrl}/products/${initialData.id}` : `${apiUrl}/products`;
        const method = isEdit ? "PATCH" : "POST";

        try {
            const res = await fetchWithAuth(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    precio: parseFloat(formData.precio),
                    costo: formData.costo ? parseFloat(formData.costo) : null,
                    stock: parseInt(formData.stock, 10),
                    stock_minimo: parseInt(formData.stock_minimo, 10),
                    proveedor_id: formData.proveedor_id || null,
                }),
            });

            if (res.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                alert("Error al guardar el producto");
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadClick = () => {
        // @ts-ignore
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dimv8kos8",
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "preajuste de bellas",
                sources: ["local", "url", "camera"],
                multiple: false,
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                maxFileSize: 2000000, // 2MB
                language: "es",
                text: {
                    es: {
                        menu: {
                            files: "Mis Archivos",
                            web: "URL Web",
                            camera: "Cámara"
                        },
                        local: {
                            browse: "Buscar",
                            dd_title_single: "Arrastra tu imagen aquí"
                        }
                    }
                }
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    console.log("Imagen subida con éxito:", result.info.secure_url);
                    setFormData({ ...formData, imagen: result.info.secure_url });
                }
            }
        );
        widget.open();
    };

    return (
        <>
            <Script 
                src="https://upload-widget.cloudinary.com/global/all.js" 
                strategy="afterInteractive" 
            />
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-orange-200 shadow-sm backdrop-blur-md space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-600">
                        <Layout size={18} />
                        Información Básica
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Nombre del Producto</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej. Labial Matte Red"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all text-stone-800"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Categoría</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Ej. Maquillaje"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all text-stone-800"
                                    value={formData.categoria}
                                    onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Proveedor (Opcional)</label>
                            <div className="relative flex items-center">
                                <Truck className="absolute left-3 text-stone-400" size={18} />
                                <select
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all text-stone-800 appearance-none"
                                    value={formData.proveedor_id}
                                    onChange={e => setFormData({ ...formData, proveedor_id: e.target.value })}
                                >
                                    <option value="">Sin proveedor asignado</option>
                                    {proveedores.map(prov => (
                                        <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                                    ))}
                                </select>
                                {/* Custom arrow for select */}
                                <div className="absolute right-4 pointer-events-none text-stone-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-orange-100" />

                {/* Pricing Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-emerald-600">
                        <DollarSign size={18} />
                        Precios y Costos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Precio de Venta</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all text-stone-800"
                                    value={formData.precio}
                                    onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Costo (Opcional)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all text-stone-800"
                                    value={formData.costo}
                                    onChange={e => setFormData({ ...formData, costo: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-orange-100" />

                {/* Inventory Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-amber-600">
                        <Hash size={18} />
                        Inventario
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Stock Inicial</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/30 transition-all text-stone-800"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">Stock Mínimo</label>
                            <input
                                type="number"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all text-stone-800"
                                value={formData.stock_minimo}
                                onChange={e => setFormData({ ...formData, stock_minimo: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">SKU / Código</label>
                            <input
                                type="text"
                                placeholder="BP-001"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all text-stone-800 uppercase"
                                value={formData.sku}
                                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-orange-100" />

                {/* Image URL Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
                        <ImageIcon size={18} />
                        Imagen (URL)
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-bold text-stone-600 ml-1">URL de la Imagen</label>
                            <input
                                type="url"
                                placeholder="https://ejemplo.com/producto.jpg"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-stone-800"
                                value={formData.imagen}
                                onChange={e => setFormData({ ...formData, imagen: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-2.5 rounded-xl font-bold border border-blue-200 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <UploadCloud size={18} />
                                Subir Imagen
                            </button>
                        </div>
                    </div>
                    {formData.imagen && (
                        <div className="mt-4 relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-sm">
                            <img 
                                src={formData.imagen} 
                                alt="Vista previa" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pb-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-2xl font-bold text-stone-400 hover:text-stone-600 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    disabled={loading}
                    type="submit"
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-orange-900/20 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save size={20} />
                    )}
                    {loading ? "Guardando..." : isEdit ? "Actualizar Producto" : "Guardar Producto"}
                </button>
            </div>
        </form>
    </>
    );
}
