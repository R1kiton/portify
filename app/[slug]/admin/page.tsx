import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStudentAccess } from "@/lib/auth/dal";
import { getProfileStatus, isProfileCompleteEnoughToPublish } from "@/lib/publish";
import { card, btnSecondary } from "@/lib/ui";
import { PublishButton } from "./publish-button";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  vacio: { label: "Vacío", className: "bg-zinc-100 text-zinc-600" },
  borrador: { label: "Borrador", className: "bg-amber-100 text-amber-800" },
  publicado: { label: "Publicado", className: "bg-emerald-100 text-emerald-800" },
};

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student } = await requireStudentAccess(slug);

  const [educations, experiences, projects, skills] = await Promise.all([
    prisma.education.count({ where: { studentId: student.id } }),
    prisma.experience.count({ where: { studentId: student.id } }),
    prisma.project.count({ where: { studentId: student.id } }),
    prisma.skill.count({ where: { studentId: student.id } }),
  ]);

  const status = getProfileStatus(student);
  const canPublish = isProfileCompleteEnoughToPublish(student);
  const statusMeta = STATUS_LABEL[status];

  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Estado de tu EProfile</p>
            <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
            {student.publishedAt ? (
              <p className="mt-2 text-xs text-zinc-400">
                Última publicación: {new Date(student.publishedAt).toLocaleString("es-MX")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-2">
            {canPublish ? (
              <PublishButton slug={slug} />
            ) : (
              <p className="max-w-xs text-right text-sm text-zinc-500">
                Completa al menos tu nombre y carrera en{" "}
                <Link href={`/${slug}/admin/profile`} className="underline">
                  Perfil
                </Link>{" "}
                para poder publicar.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Formación", value: educations, href: "cv" },
          { label: "Experiencia", value: experiences, href: "cv" },
          { label: "Proyectos", value: projects, href: "projects" },
          { label: "Habilidades", value: skills, href: "skills" },
        ].map((item) => (
          <Link
            key={item.label}
            href={`/${slug}/admin/${item.href}`}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
          >
            <p className="text-2xl font-semibold text-zinc-900">{item.value}</p>
            <p className="text-sm text-zinc-500">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className={card}>
        <h2 className="mb-2 text-sm font-semibold text-zinc-900">Compartir tu EProfile</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Este enlace y el código QR no cambian, aunque actualices tu contenido.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${slug}`} target="_blank" className={btnSecondary}>
            Ver perfil público
          </Link>
          <Link href={`/${slug}/card`} target="_blank" className={btnSecondary}>
            Tarjeta con QR
          </Link>
          <Link href={`/${slug}/admin/preview`} className={btnSecondary}>
            Vista previa del borrador
          </Link>
        </div>
      </div>
    </div>
  );
}
