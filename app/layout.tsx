import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "IRIK Aviation ERP",
  description: "IRIK International Institute of Aviation Management ERP",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IRIK ERP",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#020617" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect fill='%23020617' width='180' height='180'/><text x='50%' y='50%' font-size='90' font-weight='bold' fill='%23ffffff' dominant-baseline='central' text-anchor='middle'>IRIK</text></svg>" />
      </head>
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
