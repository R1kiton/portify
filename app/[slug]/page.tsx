import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVisiblePublishedProfile } from "@/lib/public-student";
import { PublicProfile } from "@/components/public-profile";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getVisiblePublishedProfile(slug);
  if (!profile) return { title: "EProfile" };
  return {
    title: `${profile.fullName} — EProfile`,
    description: profile.headline || profile.career || undefined,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const profile = await getVisiblePublishedProfile(slug);
  if (!profile) notFound();

  return <PublicProfile profile={profile} slug={slug} />;
}
