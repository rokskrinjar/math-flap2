import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const description = "Solve quick arithmetic, fly through the correct answer, and climb the daily leaderboard.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.skysum.io"),
  title: "SkySum",
  description,
  openGraph: {
    title: "SkySum: the one-tap math game",
    description,
    url: "/",
    siteName: "SkySum",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
