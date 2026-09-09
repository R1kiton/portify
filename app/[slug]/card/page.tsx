import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Contact } from "lucide-react";
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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-10 sm:px-6 sm:py-16 print:bg-white">
      <div className="self-start print:hidden">
        <Link
          href={`/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al perfil
        </Link>
      </div>

      <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-8 print:border-0 print:shadow-none">
        <div className="w-full max-w-50 rounded-2xl border border-slate-100 bg-white p-3">
          <Image
            src={`/${slug}/qrcode`}
            alt={`Código QR de ${profile.fullName}`}
            width={220}
            height={220}
            unoptimized
            className="h-auto w-full"
          />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{profile.fullName}</p>
          <p className="text-sm font-medium text-indigo-600">{profile.career}</p>
        </div>
        <p className="break-all rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">{url}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <PrintButton />
        <a
          href={`/${slug}/vcard`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Contact className="h-4 w-4" />
          Guardar contacto (vCard)
        </a>
      </div>
    </div>
  );
}
