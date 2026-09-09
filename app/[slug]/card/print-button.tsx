"use client";

import { Printer } from "lucide-react";
import { btnPrimary } from "@/lib/ui";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={btnPrimary}>
      <Printer className="h-4 w-4" />
      Imprimir tarjeta
    </button>
  );
}
