import Link from "next/link";
import { ExternalLink, LogOut, ShieldAlert } from "lucide-react";
import { requireStudentAccess } from "@/lib/auth/dal";
import { logout } from "@/lib/auth/actions";
import { UserRole } from "@/app/generated/prisma/enums";
import { AdminNav } from "./admin-nav";

export default async function StudentAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student, isAdmin, session } = await requireStudentAccess(slug);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {isAdmin && session.role === UserRole.PLATFORM_ADMIN ? (
        <div className="flex items-center justify-center gap-2 bg-amber-100 px-6 py-2 text-center text-sm text-amber-900">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Estás administrando el panel de <strong>{student.fullName || student.slug}</strong> como
          administrador de plataforma.{" "}
          <Link href="/admin" className="underline">
            Volver al panel de plataforma
          </Link>
        </div>
      ) : null}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Panel de estudiante</p>
            <p className="font-bold text-slate-900">eprofile.com/{student.slug}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/${student.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
              Ver perfil público
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-8 px-6 py-8">
        <nav className="w-56 shrink-0">
          <AdminNav slug={student.slug} />
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
