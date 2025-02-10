"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/redux/slices/userSlice";
import { setShops, setCurrentShop } from "@/redux/slices/shopSlice"; // 여기 주목
import { AppDispatch } from "@/redux/store";
import "@/app/globals.css";
import styles from "@/app/page.module.css";
import Button from "@/features/common/components/ui/button/Button";

interface LoginResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    age: string;
    staff_type: string;
    access_token: string;
    refresh_token: string;
  };
}

interface Shop {
  id: number;
  userOwnerId: number;
  name: string;
  address: string;
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
  
      const responseData: LoginResponse = await response.json();
      
      if (responseData.success && responseData.data.access_token) {
        localStorage.setItem("token", responseData.data.access_token);
  
        // 로그인 성공 처리
        dispatch(loginSuccess({
          profile: {
            id: responseData.data.id.toString(),
            email: responseData.data.email,
            name: responseData.data.name,
            age: responseData.data.age,
            userType: responseData.data.staff_type,
          },
          accessToken: responseData.data.access_token,
          refreshToken: responseData.data.refresh_token,
        }));
  
        // 매장 정보 조회 및 리덕스 업데이트
        try {
          const shopsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/select`, {
            headers: {
              "Authorization": `Bearer ${responseData.data.access_token}`,
              "Content-Type": "application/json"
            }
          });
  
          if (shopsResponse.ok) {
            const shopsData = await shopsResponse.json();
            
            // 로그인한 사용자의 ID와 일치하는 매장 필터링
            const userShops: Shop[] = shopsData.data.filter(
              (shop: Shop) => shop.userOwnerId === responseData.data.id
            );
            
            // 매장이 있다면 리덕스에 업데이트
            if (userShops.length > 0) {
              // 모든 매장 설정
              dispatch(setShops(userShops));
              
              // 첫 번째 매장을 현재 매장으로 설정
              dispatch(setCurrentShop(userShops[0]));
              
              // 확인 페이지로 이동
              router.replace("/confirm");
            } else {
              // 매장이 없는 경우 처리 (예: 매장 생성 페이지로 리다이렉트)
              router.replace("/create-shop");
            }
          } else {
            // 매장 조회 실패 시 에러 처리
            throw new Error("매장 정보를 불러오는 데 실패했습니다.");
          }
        } catch (error) {
          console.error("매장 정보 조회 중 오류 발생:", error);
          dispatch(loginFailure(error instanceof Error ? error.message : "매장 정보 조회 중 오류가 발생했습니다."));
        }
      } else {
        throw new Error("로그인 응답이 올바르지 않습니다");
      }
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다"));
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

      <Button variant="orange" onClick={handleLogin}>
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