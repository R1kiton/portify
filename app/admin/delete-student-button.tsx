"use client";

import { useTransition } from "react";
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
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
