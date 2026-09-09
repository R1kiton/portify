"use client";

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";
import { btnGhost } from "@/lib/ui";

export function DeleteButton({
  formAction,
  label = "Eliminar",
  confirmMessage = "¿Eliminar este elemento?",
  iconOnly = false,
}: {
  formAction?: (formData: FormData) => void;
  label?: string;
  confirmMessage?: string;
  iconOnly?: boolean;
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
      className={`${btnGhost} hover:bg-red-50 hover:text-red-600`}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {iconOnly ? null : pending ? "Eliminando..." : label}
    </button>
  );
}
