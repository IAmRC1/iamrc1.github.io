import type { Metadata } from "next";
import type { SocialIconName } from "@/components/SocialIcon";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconName;
};

export const SITE = {
  author: {
    name: "Rishabh Singh",
    email: "rishabhcena1@gmail.com",
  },
  brand: {
    logoPath: "/images/header-logo.jpg",
  },
  socialLinks: [
    { label: "Telegram", href: "https://t.me/IAmRC1", icon: "telegram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/IAmRC1", icon: "linkedin" },
  ] satisfies SocialLink[],
} as const;

export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel = process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
}

export const SITE_METADATA: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${SITE.author.name} — Portfolio`,
    template: `%s — ${SITE.author.name}`,
  },
  description: `Portfolio website of ${SITE.author.name}.`,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: `${SITE.author.name} — Portfolio`,
    description: `Portfolio website of ${SITE.author.name}.`,
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: `${SITE.author.name} — Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.author.name} — Portfolio`,
    description: `Portfolio website of ${SITE.author.name}.`,
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};
