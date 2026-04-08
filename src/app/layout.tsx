import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Plataforma de gestión de OpenClaws para Rogelio Iglesias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-background text-white">
        {children}
      </body>
    </html>
  );
}
