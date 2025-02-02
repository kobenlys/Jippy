"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUserInfo, setUserToken } from "@/redux/userSlice";
import { AppDispatch } from "@/redux/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("OWNER");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`로그인 실패: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("로그인 성공!!! 데이터:", data);

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        console.log("저장된 토큰:", localStorage.getItem("token"));

        // Redux 상태 업데이트
        dispatch(setUserToken({ accessToken: data.accessToken }));
        dispatch(setUserInfo({
          id: data.id,
          email: data.email,
          name: data.name,
          age: data.age,
          userType: data.userType,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }));

        router.replace("/"); // 로그인 성공 후 홈으로 리다이렉트
      } else {
        throw new Error("토큰이 응답에 없습니다");
      }
    } catch (error: any) {
      console.error("로그인 에러:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-6">로그인</h1>

      <div className="flex gap-4 m-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="OWNER"
            checked={userType === "OWNER"}
            onChange={(e) => setUserType(e.target.value)}
            className="form-radio text-blue-500"
          />
          <span>점주</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="STAFF"
            checked={userType === "STAFF"}
            onChange={(e) => setUserType(e.target.value)}
            className="form-radio text-blue-500"
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

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-4"
      >
        로그인
      </button>

      <div className="w-64 h-px bg-gray-300 my-6"></div>

      <div className="text-sm">
        <span className="text-gray-600">비밀번호가 기억 안 나요! </span>
        <Link href="/reset" className="text-blue-500 hover:text-blue-600">
          비밀번호 재발급
        </Link>
      </div>
    </div>
  );
}
