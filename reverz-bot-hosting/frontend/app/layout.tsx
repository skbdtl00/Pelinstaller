import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reverz Bot Hosting",
  description: "แพลตฟอร์มโฮสต์บอทที่ใช้งานง่าย ด้วยพลัง Pelican Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
