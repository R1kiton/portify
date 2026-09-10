import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const BUCKET = "photos";
let bucketReady: Promise<void> | null = null;

// Vercel's serverless filesystem is read-only, so photos live in Supabase
// Storage instead. The bucket is created lazily on first use.
function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = supabaseAdmin.storage.createBucket(BUCKET, { public: true }).then((res) => {
      if (res.error && !/already exists/i.test(res.error.message)) {
        bucketReady = null;
        throw res.error;
      }
    });
  }
  return bucketReady;
}

export async function savePhotoUpload(file: File, studentId: string): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error("Formato no soportado. Usa una imagen JPG, PNG o WEBP.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo de 5MB.");
  }

  await ensureBucket();

  const filename = `${studentId}-${Date.now()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(filename, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) {
    throw new Error(`No se pudo subir la foto: ${error.message}`);
  }

  return supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}
