import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI commands (migrate, db push, introspect) talk to Postgres directly,
// so they use DIRECT_URL. The app itself talks to the pooled connection
// (DATABASE_URL) at runtime via the driver adapter in lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
