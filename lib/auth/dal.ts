import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession, type SessionPayload } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";

// Memoized per-request: cheap to call from many components.
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  return readSession();
});

// Use in Server Components/layouts that require *any* signed-in user.
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

// Use for platform-admin-only routes (/admin/**).
export async function requirePlatformAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== UserRole.PLATFORM_ADMIN) {
    notFound();
  }
  return session;
}

// Memoized per request: the layout and the page for the same route both
// call requireStudentAccess, so this avoids querying twice per request.
const getStudentBySlug = cache(async (slug: string) => {
  return prisma.student.findUnique({ where: { slug } });
});

// Use for a specific student's panel (/[slug]/admin/**).
// Platform admins may manage any student; a student may only manage their own.
export async function requireStudentAccess(slug: string) {
  const session = await requireSession();

  const student = await getStudentBySlug(slug);
  if (!student) notFound();

  const isOwner = session.role === UserRole.STUDENT && session.studentId === student.id;
  const isAdmin = session.role === UserRole.PLATFORM_ADMIN;

  if (!isOwner && !isAdmin) {
    notFound();
  }

  return { session, student, isAdmin };
}
