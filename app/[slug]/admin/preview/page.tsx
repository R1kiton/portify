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
    <div className="flex flex-col rounded-2xl border border-amber-200 bg-white">
      <div className="rounded-t-2xl bg-amber-100 px-6 py-2 text-center text-sm text-amber-900">
        Vista previa de tu borrador — así se vería si publicaras ahora mismo. Los visitantes no ven esto todavía.
      </div>
      <PublicProfile profile={draftProfile} slug={slug} />
    </div>
  );
}
