import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control | Synthetic Sentinel",
  description: "Fleet management dashboard for OpenClaws AI agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="font-body antialiased bg-background text-on-surface min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1c2026",
              border: "1px solid #3a494a",
              color: "#dfe2eb",
            },
          }}
        />
      </body>
    </html>
  );
}
