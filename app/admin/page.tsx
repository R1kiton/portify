import Link from "next/link";
import { UserPlus, Users, CircleCheck, CircleDashed, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProfileStatus } from "@/lib/publish";
import { card, btnSecondary, badge, badgeTones } from "@/lib/ui";
import { CreateStudentForm } from "./create-student-form";
import { ResetPasswordButton } from "./reset-password-button";
import { ToggleActiveButton } from "./toggle-active-button";
import { DeleteStudentButton } from "./delete-student-button";

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  vacio: { label: "Vacío", tone: badgeTones.neutral },
  borrador: { label: "Borrador", tone: badgeTones.warning },
  publicado: { label: "Publicado", tone: badgeTones.success },
};

export default async function PlatformAdminPage() {
  const students = await prisma.student.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const published = students.filter((s) => getProfileStatus(s) === "publicado").length;
  const active = students.filter((s) => s.user.active).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={card}>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Users className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{students.length}</p>
          <p className="text-sm text-slate-500">Estudiantes registrados</p>
        </div>
        <div className={card}>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CircleCheck className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{published}</p>
          <p className="text-sm text-slate-500">Perfiles publicados</p>
        </div>
        <div className={card}>
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <CircleDashed className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{active}</p>
          <p className="text-sm text-slate-500">Cuentas activas</p>
        </div>
      </div>

      <div className={card}>
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <UserPlus className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Crear cuenta de estudiante</h1>
            <p className="text-sm text-slate-500">
              El estudiante inicia sesión con este correo y la contraseña temporal.
            </p>
          </div>
        </div>
        <CreateStudentForm />
      </div>

      <div className={card}>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Estudiantes ({students.length})
        </h2>

        {students.length === 0 ? (
          <p className="text-sm text-slate-400">Aún no hay cuentas de estudiante.</p>
        ) : (
          <div className="-mx-6 overflow-x-auto px-6">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-4 font-semibold">Estudiante</th>
                  <th className="py-2 pr-4 font-semibold">Correo</th>
                  <th className="py-2 pr-4 font-semibold">Perfil</th>
                  <th className="py-2 pr-4 font-semibold">Cuenta</th>
                  <th className="py-2 pr-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const status = STATUS_LABEL[getProfileStatus(student)];
                  const initial = (student.fullName || student.slug).charAt(0).toUpperCase();
                  return (
                    <tr key={student.id} className="align-top">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {initial}
                          </span>
                          <div>
                            <p className="font-medium text-slate-900">{student.fullName || "(sin nombre)"}</p>
                            <p className="text-xs text-slate-400">/{student.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600">{student.user.email}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`${badge} ${status.tone}`}>{status.label}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`${badge} ${student.user.active ? badgeTones.success : badgeTones.neutral}`}>
                          {student.user.active ? "Activa" : "Desactivada"}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/${student.slug}/admin`} className={btnSecondary}>
                            <ExternalLink className="h-3.5 w-3.5" />
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
