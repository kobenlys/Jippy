"use client";

import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice"; // import 수정
import "@/app/globals.css";
import styles from "./page.module.css";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

const JippyPage = () => {
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
      {/* 배경 요소 */}
      <Image
        src="/images/MainDeco.svg"
        alt="Background decoration"
        fill
        className={styles.backgroundImage}
        priority
      />

      <h1 className={styles.title}>Jippy</h1>

      <h3 className={styles.subtitle}>소상공인을 위한<br/>카페 매장 관리 서비스</h3>
      
      <div className="flex flex-col items-center gap-4 z-10 w-[200px]">
        <Button type="orange">
          <Link href="/signup/owner" className="w-full block">
            계정 생성
          </Link>
        </Button>

        <p> 또는 </p>
        
        {accessToken ? (
          <Button type="orange" onClick={handleLogout}>로그아웃</Button>
        ) : (
          <Button type="orangeBorder">
            <Link href="/login" className="w-full block">
              로그인
            </Link>
          </Button>
        )}

      </div>
    </div>
  );
};

export default JippyPage;