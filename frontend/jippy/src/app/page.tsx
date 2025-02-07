"use client";

import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserToken, setUserInfo } from "@/redux/slices/userSlice";
import "@/app/globals.css";
import styles from "./page.module.css";
import Button from "@/components/ui/button/Button";

const JippyPage = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.user);

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

      // Redux 상태 초기화
      dispatch(setUserToken({ 
        accessToken: null, 
        refreshToken: null 
      }));
      dispatch(setUserInfo({
        id: null,
        email: null,
        name: null,
        age: null,
        userType: null,
      }));
      
      // console.log("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className={styles.title}>Jippy</h1>
      
      <div className="flex flex-col gap-4 w-64">
        <Button type="orange">
          <Link href="/signup/owner" className="w-full block">
            계정 생성
          </Link>
        </Button>

        {accessToken ? (
          <Button type="orange" onClick={handleLogout}>로그아웃</Button>
        ) : (
          <Button type="orange-border">
            <Link href="/login" className="w-full block">
              로그인
            </Link>
          </Button>
        )}

        <Button type="primary">
          <Link href="/update" className="w-full block">
            회원 정보 수정
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JippyPage;