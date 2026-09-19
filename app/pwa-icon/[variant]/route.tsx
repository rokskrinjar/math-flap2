import { renderAppIcon } from "../../_lib/app-icon";

// Android home-screen icons referenced from app/manifest.ts. Pre-rendered at build time.
const VARIANTS = {
  "192": { size: 192, maskable: false },
  "512": { size: 512, maskable: false },
  "maskable-512": { size: 512, maskable: true },
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ variant: string }> }) {
  const variant = VARIANTS[(await params).variant as keyof typeof VARIANTS];
  if (!variant) return new Response("Not found", { status: 404 });
  return renderAppIcon(variant.size, { maskable: variant.maskable });
}
