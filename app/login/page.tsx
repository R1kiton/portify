import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Iniciar sesión — EProfile" };

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(79,70,229,0.12),transparent)]"
      />

      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          EProfile
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Iniciar sesión
          </h1>
          <p className="mt-1 mb-6 text-sm text-slate-500">
            Panel de estudiante o de administrador de plataforma.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
