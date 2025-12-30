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
    logoPath: "/images/header-logo.png",
  },
  socialLinks: [
    { label: "Telegram", href: "https://t.me/IAmRC1", icon: "telegram" },
    { label: "LinkedIn", href: "https://www.linkedin.com/IAmRC1", icon: "linkedin" },
  ] satisfies SocialLink[],
} as const;

export const SITE_METADATA: Metadata = {
  title: `${SITE.author.name} — Portfolio`,
  description: `Portfolio website of ${SITE.author.name}.`,
};
