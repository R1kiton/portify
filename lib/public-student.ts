import "server-only";
import { prisma } from "@/lib/prisma";
import { getPublishedProfile, type PublishedProfile } from "@/lib/publish";

// A deactivated account's EProfile must stop being visible to visitors,
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
