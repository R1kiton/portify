"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Users } from "lucide-react";
import type { DirectoryEntry } from "@/lib/public-student";
import { input } from "@/lib/ui";

const DIACRITICS_REGEX = new RegExp("[̀-ͯ]", "g");

// Strips accents so a search for "garcia" also matches "García".
function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(DIACRITICS_REGEX, "");
}

export function StudentDirectory({ entries }: { entries: DirectoryEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return entries;
    return entries.filter((entry) => {
      const haystack = normalize(`${entry.profile.fullName} ${entry.profile.career}`);
      return haystack.includes(q);
    });
  }, [entries, query]);

  return (
    <div>
      <div className="relative mb-8">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o carrera..."
          className={`${input} py-3 pl-10`}
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <Users className="h-8 w-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">
            {entries.length === 0
              ? "Todavía no hay Prolifys publicados."
              : `Sin resultados para "${query}".`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ slug, profile }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {profile.photoUrl ? (
                    <Image src={profile.photoUrl} alt={profile.fullName} fill sizes="48px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-100 to-violet-100 text-lg font-bold text-indigo-500">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{profile.fullName}</p>
                  <p className="truncate text-sm text-indigo-600">{profile.career}</p>
                </div>
              </div>
              {profile.headline ? (
                <p className="line-clamp-2 text-sm text-slate-500">{profile.headline}</p>
              ) : null}
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition group-hover:text-indigo-600">
                Ver perfil
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
