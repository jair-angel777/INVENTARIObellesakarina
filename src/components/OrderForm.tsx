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
            alert("Error de conexi\u00f3n");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* FORCE UPDATE BANNER v2.0 */}
            <div className="bg-blue-600 text-white p-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-[0.4em] shadow-lg shadow-blue-500/10">
                Sistema Profesional v2.0 / Localizaci\u00f3n IGV Per\u00fa Activa
            </div>

            {/* Indicador de Pasos */}
            <div className="flex justify-between items-center px-4 md:px-12 mb-10">
                {[1, 2, 3].map((num) => (
                    <div key={num} className="flex flex-col items-center gap-2 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step \u003e= num ? 'bg-blue-600 text-white scale-110 shadow-blue-500/20' : 'bg-stone-100 text-stone-400'}`}>
                            {step \u003e num ? \u003cCheckCircle2 size={24} /\u003e : num}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step \u003e= num ? 'text-blue-600' : 'text-stone-400'}`}>
                {num === 1 ? "Origen" : num === 2 ? "Productos" : "Boleta IGV"}
            </span>
            {num \u003c 3 \u0026\u0026 \u003cdiv className={`hidden md:block absolute left-14 top-6 h-0.5 w-40 -z-10 rounded-full transition-colors duration-500 ${step \u003e num ? 'bg-blue-600' : 'bg-stone-100'}`} /\u003e}
        </div>
    ))
}
            </div >

    {/* CONTENIDO DE LOS PASOS */ }
    < div className = "transition-all duration-500 transform" >
        { step === 1 \u0026\u0026(
            \u003cdiv className = "bg-white p-8 md:p-12 rounded-[3.5rem] border border-blue-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm bg-white/80"\u003e
            \u003cSectionHeader icon = { \u003cUsers size={ 24} /\u003e } title = "Selecci\u00f3n de Proveedor" subtitle = "Define a qui\u00e9n se le realiza la solicitud" /\u003e"

            \u003cdiv className = "grid grid-cols-1 md:grid-cols-2 gap-8"\u003e
            \u003cdiv className = "space-y-3"\u003e
            \u003clabel className = "text-xs font-black text-stone-400 uppercase tracking-widest ml-1"\u003eElegir Proveedor\u003c / label\u003e
            \u003cdiv className = "relative"\u003e
            \u003cselect 
                                        className = "w-full bg-stone-50 border border-stone-200 rounded-[2rem] py-4 px-6 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-stone-800 font-bold appearance-none cursor-pointer transition-all"
                                        value = { selectedSupplierId }
                                        onChange = {(e) => { setSelectedSupplierId(e.target.value); setOrderItems([]); }}
\u003e
\u003coption value = ""\u003e-- Buscar Proveedor--\u003c / option\u003e
{ suppliers.map(s =\u003e \u003coption key = { s.id } value = { s.id }\u003e{ s.nombre }\u003c / option\u003e) }
\u003c / select\u003e
\u003cChevronDown className = "absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size = { 24} /\u003e
\u003c / div\u003e
\u003c / div\u003e

\u003cdiv className = "space-y-3"\u003e
\u003clabel className = "text-xs font-black text-stone-400 uppercase tracking-widest ml-1"\u003eImpuesto a las Ventas(IGV %) \u003c / label\u003e
\u003cdiv className = "relative group"\u003e
\u003cinput
type = "number"
className = "w-full bg-stone-50 border border-stone-200 rounded-[2rem] py-4 px-6 text-stone-800 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
value = { igvPercent }
onChange = {(e) => setIgvPercent(parseFloat(e.target.value) || 0)}
                                    /\u003e
\u003cspan className = "absolute right-6 top-1/2 -translate-y-1/2 font-black text-blue-600"\u003e %\u003c / span\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e

{
    selectedSupplierId \u0026\u0026(
        \u003cdiv className = "flex justify-end pt-4"\u003e
        \u003cbutton 
                                    onClick = {() =\u003e setStep(2)}
className = "flex items-center gap-3 bg-stone-900 hover:bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-xl shadow-stone-900/10 group"
\u003e
                                    Abrir Cat\u00e1logo
\u003cChevronRight size = { 24} className = "group-hover:translate-x-1 transition-transform" /\u003e
\u003c / button\u003e
\u003c / div\u003e
                        )}
\u003c / div\u003e
                )}

{
    step === 2 \u0026\u0026(
        \u003cdiv className = "grid grid-cols-1 lg:grid-cols-10 gap-8 animate-in slide-in-from-right-4 duration-500"\u003e
                        {/* Selector de Items */ }
        \u003cdiv className = "lg:col-span-4 bg-white p-6 rounded-[3rem] border border-stone-100 shadow-sm flex flex-col h-[650px]"\u003e
        \u003cSectionHeader icon = { \u003cShoppingBag size={ 20} /\u003e } title = "Cat\u00e1logo" subtitle = "Vincular productos" /\u003e

        \u003cdiv className = "relative my-4"\u003e
        \u003cSearch className = "absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size = { 18} /\u003e
        \u003cinput 
                                    type = "text"
                                    placeholder = "Buscar producto por nombre..."
                                    className = "w-full bg-stone-100/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                                    value = { searchTerm }
                                    onChange = {(e) =\u003e setSearchTerm(e.target.value)}
                                /\u003e
\u003c / div\u003e

\u003cdiv className = "flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide"\u003e
{
    availableProducts.length === 0 ? (
    \u003cdiv className = "flex flex-col items-center justify-center p-12 text-center opacity-40 grayscale space-y-2 border-2 border-dashed border-stone-200 rounded-[2.5rem]"\u003e
    \u003cPackage size = { 40} /\u003e
    \u003cp className = "text-[10px] font-black uppercase"\u003eNo hay productos disponibles\u003c / p\u003e
    \u003c / div\u003e
                                ) : (
        availableProducts.map(product =\u003e(
            \u003cdiv key = { product.id } className = "group bg-stone-50 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 p-4 rounded-3xl border border-stone-100 transition-all flex items-center justify-between"\u003e
            \u003cdiv\u003e
            \u003ch4 className = "font-black text-stone-900 text-sm uppercase tracking-tight"\u003e{ product.nombre }\u003c / h4\u003e
            \u003cp className = "text-[10px] font-bold text-stone-400"\u003eCosto: ${ product.costo || product.precio }\u003c / p\u003e
            \u003c / div\u003e
            \u003cbutton 
                                                onClick = {() =\u003e addItem(product.id)}
className = "bg-white border border-stone-200 p-2 rounded-2xl text-stone-400 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm"
\u003e
\u003cPlus size = { 20} /\u003e
\u003c / button\u003e
\u003c / div\u003e
                                    ))
                                )}
\u003c / div\u003e
\u003c / div\u003e

{/* Listado de Pedido */ }
\u003cdiv className = "lg:col-span-6 bg-white p-8 md:p-10 rounded-[3.5rem] border border-stone-100 shadow-xl flex flex-col h-[650px] relative"\u003e
\u003cSectionHeader icon = { \u003cFileText size={ 20} /\u003e } title = "Lista de Pedido" subtitle = {`${orderItems.length} items seleccionados`} /\u003e

\u003cdiv className = "flex-1 overflow-y-auto my-6 space-y-4 pr-2"\u003e
{
    orderItems.length === 0 ? (
    \u003cdiv className = "flex flex-col items-center justify-center h-full text-stone-300 space-y-4 opacity-50"\u003e
    \u003cShoppingBag size = { 64} /\u003e
    \u003cp className = "font-black uppercase text-[10px] tracking-[0.2em]"\u003eEl pedido est\u00e1 vac\u00edo\u003c / p\u003e
    \u003c / div\u003e
                                ) : (
    \u003ctable className = "w-full text-left"\u003e
    \u003cthead\u003e
    \u003ctr className = "text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100"\u003e
    \u003cth className = "pb-4"\u003eProducto\u003c / th\u003e
    \u003cth className = "pb-4 text-center"\u003eCant.\u003c / th\u003e
    \u003cth className = "pb-4 text-right"\u003eSubtotal\u003c / th\u003e
    \u003cth className = "pb-4 text-right"\u003e\u003c / th\u003e
    \u003c / tr\u003e
    \u003c / thead\u003e
    \u003ctbody className = "divide-y divide-stone-50"\u003e
    {
        orderItems.map(item =\u003e(
            \u003cOrderRow key = { item.productId } item = { item } onUpdate = {(qty) =\u003e updateQty(item.productId, qty)} onRemove = {() =\u003e removeItem(item.productId)
} /\u003e
                                            ))}
\u003c / tbody\u003e
\u003c / table\u003e
                                )}
\u003c / div\u003e

\u003cdiv className = "pt-6 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6"\u003e
\u003cdiv\u003e
\u003cp className = "text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1"\u003eTotal Estimado\u003c / p\u003e
\u003cp className = "text-4xl font-black text-stone-900 italic tracking-tighter shadow-blue-500/10"\u003e
                                        ${ total.toFixed(2) }
\u003c / p\u003e
\u003c / div\u003e

\u003cdiv className = "flex gap-4"\u003e
\u003cbutton
onClick = {() =\u003e setStep(1)}
className = "bg-stone-100 hover:bg-stone-200 text-stone-600 p-5 rounded-2xl flex items-center justify-center transition-all group"
\u003e
\u003cChevronLeft size = { 24} className = "group-hover:-translate-x-1 transition-transform" /\u003e
\u003c / button\u003e
\u003cbutton
disabled = { orderItems.length === 0 }
onClick = {() =\u003e setStep(3)}
className = "bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:grayscale text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
\u003e
                                        Revisar Boleta IGV
\u003c / button\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e
                )}

{
    step === 3 \u0026\u0026(
        \u003cdiv className = "grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500"\u003e
                        {/* Area de Observaciones */ }
        \u003cdiv className = "lg:col-span-4 bg-white p-8 rounded-[3.5rem] border border-blue-50 shadow-sm space-y-6"\u003e
        \u003cSectionHeader icon = { \u003cInfo size={ 20} /\u003e } title = "Observaciones" subtitle = "A\u00f1ade notas extras" /\u003e
        \u003ctextarea 
                                className = "w-full bg-stone-50 border border-stone-100 rounded-3xl p-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[300px] transition-all resize-none"
                                placeholder = "Escribe aqu\u00ed detalles como: 'Prioridad alta', 'Faltan productos por confirmar', 'Entregar por la tarde'..."
                                value = { notes }
                                onChange = {(e) =\u003e setNotes(e.target.value)}
                            /\u003e
\u003cdiv className = "bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-600 border border-blue-100"\u003e
\u003cCheckCircle2 size = { 24} className = "mt-1" /\u003e
\u003cp className = "text-[10px] font-bold uppercase leading-relaxed"\u003eEstas notas aparecer\u00e1n en tu historial de pedidos para mayor control operativo.\u003c / p\u003e
\u003c / div\u003e
\u003c / div\u003e

{/* Pre-Visualizaci\u00f3n de Boleta IGV */ }
\u003cdiv className = "lg:col-span-8 space-y-8 flex flex-col"\u003e
\u003cdiv className = "bg-white rounded-[4rem] border border-stone-100 shadow-2xl p-12 relative overflow-hidden flex-1"\u003e
{/* Diseño Visual de Boleta */ }
\u003cdiv className = "absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2" /\u003e

\u003cdiv className = "flex justify-between items-start mb-12"\u003e
\u003cdiv className = "space-y-1"\u003e
\u003ch3 className = "text-2xl font-black text-stone-900 italic uppercase tracking-tighter"\u003eBellesasKarina\u003c / h3\u003e
\u003cp className = "text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]"\u003eBoleta de Venta / IGV Aplicado\u003c / p\u003e
\u003c / div\u003e
\u003cdiv className = "text-right"\u003e
\u003cp className = "text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1"\u003eID Borrador\u003c / p\u003e
\u003cp className = "text-xs font-black text-stone-900"\u003e#ORD - { Math.floor(Math.random() * 10000) }\u003c / p\u003e
\u003c / div\u003e
\u003c / div\u003e

\u003cdiv className = "grid grid-cols-2 gap-8 mb-12 pb-8 border-b border-stone-100"\u003e
\u003cdiv\u003e
\u003cp className = "text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2"\u003eProveedor Destino\u003c / p\u003e
\u003cp className = "text-xl font-black text-stone-900 uppercase italic"\u003e{ selectedSupplier?.nombre } \u003c / p\u003e
\u003cp className = "text-xs font-bold text-stone-400 mt-1"\u003e{ selectedSupplier?.email || "Sin email registrado" } \u003c / p\u003e
\u003c / div\u003e
\u003cdiv className = "text-right"\u003e
\u003cp className = "text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2"\u003eFecha Solicitud\u003c / p\u003e
\u003cp className = "text-xl font-black text-stone-900 italic"\u003e{ new Date().toLocaleDateString() } \u003c / p\u003e
\u003c / div\u003e
\u003c / div\u003e

\u003cdiv className = "space-y-4 mb-12"\u003e
{
    orderItems.map(item =\u003e(
        \u003cdiv key = { item.productId } className = "flex justify-between items-center text-xs"\u003e
        \u003cdiv className = "flex gap-4 items-center"\u003e
        \u003cspan className = "w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center font-black text-blue-600"\u003e{ item.cantidad }\u003c / span\u003e
        \u003cspan className = "font-black text-stone-800 uppercase"\u003e{ item.nombre }\u003c / span\u003e
        \u003c / div\u003e
        \u003cspan className = "font-black text-stone-900 tracking-tight"\u003e${(item.cantidad * item.costo).toFixed(2)} \u003c / span\u003e
\u003c / div\u003e
                                    ))}
\u003c / div\u003e

\u003cdiv className = "bg-stone-50 p-8 rounded-[2.5rem] space-y-3"\u003e
\u003cdiv className = "flex justify-between text-stone-400 font-bold text-xs uppercase tracking-widest"\u003e
\u003cspan\u003eSubtotal Neto\u003c / span\u003e
\u003cspan\u003e${ subtotal.toFixed(2) } \u003c / span\u003e
\u003c / div\u003e
\u003cdiv className = "flex justify-between text-blue-600/70 font-bold text-xs uppercase italic tracking-widest"\u003e
\u003cspan\u003eImpuestos(IGV { igvPercent } %) \u003c / span\u003e
\u003cspan\u003e${ igvValue.toFixed(2) } \u003c / span\u003e
\u003c / div\u003e
\u003cdiv className = "flex justify-between items-center pt-4"\u003e
\u003cspan className = "text-stone-900 font-black uppercase text-sm tracking-widest"\u003eTotal a Pagar\u003c / span\u003e
\u003cspan className = "text-3xl font-black text-stone-900 tracking-tighter italic"\u003e${ total.toFixed(2) } \u003c / span\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e

\u003cdiv className = "flex justify-between gap-6"\u003e
\u003cbutton
onClick = {() =\u003e setStep(2)}
className = "bg-white border border-stone-200 hover:border-stone-400 text-stone-600 px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all"
\u003e
                                    Volver al Carrito
\u003c / button\u003e
\u003cbutton
disabled = { saving }
onClick = { handleGenerateOrder }
className = "flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-green-600/20 flex items-center justify-center gap-3"
\u003e
{ saving ? "Registrando..." : "Confirmar y Registrar Boleta" }
{ !saving \u0026\u0026 \u003cCheckCircle2 size = { 24} /\u003e }
\u003c / button\u003e
\u003c / div\u003e
\u003c / div\u003e
\u003c / div\u003e
                )}
            </div >

    { showSuccess \u0026\u0026 \u003cSuccessOverlay /\u003e}
        </div >
    );
}

// COMPONENTES AUXILIARES INTERNOS
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
    return (
    \u003cdiv className = "flex gap-4 items-center mb-2"\u003e
    \u003cdiv className = "w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0"\u003e
    { icon }
    \u003c / div\u003e
    \u003cdiv\u003e
    \u003ch2 className = "text-xl font-black text-stone-900 italic uppercase tracking-tighter leading-none"\u003e{ title } \u003c / h2\u003e
    \u003cp className = "text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1"\u003e{ subtitle } \u003c / p\u003e
    \u003c / div\u003e
    \u003c / div\u003e
    );
}

function OrderRow({ item, onUpdate, onRemove }: { item: OrderItem, onUpdate: (qty: number) =\u003e void, onRemove: () =\u003e void }) {
    return (
    \u003ctr className = "group hover:bg-stone-50/50 transition-colors"\u003e
    \u003ctd className = "py-4"\u003e
    \u003cdiv className = "flex flex-col"\u003e
    \u003cspan className = "font-black text-stone-800 text-xs uppercase tracking-tight"\u003e{ item.nombre } \u003c / span\u003e
    \u003cspan className = "text-[10px] text-stone-400 font-bold"\u003eCosto Unit: ${ item.costo.toFixed(2) } \u003c / span\u003e
    \u003c / div\u003e
    \u003c / td\u003e
    \u003ctd className = "py-4 text-center"\u003e
    \u003cdiv className = "inline-flex items-center bg-stone-50 rounded-xl p-1 border border-stone-100"\u003e
    \u003cinput
    type = "number"
    className = "w-10 bg-transparent text-center text-xs font-black text-stone-800 focus:outline-none"
    value = { item.cantidad }
    onChange = {(e) =\u003e onUpdate(parseInt(e.target.value) || 1)
}
                    /\u003e
\u003c / div\u003e
\u003c / td\u003e
\u003ctd className = "py-4 text-right"\u003e
\u003cspan className = "font-black text-stone-900 text-xs"\u003e${ (item.cantidad * item.costo).toFixed(2) } \u003c / span\u003e
\u003c / td\u003e
\u003ctd className = "py-4 text-right"\u003e
\u003cbutton onClick = { onRemove } className = "opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all p-2"\u003e
\u003cTrash2 size = { 16} /\u003e
\u003c / button\u003e
\u003c / td\u003e
\u003c / tr\u003e
    );
}

function LoadingSpinner() {
    return (
    \u003cdiv className = "flex flex-col items-center justify-center p-32 space-y-4"\u003e
    \u003cdiv className = "h-16 w-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin shadow-inner" /\u003e
    \u003cp className = "text-xs font-black text-stone-400 uppercase tracking-widest animate-pulse"\u003eCargando Sistema de Boletas...\u003c / p\u003e
    \u003c / div\u003e
    );
}

function SuccessOverlay() {
    return (
    \u003cdiv className = "fixed inset-0 bg-stone-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 transition-all duration-700"\u003e
    \u003cdiv className = "bg-white p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center space-y-8 animate-in zoom-in-90 scale-100"\u003e
    \u003cdiv className = "w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/20"\u003e
    \u003cCheckCircle2 size = { 56} /\u003e
    \u003c / div\u003e
    \u003cdiv className = "space-y-4 px-4"\u003e
    \u003ch2 className = "text-4xl font-black text-stone-900 uppercase italic tracking-tighter"\u003e\u00a1Boleta Registrada!\u003c / h2\u003e
    \u003cp className = "text-stone-400 font-bold uppercase text-xs tracking-widest"\u003eEl inventario se actualizar\u00e1 al recibir el pedido\u003c / p\u003e
    \u003c / div\u003e
    \u003cdiv className = "pt-4 animate-bounce"\u003e
    \u003cInfo size = { 24} className = "mx-auto text-blue-500" /\u003e
    \u003c / div\u003e
    \u003c / div\u003e
    \u003c / div\u003e
    );
}
