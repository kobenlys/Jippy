import "./globals.css"; // 글로벌 CSS 파일 임포트
import { ReactNode } from "react";

export const metadata = {
  title: "Jippy",
  description: "Pretendard 폰트가 적용된 페이지",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
