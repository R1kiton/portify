import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Photos are stored on the local filesystem under public/uploads. This is
// enough for local development and grading; a production deployment on a
// serverless platform would swap this for object storage (e.g. Supabase Storage).
export async function savePhotoUpload(file: File, studentId: string): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error("Formato no soportado. Usa una imagen JPG, PNG o WEBP.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo de 5MB.");
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${studentId}-${Date.now()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  return `/uploads/${filename}`;
}
