import Link from "next/link";
import { requireStudentAccess } from "@/lib/auth/dal";
import { logout } from "@/lib/auth/actions";
import { UserRole } from "@/app/generated/prisma/enums";

const NAV_ITEMS = [
  { href: "", label: "Resumen" },
  { href: "/profile", label: "Perfil" },
  { href: "/cv", label: "Formación y experiencia" },
  { href: "/projects", label: "Proyectos" },
  { href: "/skills", label: "Habilidades" },
  { href: "/preview", label: "Vista previa" },
];

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
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {isAdmin && session.role === UserRole.PLATFORM_ADMIN ? (
        <div className="bg-amber-100 px-6 py-2 text-center text-sm text-amber-900">
          Estás administrando el panel de <strong>{student.fullName || student.slug}</strong> como
          administrador de plataforma.{" "}
          <Link href="/admin" className="underline">
            Volver al panel de plataforma
          </Link>
        </div>
      ) : null}

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-zinc-500">Panel de estudiante</p>
            <p className="font-semibold text-zinc-900">eprofile.com/{student.slug}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/${student.slug}`} target="_blank" className="text-sm text-zinc-600 hover:text-zinc-900">
              Ver perfil público ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-zinc-600 hover:text-zinc-900">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-8 px-6 py-8">
        <nav className="w-48 shrink-0">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${student.slug}/admin${item.href}`}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
