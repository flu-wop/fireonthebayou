import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "linear-gradient(135deg, #E2452A 0%, #7A1F0F 100%)",
          borderRadius: "6px",
          fontSize: 18,
          fontWeight: 600,
          color: "#F5EFE4",
          fontFamily: "Georgia, serif",
        }}
      >
        F
      </div>
    ),
    { ...size }
  );
}
