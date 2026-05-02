"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Package,
    Tag,
    DollarSign,
    Layout,
    Hash,
    Image as ImageIcon,
    Truck,
    UploadCloud,
    X,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
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
        marca: initialData?.marca || "",
        unidades_por_caja: initialData?.unidades_por_caja?.toString() || "1",
        precio: initialData?.precio?.toString() || "",
        costo: initialData?.costo?.toString() || "",
        stock: initialData?.stock?.toString() || "0",
        stock_minimo: initialData?.stock_minimo?.toString() || "5",
        sku: initialData?.sku || "",
        imagen: initialData?.imagen || "",
        proveedor_id: initialData?.proveedor_id || ""
    });

    const [proveedores, setProveedores] = useState<any[]>([]);
    const [categoriasList, setCategoriasList] = useState<any[]>([]);
    const [marcasList, setMarcasList] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
                
                const resProv = await fetchWithAuth(`${apiUrl}/suppliers`);
                if (resProv.ok) setProveedores(await resProv.json());

                const resCat = await fetchWithAuth(`${apiUrl}/categories`);
                if (resCat.ok) setCategoriasList(await resCat.json());

                try {
                    const resMarcas = await fetchWithAuth(`${apiUrl}/brands`);
                    if (resMarcas.ok) setMarcasList(await resMarcas.json());
                } catch (e) {
                    console.log("Brands API not ready yet");
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };
        fetchInitialData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
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
                    marca: formData.marca || null,
                    unidades_por_caja: parseInt(formData.unidades_por_caja, 10) || 1,
                    stock: parseInt(formData.stock, 10),
                    stock_minimo: parseInt(formData.stock_minimo, 10),
                    proveedor_id: formData.proveedor_id || null,
                }),
            });

            if (res.ok) {
                router.push("/dashboard/inventory");
                router.refresh();
            }
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadClick = () => {
        // @ts-ignore
        if (window.cloudinary) {
            // @ts-ignore
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloudName: "dimv8kos8",
                    uploadPreset: "preajuste de bellas",
                    sources: ["local", "url", "camera"],
                    language: "es",
                },
                (error: any, result: any) => {
                    if (!error && result && result.event === "success") {
                        setFormData({ ...formData, imagen: result.info.secure_url });
                    }
                }
            );
            widget.open();
        }
    };

    return (
        <>
            <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
                
                {/* Left: Product Media & Information */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-white p-10 rounded-[3rem] border border-[#121212]/5 shadow-sm space-y-10">
                      
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#121212] border border-[#121212]/5">
                            <Package size={24} />
                         </div>
                         <h2 className="text-2xl font-serif font-bold italic">Atributos del Producto</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Nombre Comercial</label>
                            <input 
                               required
                               className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none"
                               placeholder="Ej: Labial Matte Gold"
                               value={formData.nombre}
                               onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Categoría</label>
                            <select 
                               required
                               className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none appearance-none"
                               value={formData.categoria}
                               onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                            >
                               <option value="">Seleccionar clase...</option>
                               {categoriasList.map(cat => <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>)}
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Marca</label>
                            <select 
                               className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none appearance-none"
                               value={formData.marca}
                               onChange={e => setFormData({ ...formData, marca: e.target.value })}
                            >
                               <option value="">Seleccionar marca...</option>
                               {marcasList.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
                            </select>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Representación Visual (Unidad)</label>
                         <div className="flex items-center gap-6 p-6 bg-[#FDFBF7] rounded-[2rem] border border-dashed border-[#121212]/10 group hover:border-[#D4AF37]/50 transition-all">
                            <div className="w-32 h-32 bg-white rounded-2xl border border-[#121212]/5 overflow-hidden shadow-inner flex-shrink-0">
                               {formData.imagen ? <img src={formData.imagen} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#121212]/10"><ImageIcon size={40} strokeWidth={1} /></div>}
                            </div>
                            <div className="space-y-4">
                               <p className="text-xs font-medium text-[#121212]/40 italic">"Sube una imagen de alta calidad para el catálogo premium."</p>
                               <button 
                                 type="button" 
                                 onClick={handleUploadClick}
                                 className="flex items-center gap-2 px-6 py-3 bg-[#121212] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#121212] transition-all shadow-lg"
                               >
                                  <UploadCloud size={16} /> Vincular Imagen
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#121212]/30 ml-1">Vínculo con Proveedor</label>
                         <select 
                           className="w-full bg-[#FDFBF7] border border-[#121212]/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none appearance-none"
                           value={formData.proveedor_id}
                           onChange={e => setFormData({ ...formData, proveedor_id: e.target.value })}
                         >
                            <option value="">Sin proveedor directo</option>
                            {proveedores.map(prov => <option key={prov.id} value={prov.id}>{prov.nombre}</option>)}
                         </select>
                      </div>
                   </div>
                </div>

                {/* Right: Logistics & Pricing */}
                <div className="space-y-8">
                   <div className="bg-[#121212] text-white p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative z-10 flex items-center gap-3">
                         <DollarSign size={20} className="text-[#D4AF37]" />
                         <h3 className="text-xl font-serif font-bold italic">Finanzas & Stock</h3>
                      </div>

                      <div className="relative z-10 space-y-8">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Precio de Venta</label>
                               <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif font-bold">S/</span>
                                  <input 
                                    required
                                    type="number" step="0.01" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-lg font-serif font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none"
                                    value={formData.precio}
                                    onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                  />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Costo Unitario</label>
                               <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-serif font-bold">S/</span>
                                  <input 
                                    type="number" step="0.01" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-lg font-serif font-bold focus:ring-2 focus:ring-white/20 transition-all outline-none"
                                    value={formData.costo}
                                    onChange={e => setFormData({ ...formData, costo: e.target.value })}
                                  />
                               </div>
                            </div>
                         </div>

                         <div className="h-px bg-white/10" />

                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Código de Barras / SKU</label>
                               <div className="relative">
                                  <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                  <input 
                                    type="text" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none"
                                    value={formData.sku}
                                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                  />
                               </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Stock Inicial</label>
                                  <input 
                                    required
                                    type="number" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Mínimo</label>
                                  <input 
                                    type="number" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-white/20 transition-all outline-none text-rose-400"
                                    value={formData.stock_minimo}
                                    onChange={e => setFormData({ ...formData, stock_minimo: e.target.value })}
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]/80 ml-1">Unid. por Caja</label>
                                  <input 
                                    required
                                    type="number" 
                                    min="1"
                                    className="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/50 transition-all outline-none text-[#D4AF37]"
                                    value={formData.unidades_por_caja}
                                    onChange={e => setFormData({ ...formData, unidades_por_caja: e.target.value })}
                                  />
                               </div>
                            </div>
                         </div>

                         <button 
                           disabled={loading}
                           type="submit" 
                           className="w-full py-6 bg-[#D4AF37] text-[#121212] rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3"
                         >
                            {loading ? <div className="w-5 h-5 border-2 border-[#121212]/20 border-t-[#121212] rounded-full animate-spin" /> : <Save size={18} />}
                            {isEdit ? "Sincronizar Cambios" : "Verificar & Registrar"}
                         </button>
                      </div>
                   </div>

                   <div className="p-8 bg-white border border-[#121212]/5 rounded-[2.5rem] space-y-4 shadow-sm">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-emerald-600 border border-[#121212]/5">
                            <CheckCircle2 size={24} />
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#121212]/40">Auditoría Activa</p>
                            <p className="text-xs font-bold text-[#121212]">Integridad de Datos</p>
                         </div>
                      </div>
                      <p className="text-[10px] text-[#121212]/40 leading-relaxed font-medium italic">
                        "Cada registro en Bellesas Karina v4 se audita con marca de tiempo y autoría del gerente en sesión."
                      </p>
                   </div>
                </div>

            </form>
        </>
    );
}
