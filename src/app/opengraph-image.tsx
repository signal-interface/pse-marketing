import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Payroll Synergy Experts — AI-Powered Payroll Compliance & Controls";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f1a2e 0%, #1a2740 50%, #253554 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#7a9ab4",
            }}
          >
            S
          </span>
        </div>

        {/* Company name */}
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Payroll Synergy Experts
        </span>

        {/* Tagline */}
        <span
          style={{
            fontSize: 24,
            color: "#a3bdd1",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          AI-powered payroll controls that catch compliance issues before they
          cost you.
        </span>

        {/* CHAP AI badge */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 100,
            padding: "8px 20px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#16a34a",
            }}
          />
          <span style={{ fontSize: 16, color: "#a3bdd1", fontWeight: 600 }}>
            Powered by CHAP AI
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
