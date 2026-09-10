import { Briefcase, GraduationCap, Award, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireStudentAccess } from "@/lib/auth/dal";
import {
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addAchievement,
  deleteAchievement,
} from "../actions";
import { card, input, label, textarea } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";
import { DeleteButton } from "@/components/delete-button";

function CardHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default async function CvEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student } = await requireStudentAccess(slug);

  const [educations, experiences, achievements] = await Promise.all([
    prisma.education.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "asc" } }),
    prisma.experience.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "asc" } }),
    prisma.achievement.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Experience */}
      <section className={card}>
        <CardHeading icon={Briefcase} title="Experiencia" description="Trabajos, prácticas o colaboraciones." />

        <div className="flex flex-col gap-4">
          {experiences.map((exp) => (
            <form
              key={exp.id}
              action={updateExperience.bind(null, slug, exp.id)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="company" defaultValue={exp.company} placeholder="Empresa *" required className={input} />
                <input name="role" defaultValue={exp.role} placeholder="Puesto *" required className={input} />
                <input name="startDate" defaultValue={exp.startDate ?? ""} placeholder="Inicio (ej. 2023)" className={input} />
                <input name="endDate" defaultValue={exp.endDate ?? ""} placeholder="Fin (vacío = presente)" className={input} />
              </div>
              <textarea name="description" defaultValue={exp.description ?? ""} placeholder="Descripción" className={`${textarea} mt-3`} />
              <div className="mt-3 flex items-center gap-2">
                <SubmitButton>Guardar</SubmitButton>
                <DeleteButton formAction={deleteExperience.bind(null, slug, exp.id)} />
              </div>
            </form>
          ))}
          {experiences.length === 0 ? <p className="text-sm text-slate-400">Aún no agregas experiencia.</p> : null}
        </div>

        <details className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 open:bg-slate-50/50">
          <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-700">
            <Plus className="h-4 w-4" /> Agregar experiencia
          </summary>
          <form action={addExperience.bind(null, slug)} className="mt-4 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="company" placeholder="Empresa *" required className={input} />
              <input name="role" placeholder="Puesto *" required className={input} />
              <input name="startDate" placeholder="Inicio (ej. 2023)" className={input} />
              <input name="endDate" placeholder="Fin (vacío = presente)" className={input} />
            </div>
            <textarea name="description" placeholder="Descripción" className={textarea} />
            <div>
              <SubmitButton>Agregar</SubmitButton>
            </div>
          </form>
        </details>
      </section>

      {/* Education */}
      <section className={card}>
        <CardHeading icon={GraduationCap} title="Formación" description="Estudios y certificaciones." />

        <div className="flex flex-col gap-4">
          {educations.map((edu) => (
            <form
              key={edu.id}
              action={updateEducation.bind(null, slug, edu.id)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="institution" defaultValue={edu.institution} placeholder="Institución *" required className={input} />
                <input name="degree" defaultValue={edu.degree ?? ""} placeholder="Grado (ej. Licenciatura)" className={input} />
                <input name="fieldOfStudy" defaultValue={edu.fieldOfStudy ?? ""} placeholder="Área de estudio" className={input} />
                <div className="flex gap-3">
                  <input name="startDate" defaultValue={edu.startDate ?? ""} placeholder="Inicio" className={input} />
                  <input name="endDate" defaultValue={edu.endDate ?? ""} placeholder="Fin" className={input} />
                </div>
              </div>
              <textarea name="description" defaultValue={edu.description ?? ""} placeholder="Descripción" className={`${textarea} mt-3`} />
              <div className="mt-3 flex items-center gap-2">
                <SubmitButton>Guardar</SubmitButton>
                <DeleteButton formAction={deleteEducation.bind(null, slug, edu.id)} />
              </div>
            </form>
          ))}
          {educations.length === 0 ? <p className="text-sm text-slate-400">Aún no agregas formación.</p> : null}
        </div>

        <details className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 open:bg-slate-50/50">
          <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-700">
            <Plus className="h-4 w-4" /> Agregar formación
          </summary>
          <form action={addEducation.bind(null, slug)} className="mt-4 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="institution" placeholder="Institución *" required className={input} />
              <input name="degree" placeholder="Grado (ej. Licenciatura)" className={input} />
              <input name="fieldOfStudy" placeholder="Área de estudio" className={input} />
              <div className="flex gap-3">
                <input name="startDate" placeholder="Inicio" className={input} />
                <input name="endDate" placeholder="Fin" className={input} />
              </div>
            </div>
            <textarea name="description" placeholder="Descripción" className={textarea} />
            <div>
              <SubmitButton>Agregar</SubmitButton>
            </div>
          </form>
        </details>
      </section>

      {/* Achievements */}
      <section className={card}>
        <CardHeading icon={Award} title="Reconocimientos" description="Premios, becas o menciones." />

        <form action={addAchievement.bind(null, slug)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={label}>Título *</label>
            <input name="title" required className={input} />
          </div>
          <div className="flex-1">
            <label className={label}>Descripción</label>
            <input name="description" className={input} />
          </div>
          <div className="w-full sm:w-32">
            <label className={label}>Fecha</label>
            <input name="date" className={input} placeholder="2024" />
          </div>
          <SubmitButton>Agregar</SubmitButton>
        </form>

        {achievements.length > 0 ? (
          <ul className="mt-5 flex flex-col divide-y divide-slate-100">
            {achievements.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.title}</p>
                  {a.description ? <p className="text-sm text-slate-500">{a.description}</p> : null}
                </div>
                <form action={deleteAchievement.bind(null, slug, a.id)}>
                  <DeleteButton />
                </form>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
