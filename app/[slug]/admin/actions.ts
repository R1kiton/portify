"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStudentAccess } from "@/lib/auth/dal";
import { savePhotoUpload } from "@/lib/uploads";
import { publishStudent, ProfileIncompleteError } from "@/lib/publish";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function revalidateStudent(slug: string) {
  revalidatePath(`/${slug}/admin`);
  revalidatePath(`/${slug}/admin/profile`);
  revalidatePath(`/${slug}/admin/cv`);
  revalidatePath(`/${slug}/admin/skills`);
  revalidatePath(`/${slug}/admin/projects`);
  revalidatePath(`/${slug}/admin/preview`);
  revalidatePath(`/${slug}`);
}

// ---------- Profile ----------

export async function updatPortify(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);

  let photoUrl = student.photoUrl;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    photoUrl = await savePhotoUpload(photo, student.id);
  }

  await prisma.student.update({
    where: { id: student.id },
    data: {
      fullName: str(formData, "fullName"),
      career: str(formData, "career"),
      headline: str(formData, "headline"),
      contactEmail: str(formData, "contactEmail"),
      phone: str(formData, "phone"),
      linkedinUrl: str(formData, "linkedinUrl"),
      githubUrl: str(formData, "githubUrl"),
      websiteUrl: str(formData, "websiteUrl"),
      photoUrl,
    },
  });

  revalidateStudent(slug);
}

export async function setCvTemplate(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  const template = str(formData, "cvTemplate") ?? "classic";
  await prisma.student.update({ where: { id: student.id }, data: { cvTemplate: template } });
  revalidateStudent(slug);
}

export type PublishResult = { error?: string } | undefined;

export async function publishAction(
  slug: string,
  _prevState: PublishResult,
  _formData: FormData
): Promise<PublishResult> {
  const { student } = await requireStudentAccess(slug);
  try {
    await publishStudent(student.id);
  } catch (error) {
    if (error instanceof ProfileIncompleteError) {
      return { error: error.message };
    }
    throw error;
  }
  revalidateStudent(slug);
  return undefined;
}

// ---------- Education ----------

export async function addEducation(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  const institution = str(formData, "institution");
  if (!institution) return;

  const count = await prisma.education.count({ where: { studentId: student.id } });
  await prisma.education.create({
    data: {
      studentId: student.id,
      institution,
      degree: str(formData, "degree"),
      fieldOfStudy: str(formData, "fieldOfStudy"),
      startDate: str(formData, "startDate"),
      endDate: str(formData, "endDate"),
      description: str(formData, "description"),
      order: count,
    },
  });
  revalidateStudent(slug);
}

export async function updateEducation(slug: string, id: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  await prisma.education.updateMany({
    where: { id, studentId: student.id },
    data: {
      institution: str(formData, "institution") ?? "",
      degree: str(formData, "degree"),
      fieldOfStudy: str(formData, "fieldOfStudy"),
      startDate: str(formData, "startDate"),
      endDate: str(formData, "endDate"),
      description: str(formData, "description"),
    },
  });
  revalidateStudent(slug);
}

export async function deleteEducation(slug: string, id: string) {
  const { student } = await requireStudentAccess(slug);
  await prisma.education.deleteMany({ where: { id, studentId: student.id } });
  revalidateStudent(slug);
}

// ---------- Experience ----------

export async function addExperience(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  const company = str(formData, "company");
  const role = str(formData, "role");
  if (!company || !role) return;

  const count = await prisma.experience.count({ where: { studentId: student.id } });
  await prisma.experience.create({
    data: {
      studentId: student.id,
      company,
      role,
      startDate: str(formData, "startDate"),
      endDate: str(formData, "endDate"),
      description: str(formData, "description"),
      order: count,
    },
  });
  revalidateStudent(slug);
}

export async function updateExperience(slug: string, id: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  await prisma.experience.updateMany({
    where: { id, studentId: student.id },
    data: {
      company: str(formData, "company") ?? "",
      role: str(formData, "role") ?? "",
      startDate: str(formData, "startDate"),
      endDate: str(formData, "endDate"),
      description: str(formData, "description"),
    },
  });
  revalidateStudent(slug);
}

export async function deleteExperience(slug: string, id: string) {
  const { student } = await requireStudentAccess(slug);
  await prisma.experience.deleteMany({ where: { id, studentId: student.id } });
  revalidateStudent(slug);
}

// ---------- Achievements ----------

export async function addAchievement(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  const title = str(formData, "title");
  if (!title) return;

  const count = await prisma.achievement.count({ where: { studentId: student.id } });
  await prisma.achievement.create({
    data: {
      studentId: student.id,
      title,
      description: str(formData, "description"),
      date: str(formData, "date"),
      order: count,
    },
  });
  revalidateStudent(slug);
}

export async function deleteAchievement(slug: string, id: string) {
  const { student } = await requireStudentAccess(slug);
  await prisma.achievement.deleteMany({ where: { id, studentId: student.id } });
  revalidateStudent(slug);
}

// ---------- Skills ----------

export async function addSkill(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  const name = str(formData, "name");
  if (!name) return;

  const count = await prisma.skill.count({ where: { studentId: student.id } });
  await prisma.skill.create({
    data: {
      studentId: student.id,
      name,
      category: str(formData, "category") ?? "Técnicas",
      order: count,
    },
  });
  revalidateStudent(slug);
}

export async function deleteSkill(slug: string, id: string) {
  const { student } = await requireStudentAccess(slug);
  await prisma.skill.deleteMany({ where: { id, studentId: student.id } });
  revalidateStudent(slug);
}

// ---------- Projects ----------

export async function addProject(slug: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  const name = str(formData, "name");
  if (!name) return;

  const count = await prisma.project.count({ where: { studentId: student.id } });
  await prisma.project.create({
    data: {
      studentId: student.id,
      name,
      description: str(formData, "description"),
      techStack: str(formData, "techStack"),
      role: str(formData, "role"),
      url: str(formData, "url"),
      isAcademic: formData.get("isAcademic") === "on",
      order: count,
    },
  });
  revalidateStudent(slug);
}

export async function updateProject(slug: string, id: string, formData: FormData) {
  const { student } = await requireStudentAccess(slug);
  await prisma.project.updateMany({
    where: { id, studentId: student.id },
    data: {
      name: str(formData, "name") ?? "",
      description: str(formData, "description"),
      techStack: str(formData, "techStack"),
      role: str(formData, "role"),
      url: str(formData, "url"),
      isAcademic: formData.get("isAcademic") === "on",
    },
  });
  revalidateStudent(slug);
}

export async function deleteProject(slug: string, id: string) {
  const { student } = await requireStudentAccess(slug);
  await prisma.project.deleteMany({ where: { id, studentId: student.id } });
  revalidateStudent(slug);
}
