import { NextResponse } from "next/server";
import { getVisiblePublishedProfile } from "@/lib/public-student";
import { renderCvPdf } from "@/lib/pdf/render";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const profile = await getVisiblePublishedProfile(slug);

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado o no publicado." }, { status: 404 });
  }

  const pdfBuffer = await renderCvPdf(profile);
  const fileSlug = slug.replace(/[^a-z0-9-]/gi, "-");

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cv-${fileSlug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
