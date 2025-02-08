"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, setUserToken } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginData {
  email: string;
  password: string;
  userType: "OWNER" | "STAFF";
}

interface UserData {
  id: number;
  email: string;
  name: string;
  age: number;
  staffType: "OWNER" | "STAFF";
  accessToken: string;
  refreshToken: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"OWNER" | "STAFF">("OWNER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.user);

  // Token expiry check function
  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Attempt to renew 10 minutes before expiration
      return payload.exp * 1000 < Date.now() + 10 * 60 * 1000;
    } catch {
      return true;
    }
  };

  // Refresh access token
  const refreshAccessToken = async (currentRefreshToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      if (!response.ok) throw new Error("Token renewal failed");

      const responseData = await response.json();
      const newTokens = responseData.data;

      // Save new access and refresh tokens
      dispatch(setUserToken({ 
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken 
      }));

      return newTokens.accessToken;
    } catch (error) {
      throw new Error("Failed to obtain new access token");
    }
  };

  // Automatic token renewal setup
  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const tokenExpiryCheck = setInterval(async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        try {
          await refreshAccessToken(refreshToken);
        } catch {
          router.replace("/login");
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(tokenExpiryCheck);
  }, [accessToken, refreshToken, dispatch, router]);

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
  
      const loginData: LoginData = {
        email,
        password,
        userType
      };
  
      // console.log("Login attempt with:", loginData);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
  
      const responseData = await response.json();
      // console.log("Login response:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }
  
      const userData: UserData = responseData.data;
  
      if (!userData) {
        throw new Error("Invalid login response data");
      }
  
      // Dispatch user information
      dispatch(setUserInfo({
        id: String(userData.id),
        email: userData.email,
        name: userData.name,
        age: userData.age,
        userType: userData.staffType,
      }));
  
      // Dispatch tokens
      dispatch(setUserToken({
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken
      }));
  
      router.replace("/");
    } catch (error) {
      // console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-6">로그인</h1>

      {error && (
        <Alert variant="destructive" className="mb-4 w-64">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 m-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="OWNER"
            checked={userType === "OWNER"}
            onChange={(e) => setUserType(e.target.value as "OWNER" | "STAFF")}
            className="form-radio text-blue-500"
          />
          <span>점주</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="STAFF"
            checked={userType === "STAFF"}
            onChange={(e) => setUserType(e.target.value as "OWNER" | "STAFF")}
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
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 m-2 w-64 rounded"
        disabled={isLoading}
      />

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-4 disabled:bg-gray-400"
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