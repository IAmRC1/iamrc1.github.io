import { promises as fs } from "node:fs";
import path from "node:path";

export type CertificateType = "certificate" | "badge";

export type Certificate = {
  id: string;
  domain: string;
  type: CertificateType;
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
};

const CERTS_PATH = path.join(process.cwd(), "content", "certificates.json");

function safeString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function safeType(v: unknown): CertificateType {
  return v === "badge" ? "badge" : "certificate";
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const raw = await fs.readFile(CERTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const out: Certificate[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;

      const id = safeString(rec.id);
      const domain = safeString(rec.domain).toLowerCase();
      const title = safeString(rec.title);
      const issuer = safeString(rec.issuer);
      const type = safeType(rec.type);
      const date = safeString(rec.date) || undefined;
      const credentialUrl = safeString(rec.credentialUrl) || undefined;

      if (!id || !domain || !title || !issuer) continue;

      out.push({ id, domain, title, issuer, type, date, credentialUrl });
    }

    return out.sort((a, b) => (a.date && b.date ? (a.date < b.date ? 1 : -1) : 0));
  } catch {
    return [];
  }
}
