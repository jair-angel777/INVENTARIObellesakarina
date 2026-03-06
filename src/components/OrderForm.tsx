"use client";
// Version: IGV Professional System v2.0 - Perú

import React, { useState, useEffect, useMemo } from "react";
import {
    Truck,
    Plus,
    Trash2,
    FileText,
    Calendar,
    Package,
    ChevronDown,
    CheckCircle2,
    Users,
    AlertCircle,
    Info,
    Search,
    ChevronRight,
    ChevronLeft,
    X,
    Printer,
    ArrowRightCircle,
    ShoppingBag
} from "lucide-react";

interface Product {
    id: string;
    nombre: string;
    precio: number;
    costo: number | null;
    stock: number;
    proveedor_id: string | null;
}

interface Supplier {
    id: string;
    nombre: string;
    email?: string;
    telefono?: string;
    direccion?: string;
}

interface OrderItem {
    productId: string;
    nombre: string;
    cantidad: number;
    costo: number;
}

export function OrderForm() {
    const [step, setStep] = useState(1); // 1: Config, 2: Seleccion, 3: Revision
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [igvPercent, setIgvPercent] = useState(18); // Default Perú
    const [searchTerm, setSearchTerm] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                const [suppRes, prodRes] = await Promise.all([
                    fetch(`${apiUrl}/suppliers`),
                    fetch(`${apiUrl}/products`)
                ]);
                const suppData = await suppRes.json();
                const prodData = await prodRes.json();
                setSuppliers(Array.isArray(suppData) ? suppData : []);
                setAllProducts(Array.isArray(prodData) ? prodData : []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedSupplier = useMemo(() => suppliers.find(s => s.id === selectedSupplierId), [suppliers, selectedSupplierId]);

    const availableProducts = useMemo(() => {
        let filtered = allProducts.filter(p => p.proveedor_id === selectedSupplierId);
        if (searchTerm) {
            filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return filtered;
    }, [allProducts, selectedSupplierId, searchTerm]);

    const addItem = (productId: string) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        const existing = orderItems.find(item => item.productId === productId);
        if (existing) {
            setOrderItems(orderItems.map(item =>
                item.productId === productId ? { ...item, cantidad: item.cantidad + 1 } : item
            ));
        } else {
            setOrderItems([...orderItems, {
                productId,
                nombre: product.nombre,
                cantidad: 1,
                costo: product.costo || product.precio
            }]);
        }
    };

    const removeItem = (productId: string) => {
        setOrderItems(orderItems.filter(item => item.productId !== productId));
    };

    const updateQty = (productId: string, qty: number) => {
        if (qty < 1) return;
        setOrderItems(orderItems.map(item =>
            item.productId === productId ? { ...item, cantidad: qty } : item
        ));
    };

    const subtotal = orderItems.reduce((acc, item) => acc + (item.cantidad * item.costo), 0);
    const igvValue = subtotal * (igvPercent / 100);
    const total = subtotal + igvValue;

    const handleGenerateOrder = async () => {
        if (!selectedSupplierId || orderItems.length === 0) return;

        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const res = await fetch(`${apiUrl}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proveedor_id: selectedSupplierId,
                    subtotal,
                    igv: igvValue,
                    total,
                    notas: notes || `Pedido con ${igvPercent}% de IGV - v2.0`,
                    detalles: orderItems.map(item => ({
                        producto_id: item.productId,
                        nombre_producto: item.nombre,
                        cantidad: item.cantidad,
                        costo_unitario: item.costo,
                        subtotal: item.cantidad * item.costo
                    }))
                }),
            });

            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => { window.location.href = "/dashboard/suppliers/orders"; }, 2000);
            } else {
                alert("Error al guardar el pedido");
            }
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Error de conexión");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* FORCE UPDATE BANNER v2.0 */}
            <div className="bg-blue-600 text-white p-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-[0.4em] shadow-lg shadow-blue-500/10">
                Sistema Profesional v2.0 / Localización IGV Perú Activa
            </div>

            {/* Indicador de Pasos */}
            <div className="flex justify-between items-center px-4 md:px-12 mb-10">
                {[1, 2, 3].map((num) => (
                    <div key={num} className="flex flex-col items-center gap-2 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step >= num ? 'bg-blue-600 text-white scale-110 shadow-blue-500/20' : 'bg-stone-100 text-stone-400'}`}>
                            {step > num ? <CheckCircle2 size={24} /> : num}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step >= num ? 'text-blue-600' : 'text-stone-400'}`}>
                            {num === 1 ? "Origen" : num === 2 ? "Productos" : "Boleta IGV"}
                        </span>
                        {num < 3 && <div className={`hidden md:block absolute left-14 top-6 h-0.5 w-40 -z-10 rounded-full transition-colors duration-500 ${step > num ? 'bg-blue-600' : 'bg-stone-100'}`} />}
                    </div>
                ))}
            </div>

            <div className="transition-all duration-500 transform">
                {step === 1 && (
                    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-blue-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-white/80">
                        <SectionHeader icon={<Users size={24} />} title="Selección de Proveedor" subtitle="Define a quién se le realiza la solicitud" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Elegir Proveedor</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-stone-50 border border-stone-200 rounded-[2rem] py-4 px-6 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-stone-800 font-bold appearance-none cursor-pointer transition-all"
                                        value={selectedSupplierId}
                                        onChange={(e) => { setSelectedSupplierId(e.target.value); setOrderItems([]); }}
                                    >
                                        <option value="">-- Buscar Proveedor --</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={24} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest ml-1">Impuesto a las Ventas (IGV %)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        className="w-full bg-stone-50 border border-stone-200 rounded-[2rem] py-4 px-6 text-stone-800 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        value={igvPercent}
                                        onChange={(e) => setIgvPercent(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-blue-600">%</span>
                                </div>
                            </div>
                        </div>

                        {selectedSupplierId && (
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-3 bg-stone-900 hover:bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-xl shadow-stone-900/10 group"
                                >
                                    Abrir Catálogo
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 animate-in slide-in-from-right-4 duration-500">
                        {/* Selector de Items */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-[3rem] border border-stone-100 shadow-sm flex flex-col h-[650px]">
                            <SectionHeader icon={<ShoppingBag size={20} />} title="Catálogo" subtitle="Vincular productos" />

                            <div className="relative my-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre..."
                                    className="w-full bg-stone-100/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                                {availableProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 grayscale space-y-2 border-2 border-dashed border-stone-200 rounded-[2.5rem]">
                                        <Package size={40} />
                                        <p className="text-[10px] font-black uppercase">No hay productos disponibles</p>
                                    </div>
                                ) : (
                                    availableProducts.map(product => (
                                        <div key={product.id} className="group bg-stone-50 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 p-4 rounded-3xl border border-stone-100 transition-all flex items-center justify-between">
                                            <div>
                                                <h4 className="font-black text-stone-900 text-sm uppercase tracking-tight">{product.nombre}</h4>
                                                <p className="text-[10px] font-bold text-stone-400">Costo: ${product.costo || product.precio}</p>
                                            </div>
                                            <button
                                                onClick={() => addItem(product.id)}
                                                className="bg-white border border-stone-200 p-2 rounded-2xl text-stone-400 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Listado de Pedido */}
                        <div className="lg:col-span-6 bg-white p-8 md:p-10 rounded-[3.5rem] border border-stone-100 shadow-xl flex flex-col h-[650px] relative">
                            <SectionHeader icon={<FileText size={20} />} title="Lista de Pedido" subtitle={`${orderItems.length} items seleccionados`} />

                            <div className="flex-1 overflow-y-auto my-6 space-y-4 pr-2">
                                {orderItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-stone-300 space-y-4 opacity-50">
                                        <ShoppingBag size={64} />
                                        <p className="font-black uppercase text-[10px] tracking-[0.2em]">El pedido está vacío</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                                                <th className="pb-4">Producto</th>
                                                <th className="pb-4 text-center">Cant.</th>
                                                <th className="pb-4 text-right">Subtotal</th>
                                                <th className="pb-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {orderItems.map(item => (
                                                <OrderRow
                                                    key={item.productId}
                                                    item={item}
                                                    onUpdate={(qty) => updateQty(item.productId, qty)}
                                                    onRemove={() => removeItem(item.productId)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="pt-6 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Estimado</p>
                                    <p className="text-4xl font-black text-stone-900 italic tracking-tighter shadow-blue-500/10">
                                        ${total.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="bg-stone-100 hover:bg-stone-200 text-stone-600 p-5 rounded-2xl flex items-center justify-center transition-all group"
                                    >
                                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        disabled={orderItems.length === 0}
                                        onClick={() => setStep(3)}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:grayscale text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                                    >
                                        Revisar Boleta IGV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500">
                        {/* Area de Observaciones */}
                        <div className="lg:col-span-4 bg-white p-8 rounded-[3.5rem] border border-blue-50 shadow-sm space-y-6">
                            <SectionHeader icon={<Info size={20} />} title="Observaciones" subtitle="Añade notas extras" />
                            <textarea
                                className="w-full bg-stone-50 border border-stone-100 rounded-3xl p-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[300px] transition-all resize-none"
                                placeholder="Escribe aquí detalles como: 'Prioridad alta', 'Faltan productos por confirmar', 'Entregar por la tarde'..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-600 border border-blue-100">
                                <CheckCircle2 size={24} className="mt-1" />
                                <p className="text-[10px] font-bold uppercase leading-relaxed">Estas notas aparecerán en tu historial de pedidos para mayor control operativo.</p>
                            </div>
                        </div>

                        {/* Pre-Visualización de Boleta IGV */}
                        <div className="lg:col-span-8 space-y-8 flex flex-col">
                            <div className="bg-white rounded-[4rem] border border-stone-100 shadow-2xl p-12 relative overflow-hidden flex-1">
                                {/* Diseño Visual de Boleta */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                                <div className="flex justify-between items-start mb-12">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-stone-900 italic uppercase tracking-tighter">BellesasKarina</h3>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Boleta de Venta / IGV Aplicado</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">ID Borrador</p>
                                        <p className="text-xs font-black text-stone-900">#ORD-{Math.floor(Math.random() * 10000)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-12 pb-8 border-b border-stone-100">
                                    <div>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Proveedor Destino</p>
                                        <p className="text-xl font-black text-stone-900 uppercase italic">{selectedSupplier?.nombre}</p>
                                        <p className="text-xs font-bold text-stone-400 mt-1">{selectedSupplier?.email || "Sin email registrado"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Fecha Solicitud</p>
                                        <p className="text-xl font-black text-stone-900 italic">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-12">
                                    {orderItems.map(item => (
                                        <div key={item.productId} className="flex justify-between items-center text-xs">
                                            <div className="flex gap-4 items-center">
                                                <span className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center font-black text-blue-600">{item.cantidad}</span>
                                                <span className="font-black text-stone-800 uppercase">{item.nombre}</span>
                                            </div>
                                            <span className="font-black text-stone-900 tracking-tight">${(item.cantidad * item.costo).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-stone-50 p-8 rounded-[2.5rem] space-y-3">
                                    <div className="flex justify-between text-stone-400 font-bold text-xs uppercase tracking-widest">
                                        <span>Subtotal Neto</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-blue-600/70 font-bold text-xs uppercase italic tracking-widest">
                                        <span>Impuestos (IGV {igvPercent}%)</span>
                                        <span>${igvValue.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-stone-900 font-black uppercase text-sm tracking-widest">Total a Pagar</span>
                                        <span className="text-3xl font-black text-stone-900 tracking-tighter italic">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between gap-6">
                                <button
                                    onClick={() => setStep(2)}
                                    className="bg-white border border-stone-200 hover:border-stone-400 text-stone-600 px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all"
                                >
                                    Volver al Carrito
                                </button>
                                <button
                                    disabled={saving}
                                    onClick={handleGenerateOrder}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-green-600/20 flex items-center justify-center gap-3"
                                >
                                    {saving ? "Registrando..." : "Confirmar y Registrar Boleta"}
                                    {!saving && <CheckCircle2 size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showSuccess && <SuccessOverlay />}
        </div>
    );
}

// COMPONENTES AUXILIARES INTERNOS
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
    return (
        <div className="flex gap-4 items-center mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-black text-stone-900 italic uppercase tracking-tighter leading-none">{title}</h2>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">{subtitle}</p>
            </div>
        </div>
    );
}

function OrderRow({ item, onUpdate, onRemove }: { item: OrderItem, onUpdate: (qty: number) => void, onRemove: () => void }) {
    return (
        <tr className="group hover:bg-stone-50/50 transition-colors">
            <td className="py-4">
                <div className="flex flex-col">
                    <span className="font-black text-stone-800 text-xs uppercase tracking-tight">{item.nombre}</span>
                    <span className="text-[10px] text-stone-400 font-bold">Costo Unit: ${item.costo.toFixed(2)}</span>
                </div>
            </td>
            <td className="py-4 text-center">
                <div className="inline-flex items-center bg-stone-50 rounded-xl p-1 border border-stone-100">
                    <input
                        type="number"
                        className="w-10 bg-transparent text-center text-xs font-black text-stone-800 focus:outline-none"
                        value={item.cantidad}
                        onChange={(e) => onUpdate(parseInt(e.target.value) || 1)}
                    />
                </div>
            </td>
            <td className="py-4 text-right">
                <span className="font-black text-stone-900 text-xs">${(item.cantidad * item.costo).toFixed(2)}</span>
            </td>
            <td className="py-4 text-right">
                <button
                    onClick={onRemove}
                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all p-2"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <div className="h-16 w-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin shadow-inner" />
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest animate-pulse">Cargando Sistema de Boletas...</p>
        </div>
    );
}

function SuccessOverlay() {
    return (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 transition-all duration-700">
            <div className="bg-white p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center space-y-8 animate-in zoom-in-90 scale-100">
                <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/20">
                    <CheckCircle2 size={56} />
                </div>
                <div className="space-y-4 px-4">
                    <h2 className="text-4xl font-black text-stone-900 uppercase italic tracking-tighter">¡Boleta Registrada!</h2>
                    <p className="text-stone-400 font-bold uppercase text-xs tracking-widest">El inventario se actualizará al recibir el pedido</p>
                </div>
                <div className="pt-4 animate-bounce">
                    <Info size={24} className="mx-auto text-blue-500" />
                </div>
            </div>
        </div>
    );
}
