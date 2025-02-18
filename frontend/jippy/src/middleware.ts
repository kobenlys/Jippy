import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const urlPath = nextUrl.pathname;
  const staffType = cookies.get("staffType")?.value;
  const loginType = cookies.get("loginType")?.value;

  // 쿠키로 권한 확인
  console.log("I'm in middleware");
  if (!staffType || !loginType) {
    return NextResponse.redirect(new URL("/login", request.url)); // ✅ 로그인 페이지로 리디렉트
  }

  if (urlPath.startsWith("/owner")) {
    console.log(staffType + " " + loginType + " " + urlPath);
    if (staffType !== "OWNER" || loginType !== "OWNER") {
      return NextResponse.redirect(new URL("/error", request.url));
    }
  } else if (urlPath.startsWith("/order") || urlPath.startsWith("/payment")) {
    if (staffType === "STAFF") {
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }

  const userAgent = request.headers.get("user-agent");
  // console.log("User Agent:", userAgent);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent || "");
  // console.log("모바일 여부:", isMobile);

  if (isMobile && request.nextUrl.pathname.startsWith("/(staff)")) {
    // console.log("리다이렉트 시도:", "/(staff)" + request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL("/(staff)" + request.nextUrl.pathname, request.url)
    );
  }

  return NextResponse.next();
}

// matcher를 staff 경로에만 적용하도록 확실히 설정
export const config = {
  matcher: [
    "/(staff)", // staff 정확히 일치
    "/(staff)/:path*", // staff의 하위 경로
    "/owner/:path*",
    "/order/:path*",
    "/payment/:path*",
  ],
};
