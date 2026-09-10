import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  FolderGit2,
  Sparkles,
  ExternalLink,
  QrCode,
  Eye,
  CircleCheck,
  CircleDashed,
  Circle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireStudentAccess } from "@/lib/auth/dal";
import { getProfileStatus, isProfileCompleteEnoughToPublish } from "@/lib/publish";
import { card, btnSecondary, badge, badgeTones } from "@/lib/ui";
import { PublishButton } from "./publish-button";

const STATUS_META: Record<string, { label: string; tone: string; icon: typeof Circle }> = {
  vacio: { label: "Vacío", tone: badgeTones.neutral, icon: Circle },
  borrador: { label: "Borrador", tone: badgeTones.warning, icon: CircleDashed },
  publicado: { label: "Publicado", tone: badgeTones.success, icon: CircleCheck },
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
  const meta = STATUS_META[status];

  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Estado de tu Portify</p>
            <span className={`${badge} ${meta.tone} mt-2`}>
              <meta.icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            {student.publishedAt ? (
              <p className="mt-2 text-xs text-slate-400">
                Última publicación: {new Date(student.publishedAt).toLocaleString("es-MX")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-2">
            {canPublish ? (
              <PublishButton slug={slug} />
            ) : (
              <p className="max-w-xs text-right text-sm text-slate-500">
                Completa al menos tu nombre y carrera en{" "}
                <Link href={`/${slug}/admin/profile`} className="font-medium text-emerald-600 underline">
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
          { label: "Formación", value: educations, href: "cv", icon: GraduationCap },
          { label: "Experiencia", value: experiences, href: "cv", icon: Briefcase },
          { label: "Proyectos", value: projects, href: "projects", icon: FolderGit2 },
          { label: "Habilidades", value: skills, href: "skills", icon: Sparkles },
        ].map((item) => (
          <Link
            key={item.label}
            href={`/${slug}/admin/${item.href}`}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
              <item.icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className={card}>
        <h2 className="mb-1 text-sm font-semibold text-slate-900">Compartir tu Portify</h2>
        <p className="mb-4 text-sm text-slate-500">
          Este enlace y el código QR no cambian, aunque actualices tu contenido.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${slug}`} target="_blank" className={btnSecondary}>
            <ExternalLink className="h-4 w-4" />
            Ver perfil público
          </Link>
          <Link href={`/${slug}/card`} target="_blank" className={btnSecondary}>
            <QrCode className="h-4 w-4" />
            Tarjeta con QR
          </Link>
          <Link href={`/${slug}/admin/preview`} className={btnSecondary}>
            <Eye className="h-4 w-4" />
            Vista previa del borrador
          </Link>
        </div>
      </div>
    </div>
  );
}
