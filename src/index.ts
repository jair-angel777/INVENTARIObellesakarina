import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Inicialización diferida de Prisma para evitar crashes en startup si no hay DB
let prisma: PrismaClient;
try {
    prisma = new PrismaClient();
    console.log("Prisma Client initialized");
} catch (e) {
    console.error("Failed to initialize Prisma Client", e);
}

app.use(cors({
    origin: '*', // En producción podrías restringirlo a tu dominio de Vercel
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware de log para depuración en Vercel
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Root route for health check
app.get('/', (req, res) => {
    res.json({ message: 'Backend INVENTARIO API is running' });
});

// GET /api/products
app.get('/api/products', async (req: Request, res: Response) => {
    console.log("GET /api/products called");
    try {
        const products = await prisma.productos.findMany({
            orderBy: { nombre: 'asc' }
        });
        res.json(products);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Error al obtener productos', details: error.message });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await prisma.productos.findUnique({
            where: { id: id }
        });
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
    }
});

// POST /api/products
app.post('/api/products', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const newProduct = await prisma.productos.create({
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
        });
        res.status(201).json(newProduct);
    } catch (error: any) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: 'Error al crear producto', details: error.message });
    }
});

// PATCH /api/products/:id
app.patch('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const body = req.body;
        const product = await prisma.productos.update({
            where: { id: id },
            data: body
        });
        res.json(product);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
    }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.productos.delete({
            where: { id: id }
        });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error: any) {
        res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
    }
});

// Debug route
app.get('/api/debug/test-db', async (req: Request, res: Response) => {
    try {
        const count = await prisma.productos.count();
        res.json({ status: 'Connected', message: `Database connected. ${count} products found.` });
    } catch (error: any) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Local Server: http://localhost:${PORT}`);
    });
}
