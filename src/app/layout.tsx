import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quinceañeras de Lujo | Producción Integral de Eventos Premium en Ecuador",
  description: "Producción integral de quinceañeras de lujo en Guayaquil y todo Ecuador. Cotiza tu evento modular: sonido, iluminación, decoración, catering, coreografía y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  );
}
