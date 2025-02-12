"use client";

import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import "@/app/globals.css";
import Button from "@/components/ui/button/Button";

const ConfirmPage = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.user); // state 구조 변경
  const accessToken = auth.accessToken;

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      if (!accessToken) {
        throw new Error("로그인 세션이 만료되었습니다.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      // Redux 상태 초기화 - 단일 액션으로 변경
      dispatch(logout());
      
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center gap-8">
      <div className="flex flex-col items-center gap-4 z-10 w-[200px]">
        <Button type="orange">
          <Link href="/signup/owner" className="w-full block">
            계정 생성
          </Link>
        </Button>
        
        {accessToken ? (
          <Button type="orange" onClick={handleLogout}>로그아웃</Button>
        ) : (
          <Button type="orangeBorder">
            <Link href="/login" className="w-full block">
              로그인
            </Link>
          </Button>
        )}

        <Button type="default">
          <Link href="/update" className="w-full block">
            회원 정보 수정
          </Link>
        </Button>

        <Button type="brown">
          <Link href="/shop/create" className="w-full block">
            매장 등록
          </Link>
        </Button>

        <Button type="orangeSquare">
          <Link href="/shop" className="w-full block">
            매장 조회
          </Link>
        </Button>

        <Button type="primary">
          <Link href="/qr" className="w-full block">
            QR 페이지
          </Link>
        </Button>

        <Button type="primary">
          <Link href="/error" className="w-full block">
            Error 페이지
          </Link>
        </Button>

        <Button type="primary">
          <Link href="/success" className="w-full block">
            Success 페이지
          </Link>
        </Button>

      </div>
    </div>
  );
};

export default ConfirmPage;