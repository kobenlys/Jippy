"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  updateUserInfo, 
  logout 
} from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import "@/app/globals.css";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormField } from "@/components/ui/form/FormFields";
import { styles } from "@/features/shop/constants/styles";

const UpdateUserForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, auth } = useSelector((state: RootState) => state.user);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [initialUserInfo, setInitialUserInfo] = useState({ 
    name: user?.name || "", 
    age: user?.age || "" 
  });
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!auth.accessToken) {
      router.push("/login");
    }
  }, [auth.accessToken, router]);

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    
    if (value && !validatePassword(value)) {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다"
      }));
    } else {
      setPasswordErrors(prev => ({
        ...prev,
        newPassword: ""
      }));
    }

    if (confirmPassword && value !== confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: "비밀번호가 일치하지 않습니다"
      }));
    } else if (confirmPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: ""
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value && value !== newPassword) {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: "비밀번호가 일치하지 않습니다"
      }));
    } else {
      setPasswordErrors(prev => ({
        ...prev,
        confirmPassword: ""
      }));
    }
  };

  const handleUserInfoChange = (field: "name" | "age", value: string): void => {
    dispatch(updateUserInfo({ [field]: value }));
  };

  const handleLogout = (): void => {
    dispatch(logout());
    router.push("/login");
  };

  const isUserInfoChanged = (): boolean => {
    return user?.name !== initialUserInfo.name || user?.age !== initialUserInfo.age;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!auth.accessToken) {
      toast.error("로그인이 필요합니다");
      router.push("/login");
      return;
    }
  
    const isPasswordChanged = newPassword && confirmPassword && currentPassword;
  
    // 폼 제출 전 유효성 검사
    if (isPasswordChanged) {
      if (!validatePassword(newPassword) || newPassword !== confirmPassword) {
        return; // 에러 메시지가 이미 표시되어 있으므로 중단
      }
    }
  
    try {
      let userInfoUpdated = false;
      
      // 유저 정보 업데이트 처리
      if (isUserInfoChanged()) {
        const userInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/userInfo`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify({
            name: user?.name,
            age: user?.age,
          }),
        });
  
        if (!userInfoResponse.ok) {
          throw new Error("유저 정보 업데이트에 실패했습니다");
        }
  
        const userInfoResult = await userInfoResponse.json();
  
        if (userInfoResult.success && userInfoResult.data) {
          dispatch(updateUserInfo({
            name: userInfoResult.data.name,
            age: userInfoResult.data.age
          }));
          
          setInitialUserInfo({
            name: userInfoResult.data.name,
            age: userInfoResult.data.age
          });
          userInfoUpdated = true;
        }
      }
  
      // 비밀번호 변경 처리
      if (isPasswordChanged) {
        const passwordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
  
        if (!passwordResponse.ok) {
          throw new Error("비밀번호 변경에 실패했습니다");
        }
  
        const passwordResult = await passwordResponse.json();
        
        if (passwordResult.success) {
          if (userInfoUpdated) {
            toast.success("모든 정보가 성공적으로 수정되었습니다. 비밀번호가 변경되어 다시 로그인해주세요.");
          } else {
            toast.success("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
          }
          setTimeout(() => {
            handleLogout();
          }, 1500);
        }
      } else if (userInfoUpdated) {
        toast.success("회원 정보가 성공적으로 수정되었습니다");
      }
  
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "정보 수정에 실패했습니다");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="이름"
        name="name"
        value={user?.name || ""}
        onChange={(e) => handleUserInfoChange("name", e.target.value)}
      />

      <FormField
        label="이메일"
        name="email"
        type="email"
        value={user?.email || ""}
        onChange={() => {}}
        disabled={true}
      />

      <FormField
        label="생년월일"
        name="age"
        value={user?.age || ""}
        onChange={(e) => handleUserInfoChange("age", e.target.value)}
      />

      <div className="input-container">
        <label className={styles.label}>가입 유형</label>
        <div className="grid grid-cols-2 gap-4 w-full">
          <label className="flex items-center space-x-2 p-2">
            <input
              type="radio"
              value="OWNER"
              checked={user?.userType === "OWNER"}
              disabled
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">점주</span>
          </label>
          <label className="flex items-center space-x-2 p-2">
            <input
              type="radio"
              value="STAFF"
              checked={user?.userType === "STAFF"}
              disabled
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">직원</span>
          </label>
        </div>
      </div>

      <FormField
        label="현재 비밀번호"
        name="currentPassword"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <FormField
        label="새 비밀번호"
        name="newPassword"
        type="password"
        value={newPassword}
        onChange={handleNewPasswordChange}
        error={passwordErrors.newPassword}
        showCheckIcon={true}
        isValid={validatePassword(newPassword)}
      />

      <FormField
        label="새 비밀번호 확인"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={passwordErrors.confirmPassword}
        isValid={confirmPassword !== "" && newPassword !== "" && newPassword === confirmPassword}
      />

      <Button type="orange">
        수정하기
      </Button>
    </form>
  );
};

export default UpdateUserForm;