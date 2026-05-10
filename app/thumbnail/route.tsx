import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = { width: 1024, height: 1024 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
          fontSize: 720,
          lineHeight: 1,
        }}
      >
        🖼️
      </div>
    ),
    { ...size, emoji: "twemoji" }
  );
}
