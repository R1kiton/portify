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
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const href = `${base}${item.href}`;
        const isActive = item.href === "" ? pathname === base : pathname?.startsWith(href);
        return (
          <li key={item.href}>
            <Link href={href} className={isActive ? navLinkActive : navLink}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
