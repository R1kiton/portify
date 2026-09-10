import { Sparkles } from "lucide-react";
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
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Habilidades</h1>
            <p className="text-sm text-slate-500">Agrúpalas por categoría para que se lean más claras.</p>
          </div>
        </div>

        <form action={addSkill.bind(null, slug)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={label}>Habilidad *</label>
            <input name="name" required className={input} placeholder="Ej. React" />
          </div>
          <div className="w-full sm:w-48">
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
        <p className="text-sm text-slate-400">Aún no agregas habilidades.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className={card}>
            <h2 className="mb-3 text-sm font-semibold text-slate-700">{category}</h2>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <form
                  key={skill.id}
                  action={deleteSkill.bind(null, slug, skill.id)}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 py-1.5 pl-3.5 pr-1.5 text-emerald-700"
                >
                  <span className="text-sm font-medium">{skill.name}</span>
                  <DeleteButton iconOnly confirmMessage={`¿Eliminar "${skill.name}"?`} />
                </form>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
