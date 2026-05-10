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
          fontSize: 880,
          lineHeight: 1,
        }}
      >
        🖼️
      </div>
    ),
    { ...size, emoji: "twemoji" }
  );
}
