import { ImageResponse } from "next/og";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 180,
          lineHeight: 1,
        }}
      >
        🖼️
      </div>
    ),
    { ...size, emoji: "twemoji" }
  );
}
