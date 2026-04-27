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
  title: "صكوك سويب — استثمر فكتتك",
  description:
    "منصة الاستثمار الذكي الشرعي — استثمر الفكة من مشترياتك اليومية في صكوك وأدوات مالية متوافقة مع أحكام الشريعة الإسلامية",
  keywords: ["استثمار", "صكوك", "شريعة", "مصر", "MENA", "fintech", "micro-investing"],
};

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
        {children}
      </body>
    </html>
  );
}
