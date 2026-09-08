import Image from "next/image";
import { requireStudentAccess } from "@/lib/auth/dal";
import { updateProfile, setCvTemplate } from "../actions";
import { CV_TEMPLATES } from "@/lib/pdf/cv-document";
import { card, input, label, textarea } from "@/lib/ui";
import { SubmitButton } from "@/components/submit-button";

export default async function ProfileEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student } = await requireStudentAccess(slug);
  const boundUpdate = updateProfile.bind(null, slug);
  const boundTemplate = setCvTemplate.bind(null, slug);

  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
        <h1 className="mb-1 text-lg font-semibold text-zinc-900">Perfil</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Nombre y carrera son obligatorios para poder publicar.
        </p>

        <form action={boundUpdate} className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
              {student.photoUrl ? (
                <Image src={student.photoUrl} alt="Foto de perfil" fill sizes="80px" className="object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <label htmlFor="photo" className={label}>
                Foto de perfil
              </label>
              <input id="photo" name="photo" type="file" accept="image/png,image/jpeg,image/webp" className="text-sm" />
              <p className="mt-1 text-xs text-zinc-400">JPG, PNG o WEBP, máx. 5MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className={label}>
                Nombre completo *
              </label>
              <input id="fullName" name="fullName" defaultValue={student.fullName ?? ""} required className={input} />
            </div>
            <div>
              <label htmlFor="career" className={label}>
                Carrera / profesión *
              </label>
              <input id="career" name="career" defaultValue={student.career ?? ""} required className={input} />
            </div>
          </div>

          <div>
            <label htmlFor="headline" className={label}>
              Reseña breve
            </label>
            <textarea id="headline" name="headline" defaultValue={student.headline ?? ""} className={textarea} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactEmail" className={label}>
                Correo de contacto
              </label>
              <input id="contactEmail" name="contactEmail" type="email" defaultValue={student.contactEmail ?? ""} className={input} />
            </div>
            <div>
              <label htmlFor="phone" className={label}>
                Teléfono
              </label>
              <input id="phone" name="phone" defaultValue={student.phone ?? ""} className={input} />
            </div>
            <div>
              <label htmlFor="linkedinUrl" className={label}>
                LinkedIn
              </label>
              <input id="linkedinUrl" name="linkedinUrl" defaultValue={student.linkedinUrl ?? ""} className={input} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label htmlFor="githubUrl" className={label}>
                GitHub
              </label>
              <input id="githubUrl" name="githubUrl" defaultValue={student.githubUrl ?? ""} className={input} placeholder="https://github.com/..." />
            </div>
            <div>
              <label htmlFor="websiteUrl" className={label}>
                Sitio web
              </label>
              <input id="websiteUrl" name="websiteUrl" defaultValue={student.websiteUrl ?? ""} className={input} />
            </div>
          </div>

          <div>
            <SubmitButton>Guardar cambios</SubmitButton>
          </div>
        </form>
      </div>

      <div className={card}>
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">Plantilla del CV en PDF</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Elige el estilo con el que se genera tu CV descargable. El contenido siempre es el mismo que tu perfil publicado.
        </p>
        <form action={boundTemplate} className="flex flex-wrap items-center gap-3">
          <select name="cvTemplate" defaultValue={student.cvTemplate} className={`${input} w-auto`}>
            {CV_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <SubmitButton>Guardar plantilla</SubmitButton>
        </form>
      </div>
    </div>
  );
}
