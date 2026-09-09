import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listPublishedProfiles } from "@/lib/public-student";
import { StudentDirectory } from "@/components/student-directory";

export const metadata = { title: "Estudiantes — EProfile" };

// Must be rendered per-request: this list changes every time someone
// publishes, and there are no dynamic params here to force that by default.
export const dynamic = "force-dynamic";

export default async function StudentsDirectoryPage() {
  const entries = await listPublishedProfiles();

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(79,70,229,0.10),transparent)]"
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          EProfile
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Estudiantes
        </h1>
        <p className="mt-2 max-w-xl text-slate-600">
          Explora las tarjetas de presentación digitales ya publicadas.
          {entries.length > 0 ? ` ${entries.length} en total.` : ""}
        </p>

        <div className="mt-8">
          <StudentDirectory entries={entries} />
        </div>
      </div>
    </div>
  );
}
