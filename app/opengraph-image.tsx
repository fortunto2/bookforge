import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BookForge — Free AI Worksheet & Workbook Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "64px" }}>📚</span>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            BookForge
          </span>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#e0e0e0",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Free AI Worksheet & Workbook Generator
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Math", "English", "Science", "Spanish", "Kids", "SAT Prep"].map(
            (cat) => (
              <div
                key={cat}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "9999px",
                  padding: "8px 24px",
                  fontSize: "20px",
                  color: "#d4d4d4",
                }}
              >
                {cat}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#737373",
          }}
        >
          12 categories · KDP-ready PDF · No signup required
        </div>
      </div>
    ),
    { ...size }
  );
}
