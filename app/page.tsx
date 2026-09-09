import Link from "next/link";
import {
  ArrowRight,
  QrCode,
  FileDown,
  UserCog,
  Eye,
  ShieldCheck,
  Users,
} from "lucide-react";
import { btnPrimary, btnSecondary } from "@/lib/ui";

const ROLES = [
  {
    icon: Eye,
    title: "Visitante",
    description:
      "Ve cualquier Portify pública sin iniciar sesión, descarga el CV en PDF y guarda el contacto.",
  },
  {
    icon: UserCog,
    title: "Estudiante",
    description:
      "Administra su perfil, CV, proyectos y enlaces desde un panel propio: borrador, vista previa y publicación.",
  },
  {
    icon: ShieldCheck,
    title: "Administrador",
    description:
      "Crea cuentas, revisa el estado de cada perfil y apoya la publicación de cualquier estudiante.",
  },
];

const FEATURES = [
  { icon: FileDown, label: "CV en PDF, con plantillas" },
  { icon: QrCode, label: "Tarjeta con código QR" },
  { icon: Users, label: "Aislamiento total entre cuentas" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
          <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
              E
            </span>
            Portify
          </span>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/estudiantes" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Estudiantes
            </Link>
            <Link href="/login" className={btnPrimary}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(79,70,229,0.12),transparent)]"
        />

        <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Proyecto integrador · Nuevas Tecnologías
          </span>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Tu tarjeta de presentación,{" "}
            <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              siempre viva
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-600">
            Perfil, currículum, proyectos y contacto en un único enlace fijo y
            un código QR. Siempre actualizado, sin rehacer documentos.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/login" className={`${btnPrimary} px-6 py-3 text-base`}>
              Entrar a mi panel
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/estudiantes" className={`${btnSecondary} px-6 py-3 text-base`}>
              Ver estudiantes
            </Link>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {FEATURES.map((f) => (
                <span key={f.label} className="hidden items-center gap-1.5 sm:flex">
                  <f.icon className="h-4 w-4 text-indigo-500" />
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <role.icon className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">{role.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-400 sm:px-6">
          Portify — Documento de requerimientos · Asignatura Nuevas Tecnologías
        </div>
      </footer>
    </div>
  );
}
