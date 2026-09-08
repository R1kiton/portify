import type { PublishedProfile } from "@/lib/publish";

function escapeVCardValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function buildVCard(profile: PublishedProfile, profileUrl: string): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  lines.push(`FN:${escapeVCardValue(profile.fullName)}`);
  if (profile.career) lines.push(`TITLE:${escapeVCardValue(profile.career)}`);
  if (profile.contactEmail) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(profile.contactEmail)}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${escapeVCardValue(profile.phone)}`);
  if (profile.linkedinUrl) lines.push(`URL;TYPE=LinkedIn:${escapeVCardValue(profile.linkedinUrl)}`);
  if (profile.githubUrl) lines.push(`URL;TYPE=GitHub:${escapeVCardValue(profile.githubUrl)}`);
  if (profile.websiteUrl) lines.push(`URL;TYPE=Website:${escapeVCardValue(profile.websiteUrl)}`);
  lines.push(`URL;TYPE=EProfile:${escapeVCardValue(profileUrl)}`);
  if (profile.headline) lines.push(`NOTE:${escapeVCardValue(profile.headline)}`);

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
