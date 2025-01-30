"use client";

import { useState, FormEvent, ChangeEvent } from "react";

interface FormData {
  email: string;
  userType: "OWNER" | "STAFF";
}

const ResetPassword = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    userType: "OWNER",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    // 이메일 검증
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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/reset/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("임시 비밀번호가 발급되었습니다. 이메일을 확인해주세요.");
        // 폼 초기화
        setFormData({ email: "", userType: "OWNER" });
      } else {
        throw new Error("비밀번호 재발급 실패");
      }
    } catch (error) {
      setMessage("비밀번호 재발급에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-xl font-bold mb-4">비밀번호 재발급</h2>
      {message && (
        <p className={`mb-4 text-sm ${message.includes('실패') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
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
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   transition-colors duration-200"
        >
          비밀번호 재발급
        </button>

        <div className="w-64 h-px bg-gray-300 my-6"></div>

        <button
          onClick={() => window.location.href = '/login'}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          로그인하러 가기
        </button>

      </form>
    </div>
  );
};

export default ResetPassword;