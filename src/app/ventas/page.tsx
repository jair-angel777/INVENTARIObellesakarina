"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    ShoppingBag, 
    Trash2, 
    Plus, 
    Minus, 
    Search, 
    ArrowLeft, 
    CreditCard, 
    Banknote, 
    QrCode,
    CheckCircle2,
    Package,
    AlertCircle
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import BarcodeScanner from "@/components/BarcodeScanner";

interface SaleItem {
    producto_id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;
    imagen?: string;
    sku?: string;
}

export default function VentasPage() {
    const router = useRouter();
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [clienteNombre, setClienteNombre] = useState("");

    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    const handleBarcodeScanned = async (barcode: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
            // Buscamos el producto por SKU
            const res = await fetchWithAuth(`${apiUrl}/products`);
            if (res.ok) {
                const products = await res.json();
                const product = products.find((p: any) => p.sku === barcode);
                
                if (product) {
                    addToCart(product);
                } else {
                    showTemporaryError(`Producto con SKU "${barcode}" no encontrado`);
                }
            }
        } catch (err) {
            console.error("Error al buscar producto escaneado:", err);
        }
    };

    const addToCart = (product: any) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.producto_id === product.id);
            if (existing) {
                return prevCart.map(item => 
                    item.producto_id === product.id 
                    ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio }
                    : item
                );
            }
            return [...prevCart, {
                producto_id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: 1,
                subtotal: product.precio,
                imagen: product.imagen,
                sku: product.sku
            }];
        });
        setError("");
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.producto_id === id) {
                const newQty = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: newQty, subtotal: newQty * item.precio };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setCart(prevCart => prevCart.filter(item => item.producto_id !== id));
    };

    const showTemporaryError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(""), 3000);
    };

    const handleFinalizeSale = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        setError("");

        const saleData = {
            cliente_nombre: clienteNombre || "Cliente General",
            total: total,
            metodo_pago: metodoPago,
            detalles: cart.map(item => ({
                producto_id: item.producto_id,
                nombre_producto: item.nombre,
                cantidad: item.cantidad,
                precio_unitario: item.precio,
                subtotal: item.subtotal
            }))
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://backen-inventario.vercel.app/api";
            const res = await fetchWithAuth(`${apiUrl}/sales`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData)
            });

            if (res.ok) {
                setSuccess(true);
                setCart([]);
                setClienteNombre("");
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || "Error al procesar la venta");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-12">
            <BarcodeScanner onScan={handleBarcodeScanned} />
            
            {/* Header POS */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push("/dashboard")}
                            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-serif font-bold text-stone-900">Punto de Venta</h1>
                        <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Caja 01</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Estado</span>
                            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                Sistema Listo
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Lado Izquierdo: Boleta / Lista de Productos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2">
                                <ShoppingBag className="text-rose-600" size={20} />
                                Artículos en Boleta
                            </h2>
                            <span className="text-stone-400 text-xs font-medium">{cart.length} productos añadidos</span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[600px]">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-300">
                                        <QrCode size={40} />
                                    </div>
                                    <h3 className="text-stone-400 font-medium">Escané un producto para comenzar</h3>
                                    <p className="text-stone-300 text-xs max-w-xs">Usa la pistola láser para registrar los artículos de forma automática.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-50 border-b border-stone-100">
                                        <tr>
                                            <th className="px-6 py-4">Producto</th>
                                            <th className="px-6 py-4 text-center">Cantidad</th>
                                            <th className="px-6 py-4 text-right">Precio</th>
                                            <th className="px-6 py-4 text-right">Subtotal</th>
                                            <th className="px-6 py-4 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {cart.map((item) => (
                                            <tr key={item.producto_id} className="group hover:bg-stone-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                                                            {item.imagen ? (
                                                                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                                    <Package size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-stone-900">{item.nombre}</p>
                                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{item.sku}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button 
                                                            onClick={() => updateQuantity(item.producto_id, -1)}
                                                            className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-bold text-stone-800 w-8 text-center">{item.cantidad}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.producto_id, 1)}
                                                            className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-stone-600">S/ {item.precio.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-bold text-rose-600">S/ {item.subtotal.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => removeItem(item.producto_id)}
                                                        className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                            <AlertCircle size={20} />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex flex-col items-center gap-3 text-emerald-600 animate-bounce text-center">
                            <CheckCircle2 size={48} strokeWidth={2.5} />
                            <div>
                                <h3 className="font-black uppercase tracking-[0.2em] text-sm">Venta Exitosa</h3>
                                <p className="text-xs font-medium opacity-80 mt-1">Stock actualizado correctamente.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lado Derecho: Resumen y Pago */}
                <div className="space-y-6">
                    <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 rounded-full blur-3xl" />
                        
                        <h2 className="text-stone-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">Resumen de Venta</h2>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Nombre del Cliente</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej. Consumidor Final"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-white placeholder:text-white/20 transition-all"
                                    value={clienteNombre}
                                    onChange={e => setClienteNombre(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Método de Pago</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button 
                                        onClick={() => setMetodoPago("EFECTIVO")}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${metodoPago === "EFECTIVO" ? "bg-white text-stone-900 border-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
                                    >
                                        <Banknote size={20} />
                                        <span className="text-[8px] font-black mt-2 uppercase">Efectivo</span>
                                    </button>
                                    <button 
                                        onClick={() => setMetodoPago("YAPE_PLIN")}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${metodoPago === "YAPE_PLIN" ? "bg-rose-600 text-white border-rose-600" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
                                    >
                                        <QrCode size={20} />
                                        <span className="text-[8px] font-black mt-2 uppercase">Yape/Plin</span>
                                    </button>
                                    <button 
                                        onClick={() => setMetodoPago("TARJETA")}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${metodoPago === "TARJETA" ? "bg-blue-600 text-white border-blue-600" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}
                                    >
                                        <CreditCard size={20} />
                                        <span className="text-[8px] font-black mt-2 uppercase">Tarjeta</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Total a Pagar</span>
                                    <span className="text-5xl font-serif font-medium">S/ {total.toFixed(2)}</span>
                                </div>
                                <button 
                                    disabled={loading || cart.length === 0}
                                    onClick={handleFinalizeSale}
                                    className="w-full bg-rose-600 hover:bg-rose-500 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 shadow-xl shadow-rose-900/40"
                                >
                                    {loading ? "Procesando..." : "Confirmar Venta"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500 p-2 rounded-lg text-white">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h4 className="text-emerald-900 font-black uppercase tracking-widest text-[10px]">Integración SUNAT</h4>
                                <p className="text-emerald-700 text-[9px] leading-tight mt-1">Este módulo actualiza el inventario local. La facturación oficial sigue en la caja principal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
