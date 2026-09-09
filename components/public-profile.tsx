import Image from "next/image";
import Link from "next/link";
import {
  FileDown,
  Contact,
  QrCode,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Sparkles,
  Mail,
  Phone,
  Users,
  GitBranch,
  Globe,
  ExternalLink,
} from "lucide-react";
import type { PublishedProfile } from "@/lib/publish";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
      <Icon className="h-4 w-4 text-indigo-500" />
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
    profile.linkedinUrl && { label: "LinkedIn", href: profile.linkedinUrl, icon: Users },
    profile.githubUrl && { label: "GitHub", href: profile.githubUrl, icon: GitBranch },
    profile.websiteUrl && { label: "Sitio web", href: profile.websiteUrl, icon: Globe },
  ].filter(Boolean) as { label: string; href: string; icon: typeof Globe }[];

  return (
    <div className="mx-auto w-full max-w-3xl pb-16">
      {/* Cover + header */}
      <div className="relative h-40 w-full overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-500 sm:h-48">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]"
        />
      </div>

      <div className="px-6">
        <div className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16 sm:flex-row sm:items-end sm:text-left">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg sm:h-32 sm:w-32">
            {profile.photoUrl ? (
              <Image src={profile.photoUrl} alt={profile.fullName} fill sizes="128px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-100 to-violet-100 text-4xl font-bold text-indigo-500">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="sm:pb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{profile.fullName}</h1>
            <p className="mt-1 text-lg font-medium text-indigo-600">{profile.career}</p>
          </div>
        </div>

        {profile.headline ? (
          <p className="mx-auto mt-5 max-w-xl text-center text-slate-600 sm:mx-0 sm:text-left">
            {profile.headline}
          </p>
        ) : null}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 border-b border-slate-200 pb-8 sm:justify-start">
          <a
            href={`/${slug}/cv.pdf`}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            <FileDown className="h-4 w-4" />
            Descargar CV
          </a>
          <a
            href={`/${slug}/vcard`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Contact className="h-4 w-4" />
            Guardar contacto
          </a>
          <Link
            href={`/${slug}/card`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <QrCode className="h-4 w-4" />
            Tarjeta con QR
          </Link>
        </div>

        <div className="flex flex-col gap-10 pt-8">
          {profile.experiences.length > 0 && (
            <section>
              <SectionTitle icon={Briefcase}>Experiencia</SectionTitle>
              <div className="flex flex-col gap-6 border-l-2 border-slate-100 pl-5">
                {profile.experiences.map((e, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6.5 top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-semibold text-slate-900">
                        {e.role} <span className="font-normal text-slate-400">·</span> {e.company}
                      </p>
                      <p className="text-sm text-slate-400">{dateRange(e.startDate, e.endDate)}</p>
                    </div>
                    {e.description ? <p className="mt-1 text-sm text-slate-600">{e.description}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {profile.educations.length > 0 && (
            <section>
              <SectionTitle icon={GraduationCap}>Formación</SectionTitle>
              <div className="flex flex-col gap-6 border-l-2 border-slate-100 pl-5">
                {profile.educations.map((e, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-6.5 top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-semibold text-slate-900">{e.institution}</p>
                      <p className="text-sm text-slate-400">{dateRange(e.startDate, e.endDate)}</p>
                    </div>
                    {(e.degree || e.fieldOfStudy) && (
                      <p className="text-sm text-slate-500">{[e.degree, e.fieldOfStudy].filter(Boolean).join(" · ")}</p>
                    )}
                    {e.description ? <p className="mt-1 text-sm text-slate-600">{e.description}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {profile.projects.length > 0 && (
            <section>
              <SectionTitle icon={FolderGit2}>Proyectos</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.projects.map((p, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      {p.isAcademic ? (
                        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          Académico
                        </span>
                      ) : null}
                    </div>
                    {p.role ? <p className="text-sm text-indigo-600">{p.role}</p> : null}
                    {p.description ? <p className="mt-1.5 text-sm text-slate-600">{p.description}</p> : null}
                    {p.techStack ? (
                      <p className="mt-2 text-xs font-medium text-slate-400">{p.techStack}</p>
                    ) : null}
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Ver proyecto
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {profile.achievements.length > 0 && (
            <section>
              <SectionTitle icon={Award}>Reconocimientos</SectionTitle>
              <div className="flex flex-col gap-3">
                {profile.achievements.map((a, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 rounded-lg bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      {a.description ? <p className="text-sm text-slate-500">{a.description}</p> : null}
                    </div>
                    {a.date ? <p className="text-sm text-slate-400">{a.date}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {profile.skills.length > 0 && (
            <section>
              <SectionTitle icon={Sparkles}>Habilidades</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(contactLinks.length > 0 || profile.contactEmail || profile.phone) && (
            <section>
              <SectionTitle icon={Contact}>Contacto</SectionTitle>
              <div className="flex flex-wrap gap-3">
                {profile.contactEmail ? (
                  <a
                    href={`mailto:${profile.contactEmail}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
                  >
                    <Mail className="h-4 w-4" />
                    {profile.contactEmail}
                  </a>
                ) : null}
                {profile.phone ? (
                  <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </span>
                ) : null}
                {contactLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-14 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          EProfile · eprofile.com/{slug}
        </footer>
      </div>
    </div>
  );
}
