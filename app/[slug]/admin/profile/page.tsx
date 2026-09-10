import Image from "next/image";
import { UserRound, Camera, Palette } from "lucide-react";
import { requireStudentAccess } from "@/lib/auth/dal";
import { updatPortify, setCvTemplate } from "../actions";
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
  const boundUpdate = updatPortify.bind(null, slug);
  const boundTemplate = setCvTemplate.bind(null, slug);

  return (
    <div className="flex flex-col gap-6">
      <div className={card}>
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <UserRound className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Perfil</h1>
            <p className="text-sm text-slate-500">
              Nombre y carrera son obligatorios para poder publicar.
            </p>
          </div>
        </div>

        <form action={boundUpdate} className="flex flex-col gap-5">
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-slate-200 shadow-sm">
              {student.photoUrl ? (
                <Image src={student.photoUrl} alt="Foto de perfil" fill sizes="80px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <Camera className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="photo" className={label}>
                Foto de perfil
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <p className="mt-1 text-xs text-slate-400">JPG, PNG o WEBP, máx. 5MB.</p>
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
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Palette className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Plantilla del CV en PDF</h2>
            <p className="text-sm text-slate-500">
              El contenido siempre es el mismo que tu perfil publicado.
            </p>
          </div>
        </div>
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
