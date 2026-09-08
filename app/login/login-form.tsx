"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth/actions";
import { btnPrimary, input, label } from "@/lib/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={label}>
          Correo
        </label>
        <input id="email" name="email" type="email" required className={input} placeholder="tu@correo.com" />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Contraseña
        </label>
        <input id="password" name="password" type="password" required className={input} />
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
