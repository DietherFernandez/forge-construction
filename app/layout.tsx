import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "FORGE Construction — Built Strong. Built to Last.", template: "%s | FORGE Construction" },
  description: "Thoughtful planning. Skilled execution. Spaces built for the way you live and work.",
  applicationName: "FORGE Construction",
  openGraph: { type: "website", siteName: "FORGE Construction", title: "FORGE Construction", description: "Thoughtful planning. Skilled execution. Spaces built for the way you live and work." },
  icons: { icon: "/favicon.svg" }
};
export const viewport: Viewport = { themeColor: "#1c1d1b", colorScheme: "light" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
