"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteStudentAction } from "./actions";
import { btnDanger } from "@/lib/ui";

export function DeleteStudentButton({ userId, label }: { userId: string; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`¿Eliminar la cuenta de "${label}" y todo su contenido? Esta acción no se puede deshacer.`)) {
          startTransition(() => deleteStudentAction(userId, new FormData()));
        }
      }}
      className={btnDanger}
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
