import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Belleza Premium - Inventario",
    description: "Sistema de gestión de inventario de alta gama",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
