import type { Metadata } from "next";
import "./globals.css";

import {
  Newsreader,
  Plus_Jakarta_Sans,
} from "next/font/google";

import { THEME_INIT_CODE } from "@/lib/themeInitCode";
import { SITE_METADATA } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-plus-jakarta" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-newsreader" });

export const metadata: Metadata = SITE_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[
        jakarta.variable,
        newsreader.variable,
      ].join(" ")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_CODE }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
