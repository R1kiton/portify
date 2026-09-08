"use client";

import { btnPrimary } from "@/lib/ui";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={btnPrimary}>
      Imprimir tarjeta
    </button>
  );
}
