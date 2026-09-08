import { NextResponse } from "next/server";
import { getVisiblePublishedProfile } from "@/lib/public-student";
import { buildVCard } from "@/lib/vcard";
import { profileUrl } from "@/lib/url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const profile = await getVisiblePublishedProfile(slug);

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado o no publicado." }, { status: 404 });
  }

  const vcard = buildVCard(profile, profileUrl(slug));
  const fileSlug = slug.replace(/[^a-z0-9-]/gi, "-");

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileSlug}.vcf"`,
      "Cache-Control": "no-store",
    },
  });
}
