import Link from "next/link";
import { getCertificates } from "@/lib/certificates";
import { CertificatesBrowser } from "@/components/CertificatesBrowser";
import { CERTIFICATES_COPY } from "@/lib/copy/certificates";

export const metadata = CERTIFICATES_COPY.metadata;

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const domain = typeof sp.domain === "string" ? sp.domain : "";

  const certificates = await getCertificates();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {CERTIFICATES_COPY.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {CERTIFICATES_COPY.subtitle}
          </p>
        </div>

        <Link
          href="/"
          className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:decoration-zinc-200"
        >
          {CERTIFICATES_COPY.backHome}
        </Link>
      </header>

      <CertificatesBrowser certificates={certificates} initialDomain={domain} />
    </main>
  );
}
