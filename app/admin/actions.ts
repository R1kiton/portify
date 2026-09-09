"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePlatformAdmin } from "@/lib/auth/dal";
import { hashPassword, generateTempPassword } from "@/lib/auth/password";
import { UserRole } from "@/app/generated/prisma/enums";

const RESERVED_SLUGS = ["admin", "login", "api", "estudiantes"];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const CreateStudentSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre es obligatorio."),
  email: z.string().trim().toLowerCase().email("Correo inválido."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(SLUG_RE, "Usa solo minúsculas, números y guiones (ej. luis-jz)."),
});

export type CreateStudentState =
  | { error: string; success?: undefined }
  | { error?: undefined; success: { slug: string; email: string; tempPassword: string } }
  | undefined;

export async function createStudentAction(
  _prevState: CreateStudentState,
  formData: FormData
): Promise<CreateStudentState> {
  await requirePlatformAdmin();

  const parsed = CreateStudentSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { fullName, email, slug } = parsed.data;

  if (RESERVED_SLUGS.includes(slug)) {
    return { error: "Esa dirección está reservada. Elige otra." };
  }

  const [existingEmail, existingSlug] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.student.findUnique({ where: { slug } }),
  ]);
  if (existingEmail) return { error: "Ya existe una cuenta con ese correo." };
  if (existingSlug) return { error: "Esa dirección ya está en uso." };

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole.STUDENT,
      student: { create: { slug, fullName } },
    },
  });

  revalidatePath("/admin");
  return { success: { slug, email, tempPassword } };
}

export async function toggleActiveAction(userId: string, _formData: FormData) {
  await requirePlatformAdmin();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  await prisma.user.update({ where: { id: userId }, data: { active: !user.active } });
  revalidatePath("/admin");
}

export async function deleteStudentAction(userId: string, _formData: FormData) {
  await requirePlatformAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
}

export type ResetPasswordState = { tempPassword?: string; error?: string } | undefined;

export async function resetPasswordAction(
  userId: string,
  _prevState: ResetPasswordState,
  _formData: FormData
): Promise<ResetPasswordState> {
  await requirePlatformAdmin();
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  revalidatePath("/admin");
  return { tempPassword };
}
