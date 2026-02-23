import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json()
        const product = await prisma.productos.update({
            where: { id: parseInt(id) },
            data: {
                nombre: body.nombre,
                categoria: body.categoria,
                precio: body.precio,
                costo: body.costo,
                stock: body.stock,
                stock_minimo: body.stock_minimo,
                sku: body.sku,
                imagen: body.imagen,
                fecha_actualizacion: new Date()
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.productos.delete({
            where: { id: parseInt(id) }
        })
        return NextResponse.json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 })
    }
}
