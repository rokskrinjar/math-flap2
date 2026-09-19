import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Home-screen icon in the game's night-city style. Full-bleed square: iOS and Android
// round the corners themselves. "maskable" shrinks the owl into Android's safe zone
// (the centre 80% circle), since launchers may crop the icon to any shape.
export async function renderAppIcon(size: number, { maskable = false } = {}) {
  const owl = await readFile(join(process.cwd(), "public/math-owl.png"));
  const owlSrc = `data:image/png;base64,${owl.toString("base64")}`;
  // The sprite is wide and flat, so the regular icon lets the wing tips run off the edges
  // to keep the owl's face large at home-screen size.
  const owlWidth = size * (maskable ? 0.78 : 1.1);
  const owlHeight = owlWidth * (122 / 320);
  const stars = [
    [0.16, 0.16], [0.4, 0.1], [0.78, 0.14], [0.9, 0.34], [0.1, 0.4], [0.62, 0.24],
  ];
  const buildings = [0.2, 0.14, 0.24, 0.16, 0.21, 0.13, 0.19];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          backgroundImage: "linear-gradient(180deg, #0b1935 0%, #123b67 60%, #1b527c 100%)",
        }}
      >
        {stars.map(([x, y], i) => (
          <div
            key={`star-${i}`}
            style={{
              position: "absolute",
              left: x * size,
              top: y * size,
              width: size * 0.018,
              height: size * 0.018,
              borderRadius: size,
              backgroundColor: "rgba(255,231,168,.75)",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "flex-end" }}>
          {buildings.map((h, i) => (
            <div
              key={`building-${i}`}
              style={{ width: size / buildings.length, height: h * size, backgroundColor: i % 2 ? "#102e50" : "#173f68" }}
            />
          ))}
        </div>
        <img
          src={owlSrc}
          width={owlWidth}
          height={owlHeight}
          alt=""
          style={{ flexShrink: 0, marginTop: -size * 0.06 }}
        />
      </div>
    ),
    { width: size, height: size },
  );
}
