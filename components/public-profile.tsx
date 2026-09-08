import Image from "next/image";
import Link from "next/link";
import type { PublishedProfile } from "@/lib/publish";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
      {children}
    </h2>
  );
}

function dateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  return `${start ?? ""} — ${end || "Presente"}`;
}

export function PublicProfile({
  profile,
  slug,
}: {
  profile: PublishedProfile;
  slug: string;
}) {
  const contactLinks = [
    profile.linkedinUrl && { label: "LinkedIn", href: profile.linkedinUrl },
    profile.githubUrl && { label: "GitHub", href: profile.githubUrl },
    profile.websiteUrl && { label: "Sitio web", href: profile.websiteUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-14">
      {/* 1. Lo esencial */}
      <section className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
          {profile.photoUrl ? (
            <Image src={profile.photoUrl} alt={profile.fullName} fill sizes="112px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-zinc-400">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{profile.fullName}</h1>
          <p className="mt-1 text-lg text-zinc-600">{profile.career}</p>
          {profile.headline ? <p className="mt-2 max-w-xl text-zinc-500">{profile.headline}</p> : null}
        </div>
      </section>

      {/* Acciones: CV, vCard, tarjeta */}
      <section className="flex flex-wrap gap-3 border-y border-zinc-200 py-4">
        <a
          href={`/${slug}/cv.pdf`}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Descargar CV (PDF)
        </a>
        <a
          href={`/${slug}/vcard`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Guardar contacto (vCard)
        </a>
        <Link
          href={`/${slug}/card`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Tarjeta con QR
        </Link>
      </section>

      {/* 2. Lo detallado */}
      {profile.experiences.length > 0 && (
        <section>
          <SectionTitle>Experiencia</SectionTitle>
          <div className="flex flex-col gap-5">
            {profile.experiences.map((e, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium text-zinc-900">{e.role} · {e.company}</p>
                  <p className="text-sm text-zinc-500">{dateRange(e.startDate, e.endDate)}</p>
                </div>
                {e.description ? <p className="mt-1 text-sm text-zinc-600">{e.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.educations.length > 0 && (
        <section>
          <SectionTitle>Formación</SectionTitle>
          <div className="flex flex-col gap-5">
            {profile.educations.map((e, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium text-zinc-900">{e.institution}</p>
                  <p className="text-sm text-zinc-500">{dateRange(e.startDate, e.endDate)}</p>
                </div>
                {(e.degree || e.fieldOfStudy) && (
                  <p className="text-sm text-zinc-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(" · ")}</p>
                )}
                {e.description ? <p className="mt-1 text-sm text-zinc-600">{e.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.projects.length > 0 && (
        <section>
          <SectionTitle>Proyectos</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.projects.map((p, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">{p.name}</p>
                  {p.isAcademic ? (
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Académico
                    </span>
                  ) : null}
                </div>
                {p.role ? <p className="text-sm text-zinc-500">{p.role}</p> : null}
                {p.description ? <p className="mt-1 text-sm text-zinc-600">{p.description}</p> : null}
                {p.techStack ? <p className="mt-1 text-xs text-zinc-400">{p.techStack}</p> : null}
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-zinc-900 underline">
                    Ver proyecto
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.achievements.length > 0 && (
        <section>
          <SectionTitle>Reconocimientos</SectionTitle>
          <div className="flex flex-col gap-3">
            {profile.achievements.map((a, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="font-medium text-zinc-900">{a.title}</p>
                {a.date ? <p className="text-sm text-zinc-500">{a.date}</p> : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section>
          <SectionTitle>Habilidades</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span key={i} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {(contactLinks.length > 0 || profile.contactEmail || profile.phone) && (
        <section>
          <SectionTitle>Contacto</SectionTitle>
          <div className="flex flex-wrap gap-3">
            {profile.contactEmail ? (
              <a href={`mailto:${profile.contactEmail}`} className="text-sm font-medium text-zinc-900 underline">
                {profile.contactEmail}
              </a>
            ) : null}
            {profile.phone ? <span className="text-sm text-zinc-700">{profile.phone}</span> : null}
            {contactLinks.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-900 underline">
                {l.label}
              </a>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-6 text-center text-xs text-zinc-400">
        EProfile · eprofile.com/{slug}
      </footer>
    </div>
  );
}
