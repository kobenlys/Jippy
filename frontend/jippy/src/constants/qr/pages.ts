import { Page } from "@/types/qr";

// QR 코드를 생성할 수 있는 페이지 목록
export const QR_PAGES: Page[] = [
  { name: "피드백", path: "/feedback" },
  { name: "회원가입", path: "/signup" },
  { name: "직원 출퇴근", path: "/attendance" }
] as const;