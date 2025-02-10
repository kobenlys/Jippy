// app/layout.tsx
import RootLayoutClient from "./RootLayoutClient";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Jippy",
  description: "소상공인을 위한 카페 매장 관리 서비스",
  manifest: "/manifest.json", // PWA manifest
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export const viewport: Viewport = {
  ...(process.env.NEXT_PUBLIC_STAFF_ROUTE 
    ? {}  // staff 라우트에서는 빈 객체
    : {
        width: 'device-width',
        initialScale: 1,
      }
  ),
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}