/** URL publique du site (liens dans les mails). Jamais codée en dur. */
export function siteUrl(): string {
  const url = process.env.SITE_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return url.replace(/\/+$/, "");
}
