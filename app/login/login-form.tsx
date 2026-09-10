"use client";

import { useActionState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { login } from "@/lib/auth/actions";
import { btnPrimary, label } from "@/lib/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={label}>
          Correo
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            placeholder="tu@correo.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Contraseña
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      {state?.error ? (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={`${btnPrimary} mt-1 w-full`}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
