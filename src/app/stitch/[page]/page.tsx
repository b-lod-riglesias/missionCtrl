"use client";

import { use } from "react";

interface StitchPageProps {
  params: Promise<{ page: string }>;
}

export default function StitchPage({ params }: StitchPageProps) {
  const { page } = use(params);
  const src = `/stitch/${page}.html`;

  return (
    <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        src={src}
        title={page}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}
