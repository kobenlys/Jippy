// app/layout.tsx
import RootLayoutClient from "./RootLayoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jippy",
  description: "소상공인을 위한 카페 매장 관리 서비스",
  manifest: "/manifest.json", // PWA manifest 추가
  viewport: process.env.NEXT_PUBLIC_STAFF_ROUTE 
    ? undefined  // staff 라우트에서는 뷰포트 메타 태그 제거
    : "width=device-width, initial-scale=1"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}