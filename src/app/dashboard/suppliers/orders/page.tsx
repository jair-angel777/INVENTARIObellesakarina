"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    ChevronLeft,
    Calendar,
    ArrowUpRight,
    Search,
    Filter,
    Package,
    Tag,
    Clock,
    CheckCircle2,
    X,
    Printer,
    Download
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

interface OrderDetail {
    id: string;
    nombre_producto: string;
    cantidad: number;
    costo_unitario: number;
    subtotal: number;
}

interface Order {
    id: string;
    fecha: string;
    total: number;
    igv: number;
    subtotal: number;
    estado: string;
    notas: string;
    proveedor_id: string;
    detalles: OrderDetail[];
}

export default function OrdersHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            // Usamos fetchWithAuth para que la seguridad implementada funcione
            const res = await fetchWithAuth(`${apiUrl}/suppliers`);
            const data = await res.json();
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const res = await fetchWithAuth(`${apiUrl}/orders`);
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
            const res = await fetchWithAuth(`${apiUrl}/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: newStatus })
            });

            if (res.ok) {
                // Actualizar lista local
                setOrders(orders.map(o => o.id === orderId ? { ...o, estado: newStatus } : o));
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('boleta-formal');
        if (!element) return;
        
        // Dynamically import html2pdf to avoid SSR issues
        const html2pdf = (await import('html2pdf.js')).default;
        const opt: any = {
            margin:       0.5,
            filename:     `orden_compra_${selectedOrder?.id.slice(-5).toUpperCase() || 'doc'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        const printContent = document.getElementById('boleta-formal');
        if (!printContent) return;

        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners after DOM replacement
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold uppercase text-[10px] tracking-widest"
                        >
                            <ChevronLeft size={16} />
                            Volver
                        </Link>
                        <div>
                            <h1 className="text-5xl font-black text-stone-900 italic uppercase tracking-tighter leading-none">
                                Historial de <br />
                                <span className="text-red-500">Movimientos</span>
                            </h1>
                            <p className="text-stone-400 font-bold uppercase text-xs tracking-[0.2em] mt-4">
                                Registro de Órdenes de Compra y Entradas de Stock
                            </p>
                        </div>
                    </div>

                    <div className="flex bg-white rounded-2xl p-2 border border-stone-200 shadow-sm">
                        <button className="px-6 py-2 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Todos</button>
                        <button className="px-6 py-2 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-colors">Completados</button>
                        <button className="px-6 py-2 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-50 transition-colors">Pendientes</button>
                    </div>
                </div>

                {/* Table / List */}
                <div className="bg-white rounded-[3.5rem] border border-stone-100 shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-stone-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-xl font-black text-stone-900 italic uppercase tracking-tighter">Listado General</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar por ID o Nota..."
                                    className="bg-stone-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold w-64 focus:ring-2 focus:ring-red-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Orden ID</th>
                                    <th className="px-8 py-5">Fecha</th>
                                    <th className="px-8 py-5">Productos</th>
                                    <th className="px-8 py-5 text-right">Monto Total</th>
                                    <th className="px-8 py-5 text-center">Estado</th>
                                    <th className="px-8 py-5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="animate-spin h-10 w-10 border-4 border-red-50 border-t-red-600 rounded-full mx-auto" />
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center opacity-30 grayscale">
                                                <Package size={48} className="mb-4" />
                                                <p className="font-black uppercase text-[10px] tracking-widest">No se encontraron movimientos registrados</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="group hover:bg-stone-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-stone-900 text-xs italic">#ORD-{order.id.slice(-5).toUpperCase()}</span>
                                                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-tight truncate max-w-[150px]">{order.notas || "Sin observaciones"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-stone-500 text-xs font-bold">
                                                    <Calendar size={14} className="text-stone-300" />
                                                    {new Date(order.fecha).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-stone-600 uppercase">
                                                        {order.detalles?.length || 0} Items
                                                    </span>
                                                    <div className="flex -space-x-2">
                                                        {(order.detalles || []).slice(0, 3).map((d, i) => (
                                                            <div key={i} className="w-6 h-6 rounded-lg bg-stone-100 border border-white flex items-center justify-center text-[8px] font-black text-stone-400 uppercase">
                                                                {d.nombre_producto[0]}
                                                            </div>
                                                        ))}
                                                        {(order.detalles?.length || 0) > 3 && (
                                                            <div className="w-6 h-6 rounded-lg bg-stone-100 border border-white flex items-center justify-center text-[8px] font-black text-stone-400">
                                                                +{(order.detalles?.length || 0) - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-stone-900 text-sm italic tracking-tighter">${order.total.toFixed(2)}</span>
                                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest italic">IGV Incl.</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.estado === 'COMPLETADO'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${order.estado === 'COMPLETADO' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                                    {order.estado === 'COMPLETADO' ? 'RECIBIDO' : 'PENDIENTE'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.estado === 'PENDIENTE' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, 'COMPLETADO')}
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                                        >
                                                            <CheckCircle2 size={12} />
                                                            Recibido
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="bg-stone-100 hover:bg-stone-900 hover:text-white p-3 rounded-xl transition-all group-hover:scale-105 active:scale-95"
                                                    >
                                                        <ArrowUpRight size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="bg-stone-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/40">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Sincronización v2.0</h3>
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-1">Todas tus operaciones están cifradas y respaldadas en tiempo real.</p>
                        </div>
                    </div>
                    <button className="relative z-10 bg-white text-stone-900 px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                        Exportar Reporte Mensual
                    </button>
                </div>
            </div>

            {/* Modal de la Boleta Formal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
                        {/* Header del Modal */}
                        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-stone-500">Visualización de Orden</h3>
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="p-2 text-stone-500 hover:text-stone-900 hover:bg-white rounded-lg transition-colors shadow-sm" title="Imprimir">
                                    <Printer size={18} />
                                </button>
                                <button onClick={handleDownloadPDF} className="p-2 text-stone-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors shadow-sm" title="Descargar PDF">
                                    <Download size={18} />
                                </button>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-lg transition-colors" title="Cerrar">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Área Imprimible de la Boleta */}
                        <div className="overflow-y-auto flex-1 p-8 bg-white document-body">
                            <div id="boleta-formal" className="max-w-xl mx-auto space-y-8 font-mono text-sm text-stone-900 print:p-0">
                                
                                {/* Encabezado Formal */}
                                <div className="border border-stone-300 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-stone-50/50">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-widest">ORDEN DE COMPRA</h2>
                                        <p className="font-semibold text-stone-600 mt-1">N° {selectedOrder.id.slice(-5).toUpperCase()}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <p className="font-medium text-stone-600">Fecha: {new Date(selectedOrder.fecha).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Información de Empresa y Proveedor */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/30">
                                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 border-b border-stone-200 pb-2">Empresa:</h4>
                                        <p><span className="font-semibold">Empresa:</span> Bellesas Karina</p>
                                        <p><span className="font-semibold">RUC:</span> 12345678912</p>
                                        <p><span className="font-semibold">Dirección:</span> Lima, Perú</p>
                                    </div>

                                    {(() => {
                                        const prov = suppliers.find(s => s.id === selectedOrder.proveedor_id) || {};
                                        return (
                                            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/30">
                                                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 border-b border-stone-200 pb-2">Proveedor:</h4>
                                                <p><span className="font-semibold">Proveedor:</span> {prov.nombre || 'Desconocido'}</p>
                                                <p><span className="font-semibold">RUC / ID:</span> {prov.notas?.match(/ruc:?\s*(\d+)/i)?.[1] || 'XXXXX'}</p>
                                                <p><span className="font-semibold">Correo:</span> {prov.email || 'No registrado'}</p>
                                                <p><span className="font-semibold">Teléfono:</span> {prov.telefono || 'No registrado'}</p>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Tabla de Productos */}
                                <div>
                                    <h4 className="text-lg font-bold mb-4">Tabla de productos</h4>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-stone-300">
                                                <th className="py-2 font-bold">Producto</th>
                                                <th className="py-2 font-bold text-center">Cantidad</th>
                                                <th className="py-2 font-bold text-right">Precio</th>
                                                <th className="py-2 font-bold text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-200">
                                            {selectedOrder.detalles.map((d, index) => (
                                                <tr key={index}>
                                                    <td className="py-3 pr-4">{d.nombre_producto}</td>
                                                    <td className="py-3 text-center">{d.cantidad}</td>
                                                    <td className="py-3 text-right">S/ {d.costo_unitario.toFixed(2)}</td>
                                                    <td className="py-3 text-right">S/ {d.subtotal.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Resumen Financiero */}
                                <div className="flex justify-end pt-4 border-t-2 border-stone-300">
                                    <div className="w-48 space-y-2 text-right">
                                        <p className="flex justify-between">
                                            <span className="font-bold text-stone-500">Subtotal:</span>
                                            <span>S/ {selectedOrder.subtotal.toFixed(2)}</span>
                                        </p>
                                        <p className="flex justify-between text-xs text-stone-400">
                                            <span>IGV (18%):</span>
                                            <span>S/ {selectedOrder.igv.toFixed(2)}</span>
                                        </p>
                                        <div className="border-t border-stone-300 pt-2 font-bold text-lg flex justify-between">
                                            <span>TOTAL:</span>
                                            <span>S/ {selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Nota en el pie */}
                                {selectedOrder.notas && (
                                    <div className="mt-8 text-xs italic text-stone-500 border-t border-dashed border-stone-300 pt-4">
                                        <span className="font-bold">Nota de la orden:</span> {selectedOrder.notas}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
