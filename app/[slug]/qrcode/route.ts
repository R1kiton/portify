import { NextResponse } from "next/server";
import { getVisibleStudent } from "@/lib/public-student";
import { generateQrPng } from "@/lib/qrcode";
import { profileUrl } from "@/lib/url";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const student = await getVisibleStudent(slug);
  if (!student) {
    return NextResponse.json({ error: "Estudiante no encontrado." }, { status: 404 });
  }

  const png = await generateQrPng(profileUrl(slug));

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
