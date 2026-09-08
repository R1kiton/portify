import Link from "next/link";
import { LoginForm } from "./login-form";
import { card } from "@/lib/ui";

export const metadata = { title: "Iniciar sesión — EProfile" };

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className={`w-full max-w-sm ${card}`}>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← EProfile
        </Link>
        <h1 className="mt-3 text-xl font-semibold text-zinc-900">Iniciar sesión</h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500">
          Panel de estudiante o de administrador de plataforma.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
