import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "K-MOM | 유학생 합법 알바 매칭",
  description:
    "D-2 비자 유학생, 아르바이트 업주, 대학교 국제처를 연결하는 신뢰 기반 합법 알바 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Nav />
        {children}
      </body>
    </html>
  );
}
