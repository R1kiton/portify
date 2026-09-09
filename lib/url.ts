export function getBaseUrl(): string {
  if(process.env.NEXT_PUBLIC_APP_URL === undefined){
    return ""
  }
  return (process.env.NEXT_PUBLIC_APP_URL).replace(/\/$/, "");
}

export function profileUrl(slug: string): string {
  return `${getBaseUrl()}/${slug}`;
}
