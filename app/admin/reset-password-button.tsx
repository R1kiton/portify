"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "./actions";
import { btnGhost } from "@/lib/ui";

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction.bind(null, userId), undefined);

  if (state?.tempPassword) {
    return (
      <span className="text-xs text-emerald-700">
        Nueva contraseña:{" "}
        <code className="rounded bg-emerald-50 px-1 py-0.5 font-mono">{state.tempPassword}</code>
      </span>
    );
  }

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        onClick={(e) => {
          if (!window.confirm("¿Restablecer la contraseña de este estudiante?")) e.preventDefault();
        }}
        className={btnGhost}
      >
        {pending ? "Generando..." : "Reiniciar contraseña"}
      </button>
    </form>
  );
}
