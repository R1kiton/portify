import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { UserRole } from "../app/generated/prisma/enums";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function hash(plain: string) {
  return bcrypt.hash(plain, 10);
}

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@Prolify.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await hash(adminPassword),
      role: UserRole.PLATFORM_ADMIN,
    },
  });
  console.log(`Platform admin ready: ${adminEmail} / ${adminPassword}`);

  const demoEmail = "demo.estudiante@Prolify.com";
  const demoPassword = "Demo1234!";
  const demoSlug = "demo";

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      passwordHash: await hash(demoPassword),
      role: UserRole.STUDENT,
      student: {
        create: {
          slug: demoSlug,
          fullName: "Estudiante Demo",
          career: "Ingeniería en Sistemas",
          headline:
            "Estudiante de últimos semestres interesado en desarrollo web y nuevas tecnologías.",
          contactEmail: demoEmail,
          linkedinUrl: "https://linkedin.com/in/demo",
          githubUrl: "https://github.com/demo",
        },
      },
    },
    include: { student: true },
  });

  const studentId = demoUser.student!.id;

  const existingEducation = await prisma.education.count({ where: { studentId } });
  if (existingEducation === 0) {
    await prisma.education.create({
      data: {
        studentId,
        institution: "Universidad Demo",
        degree: "Ingeniería en Sistemas Computacionales",
        fieldOfStudy: "Desarrollo de software",
        startDate: "2022",
        endDate: "Presente",
        order: 0,
      },
    });

    await prisma.experience.create({
      data: {
        studentId,
        company: "Prácticas Profesionales S.A.",
        role: "Desarrollador Frontend (practicante)",
        startDate: "2024",
        endDate: "Presente",
        description: "Construcción de interfaces con React y Next.js.",
        order: 0,
      },
    });

    await prisma.project.createMany({
      data: [
        {
          studentId,
          name: "Plataforma Prolify",
          description: "Tarjeta de presentación digital construida como proyecto integrador.",
          techStack: "Next.js, Prisma, PostgreSQL",
          role: "Desarrollador full-stack",
          isAcademic: true,
          order: 0,
        },
        {
          studentId,
          name: "App de tareas",
          description: "Aplicación personal para organizar pendientes.",
          techStack: "React, TypeScript",
          isAcademic: false,
          order: 1,
        },
      ],
    });

    await prisma.skill.createMany({
      data: [
        { studentId, name: "JavaScript", category: "Técnicas", order: 0 },
        { studentId, name: "React", category: "Técnicas", order: 1 },
        { studentId, name: "Trabajo en equipo", category: "Blandas", order: 2 },
      ],
    });

    await prisma.achievement.create({
      data: {
        studentId,
        title: "Beca de excelencia académica",
        date: "2023",
        order: 0,
      },
    });
  }

  console.log(`Demo student ready: ${demoEmail} / ${demoPassword} (slug: ${demoSlug})`);
  console.log("Publish the demo profile from its admin panel to see it live at /" + demoSlug);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
