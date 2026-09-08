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
        <h1 className="mb-1 text-lg font-semibold text-zinc-900">Proyectos</h1>
        <p className="mb-5 text-sm text-zinc-500">
          Incluye tus proyectos personales, laborales y académicos. Marca los académicos: por transparencia, se
          etiquetan como tales.
        </p>

        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <form
              key={project.id}
              action={updateProject.bind(null, slug, project.id)}
              className="rounded-xl border border-zinc-200 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="name" defaultValue={project.name} placeholder="Nombre *" required className={input} />
                <input name="role" defaultValue={project.role ?? ""} placeholder="Tu rol" className={input} />
                <input name="techStack" defaultValue={project.techStack ?? ""} placeholder="Tecnologías (separadas por coma)" className={input} />
                <input name="url" defaultValue={project.url ?? ""} placeholder="Enlace (opcional)" className={input} />
              </div>
              <textarea name="description" defaultValue={project.description ?? ""} placeholder="Descripción" className={`${textarea} mt-3`} />
              <label className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
                <input type="checkbox" name="isAcademic" defaultChecked={project.isAcademic} />
                Es un proyecto académico
              </label>
              <div className="mt-3 flex items-center gap-2">
                <SubmitButton>Guardar</SubmitButton>
                <DeleteButton formAction={deleteProject.bind(null, slug, project.id)} />
              </div>
            </form>
          ))}
          {projects.length === 0 ? <p className="text-sm text-zinc-400">Aún no agregas proyectos.</p> : null}
        </div>

        <details className="mt-4 rounded-xl border border-dashed border-zinc-300 p-4">
          <summary className="cursor-pointer text-sm font-medium text-zinc-700">+ Agregar proyecto</summary>
          <form action={addProject.bind(null, slug)} className="mt-4 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" placeholder="Nombre *" required className={input} />
              <input name="role" placeholder="Tu rol" className={input} />
              <input name="techStack" placeholder="Tecnologías (separadas por coma)" className={input} />
              <input name="url" placeholder="Enlace (opcional)" className={input} />
            </div>
            <textarea name="description" placeholder="Descripción" className={textarea} />
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input type="checkbox" name="isAcademic" />
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
