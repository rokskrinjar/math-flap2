import { renderAppIcon } from "./_lib/app-icon";

// iPhone/iPad "Add to Home Screen" icon.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderAppIcon(180);
}
