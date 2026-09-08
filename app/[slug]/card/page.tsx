import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getVisiblePublishedProfile } from "@/lib/public-student";
import { profileUrl } from "@/lib/url";
import { PrintButton } from "./print-button";

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getVisiblePublishedProfile(slug);
  if (!profile) notFound();

  const url = profileUrl(slug);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="print:hidden">
        <Link href={`/${slug}`} className="text-sm text-zinc-500 hover:text-zinc-800">
          ← Volver al perfil
        </Link>
      </div>

      <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm print:border-0 print:shadow-none">
        <Image
          src={`/${slug}/qrcode`}
          alt={`Código QR de ${profile.fullName}`}
          width={220}
          height={220}
          unoptimized
        />
        <div>
          <p className="text-xl font-semibold text-zinc-900">{profile.fullName}</p>
          <p className="text-sm text-zinc-500">{profile.career}</p>
        </div>
        <p className="break-all text-sm font-medium text-zinc-700">{url}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <PrintButton />
        <a
          href={`/${slug}/vcard`}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Guardar contacto (vCard)
        </a>
      </div>
    </div>
  );
}
