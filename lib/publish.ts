import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export type PublishedEducation = {
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
};

export type PublishedExperience = {
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
};

export type PublishedProject = {
  name: string;
  description: string | null;
  techStack: string | null;
  role: string | null;
  url: string | null;
  isAcademic: boolean;
};

export type PublishedSkill = { name: string; category: string };

export type PublishedAchievement = {
  title: string;
  description: string | null;
  date: string | null;
};

export type PublishedProfile = {
  fullName: string;
  career: string;
  headline: string | null;
  photoUrl: string | null;
  contactEmail: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  cvTemplate: string;
  educations: PublishedEducation[];
  experiences: PublishedExperience[];
  projects: PublishedProject[];
  skills: PublishedSkill[];
  achievements: PublishedAchievement[];
};

export function isProfileCompleteEnoughToPublish(student: {
  fullName: string | null;
  career: string | null;
}): boolean {
  return Boolean(student.fullName?.trim() && student.career?.trim());
}

export type ProfileStatus = "vacio" | "borrador" | "publicado";

export function getProfileStatus(student: {
  fullName: string | null;
  career: string | null;
  publishedSnapshot: unknown;
}): ProfileStatus {
  if (student.publishedSnapshot) return "publicado";
  if (student.fullName?.trim() || student.career?.trim()) return "borrador";
  return "vacio";
}

export async function buildSnapshot(studentId: string): Promise<PublishedProfile> {
  const student = await prisma.student.findUniqueOrThrow({
    where: { id: studentId },
    include: {
      educations: { orderBy: { order: "asc" } },
      experiences: { orderBy: { order: "asc" } },
      projects: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } },
      achievements: { orderBy: { order: "asc" } },
    },
  });

  return {
    fullName: student.fullName ?? "",
    career: student.career ?? "",
    headline: student.headline,
    photoUrl: student.photoUrl,
    contactEmail: student.contactEmail,
    phone: student.phone,
    linkedinUrl: student.linkedinUrl,
    githubUrl: student.githubUrl,
    websiteUrl: student.websiteUrl,
    cvTemplate: student.cvTemplate,
    educations: student.educations.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description,
    })),
    experiences: student.experiences.map((e) => ({
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description,
    })),
    projects: student.projects.map((p) => ({
      name: p.name,
      description: p.description,
      techStack: p.techStack,
      role: p.role,
      url: p.url,
      isAcademic: p.isAcademic,
    })),
    skills: student.skills.map((s) => ({ name: s.name, category: s.category })),
    achievements: student.achievements.map((a) => ({
      title: a.title,
      description: a.description,
      date: a.date,
    })),
  };
}

export class ProfileIncompleteError extends Error {}

export async function publishStudent(studentId: string): Promise<void> {
  const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId } });

  if (!isProfileCompleteEnoughToPublish(student)) {
    throw new ProfileIncompleteError(
      "Completa al menos el nombre y la carrera antes de publicar."
    );
  }

  const snapshot = await buildSnapshot(studentId);

  await prisma.student.update({
    where: { id: studentId },
    data: {
      publishedSnapshot: snapshot as unknown as Prisma.InputJsonValue,
      publishedAt: new Date(),
    },
  });
}

export function getPublishedProfile(student: {
  publishedSnapshot: unknown;
}): PublishedProfile | null {
  if (!student.publishedSnapshot) return null;
  return student.publishedSnapshot as PublishedProfile;
}
