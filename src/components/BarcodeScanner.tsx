"use client";

import React, { useEffect, useState } from "react";

interface BarcodeScannerProps {
    onScan: (barcode: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
    const [barcode, setBarcode] = useState("");
    const [lastCharTime, setLastCharTime] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignorar si el usuario está escribiendo en un input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const currentTime = new Date().getTime();
            
            // Si ha pasado mucho tiempo entre teclas (> 50ms), asumimos que no es un escáner
            // y reiniciamos el acumulador de barcode
            if (currentTime - lastCharTime > 50) {
                setBarcode("");
            }

            // Si es 'Enter', disparamos el evento de escaneo
            if (e.key === "Enter") {
                if (barcode.length > 2) {
                    onScan(barcode);
                    setBarcode("");
                }
            } else if (e.key.length === 1) {
                // Solo acumulamos caracteres imprimibles
                setBarcode((prev) => prev + e.key);
                setLastCharTime(currentTime);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [barcode, lastCharTime, onScan]);

    return null; // El componente es invisible, solo escucha eventos
}
