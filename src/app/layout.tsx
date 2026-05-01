import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Tajawal } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فكة — استثمر فكتك",
  description:
    "منصة الاستثمار الذكي — استثمر الفكة من مشترياتك اليومية في الأسهم وأدوات مالية متوافقة مع أحكام الشريعة الإسلامية",
  keywords: [
    "استثمار",
    "فكة",
    "شريعة",
    "مصر",
    "MENA",
    "fintech",
    "micro-investing",
  ],
};

import { Toaster } from "@/components/ui/sonner";
import { GlobalLoaderProvider } from "@/components/layout/GlobalLoaderContext";
import { GlobalLoader } from "@/components/layout/GlobalLoader";
import { SimulationProvider } from "@/components/simulation/SimulationContext";
import { SimulationOverlay } from "@/components/simulation/SimulationOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${tajawal.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <GlobalLoaderProvider>
          <SimulationProvider>
            <GlobalLoader />
            <SimulationOverlay />
            {children}
            <Toaster position="top-center" theme="light" />
          </SimulationProvider>
        </GlobalLoaderProvider>
      </body>
    </html>
  );
}
