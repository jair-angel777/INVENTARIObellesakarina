import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const products = await prisma.productos.findMany({
            orderBy: {
                fecha_creacion: 'desc'
            }
        })
        return NextResponse.json(products)
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const product = await prisma.productos.create({
            data: {
                nombre: body.nombre,
                categoria: body.categoria,
                precio: body.precio,
                costo: body.costo,
                stock: body.stock,
                stock_minimo: body.stock_minimo,
                sku: body.sku,
                imagen: body.imagen
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 })
    }
}
