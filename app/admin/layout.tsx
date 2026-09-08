import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/auth/dal";
import { logout } from "@/lib/auth/actions";

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePlatformAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-zinc-500">Panel de plataforma</p>
            <Link href="/admin" className="font-semibold text-zinc-900">
              EProfile Admin
            </Link>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm text-zinc-600 hover:text-zinc-900">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
