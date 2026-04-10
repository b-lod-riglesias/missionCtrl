"use client";

export default function HomePage() {
  return (
    <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="/stitch/fleet_overview.html"
        title="Mission Control Dashboard"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}
