import type { MetadataRoute } from "next";

// Lets Android "Add to Home screen" install SkySum as a full-screen app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SkySum",
    short_name: "SkySum",
    description: "Solve the sum, then fly the owl through the right answer.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#071a3d",
    theme_color: "#071a3d",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
