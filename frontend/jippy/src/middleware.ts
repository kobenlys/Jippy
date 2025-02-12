import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // console.log("Middleware 실행됨!");
  // console.log("현재 경로:", request.nextUrl.pathname);
  
  const userAgent = request.headers.get("user-agent");
  // console.log("User Agent:", userAgent);
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent || "");
  // console.log("모바일 여부:", isMobile);
  
  if (isMobile && !request.nextUrl.pathname.startsWith("/m")) {
    // console.log("리다이렉트 시도:", "/m" + request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/m" + request.nextUrl.pathname, request.url));
  }

  return NextResponse.next();
}

// matcher를 staff 경로에만 적용하도록 확실히 설정
export const config = {
  matcher: [
    "/staff",      // staff 정확히 일치
    "/staff/:path*" // staff의 하위 경로
  ]
}