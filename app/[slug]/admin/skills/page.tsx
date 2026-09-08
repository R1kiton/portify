import { prisma } from "@/lib/prisma";
import { requireStudentAccess } from "@/lib/auth/dal";
import { addSkill, deleteSkill } from "../actions";
import { card, input, label } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";
import { DeleteButton } from "@/components/delete-button";

const CATEGORIES = ["Técnicas", "Blandas", "Idiomas", "Herramientas"];

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student } = await requireStudentAccess(slug);
  const skills = await prisma.skill.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "asc" },
  });

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
        <h1 className="mb-1 text-lg font-semibold text-zinc-900">Habilidades</h1>
        <p className="mb-5 text-sm text-zinc-500">Agrúpalas por categoría para que se lean más claras.</p>

        <form action={addSkill.bind(null, slug)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={label}>Habilidad *</label>
            <input name="name" required className={input} placeholder="Ej. React" />
          </div>
          <div className="w-48">
            <label className={label}>Categoría</label>
            <select name="category" defaultValue="Técnicas" className={input}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <SubmitButton>Agregar</SubmitButton>
        </form>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-zinc-400">Aún no agregas habilidades.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className={card}>
            <h2 className="mb-3 text-sm font-semibold text-zinc-700">{category}</h2>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <form key={skill.id} action={deleteSkill.bind(null, slug, skill.id)} className="flex items-center gap-1 rounded-full bg-zinc-100 py-1 pl-3 pr-1">
                  <span className="text-sm text-zinc-700">{skill.name}</span>
                  <DeleteButton label="×" confirmMessage={`¿Eliminar "${skill.name}"?`} />
                </form>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
