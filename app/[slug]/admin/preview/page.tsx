import { Eye } from "lucide-react";
import { requireStudentAccess } from "@/lib/auth/dal";
import { buildSnapshot } from "@/lib/publish";
import { PublicProfile } from "@/components/public-profile";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { student } = await requireStudentAccess(slug);
  const draftProfile = await buildSnapshot(student.id);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-amber-200 bg-white">
      <div className="flex items-center justify-center gap-2 bg-amber-100 px-6 py-2.5 text-center text-sm font-medium text-amber-900">
        <Eye className="h-4 w-4 shrink-0" />
        Vista previa de tu borrador — así se vería si publicaras ahora mismo. Los visitantes no ven esto todavía.
      </div>
      <PublicProfile profile={draftProfile} slug={slug} />
    </div>
  );
}
