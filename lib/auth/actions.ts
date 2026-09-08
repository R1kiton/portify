"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";

export type LoginState = { error?: string } | undefined;

const LoginSchema = z.object({
  email: z.string().trim().min(1, "Ingresa tu correo."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Correo y contraseña son obligatorios." };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { student: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Correo o contraseña incorrectos." };
  }

  if (!user.active) {
    return { error: "Esta cuenta está desactivada. Contacta al administrador de la plataforma." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    studentId: user.student?.id,
    slug: user.student?.slug,
  });

  if (user.role === UserRole.PLATFORM_ADMIN) {
    redirect("/admin");
  }

  redirect(`/${user.student!.slug}/admin`);
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
