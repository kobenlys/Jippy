"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import "@/app/globals.css";
import styles from "@/app/page.module.css";
import Button from "@/components/ui/button/Button";

interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    name: string;
    age: number;
    staff_type: string;
  };
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("OWNER");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    dispatch(loginStart());
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, userType }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`로그인 실패: ${response.status} - ${errorData}`);
      }

      const responseData: LoginResponse = await response.json();
      const { data } = responseData;

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);

        dispatch(
          loginSuccess({
            user: {
              id: data.id,
              email: data.email,
              name: data.name,
              age: data.age.toString(),
              userType: data.staff_type,
            },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );

        router.replace("/confirm");
      } else {
        throw new Error("토큰이 응답에 없습니다");
      }
    } catch (error) {
      dispatch(
        loginFailure(
          error instanceof Error
            ? error.message
            : "로그인 중 오류가 발생했습니다"
        )
      );
      console.error("로그인 에러:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className={styles.subtitle}>로그인</h1>

      <div className="flex gap-4 m-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="OWNER"
            checked={userType === "OWNER"}
            onChange={(e) => setUserType(e.target.value)}
            className="form-radio appearance-none relative h-5 w-5 border border-gray-300 rounded-full 
             before:absolute before:inset-0 before:w-full before:h-full before:rounded-full before:border before:border-gray-300 
             checked:before:border-[#F27B39] checked:after:absolute checked:after:inset-[4px] checked:after:bg-[#F27B39] 
             checked:after:rounded-full"
          />
          <span>점주</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="STAFF"
            checked={userType === "STAFF"}
            onChange={(e) => setUserType(e.target.value)}
            className="form-radio appearance-none relative h-5 w-5 border border-gray-300 rounded-full 
             before:absolute before:inset-0 before:w-full before:h-full before:rounded-full before:border before:border-gray-300 
             checked:before:border-[#F27B39] checked:after:absolute checked:after:inset-[4px] checked:after:bg-[#F27B39] 
             checked:after:rounded-full"
          />
          <span>직원</span>
        </label>
      </div>

      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 m-2 w-64 rounded"
      />
      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 m-2 w-64 rounded"
      />

      <Button type="orange" onClick={handleLogin}>
        로그인
      </Button>

      <div className="w-64 h-px bg-gray-300 my-6"></div>

      <div className="text-sm">
        <span className="text-gray-600">비밀번호가 기억 안 나요! </span>
        <Link href="/reset" className="text-orange-500 hover:text-orange-600">
          비밀번호 재발급
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
