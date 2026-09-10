import { FolderGit2, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireStudentAccess } from "@/lib/auth/dal";
import { addProject, updateProject, deleteProject } from "../actions";
import { card, input, textarea } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";
import { DeleteButton } from "@/components/delete-button";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student } = await requireStudentAccess(slug);
  const projects = await prisma.project.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FolderGit2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Proyectos</h1>
            <p className="text-sm text-slate-500">
              Incluye proyectos personales, laborales y académicos. Marca los académicos: por
              transparencia, se etiquetan como tales.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <form
              key={project.id}
              action={updateProject.bind(null, slug, project.id)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="name" defaultValue={project.name} placeholder="Nombre *" required className={input} />
                <input name="role" defaultValue={project.role ?? ""} placeholder="Tu rol" className={input} />
                <input name="techStack" defaultValue={project.techStack ?? ""} placeholder="Tecnologías (separadas por coma)" className={input} />
                <input name="url" defaultValue={project.url ?? ""} placeholder="Enlace (opcional)" className={input} />
              </div>
              <textarea name="description" defaultValue={project.description ?? ""} placeholder="Descripción" className={`${textarea} mt-3`} />
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" name="isAcademic" defaultChecked={project.isAcademic} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                Es un proyecto académico
              </label>
              <div className="mt-3 flex items-center gap-2">
                <SubmitButton>Guardar</SubmitButton>
                <DeleteButton formAction={deleteProject.bind(null, slug, project.id)} />
              </div>
            </form>
          ))}
          {projects.length === 0 ? <p className="text-sm text-slate-400">Aún no agregas proyectos.</p> : null}
        </div>

        <details className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 open:bg-slate-50/50">
          <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-700">
            <Plus className="h-4 w-4" /> Agregar proyecto
          </summary>
          <form action={addProject.bind(null, slug)} className="mt-4 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" placeholder="Nombre *" required className={input} />
              <input name="role" placeholder="Tu rol" className={input} />
              <input name="techStack" placeholder="Tecnologías (separadas por coma)" className={input} />
              <input name="url" placeholder="Enlace (opcional)" className={input} />
            </div>
            <textarea name="description" placeholder="Descripción" className={textarea} />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="isAcademic" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              Es un proyecto académico
            </label>
            <div>
              <SubmitButton>Agregar</SubmitButton>
            </div>
          </form>
        </details>
      </div>
    </div>
  );
}
