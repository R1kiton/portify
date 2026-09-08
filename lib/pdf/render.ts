import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { CvDocument } from "@/lib/pdf/cv-document";
import type { PublishedProfile } from "@/lib/publish";

export async function renderCvPdf(profile: PublishedProfile): Promise<Buffer> {
  return renderToBuffer(CvDocument({ profile }));
}
