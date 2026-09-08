import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { PublishedProfile } from "@/lib/publish";

const classicStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  name: { fontSize: 24, fontWeight: 700, marginBottom: 2 },
  career: { fontSize: 13, color: "#444444", marginBottom: 8 },
  headline: { fontSize: 10, color: "#555555", marginBottom: 14, lineHeight: 1.4 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  contactItem: { fontSize: 9, color: "#333333" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#dddddd", marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#111111",
  },
  entry: { marginBottom: 8 },
  entryTitleRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontSize: 11, fontWeight: 700 },
  entrySubtitle: { fontSize: 10, color: "#444444", marginBottom: 2 },
  entryDates: { fontSize: 9, color: "#777777" },
  entryDescription: { fontSize: 9.5, color: "#333333", lineHeight: 1.4 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    fontSize: 9,
    backgroundColor: "#f1f1f1",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  academicTag: { fontSize: 8, color: "#7a5200", backgroundColor: "#fff3d6", borderRadius: 3, paddingVertical: 2, paddingHorizontal: 5, marginLeft: 6 },
});

const modernStyles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  sidebar: { width: "34%", backgroundColor: "#111827", color: "#ffffff", padding: 24 },
  main: { width: "66%", padding: 28 },
  name: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  career: { fontSize: 11, color: "#d1d5db", marginBottom: 16 },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#9ca3af",
    marginTop: 16,
    marginBottom: 6,
  },
  sidebarItem: { fontSize: 9, color: "#e5e7eb", marginBottom: 4, lineHeight: 1.4 },
  headline: { fontSize: 10, color: "#374151", marginBottom: 16, lineHeight: 1.5 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 14,
    color: "#111827",
    borderBottomWidth: 2,
    borderBottomColor: "#111827",
    paddingBottom: 3,
  },
  entry: { marginBottom: 9 },
  entryTitle: { fontSize: 11, fontWeight: 700 },
  entrySubtitle: { fontSize: 10, color: "#374151", marginBottom: 2 },
  entryDates: { fontSize: 9, color: "#6b7280" },
  entryDescription: { fontSize: 9.5, color: "#374151", lineHeight: 1.4 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    fontSize: 9,
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  academicTag: { fontSize: 8, color: "#7a5200", backgroundColor: "#fff3d6", borderRadius: 3, paddingVertical: 2, paddingHorizontal: 5, marginLeft: 6 },
});

function formatRange(start: string | null, end: string | null) {
  if (!start && !end) return "";
  return `${start ?? ""} — ${end || "Presente"}`;
}

function ClassicCv({ profile }: { profile: PublishedProfile }) {
  const s = classicStyles;
  return (
    <Document title={`CV - ${profile.fullName}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{profile.fullName}</Text>
        <Text style={s.career}>{profile.career}</Text>
        {profile.headline ? <Text style={s.headline}>{profile.headline}</Text> : null}

        <View style={s.contactRow}>
          {profile.contactEmail ? <Text style={s.contactItem}>{profile.contactEmail}</Text> : null}
          {profile.phone ? <Text style={s.contactItem}>{profile.phone}</Text> : null}
          {profile.linkedinUrl ? (
            <Link src={profile.linkedinUrl} style={s.contactItem}>LinkedIn</Link>
          ) : null}
          {profile.githubUrl ? <Link src={profile.githubUrl} style={s.contactItem}>GitHub</Link> : null}
          {profile.websiteUrl ? <Link src={profile.websiteUrl} style={s.contactItem}>Sitio web</Link> : null}
        </View>
        <View style={s.divider} />

        {profile.educations.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Formación</Text>
            {profile.educations.map((e, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTitleRow}>
                  <Text style={s.entryTitle}>{e.institution}</Text>
                  <Text style={s.entryDates}>{formatRange(e.startDate, e.endDate)}</Text>
                </View>
                {e.degree || e.fieldOfStudy ? (
                  <Text style={s.entrySubtitle}>{[e.degree, e.fieldOfStudy].filter(Boolean).join(" · ")}</Text>
                ) : null}
                {e.description ? <Text style={s.entryDescription}>{e.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {profile.experiences.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Experiencia</Text>
            {profile.experiences.map((e, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTitleRow}>
                  <Text style={s.entryTitle}>{e.role}</Text>
                  <Text style={s.entryDates}>{formatRange(e.startDate, e.endDate)}</Text>
                </View>
                <Text style={s.entrySubtitle}>{e.company}</Text>
                {e.description ? <Text style={s.entryDescription}>{e.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {profile.projects.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Proyectos</Text>
            {profile.projects.map((p, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTitleRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={s.entryTitle}>{p.name}</Text>
                    {p.isAcademic ? <Text style={s.academicTag}>Académico</Text> : null}
                  </View>
                </View>
                {p.role ? <Text style={s.entrySubtitle}>{p.role}</Text> : null}
                {p.description ? <Text style={s.entryDescription}>{p.description}</Text> : null}
                {p.techStack ? <Text style={s.entryDescription}>Tecnologías: {p.techStack}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {profile.achievements.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Reconocimientos</Text>
            {profile.achievements.map((a, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryTitleRow}>
                  <Text style={s.entryTitle}>{a.title}</Text>
                  {a.date ? <Text style={s.entryDates}>{a.date}</Text> : null}
                </View>
                {a.description ? <Text style={s.entryDescription}>{a.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {profile.skills.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Habilidades</Text>
            <View style={s.chipsRow}>
              {profile.skills.map((sk, i) => (
                <Text key={i} style={s.chip}>{sk.name}</Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

function ModernCv({ profile }: { profile: PublishedProfile }) {
  const s = modernStyles;
  return (
    <Document title={`CV - ${profile.fullName}`}>
      <Page size="A4" style={s.page}>
        <View style={s.sidebar}>
          <Text style={s.name}>{profile.fullName}</Text>
          <Text style={s.career}>{profile.career}</Text>

          <Text style={s.sidebarSectionTitle}>Contacto</Text>
          {profile.contactEmail ? <Text style={s.sidebarItem}>{profile.contactEmail}</Text> : null}
          {profile.phone ? <Text style={s.sidebarItem}>{profile.phone}</Text> : null}
          {profile.linkedinUrl ? <Text style={s.sidebarItem}>LinkedIn: {profile.linkedinUrl}</Text> : null}
          {profile.githubUrl ? <Text style={s.sidebarItem}>GitHub: {profile.githubUrl}</Text> : null}
          {profile.websiteUrl ? <Text style={s.sidebarItem}>{profile.websiteUrl}</Text> : null}

          {profile.skills.length > 0 && (
            <>
              <Text style={s.sidebarSectionTitle}>Habilidades</Text>
              {profile.skills.map((sk, i) => (
                <Text key={i} style={s.sidebarItem}>• {sk.name}</Text>
              ))}
            </>
          )}

          {profile.achievements.length > 0 && (
            <>
              <Text style={s.sidebarSectionTitle}>Reconocimientos</Text>
              {profile.achievements.map((a, i) => (
                <Text key={i} style={s.sidebarItem}>• {a.title}</Text>
              ))}
            </>
          )}
        </View>

        <View style={s.main}>
          {profile.headline ? <Text style={s.headline}>{profile.headline}</Text> : null}

          {profile.experiences.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Experiencia</Text>
              {profile.experiences.map((e, i) => (
                <View key={i} style={s.entry}>
                  <Text style={s.entryTitle}>{e.role}</Text>
                  <Text style={s.entrySubtitle}>{e.company}</Text>
                  <Text style={s.entryDates}>{formatRange(e.startDate, e.endDate)}</Text>
                  {e.description ? <Text style={s.entryDescription}>{e.description}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {profile.educations.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Formación</Text>
              {profile.educations.map((e, i) => (
                <View key={i} style={s.entry}>
                  <Text style={s.entryTitle}>{e.institution}</Text>
                  {e.degree || e.fieldOfStudy ? (
                    <Text style={s.entrySubtitle}>{[e.degree, e.fieldOfStudy].filter(Boolean).join(" · ")}</Text>
                  ) : null}
                  <Text style={s.entryDates}>{formatRange(e.startDate, e.endDate)}</Text>
                  {e.description ? <Text style={s.entryDescription}>{e.description}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {profile.projects.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Proyectos</Text>
              {profile.projects.map((p, i) => (
                <View key={i} style={s.entry}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={s.entryTitle}>{p.name}</Text>
                    {p.isAcademic ? <Text style={s.academicTag}>Académico</Text> : null}
                  </View>
                  {p.role ? <Text style={s.entrySubtitle}>{p.role}</Text> : null}
                  {p.description ? <Text style={s.entryDescription}>{p.description}</Text> : null}
                  {p.techStack ? <Text style={s.entryDescription}>Tecnologías: {p.techStack}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

export function CvDocument({ profile }: { profile: PublishedProfile }) {
  if (profile.cvTemplate === "modern") return <ModernCv profile={profile} />;
  return <ClassicCv profile={profile} />;
}

export const CV_TEMPLATES = [
  { id: "classic", label: "Clásica" },
  { id: "modern", label: "Moderna" },
] as const;
