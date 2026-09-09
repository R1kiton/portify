import "server-only";
import { prisma } from "@/lib/prisma";
import { getPublishedProfile, type PublishedProfile } from "@/lib/publish";

// A deactivated account's Portify must stop being visible to visitors,
// even though its published snapshot is still in the database.
export async function getVisibleStudent(slug: string) {
  const student = await prisma.student.findUnique({ where: { slug }, include: { user: true } });
  if (!student || !student.user.active) return null;
  return student;
}

export async function getVisiblePublishedProfile(slug: string): Promise<PublishedProfile | null> {
  const student = await getVisibleStudent(slug);
  if (!student) return null;
  return getPublishedProfile(student);
}

export type DirectoryEntry = { slug: string; profile: PublishedProfile };

// Every published, active profile — used by the public directory (/estudiantes).
export async function listPublishedProfiles(): Promise<DirectoryEntry[]> {
  const students = await prisma.student.findMany({
    where: { user: { active: true } },
    include: { user: true },
    orderBy: { publishedAt: "desc" },
  });

  return students
    .map((student) => {
      const profile = getPublishedProfile(student);
      return profile ? { slug: student.slug, profile } : null;
    })
    .filter((entry): entry is DirectoryEntry => entry !== null);
}
