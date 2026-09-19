import type { Metadata, Viewport } from "next";
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
  // Icons come from app/icon.svg (browser tab) and app/apple-icon.tsx (iPhone home screen).
  // Opened from the iPhone home screen: full screen, no Safari bar.
  appleWebApp: {
    capable: true,
    title: "SkySum",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#071a3d",
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
