import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/lib/ui";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">EProfile</span>
          <Link href="/login" className={btnSecondary}>
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center gap-6 px-6 py-24">
        <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Proyecto integrador · Nuevas Tecnologías
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white-900 sm:text-5xl">
          Tu tarjeta de presentación digital
        </h1>
        <p className="max-w-xl text-lg text-zinc-600">
          Perfil, currículum, proyectos y contacto en un único enlace fijo y un
          código QR. Siempre actualizado, sin rehacer documentos.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/login" className={btnPrimary}>
            Entrar a mi panel
          </Link>
        </div>

        <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Visitante</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Ve cualquier EProfile pública sin iniciar sesión, descarga el CV
              en PDF y guarda el contacto.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Estudiante</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Administra su perfil, CV, proyectos y enlaces desde un panel
              propio: borrador, vista previa y publicación.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">
              Administrador
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Crea cuentas, revisa el estado de cada perfil y apoya la
              publicación de cualquier estudiante.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
