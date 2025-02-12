"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";

interface FormData {
  email: string;
  userType: "OWNER" | "STAFF";
}

interface ResetState {
  loading: boolean;
  message: string | null;
  error: string | null;
}

const ResetPassword = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    userType: "OWNER",
  });
  
  const [resetState, setResetState] = useState<ResetState>({
    loading: false,
    message: null,
    error: null,
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setResetState({ loading: true, message: null, error: null });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/reset/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "비밀번호 재발급 실패");
      }

      setResetState({
        loading: false,
        message: "임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요.",
        error: null
      });
      
      // 폼 초기화
      setFormData({ email: "", userType: "OWNER" });
      
    } catch (error) {
      setResetState({
        loading: false,
        message: null,
        error: error instanceof Error ? error.message : "비밀번호 재발급에 실패했습니다. 다시 시도해주세요."
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-xl font-bold mb-4">비밀번호 재발급</h2>
      
      {resetState.message && (
        <p className="mb-4 text-sm text-green-500">
          {resetState.message}
        </p>
      )}
      
      {resetState.error && (
        <p className="mb-4 text-sm text-red-500">
          {resetState.error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">사용자 유형</label>
          <div className="flex gap-4 mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="OWNER"
                checked={formData.userType === "OWNER"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">점주</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="STAFF"
                checked={formData.userType === "STAFF"}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">직원</span>
            </label>
          </div>
          {errors.userType && (
            <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetState.loading}
          className={`w-full bg-blue-500 text-white p-2 rounded-md 
                   ${resetState.loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"} 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   transition-colors duration-200`}
        >
          {resetState.loading ? "처리 중..." : "비밀번호 재발급"}
        </button>

        <div className="w-64 h-px bg-gray-300 my-6"></div>

        <Link href="/login">
          <button
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            로그인하러 가기
          </button>
        </Link>

      </form>
    </div>
  );
};

export default ResetPassword;