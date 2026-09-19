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

// Chrome sends "beforeinstallprompt" to this top-level page, possibly before the game iframe
// has loaded. Keep the event so game.html can offer its own Install button (Android).
const captureInstallPrompt = `
window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault();
  window.__skysumInstallPrompt = event;
  window.dispatchEvent(new Event("skysum-install-change"));
});
window.addEventListener("appinstalled", function () {
  window.__skysumInstallPrompt = null;
  window.dispatchEvent(new Event("skysum-install-change"));
});`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: captureInstallPrompt }} />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
