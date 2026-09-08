import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProfileStatus } from "@/lib/publish";
import { card, btnSecondary } from "@/lib/ui";
import { CreateStudentForm } from "./create-student-form";
import { ResetPasswordButton } from "./reset-password-button";
import { ToggleActiveButton } from "./toggle-active-button";
import { DeleteStudentButton } from "./delete-student-button";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  vacio: { label: "Vacío", className: "bg-zinc-100 text-zinc-600" },
  borrador: { label: "Borrador", className: "bg-amber-100 text-amber-800" },
  publicado: { label: "Publicado", className: "bg-emerald-100 text-emerald-800" },
};

export default async function PlatformAdminPage() {
  const students = await prisma.student.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className={card}>
        <h1 className="mb-1 text-lg font-semibold text-zinc-900">Crear cuenta de estudiante</h1>
        <p className="mb-5 text-sm text-zinc-500">
          El estudiante inicia sesión con este correo y la contraseña temporal.
        </p>
        <CreateStudentForm />
      </div>

      <div className={card}>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Estudiantes ({students.length})
        </h2>

        {students.length === 0 ? (
          <p className="text-sm text-zinc-400">Aún no hay cuentas de estudiante.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-400">
                  <th className="py-2 pr-4">Estudiante</th>
                  <th className="py-2 pr-4">Correo</th>
                  <th className="py-2 pr-4">Perfil</th>
                  <th className="py-2 pr-4">Cuenta</th>
                  <th className="py-2 pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {students.map((student) => {
                  const status = STATUS_LABEL[getProfileStatus(student)];
                  return (
                    <tr key={student.id} className="align-top">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-zinc-900">{student.fullName || "(sin nombre)"}</p>
                        <p className="text-xs text-zinc-400">/{student.slug}</p>
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">{student.user.email}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            student.user.active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {student.user.active ? "Activa" : "Desactivada"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/${student.slug}/admin`} className={btnSecondary}>
                            Entrar al panel
                          </Link>
                          <ToggleActiveButton userId={student.user.id} active={student.user.active} />
                          <ResetPasswordButton userId={student.user.id} />
                          <DeleteStudentButton userId={student.user.id} label={student.fullName || student.slug} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
