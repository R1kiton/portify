"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { createStudentAction } from "./actions";
import { input, label } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";

export function CreateStudentForm() {
  const [state, action] = useActionState(createStudentAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label}>Nombre completo</label>
          <input name="fullName" required className={input} />
        </div>
        <div>
          <label className={label}>Correo</label>
          <input name="email" type="email" required className={input} />
        </div>
        <div>
          <label className={label}>Dirección (slug)</label>
          <input name="slug" required className={input} placeholder="luis-jz" />
        </div>
      </div>

      {state?.error ? (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      {state?.success ? (
        <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Cuenta creada para <strong>{state.success.email}</strong> en{" "}
            <strong>/{state.success.slug}</strong>.
            <br />
            Contraseña temporal:{" "}
            <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono">
              {state.success.tempPassword}
            </code>{" "}
            — compártela ahora, no se volverá a mostrar.
          </p>
        </div>
      ) : null}

      <div>
        <SubmitButton pendingText="Creando...">Crear cuenta de estudiante</SubmitButton>
      </div>
    </form>
  );
}
