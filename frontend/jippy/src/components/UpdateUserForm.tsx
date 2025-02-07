"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState, setUserInfo } from "../redux/slices/userSlice";
import { AppDispatch, RootState } from "../redux/store";
import "@/app/globals.css";
import Button from "@/components/ui/button/Button";
import CheckIcon from "@/components/CheckIcon";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateUserForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Redux 상태에서 로그인 체크
    if (!user.accessToken) {
      router.push("/login");
    }
  }, [user.accessToken, router]);

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(e.target.value);
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

  const handleLogout = (): void => {
    // Redux 상태 초기화
    dispatch(setUserInfo({
      id: null,
      email: null,
      name: null,
      age: null,
      userType: null,
      accessToken: null,
      refreshToken: null
    }));
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    if (!user.accessToken) {
      alert("로그인이 필요합니다");
      router.push("/login");
      return;
    }
  
    const isPasswordChanged = newPassword && confirmPassword && currentPassword;
  
    if (isPasswordChanged && newPassword !== confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다");
      return;
    }
  
    try {
      if (isPasswordChanged) {
        // 비밀번호 변경 API 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
     
        if (!response.ok) {
          throw new Error("비밀번호 변경에 실패했습니다");
        }
     
        toast.success("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        handleLogout();
        return;
      }
      
      // 유저 정보 업데이트 API 호출
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/userInfo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          name: user.name,
          age: user.age,
        }),
      });

      if (!response.ok) {
        throw new Error("정보 수정에 실패했습니다");
      }

      const responseData = await response.json();
      
      toast.success("정보가 성공적으로 수정되었습니다");
      dispatch(setUserInfo({
        ...user,  // 기존 정보 유지
        ...responseData.data,  // 업데이트된 정보 반영
      }));
    } catch (error) {
      toast.error("정보 수정에 실패했습니다");
      console.error("Update failed:", error);
    }
  };

  const handleUserInfoChange = (field: keyof UserState, value: string): void => {
    dispatch(setUserInfo({
      ...user,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="input-container">
        <label htmlFor="name" className="input-label">Name</label>
        <input
          id="name"
          className="input-field"
          type="text"
          value={user.name || ""}
          onChange={(e) => handleUserInfoChange("name", e.target.value)}
        />
      </div>

      <div className="input-container">
        <label htmlFor="email" className="input-label">Email</label>
        <input
          id="email"
          className="input-field"
          type="email"
          value={user.email || ""}
          disabled
          style={{ backgroundColor: "#f0f0f0" }}
        />
      </div>

      <div className="input-container">
        <label htmlFor="age" className="input-label">Age</label>
        <input
          id="age"
          className="input-field"
          type="text"
          value={user.age || ""}
          onChange={(e) => handleUserInfoChange("age", e.target.value)}
        />
      </div>

      <div className="input-container">
        <label className="input-label">User Type</label>
        <div className="grid grid-cols-2 gap-4 w-full">
          <label className="flex items-center space-x-2 p-2">
            <input
              type="radio"
              value="OWNER"
              checked={user.userType === "OWNER"}
              onChange={(e) => handleUserInfoChange("userType", e.target.value)}
              disabled
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">점주</span>
          </label>
          <label className="flex items-center space-x-2 p-2">
            <input
              type="radio"
              value="STAFF"
              checked={user.userType === "STAFF"}
              onChange={(e) => handleUserInfoChange("userType", e.target.value)}
              disabled
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">직원</span>
          </label>
        </div>
      </div>

      <div className="input-container">
        <label htmlFor="currentPassword" className="input-label">현재 비밀번호</label>
        <input
          id="currentPassword"
          className="input-field"
          type="password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
        />
      </div>

      <div className="input-container relative">
        <label htmlFor="newPassword" className="input-label">새 비밀번호</label>
        <input
          id="newPassword"
          className="input-field"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          <CheckIcon isValid={validatePassword(newPassword)} />
        </div>
      </div>

      <div className="input-container">
        <label htmlFor="confirmPassword" className="input-label">새 비밀번호 확인</label>
        <input
          id="confirmPassword"
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      <Button variant="brown" className="w-full">
        수정하기
      </Button>
    </form>
  );
};

export default UpdateUserForm;