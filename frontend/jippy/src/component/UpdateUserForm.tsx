"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../redux/userSlice';
import { RootState } from '../redux/store';
import { updateUserAPI } from '../redux/updateUser';
import { updatePasswordAPI } from '../redux/updatePassword';  // 비밀번호 업데이트 API 추가
import '@/app/globals.css';
import Button from '@/component/Button';
import CheckIcon from '@/component/CheckIcon';
import { useRouter } from 'next/navigation'; // Next.js의 navigation 추가
import { toast } from 'react-toastify'; // toast 추가
import 'react-toastify/dist/ReactToastify.css';


const UpdateUserForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [newPassword, setNewPassword] = useState(user.password || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // 리덕스 상태 출력
    console.log("Redux User State: ", user);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUserInfo(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  // 비밀번호 변경 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  // 현재 비밀번호 입력 처리
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  // 새 비밀번호 확인 처리
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // 로그아웃 함수 추가
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(setUserInfo({})); // Redux 상태 초기화
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('로그인이 필요합니다');
      return;
    }
  
    // 비밀번호가 변경되었는지 확인
    const isPasswordChanged = newPassword && confirmPassword && currentPassword;
  
    // 비밀번호 변경 시 새 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (isPasswordChanged && newPassword !== confirmPassword) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다');
      return;
    }
  
    try {
      // 비밀번호 변경이 필요한 경우에만 비밀번호 업데이트 API 호출
      if (isPasswordChanged) {
        const updatedPassword = await updatePasswordAPI(
          currentPassword, newPassword, token
        );
        // 비밀번호 변경 성공 시
        toast.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.', {
          onClose: () => {
            handleLogout(); // 로그아웃 처리
            router.push('/'); // 메인 페이지로 리다이렉트
          }
        });
        return; // 비밀번호 변경 후 다른 정보 업데이트는 하지 않음
      }
      
      // 사용자 정보 업데이트 (비밀번호를 변경하지 않았더라도 실행)
      const updatedUserData = await updateUserAPI(
        { ...user, email: user.email, userType: user.userType, age: user.age, name: user.name },
        token,
        dispatch
      );
      
      // 유저 정보 업데이트 성공 시 알림
      alert('정보가 성공적으로 수정되었습니다');
      dispatch(setUserInfo(updatedUserData)); // 수정된 유저 정보 저장
    } catch (error) {
      alert('정보 수정 실패');
      console.error('Update failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="input-container">
        <label htmlFor="name" className="input-label">Name</label>
        <input
          id="name"
          className="input-field"
          type="text"
          value={user.name || ''}
          onChange={(e) => dispatch(setUserInfo({ ...user, name: e.target.value }))}
        />
      </div>

      <div className="input-container">
        <label htmlFor="email" className="input-label">Email</label>
        <input
          id="email"
          className="input-field"
          type="email"
          value={user.email || ''}
          disabled
          style={{ backgroundColor: '#f0f0f0' }}
        />
      </div>

      <div className="input-container">
        <label htmlFor="age" className="input-label">Age</label>
        <input
          id="age"
          className="input-field"
          type="text"
          value={user.age || ''}
          onChange={(e) => dispatch(setUserInfo({ ...user, age: e.target.value }))}
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
              onChange={(e) => dispatch(setUserInfo({ ...user, userType: e.target.value }))}
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
              onChange={(e) => dispatch(setUserInfo({ ...user, userType: e.target.value }))}
              disabled
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">직원</span>
          </label>
        </div>
      </div>

      {/* 비밀번호 변경 부분 추가 */}
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

      <div className="input-container">
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

      <Button type="default">수정하기</Button>
    </form>
  );
};

export default UpdateUserForm;
