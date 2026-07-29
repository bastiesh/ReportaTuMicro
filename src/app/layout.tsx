import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "ReportaTuMicro - Incidencias RM",
  description: "Reporta incidencias de transporte público y reseña paraderos en Santiago",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ReportaMicro" },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192x192.png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#dc2626",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ServiceWorkerProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
