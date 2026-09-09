"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  GraduationCap,
  FolderGit2,
  Sparkles,
  Eye,
} from "lucide-react";
import { navLink, navLinkActive } from "@/lib/ui";

const NAV_ITEMS = [
  { href: "", label: "Resumen", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: UserRound },
  { href: "/cv", label: "Formación y experiencia", icon: GraduationCap },
  { href: "/projects", label: "Proyectos", icon: FolderGit2 },
  { href: "/skills", label: "Habilidades", icon: Sparkles },
  { href: "/preview", label: "Vista previa", icon: Eye },
];

export function AdminNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/${slug}/admin`;

  return (
    <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {NAV_ITEMS.map((item) => {
        const href = `${base}${item.href}`;
        const isActive = item.href === "" ? pathname === base : pathname?.startsWith(href);
        return (
          <li key={item.href} className="shrink-0 lg:shrink">
            <Link
              href={href}
              className={`${isActive ? navLinkActive : navLink} whitespace-nowrap lg:whitespace-normal`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
