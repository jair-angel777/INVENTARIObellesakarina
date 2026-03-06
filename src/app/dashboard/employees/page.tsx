'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    ShieldCheck,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Key,
    UserCircle,
    UserCog
} from 'lucide-react';
import Link from 'next/link';

interface Employee {
    id: string;
    nombre: string;
    dni: string;
    cargo: string;
    telefono: string;
    email: string;
    estado: string;
    fecha_ingreso: string;
}

interface User {
    id: string;
    username: string;
    rol: string;
    empleado_id?: string;
    fecha_creacion: string;
    ultimo_acceso?: string;
}

import { useAuth, Guard } from '@/context/AuthContext';

export default function EmployeesPage() {
    const { login, userRole } = useAuth();
    const [activeTab, setActiveTab] = useState<'employees' | 'users'>('employees');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backen-inventario.vercel.app';

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'employees' ? '/api/employees' : '/api/users';
            const res = await fetch(`${API_URL}${endpoint}`);
            const data = await res.json();
            if (activeTab === 'employees') setEmployees(data);
            else setUsers(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10 pb-20">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-400 hover:text-red-500 transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver al Dashboard</span>
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black text-stone-900 tracking-tighter leading-none italic uppercase">
                            Personal <span className="text-red-600">.</span>
                        </h1>
                        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.3em] max-w-md leading-relaxed">
                            Gestión de capital humano y control de accesos por niveles de seguridad.
                        </p>
                    </div>

                    <div className="flex bg-stone-100 p-1.5 rounded-[2rem] shadow-inner">
                        <button
                            onClick={() => setActiveTab('employees')}
                            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'employees' ? 'bg-white text-stone-900 shadow-xl scale-100' : 'text-stone-400 hover:text-stone-600 scale-95'}`}
                        >
                            <div className="flex items-center gap-2">
                                <Users size={14} />
                                Empleados
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-stone-900 shadow-xl scale-100' : 'text-stone-400 hover:text-stone-600 scale-95'}`}
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} />
                                Usuarios
                            </div>
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-stone-100 overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-8 md:p-12 border-b border-stone-50 flex flex-col md:flex-row gap-6 justify-between items-center bg-stone-50/30">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder={activeTab === 'employees' ? "Buscar por nombre o DNI..." : "Buscar por nombre de usuario..."}
                                className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent rounded-[2rem] text-sm font-bold placeholder:text-stone-300 focus:outline-none focus:border-red-500/20 shadow-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Guard roles={['GERENTE']}>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-red-600 hover:bg-stone-900 text-white px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95">
                                    {activeTab === 'employees' ? <UserPlus size={16} /> : <Key size={16} />}
                                    {activeTab === 'employees' ? 'Nuevo Empleado' : 'Crear Usuario'}
                                </button>
                            </Guard>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                                    {activeTab === 'employees' ? (
                                        <>
                                            <th className="px-12 py-8">Empleado</th>
                                            <th className="px-12 py-8">Contacto</th>
                                            <th className="px-12 py-8">Cargo</th>
                                            <th className="px-12 py-8 text-center">Estado</th>
                                            <th className="px-12 py-8 text-right">Acciones</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-12 py-8">Usuario</th>
                                            <th className="px-12 py-8 text-center">Rol/Permisos</th>
                                            <th className="px-12 py-8">Creado</th>
                                            <th className="px-12 py-8 text-center">Último Acceso</th>
                                            <th className="px-12 py-8 text-right">Acciones</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-12 py-32 text-center">
                                            <div className="animate-spin h-12 w-12 border-[6px] border-red-50 border-t-red-600 rounded-full mx-auto shadow-inner" />
                                        </td>
                                    </tr>
                                ) : activeTab === 'employees' ? (
                                    employees.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-12 py-32 text-center">
                                                <div className="flex flex-col items-center opacity-30 grayscale saturate-0 space-y-4">
                                                    <Users size={64} className="text-stone-400" />
                                                    <p className="font-black uppercase text-[10px] tracking-[0.3em]">No hay personal registrado en planilla</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        employees.map(emp => (
                                            <tr key={emp.id} className="group hover:bg-stone-50/50 transition-all">
                                                <td className="px-12 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors font-black text-xl italic uppercase">
                                                            {emp.nombre.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-stone-900 text-base uppercase italic tracking-tighter">{emp.nombre}</span>
                                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{emp.dni}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-stone-500">
                                                            <Mail size={12} className="text-red-500" />
                                                            <span className="text-xs font-bold">{emp.email || 'Sin correo'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-stone-500">
                                                            <Phone size={12} className="text-red-500" />
                                                            <span className="text-xs font-bold">{emp.telefono || 'Sin teléfono'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8">
                                                    <span className="text-xs font-black text-stone-900 uppercase italic tracking-tighter">{emp.cargo || 'No asignado'}</span>
                                                </td>
                                                <td className="px-12 py-8 text-center">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${emp.estado === 'ACTIVO' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${emp.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                                                        {emp.estado}
                                                    </span>
                                                </td>
                                                <td className="px-12 py-8 text-right">
                                                    <button className="bg-stone-100 hover:bg-stone-900 hover:text-white p-4 rounded-2xl transition-all scale-95 hover:scale-100 active:scale-95 shadow-sm">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-12 py-32 text-center">
                                                <div className="flex flex-col items-center opacity-30 grayscale saturate-0 space-y-4">
                                                    <ShieldCheck size={64} className="text-stone-400" />
                                                    <p className="font-black uppercase text-[10px] tracking-[0.3em]">No hay cuentas de acceso configuradas</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user.id} className="group hover:bg-stone-50/50 transition-all">
                                                <td className="px-12 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-black text-xl italic uppercase shadow-xl shadow-stone-200">
                                                            {user.username.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-stone-900 text-base uppercase italic tracking-tighter">@{user.username}</span>
                                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Cuenta Activa</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8 text-center">
                                                    <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-sm ${user.rol === 'GERENTE' ? 'bg-red-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {user.rol === 'GERENTE' ? <UserCog size={12} /> : <UserCircle size={12} />}
                                                        {user.rol}
                                                    </span>
                                                </td>
                                                <td className="px-12 py-8">
                                                    <div className="flex items-center gap-2 text-stone-500">
                                                        <Calendar size={14} />
                                                        <span className="text-xs font-bold">{new Date(user.fecha_creacion).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-8 text-center text-xs font-bold text-stone-400 italic">
                                                    {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'Nunca'}
                                                </td>
                                                <td className="px-12 py-8 text-right text-stone-400">
                                                    <button className="bg-stone-100 hover:bg-red-600 hover:text-white p-4 rounded-2xl transition-all scale-95 hover:scale-100 active:scale-95 shadow-sm">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Cards / Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-stone-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-red-600/40 transition-colors" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-6 italic">Seguridad Física</h4>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-5xl font-black italic italic uppercase tracking-tighter leading-none">{employees.length}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-red-500">Miembros Staff</span>
                            </div>
                            <Users className="text-stone-700 mb-2" size={48} />
                        </div>
                    </div>
                    <div className="bg-stone-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-600/40 transition-colors" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-6 italic">Cuentas Digitales</h4>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-5xl font-black italic uppercase tracking-tighter leading-none">{users.length}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-indigo-500">Cuentas con Acceso</span>
                            </div>
                            <ShieldCheck className="text-stone-700 mb-2" size={48} />
                        </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-100 rounded-[3rem] p-10 relative overflow-hidden flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-stone-400 mb-4">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Servidor Activo (Sincronizado)</span>
                        </div>
                        <h4 className="text-xl font-black text-stone-900 italic uppercase tracking-tighter leading-tight">Control de Roles v3.0</h4>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">Permisos granulares para proteger información financiera.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
