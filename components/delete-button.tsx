"use client";

import { useFormStatus } from "react-dom";
import { btnGhost } from "@/lib/ui";

export function DeleteButton({
  formAction,
  label = "Eliminar",
  confirmMessage = "¿Eliminar este elemento?",
}: {
  formAction?: (formData: FormData) => void;
  label?: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
      className={btnGhost}
    >
      {pending ? "Eliminando..." : label}
    </button>
  );
}
