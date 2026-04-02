"use client";

import React from "react";
import { Guard } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Guard roles={['GERENTE', 'EMPLEADO']}>
      <div className="min-h-screen bg-[#FDFBF7] text-[#121212] flex flex-col">
        {/* Main Content Area - Full Screen */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </Guard>
  );
}
