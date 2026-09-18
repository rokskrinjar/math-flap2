import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link preview for WhatsApp, Facebook, X, etc. Rendered to a static PNG at build time.
export const alt = "SkySum: solve the sum, then fly the owl through the right answer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#071a3d";
const CREAM = "#fff9e7";
const YELLOW = "#ffd44d";

// Kept clear of the text block on the right.
const STARS = [
  [0.05, 0.1], [0.2, 0.06], [0.38, 0.15], [0.62, 0.05], [0.83, 0.1], [0.96, 0.2],
  [0.1, 0.34], [0.44, 0.28], [0.03, 0.55], [0.4, 0.66],
];
const BUILDINGS = [0.13, 0.1, 0.17, 0.12, 0.15, 0.09, 0.14, 0.18, 0.11, 0.16, 0.12, 0.14];

export default async function OpengraphImage() {
  const [owl, nunito800, nunito900] = await Promise.all([
    readFile(join(process.cwd(), "public/math-owl.png")),
    readFile(join(process.cwd(), "app/fonts/Nunito-800.ttf")),
    readFile(join(process.cwd(), "app/fonts/Nunito-900.ttf")),
  ]);
  const owlSrc = `data:image/png;base64,${owl.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Nunito",
          backgroundImage: "linear-gradient(180deg, #0b1935 0%, #123b67 58%, #1b527c 100%)",
        }}
      >
        {STARS.map(([x, y], i) => (
          <div
            key={`star-${i}`}
            style={{
              position: "absolute",
              left: x * 1200,
              top: y * 630,
              width: i % 3 === 0 ? 6 : 4,
              height: i % 3 === 0 ? 6 : 4,
              borderRadius: 6,
              backgroundColor: "rgba(255,231,168,.7)",
            }}
          />
        ))}

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "flex-end" }}>
          {BUILDINGS.map((h, i) => (
            <div
              key={`building-${i}`}
              style={{
                width: 100,
                height: h * 1.4 * 630,
                backgroundColor: i % 2 ? "#102e50" : "#173f68",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", width: "100%", alignItems: "center", padding: "0 70px", gap: 40 }}>
          <img src={owlSrc} width={500} height={191} alt="" />
          <div style={{ display: "flex", flexDirection: "column", color: CREAM }}>
            <div style={{ display: "flex", fontSize: 124, fontWeight: 900, letterSpacing: -5 }}>
              <span>SKY</span>
              <span style={{ color: YELLOW }}>SUM</span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, marginTop: 8, lineHeight: 1.25, maxWidth: 520 }}>
              Solve the sum. Fly through the right answer.
            </div>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                marginTop: 34,
                padding: "14px 30px",
                borderRadius: 22,
                border: `5px solid ${INK}`,
                backgroundColor: YELLOW,
                color: INK,
                fontSize: 34,
                fontWeight: 800,
                boxShadow: `0 8px 0 ${INK}`,
              }}
            >
              Play free at skysum.io
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Nunito", data: nunito800, weight: 800, style: "normal" },
        { name: "Nunito", data: nunito900, weight: 900, style: "normal" },
      ],
    },
  );
}
