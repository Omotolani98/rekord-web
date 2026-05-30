import type { Metadata } from "next";
import { Space_Mono, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import TopBar from "@/components/TopBar";
import CommandPalette from "@/components/CommandPalette";
import { getStars } from "@/lib/github";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "rekord — record what you build, export what you learned",
  description:
    "Rekord is an open-source Go CLI that records terminal workflows and exports them into casts, Markdown, JSON, GIF/video, and AI-ready context bundles.",
};

// no-flash theme: resolve before paint from localStorage, falling back to system
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('rekord-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const stars = await getStars();
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceMono.variable} ${jetbrainsMono.variable} ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <TopBar stars={stars} />
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
